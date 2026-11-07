import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Challenge storage is not configured.' }, { status: 503 });

  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('challenges')
      .select('id,owner_id,owner_name,title,summary,topic,language,track,level,challenge_type,visibility,challenge,reason,learning_goal,created_at')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return NextResponse.json({ error: 'Challenge not found.' }, { status: 404 });

    let attempts = undefined;
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === data.owner_id) {
      const { data: attemptRows } = await supabase.rpc('get_challenge_attempts', { p_challenge_id: id });
      attempts = attemptRows ?? [];
    }

    return NextResponse.json({ challenge: data, attempts });
  } catch {
    return NextResponse.json({ error: 'Could not load this challenge.' }, { status: 503 });
  }
}
