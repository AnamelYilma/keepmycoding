import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Challenge storage is not configured.' }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const inviteToken = searchParams.get('invite');
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('challenges')
      .select('id,owner_id,owner_name,title,summary,topic,language,track,level,challenge_type,visibility,challenge,reason,learning_goal,created_at')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: 'Challenge not found.' }, { status: 404 });
    }

    // Access control for private challenges
    if (data.visibility === 'private') {
      const isOwner = Boolean(user && user.id === data.owner_id);
      let hasAccess = isOwner;

      if (!hasAccess && user) {
        const { data: access } = await supabase
          .from('challenge_access')
          .select('id')
          .eq('challenge_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        hasAccess = Boolean(access);
      }

      if (!hasAccess && inviteToken) {
        const { data: invite } = await supabase
          .from('challenge_invites')
          .select('id')
          .eq('challenge_id', id)
          .eq('token', inviteToken)
          .eq('is_revoked', false)
          .maybeSingle();
        hasAccess = Boolean(invite);
      }

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'This is a private challenge. You need a valid invitation link to access it.' },
          { status: 403 }
        );
      }
    }

    let attempts = undefined;
    if (user?.id === data.owner_id) {
      const { data: attemptRows } = await supabase.rpc('get_challenge_attempts', { p_challenge_id: id });
      attempts = attemptRows ?? [];
    }

    return NextResponse.json({ challenge: data, attempts });
  } catch {
    return NextResponse.json({ error: 'Could not load this challenge.' }, { status: 503 });
  }
}
