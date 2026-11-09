-- Migration: Challenge Invitations & Granted Access
-- Description: Enables private challenge invite links, access tracking, and recipient enrollment.

-- 1. Create challenge_invites table
create table if not exists public.challenge_invites (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  token text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  recipient_email text,
  max_uses integer,
  uses_count integer not null default 0,
  expires_at timestamptz,
  is_revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Create challenge_access table
create table if not exists public.challenge_access (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invite_id uuid references public.challenge_invites(id) on delete set null,
  granted_at timestamptz not null default now(),
  constraint challenge_access_challenge_user_unique unique(challenge_id, user_id)
);

-- 3. Create indices
create index if not exists idx_challenge_invites_token
  on public.challenge_invites (token);
create index if not exists idx_challenge_invites_challenge
  on public.challenge_invites (challenge_id, created_at desc);
create index if not exists idx_challenge_access_user
  on public.challenge_access (user_id, granted_at desc);
create index if not exists idx_challenge_access_challenge
  on public.challenge_access (challenge_id);

-- 4. Enable Row Level Security
alter table public.challenge_invites enable row level security;
alter table public.challenge_access enable row level security;

-- 5. RLS Policies for challenge_invites
-- Anyone (anon & authenticated) can validate an active invite token
create policy "Anyone can validate active invite tokens"
  on public.challenge_invites for select to anon, authenticated
  using (not is_revoked and (expires_at is null or expires_at > now()));

-- Authors have full control over invites for their challenges
create policy "Authors can view all invites for their challenges"
  on public.challenge_invites for select to authenticated
  using (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));

create policy "Authors can create invites for their challenges"
  on public.challenge_invites for insert to authenticated
  with check (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));

create policy "Authors can update invites for their challenges"
  on public.challenge_invites for update to authenticated
  using (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));

create policy "Authors can delete invites for their challenges"
  on public.challenge_invites for delete to authenticated
  using (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));

-- 6. RLS Policies for challenge_access
-- Users can see which challenges they have been granted access to
create policy "Users can view their granted challenge access"
  on public.challenge_access for select to authenticated
  using (user_id = (select auth.uid()));

-- Authors can view all members with access to their challenges
create policy "Authors can view members of their challenges"
  on public.challenge_access for select to authenticated
  using (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));

-- Authenticated users can insert an access record for themselves
create policy "Users can enroll themselves into challenge access"
  on public.challenge_access for insert to authenticated
  with check (user_id = (select auth.uid()));

-- 7. Grant Permissions to challenge_access users on challenges
-- Allow users with granted access to read private challenges
create policy "Invited users can read private challenges"
  on public.challenges for select to authenticated
  using (exists (
    select 1 from public.challenge_access ca
    where ca.challenge_id = id and ca.user_id = (select auth.uid())
  ));

-- Allow users with granted access to start attempts on private challenges
create policy "Invited users can start attempts on private challenges"
  on public.challenge_attempts for insert to authenticated
  with check (
    solver_id = (select auth.uid())
    and exists (
      select 1 from public.challenge_access ca
      where ca.challenge_id = challenge_id and ca.user_id = (select auth.uid())
    )
  );

-- 8. Table permissions
grant select on public.challenge_invites to anon;
grant select, insert, update, delete on public.challenge_invites to authenticated;
grant select, insert, delete on public.challenge_access to authenticated;
grant all on public.challenge_invites, public.challenge_access to service_role;

-- 9. Atomic RPC helper to accept an invite token
create or replace function public.accept_challenge_invite(p_token text, p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite record;
  v_challenge record;
begin
  -- Find active, unrevoked invite
  select * into v_invite
  from public.challenge_invites
  where token = p_token
    and not is_revoked
    and (expires_at is null or expires_at > now());

  if not found then
    return jsonb_build_object('success', false, 'error', 'Invalid, expired, or revoked invitation link.');
  end if;

  -- Check use limit
  if v_invite.max_uses is not null and v_invite.uses_count >= v_invite.max_uses then
    return jsonb_build_object('success', false, 'error', 'This invitation link has reached its maximum usage limit.');
  end if;

  -- Get challenge info
  select id, owner_id, title, visibility into v_challenge
  from public.challenges
  where id = v_invite.challenge_id;

  if not found then
    return jsonb_build_object('success', false, 'error', 'The referenced challenge no longer exists.');
  end if;

  -- If user is the owner, no need to enroll
  if v_challenge.owner_id = p_user_id then
    return jsonb_build_object('success', true, 'challenge_id', v_challenge.id, 'status', 'owner');
  end if;

  -- Enroll user into challenge_access if not already present
  insert into public.challenge_access (challenge_id, user_id, invite_id)
  values (v_challenge.id, p_user_id, v_invite.id)
  on conflict (challenge_id, user_id) do nothing;

  -- Increment usage counter
  update public.challenge_invites
  set uses_count = uses_count + 1
  where id = v_invite.id;

  return jsonb_build_object(
    'success', true,
    'challenge_id', v_challenge.id,
    'challenge_title', v_challenge.title,
    'status', 'joined'
  );
end;
$$;

revoke all on function public.accept_challenge_invite(text, uuid) from public, anon;
grant execute on function public.accept_challenge_invite(text, uuid) to authenticated, service_role;
