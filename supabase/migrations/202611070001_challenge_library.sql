create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_name text not null default 'KeepCoding developer',
  title text not null check (char_length(title) between 3 and 120),
  summary text not null check (char_length(summary) between 10 and 500),
  topic text not null default 'General',
  language text not null,
  track smallint not null default 1 check (track between 1 and 10),
  level smallint not null check (level between 1 and 12),
  challenge_type text not null,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  challenge jsonb not null,
  reason text not null default '',
  learning_goal text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_solutions (
  challenge_id uuid primary key references public.challenges(id) on delete cascade,
  reference_solution text not null,
  author_explanation text not null default '',
  source_urls jsonb not null default '[]'::jsonb check (jsonb_typeof(source_urls) = 'array'),
  created_at timestamptz not null default now()
);

create table if not exists public.challenge_attempts (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  solver_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (challenge_id, solver_id)
);

create index if not exists challenges_public_browse_idx
  on public.challenges (visibility, topic, language, level, challenge_type, created_at desc);
create index if not exists challenge_attempts_challenge_idx
  on public.challenge_attempts (challenge_id, started_at desc);

alter table public.challenges enable row level security;
alter table public.challenge_solutions enable row level security;
alter table public.challenge_attempts enable row level security;

create policy "Public challenge listing"
  on public.challenges for select to anon, authenticated
  using (visibility = 'public');
create policy "Owners can read all of their challenges"
  on public.challenges for select to authenticated
  using (owner_id = (select auth.uid()));
create policy "Owners can create challenges"
  on public.challenges for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "Owners can update challenges"
  on public.challenges for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy "Owners can delete challenges"
  on public.challenges for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy "Only authors can read challenge solutions"
  on public.challenge_solutions for select to authenticated
  using (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));
create policy "Only authors can create challenge solutions"
  on public.challenge_solutions for insert to authenticated
  with check (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));
create policy "Only authors can update challenge solutions"
  on public.challenge_solutions for update to authenticated
  using (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));
create policy "Only authors can delete challenge solutions"
  on public.challenge_solutions for delete to authenticated
  using (exists (
    select 1 from public.challenges c
    where c.id = challenge_id and c.owner_id = (select auth.uid())
  ));

create policy "Solvers can read their attempts and authors can see solvers"
  on public.challenge_attempts for select to authenticated
  using (
    solver_id = (select auth.uid())
    or exists (
      select 1 from public.challenges c
      where c.id = challenge_id and c.owner_id = (select auth.uid())
    )
  );
create policy "Users can start attempts on visible challenges"
  on public.challenge_attempts for insert to authenticated
  with check (
    solver_id = (select auth.uid())
    and exists (
      select 1 from public.challenges c
      where c.id = challenge_id
        and (c.visibility = 'public' or c.owner_id = (select auth.uid()))
    )
  );

revoke all on public.challenges, public.challenge_solutions, public.challenge_attempts from anon;
grant select on public.challenges to anon;
grant select, insert, update, delete on public.challenges to authenticated;
grant select, insert, update, delete on public.challenge_solutions to authenticated;
grant select, insert on public.challenge_attempts to authenticated;
grant all on public.challenges, public.challenge_solutions, public.challenge_attempts to service_role;

create or replace function public.get_challenge_attempts(p_challenge_id uuid)
returns table (solver_id uuid, solver_name text, started_at timestamptz, completed_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.challenges c
    where c.id = p_challenge_id and c.owner_id = (select auth.uid())
  ) then
    raise exception 'Not authorized';
  end if;

  return query
  select a.solver_id,
         coalesce(u.raw_user_meta_data ->> 'full_name', 'KeepCoding developer'),
         a.started_at,
         a.completed_at
  from public.challenge_attempts a
  join auth.users u on u.id = a.solver_id
  where a.challenge_id = p_challenge_id
  order by a.started_at desc;
end;
$$;

revoke all on function public.get_challenge_attempts(uuid) from public, anon;
grant execute on function public.get_challenge_attempts(uuid) to authenticated;
