import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

function generateInviteToken(): string {
  // 18 bytes base64url yields 24 url-safe alphanumeric characters
  return 'inv_' + crypto.randomBytes(18).toString('base64url');
}

// GET /api/challenges/[id]/invites - List active invites for author
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    // Verify ownership
    const { data: challenge } = await supabase
      .from('challenges')
      .select('id, owner_id')
      .eq('id', id)
      .maybeSingle();

    if (!challenge || challenge.owner_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { data: invites, error } = await supabase
      .from('challenge_invites')
      .select('id, challenge_id, token, created_by, recipient_email, max_uses, uses_count, expires_at, is_revoked, created_at')
      .eq('challenge_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invites: invites ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not list invites';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/challenges/[id]/invites - Create a new invite token
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Sign in to create an invite link.' }, { status: 401 });
    }

    // Verify ownership
    const { data: challenge } = await supabase
      .from('challenges')
      .select('id, owner_id, title, visibility')
      .eq('id', id)
      .maybeSingle();

    if (!challenge || challenge.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only the challenge author can generate invite links.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const expiresInDays = Number(body.expiresInDays) || 0;
    const maxUses = body.maxUses ? Math.max(1, Number(body.maxUses)) : null;
    const recipientEmail = typeof body.recipientEmail === 'string' && body.recipientEmail.trim()
      ? body.recipientEmail.trim().toLowerCase()
      : null;

    let expiresAt: string | null = null;
    if (expiresInDays > 0) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + expiresInDays);
      expiresAt = expDate.toISOString();
    }

    // Check if an identical active link already exists
    if (!recipientEmail && !maxUses && !expiresInDays) {
      const { data: existing } = await supabase
        .from('challenge_invites')
        .select('*')
        .eq('challenge_id', id)
        .eq('created_by', user.id)
        .eq('is_revoked', false)
        .is('recipient_email', null)
        .is('max_uses', null)
        .is('expires_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ invite: existing, created: false });
      }
    }

    const token = generateInviteToken();

    const { data: newInvite, error } = await supabase
      .from('challenge_invites')
      .insert({
        challenge_id: id,
        token,
        created_by: user.id,
        recipient_email: recipientEmail,
        max_uses: maxUses,
        expires_at: expiresAt,
        is_revoked: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invite: newInvite, created: true }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not create invite';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
