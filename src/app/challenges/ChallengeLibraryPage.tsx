'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Lock, Plus, Search } from 'lucide-react';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import type { Challenge } from '@/lib/types/challenge';
import type { PublicChallengeRecord } from '@/lib/challenges/library';

type LibraryItem = {
  id: string;
  title: string;
  summary: string;
  topic: string;
  language: string;
  level: number;
  type: string;
  visibility: 'public' | 'private' | 'built-in';
  ownerName: string;
  challenge?: Challenge;
  reason?: string;
  learningGoal?: string;
  attemptStatus?: 'In progress' | 'Completed';
};

const inputClass = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400';

export default function ChallengeLibraryPage() {
  const router = useRouter();
  const [community, setCommunity] = useState<PublicChallengeRecord[]>([]);
  const [myAttempts, setMyAttempts] = useState<{ challenge_id: string; completed_at: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('all');
  const [startingId, setStartingId] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/challenges')
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Could not load challenges.');
        if (active) {
          setCommunity(body.challenges ?? []);
          setMyAttempts(body.myAttempts ?? []);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load challenges.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const builtIns = useMemo<LibraryItem[]>(() => SAMPLE_CHALLENGES.flatMap((sample) => {
    const parsed = validateRawChallenge(sample.raw).challenge;
    if (!parsed) return [];
    return [{
      id: `builtin:${sample.id}`,
      title: sample.label.replace(/^Track \d+ \(Level \d+\) - /, ''),
      summary: parsed.task.split('\n').filter(Boolean)[0]?.slice(0, 220) || 'Built-in KeepCoding challenge.',
      topic: `Track ${sample.track}`,
      language: sample.language,
      level: sample.level,
      type: sample.type,
      visibility: 'built-in',
      ownerName: 'KeepCoding',
      challenge: parsed,
    }];
  }), []);

  const communityItems = useMemo<LibraryItem[]>(() => community.map((item) => ({
    id: item.id,
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
    attemptStatus: myAttempts.find((attempt) => attempt.challenge_id === item.id)
      ? myAttempts.find((attempt) => attempt.challenge_id === item.id)?.completed_at ? 'Completed' : 'In progress'
      : undefined,
  })), [community, myAttempts]);

  const allItems = [...builtIns, ...communityItems];
  const topics = Array.from(new Set(allItems.map((item) => item.topic))).sort();
  const languages = Array.from(new Set(allItems.map((item) => item.language))).sort();
  const types = Array.from(new Set(allItems.map((item) => item.type))).sort();
  const filtered = allItems.filter((item) => {
    const searchable = `${item.title} ${item.summary} ${item.topic} ${item.type} ${item.ownerName}`.toLowerCase();
    return (!query || searchable.includes(query.toLowerCase())) &&
      (!topic || item.topic === topic) &&
      (!language || item.language === language) &&
      (!level || item.level === Number(level)) &&
      (!type || item.type === type) &&
      (visibility === 'all' || item.visibility === visibility);
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
      sessionStorage.setItem('pending_challenge', JSON.stringify(item.challenge));
      sessionStorage.removeItem('pending_challenge_id');
      router.push('/studio');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start challenge.');
    } finally {
      setStartingId('');
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <Link href="/studio" className="text-sm text-zinc-400 hover:text-zinc-100">KeepCoding Studio</Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Challenge Library</h1>
            <p className="mt-2 text-sm text-zinc-400">Find a practice challenge or turn a real coding problem into one.</p>
          </div>
          <Link href="/challenges/create" className="inline-flex items-center gap-2 rounded-lg bg-[#88BDA4] px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300">
            <Plus size={16} aria-hidden="true" /> Create challenge
          </Link>
        </header>

        <section className="mt-6 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Challenge filters">
          <label className="relative sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search challenges</span>
            <Search size={15} className="absolute left-3 top-3 text-zinc-500" aria-hidden="true" />
            <input className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search challenges" />
          </label>
          <label><span className="sr-only">Topic</span><select className={inputClass} value={topic} onChange={(event) => setTopic(event.target.value)}><option value="">All topics</option>{topics.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">Language</span><select className={inputClass} value={language} onChange={(event) => setLanguage(event.target.value)}><option value="">All languages</option>{languages.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">Level</span><select className={inputClass} value={level} onChange={(event) => setLevel(event.target.value)}><option value="">All levels</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>Level {index + 1}</option>)}</select></label>
          <label><span className="sr-only">Challenge type</span><select className={inputClass} value={type} onChange={(event) => setType(event.target.value)}><option value="">All types</option>{types.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">Challenge visibility</span><select className={inputClass} value={visibility} onChange={(event) => setVisibility(event.target.value)}><option value="all">All challenges</option><option value="built-in">Built-in</option><option value="public">Community public</option><option value="private">My private</option></select></label>
        </section>

        {error && <p className="mt-4 rounded-lg border border-rose-500/30 bg-zinc-900 px-4 py-3 text-sm text-rose-300" role="alert">{error} <Link href="/login" className="underline">Sign in</Link></p>}
        {loading ? <p className="py-12 text-center text-sm text-zinc-400">Loading challenges...</p> : null}
        {!loading && filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <BookOpen className="mx-auto text-zinc-500" size={22} aria-hidden="true" />
            <h2 className="mt-3 font-medium">No matching challenges</h2>
            <p className="mt-1 text-sm text-zinc-400">Try another filter or create a challenge from a problem you know.</p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <article key={item.id} className="flex min-h-56 flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">{item.visibility === 'built-in' ? 'Built-in' : item.visibility === 'private' ? 'My private challenge' : 'Community challenge'} · {item.topic}</p>
                    <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                  </div>
                  {item.visibility === 'private' && <Lock size={15} className="mt-1 text-zinc-500" aria-label="Private challenge" />}
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">{item.summary}</p>
                {item.reason && <p className="mt-3 border-l border-zinc-700 pl-3 text-sm text-zinc-300"><span className="font-medium">Why it matters: </span>{item.reason}</p>}
                {item.learningGoal && <p className="mt-2 text-sm text-zinc-400"><span className="font-medium text-zinc-300">Practice goal: </span>{item.learningGoal}</p>}
                {item.attemptStatus && <p className="mt-3 text-xs text-zinc-300" aria-label="Your private challenge status">Your status: {item.attemptStatus}</p>}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <p className="text-xs text-zinc-500">{item.language} · Level {item.level} · {item.type} · by {item.ownerName}</p>
                  <button type="button" onClick={() => void startChallenge(item)} disabled={Boolean(startingId)} className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400">
                    {startingId === item.id ? 'Opening...' : item.visibility === 'built-in' ? 'Try challenge' : 'View challenge'} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
