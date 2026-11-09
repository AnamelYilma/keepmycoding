import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Challenge storage is not configured.' }, { status: 503 });

  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Sign in to try a challenge.' }, { status: 401 });

    const fullName = typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim().slice(0, 80)
      : 'KeepCoding developer';

    const { error } = await supabase.from('challenge_attempts').insert({
      challenge_id: id,
      solver_id: user.id,
      solver_name: fullName,
    });
    if (error && error.code !== '23505') {
      return NextResponse.json({ error: 'Could not record this challenge attempt.' }, { status: 400 });
    }

    return NextResponse.json({ started: true });
  } catch {
    return NextResponse.json({ error: 'Could not start this challenge.' }, { status: 503 });
  }
}
