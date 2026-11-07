import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { ChallengeLearning } from '@/lib/challenges/library';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Challenge storage is not configured.' }, { status: 503 });

  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Sign in to view the explanation.' }, { status: 401 });

    const { data: challenge } = await supabase
      .from('challenges')
      .select('owner_id')
      .eq('id', id)
      .maybeSingle();
    if (!challenge) return NextResponse.json({ error: 'Challenge not found.' }, { status: 404 });

    const isOwner = challenge.owner_id === user.id;
    if (!isOwner) {
      const { data: attempt } = await supabase
        .from('challenge_attempts')
        .select('completed_at')
        .eq('challenge_id', id)
        .eq('solver_id', user.id)
        .maybeSingle();
      if (!attempt?.completed_at) {
        return NextResponse.json({ error: 'Finish the challenge before viewing its solution.' }, { status: 403 });
      }
    }

    const storage = isOwner ? supabase : createSupabaseAdminClient();
    const { data: solution, error } = await storage
      .from('challenge_solutions')
      .select('reference_solution,author_explanation,source_urls')
      .eq('challenge_id', id)
      .maybeSingle();
    if (error || !solution) return NextResponse.json({ error: 'Could not load the solution.' }, { status: 503 });

    const learning: ChallengeLearning = {
      explanation: solution.author_explanation,
      sources: Array.isArray(solution.source_urls) ? solution.source_urls as ChallengeLearning['sources'] : [],
      referenceSolution: solution.reference_solution,
    };
    return NextResponse.json({ learning });
  } catch {
    return NextResponse.json({ error: 'Could not load the solution.' }, { status: 503 });
  }
}
