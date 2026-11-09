import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

// GET /api/invites/[token] - Validate token and fetch challenge preview
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  try {
    const { token } = await context.params;
    const supabase = await createSupabaseServerClient();

    // 1. Fetch the invite record
    const { data: invite, error: inviteError } = await supabase
      .from('challenge_invites')
      .select('id, challenge_id, token, created_by, max_uses, uses_count, expires_at, is_revoked, created_at')
      .eq('token', token)
      .maybeSingle();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invalid or unknown invitation link.' }, { status: 404 });
    }

    if (invite.is_revoked) {
      return NextResponse.json({ error: 'This invitation has been revoked by the author.' }, { status: 410 });
    }

    if (invite.expires_at && new Date(invite.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: 'This invitation link has expired.' }, { status: 410 });
    }

    if (invite.max_uses && invite.uses_count >= invite.max_uses) {
      return NextResponse.json({ error: 'This invitation link has reached its maximum usage limit.' }, { status: 410 });
    }

    // 2. Fetch challenge metadata (without leaking reference answer)
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('id, owner_id, owner_name, title, summary, topic, language, track, level, challenge_type, visibility, reason, learning_goal, created_at')
      .eq('id', invite.challenge_id)
      .maybeSingle();

    if (challengeError || !challenge) {
      return NextResponse.json({ error: 'The challenge associated with this invite no longer exists.' }, { status: 404 });
    }

    // Check if the current user is signed in and already has access
    const { data: { user } } = await supabase.auth.getUser();
    let isMember = false;
    let isOwner = false;

    if (user) {
      isOwner = user.id === challenge.owner_id;
      if (!isOwner) {
        const { data: access } = await supabase
          .from('challenge_access')
          .select('id')
          .eq('challenge_id', challenge.id)
          .eq('user_id', user.id)
          .maybeSingle();
        isMember = Boolean(access);
      }
    }

    return NextResponse.json({
      valid: true,
      invite: {
        id: invite.id,
        token: invite.token,
        expires_at: invite.expires_at,
        uses_count: invite.uses_count,
        max_uses: invite.max_uses,
      },
      challenge,
      user: user ? { id: user.id, isOwner, isMember } : null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not validate invitation';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/invites/[token] - Accept the invitation and enroll user
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  try {
    const { token } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Please sign in to accept this challenge invitation.' }, { status: 401 });
    }

    // Execute atomic RPC
    const { data: result, error } = await supabase.rpc('accept_challenge_invite', {
      p_token: token,
      p_user_id: user.id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!result?.success) {
      return NextResponse.json({ error: result?.error || 'Could not join challenge.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      challengeId: result.challenge_id,
      status: result.status,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not accept invitation';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
