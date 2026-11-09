'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  Plus,
  Search,
  Timer,
  Users,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import SmartPopover from '@/components/common/SmartPopover';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import type { Challenge } from '@/lib/types/challenge';
import type { PublicChallengeRecord } from '@/lib/challenges/library';
import AppNav from '@/components/navigation/AppNav';
import { InviteModal } from '@/components/challenges/InviteModal';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type LibraryItem = {
  id: string;
  ownerId?: string;
  title: string;
  summary: string;
  topic: string;
  language: string;
  level: number;
  type: string;
  visibility: 'public' | 'private' | 'temporary' | 'built-in';
  ownerName: string;
  challenge?: Challenge;
  reason?: string;
  learningGoal?: string;
  attemptStatus?: 'In progress' | 'Completed';
  completedAt?: string | null;
  startedAt?: string | null;
};

type AuthorAttempt = {
  challenge_id: string;
  solver_id: string;
  solver_name: string;
  started_at: string;
  completed_at: string | null;
};

const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400';

export default function ChallengeLibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: 'library' | 'shared' | 'mine' =
    tabParam === 'mine' ? 'mine' : tabParam === 'shared' ? 'shared' : 'library';

  const [community, setCommunity] = useState<PublicChallengeRecord[]>([]);
  const [shared, setShared] = useState<PublicChallengeRecord[]>([]);
  const [myAttempts, setMyAttempts] = useState<
    { challenge_id: string; started_at: string; completed_at: string | null }[]
  >([]);
  const [authorAttempts, setAuthorAttempts] = useState<AuthorAttempt[]>([]);
  const [user, setUser] = useState<{ id: string; email?: string; name: string } | null>(null);
  const [inviteTarget, setInviteTarget] = useState<{ id: string; title: string; visibility: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('all');
  const [startingId, setStartingId] = useState('');
  const [activeSolversModal, setActiveSolversModal] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (active && authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: (authUser.user_metadata?.full_name as string) || authUser.email?.split('@')[0] || 'KeepCoding developer',
        });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/challenges')
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Could not load challenges.');
        if (active) {
          setCommunity(body.challenges ?? []);
          setShared(body.sharedChallenges ?? []);
          setMyAttempts(body.myAttempts ?? []);
          setAuthorAttempts(body.authorAttempts ?? []);
          setUser(body.user ?? null);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load challenges.');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const builtIns = useMemo<LibraryItem[]>(
    () =>
      SAMPLE_CHALLENGES.flatMap((sample) => {
        const parsed = validateRawChallenge(sample.raw).challenge;
        if (!parsed) return [];
        return [
          {
            id: `builtin:${sample.id}`,
            title: sample.label.replace(/^Track \d+ \(Level \d+\) - /, ''),
            summary:
              parsed.task.split('\n').filter(Boolean)[0]?.slice(0, 220) ||
              'Built-in KeepCoding challenge.',
            topic: `Track ${sample.track}`,
            language: sample.language,
            level: sample.level,
            type: sample.type,
            visibility: 'built-in',
            ownerName: 'KeepCoding',
            challenge: parsed,
          },
        ];
      }),
    []
  );

  const communityItems = useMemo<LibraryItem[]>(
    () =>
      community.map((item) => {
        const attempt = myAttempts.find((a) => a.challenge_id === item.id);
        return {
          id: item.id,
          ownerId: item.owner_id,
          title: item.title,
          summary: item.summary,
          topic: item.topic,
          language: item.language,
          level: item.level,
          type: item.challenge_type,
          visibility: item.visibility,
          ownerName: item.owner_name,
          challenge: item.challenge ? { ...(item.challenge as Challenge), reference: '' } : undefined,
          reason: item.reason,
          learningGoal: item.learning_goal,
          attemptStatus: attempt ? (attempt.completed_at ? 'Completed' : 'In progress') : undefined,
          completedAt: attempt?.completed_at,
          startedAt: attempt?.started_at,
        };
      }),
    [community, myAttempts]
  );

  const sharedItems = useMemo<LibraryItem[]>(
    () =>
      shared.map((item) => {
        const attempt = myAttempts.find((a) => a.challenge_id === item.id);
        return {
          id: item.id,
          ownerId: item.owner_id,
          title: item.title,
          summary: item.summary,
          topic: item.topic,
          language: item.language,
          level: item.level,
          type: item.challenge_type,
          visibility: item.visibility,
          ownerName: item.owner_name,
          challenge: item.challenge ? { ...(item.challenge as Challenge), reference: '' } : undefined,
          reason: item.reason,
          learningGoal: item.learning_goal,
          attemptStatus: attempt ? (attempt.completed_at ? 'Completed' : 'In progress') : undefined,
          completedAt: attempt?.completed_at,
          startedAt: attempt?.started_at,
        };
      }),
    [shared, myAttempts]
  );

  const attemptsByChallenge = useMemo(() => {
    const map: Record<string, { total: number; solvers: AuthorAttempt[] }> = {};
    for (const att of authorAttempts) {
      if (!map[att.challenge_id]) {
        map[att.challenge_id] = { total: 0, solvers: [] };
      }
      map[att.challenge_id].total++;
      map[att.challenge_id].solvers.push(att);
    }
    return map;
  }, [authorAttempts]);

  const allItems =
    activeTab === 'mine'
      ? communityItems.filter((item) => user && item.ownerId === user.id)
      : activeTab === 'shared'
      ? sharedItems
      : [...builtIns, ...communityItems.filter((item) => item.visibility === 'public')];

  const topics = Array.from(new Set(allItems.map((item) => item.topic))).sort();
  const languages = Array.from(new Set(allItems.map((item) => item.language))).sort();
  const types = Array.from(new Set(allItems.map((item) => item.type))).sort();

  const topicOptions = useMemo<SelectOption[]>(
    () => [{ value: '', label: 'All topics' }, ...topics.map((t) => ({ value: t, label: t }))],
    [topics]
  );
  const languageOptions = useMemo<SelectOption[]>(
    () => [{ value: '', label: 'All languages' }, ...languages.map((l) => ({ value: l, label: l }))],
    [languages]
  );
  const levelOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: 'All levels' },
      ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Level ${i + 1}` })),
    ],
    []
  );
  const typeOptions = useMemo<SelectOption[]>(
    () => [{ value: '', label: 'All types' }, ...types.map((t) => ({ value: t, label: t }))],
    [types]
  );
  const visibilityOptions = useMemo<SelectOption[]>(
    () => [
      { value: 'all', label: 'All visibilities' },
      { value: 'built-in', label: 'Built-in' },
      { value: 'public', label: 'Public' },
      { value: 'private', label: 'Private' },
      { value: 'temporary', label: 'Temporary' },
    ],
    []
  );

  const filtered = allItems.filter((item) => {
    const searchable = `${item.title} ${item.summary} ${item.topic} ${item.type} ${item.ownerName}`.toLowerCase();
    return (
      (!query || searchable.includes(query.toLowerCase())) &&
      (!topic || item.topic === topic) &&
      (!language || item.language === language) &&
      (!level || item.level === Number(level)) &&
      (!type || item.type === type) &&
      (visibility === 'all' || item.visibility === visibility)
    );
  });

  async function startChallenge(item: LibraryItem) {
    if (!item.id.startsWith('builtin:')) {
      router.push(`/challenges/${item.id}`);
      return;
    }
    if (!item.challenge) return;
    setError('');
    setStartingId(item.id);
    try {
      const builtinId = item.id.replace('builtin:', '');
      sessionStorage.setItem('active_workspace_challenge', JSON.stringify(item.challenge));
      sessionStorage.setItem('active_workspace_id', item.id);
      sessionStorage.setItem('pending_challenge', JSON.stringify(item.challenge));
      sessionStorage.setItem('pending_challenge_id', item.id);
      router.push(`/studio?builtin=${builtinId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start challenge.');
    } finally {
      setStartingId('');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppNav user={user} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* Header & Sub-Tabs */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800" role="tablist" aria-label="Challenge library views">
                <Link
                  href="/challenges"
                  role="tab"
                  aria-selected={activeTab === 'library'}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'library'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <span>Challenge Library</span>
                  <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-400 font-mono">
                    {builtIns.length + communityItems.filter((i) => i.visibility === 'public').length}
                  </span>
                </Link>
                {user && (
                  <Link
                    href="/challenges?tab=shared"
                    role="tab"
                    aria-selected={activeTab === 'shared'}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'shared'
                        ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Shared with Me</span>
                    <span className="rounded-full bg-[#88BDA4]/15 px-1.5 py-0.2 text-[10px] text-[#88BDA4] font-mono border border-[#88BDA4]/20">
                      {sharedItems.length}
                    </span>
                  </Link>
                )}
                <Link
                  href="/challenges?tab=mine"
                  role="tab"
                  aria-selected={activeTab === 'mine'}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'mine'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <span>My Created Challenges</span>
                  {user && (
                    <span className="rounded-full bg-[#88BDA4]/15 px-1.5 py-0.2 text-[10px] text-[#88BDA4] font-mono border border-[#88BDA4]/20">
                      {communityItems.filter((i) => i.ownerId === user.id).length}
                    </span>
                  )}
                </Link>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                {activeTab === 'mine' ? 'My Challenges' : activeTab === 'shared' ? 'Shared with Me' : 'Challenge Library'}
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                {activeTab === 'mine'
                  ? 'Track and review the challenges you created, their visibility, and solver activity.'
                  : activeTab === 'shared'
                  ? 'Private challenges shared with you directly via invitation links.'
                  : 'Find production coding challenges, test your intuition, or author a new challenge.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/challenges/create"
                className="inline-flex items-center gap-2 rounded-lg bg-[#88BDA4] px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              >
                <Plus size={16} aria-hidden="true" /> Create challenge
              </Link>
            </div>
          </header>

          {/* Filters Bar */}
          <section
            className="mt-6 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:grid-cols-2 lg:grid-cols-6"
            aria-label="Challenge filters"
          >
            <div className="relative sm:col-span-2 lg:col-span-1">
              <span className="sr-only">Search challenges</span>
              <Search size={15} className="absolute left-3 top-2.5 text-zinc-500 pointer-events-none" aria-hidden="true" />
              <input
                className={`${inputClass} pl-9`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search challenges"
              />
            </div>
            <div>
              <CustomSelect
                value={topic}
                onChange={setTopic}
                options={topicOptions}
                aria-label="Filter by topic"
              />
            </div>
            <div>
              <CustomSelect
                value={language}
                onChange={setLanguage}
                options={languageOptions}
                aria-label="Filter by language"
              />
            </div>
            <div>
              <CustomSelect
                value={level}
                onChange={setLevel}
                options={levelOptions}
                aria-label="Filter by difficulty level"
              />
            </div>
            <div>
              <CustomSelect
                value={type}
                onChange={setType}
                options={typeOptions}
                aria-label="Filter by challenge type"
              />
            </div>
            <div>
              <CustomSelect
                value={visibility}
                onChange={setVisibility}
                options={visibilityOptions}
                aria-label="Filter by visibility"
              />
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <p className="mt-4 rounded-lg border border-rose-500/30 bg-zinc-900 px-4 py-3 text-sm text-rose-300" role="alert">
              {error}{' '}
              {!user && (
                <Link href="/login" className="underline font-medium">
                  Sign in
                </Link>
              )}
            </p>
          )}

          {/* Loading State */}
          {loading ? (
            <p className="py-12 text-center text-sm text-zinc-400">Loading challenges...</p>
          ) : null}

          {/* Empty State */}
          {!loading && filtered.length === 0 ? (
            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <BookOpen className="mx-auto text-zinc-500" size={24} aria-hidden="true" />
              <h2 className="mt-3 font-medium text-zinc-200">
                {activeTab === 'mine'
                  ? 'You have not created any challenges yet'
                  : activeTab === 'shared'
                  ? 'No challenges shared with you yet'
                  : 'No matching challenges found'}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {activeTab === 'mine'
                  ? 'Author your first challenge to practice a real production bug or test cases.'
                  : activeTab === 'shared'
                  ? 'When another developer shares a challenge invite link with you, opening it adds the challenge here.'
                  : 'Try adjusting your search filters or author a new challenge.'}
              </p>
              {activeTab === 'mine' && (
                <Link
                  href="/challenges/create"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#88BDA4] px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#9cd1b8]"
                >
                  <Plus size={14} aria-hidden="true" /> Create challenge
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {filtered.map((item) => {
                const solversData = attemptsByChallenge[item.id];
                const totalAttempts = solversData?.total ?? 0;

                return (
                  <article
                    key={item.id}
                    className="flex min-h-64 flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700/70"
                  >
                    {/* Header Row: Badges & Attempt Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300 border border-zinc-700/60 font-semibold">
                          {item.language}
                        </span>
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-400 border border-zinc-700/60">
                          Level {item.level}
                        </span>
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-400 border border-zinc-700/60">
                          {item.type}
                        </span>
                        <span className="text-zinc-500">· {item.topic}</span>
                      </div>

                      {/* Visibility & User Attempt Status */}
                      <div className="flex items-center gap-2">
                        {item.visibility === 'temporary' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            <Timer size={12} aria-hidden="true" /> Temporary
                          </span>
                        )}
                        {item.visibility === 'private' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                            <Lock size={12} aria-hidden="true" /> Private
                          </span>
                        )}
                        {item.visibility === 'public' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                            <Globe size={12} aria-hidden="true" /> Public
                          </span>
                        )}

                        {item.attemptStatus === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 size={13} aria-hidden="true" /> Completed
                          </span>
                        ) : item.attemptStatus === 'In progress' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                            <Clock size={13} aria-hidden="true" /> In progress
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500">Not started</span>
                        )}
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-100">{item.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">{item.summary}</p>

                    {item.reason && (
                      <p className="mt-3 border-l-2 border-zinc-700 pl-3 text-xs text-zinc-300">
                        <span className="font-medium text-zinc-200">Why it matters: </span>
                        {item.reason}
                      </p>
                    )}

                    {/* Author Statistics (For user-created challenges) */}
                    {activeTab === 'mine' && (
                      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-zinc-300 font-medium">
                            <Users size={14} className="text-zinc-500" aria-hidden="true" />
                            {totalAttempts === 0
                              ? 'No solvers attempted yet'
                              : `${totalAttempts} ${totalAttempts === 1 ? 'solver' : 'solvers'} attempted`}
                          </span>
                          {totalAttempts > 0 && solversData && (
                            <SmartPopover
                              align="right"
                              trigger={({ isOpen, toggle, ref, ...ariaProps }) => (
                                <button
                                  type="button"
                                  ref={ref as any}
                                  onClick={toggle}
                                  {...ariaProps}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] ${
                                    isOpen
                                      ? 'bg-[#88BDA4]/15 text-[#88BDA4] border border-[#88BDA4]/30 shadow-sm'
                                      : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-700/60'
                                  }`}
                                >
                                  <span>{isOpen ? 'Close' : 'View solvers'}</span>
                                  <ChevronDown
                                    size={12}
                                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#88BDA4]' : 'text-zinc-400'}`}
                                    aria-hidden="true"
                                  />
                                </button>
                              )}
                            >
                              {() => (
                                <div>
                                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] font-semibold text-zinc-300">
                                    <span>Solvers list ({totalAttempts})</span>
                                    <span className="text-[10px] font-mono text-zinc-500">Activity</span>
                                  </div>
                                  <ul className="divide-y divide-zinc-800/60 pt-1 text-xs">
                                    {solversData.solvers.map((solv, idx) => (
                                      <li key={`${solv.solver_id}-${idx}`} className="py-2 px-1 flex items-center justify-between hover:bg-white/5 rounded-md transition-colors">
                                        <span className="text-zinc-200 font-medium">{solv.solver_name}</span>
                                        <span className={`text-[11px] font-mono ${solv.completed_at ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                          {solv.completed_at ? 'Completed' : 'Started'} · {new Date(solv.started_at).toLocaleDateString()}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </SmartPopover>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-zinc-800/50">
                      <p className="text-xs text-zinc-500">
                        By <span className="text-zinc-400">{item.ownerName}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        {user && item.ownerId === user.id && item.visibility !== 'temporary' && (
                          <button
                            type="button"
                            onClick={() => setInviteTarget({ id: item.id, title: item.title, visibility: item.visibility })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                            title="Invite developers to practice this challenge"
                          >
                            <UserPlus size={13} aria-hidden="true" />
                            <span>Invite</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => void startChallenge(item)}
                          disabled={Boolean(startingId)}
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3.5 py-1.5 text-xs font-semibold text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                        >
                          {startingId === item.id
                            ? 'Opening...'
                            : item.visibility === 'built-in'
                            ? 'Try challenge'
                            : 'View challenge'}{' '}
                          <ArrowRight size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {inviteTarget && (
            <InviteModal
              challengeId={inviteTarget.id}
              challengeTitle={inviteTarget.title}
              visibility={inviteTarget.visibility}
              isOpen={Boolean(inviteTarget)}
              onClose={() => setInviteTarget(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
