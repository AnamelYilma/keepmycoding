'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import type { ChallengeAttempt, PublicChallengeRecord } from '@/lib/challenges/library';
import type { Challenge } from '@/lib/types/challenge';

type ChallengeDetailsRecord = Omit<PublicChallengeRecord, 'challenge'> & { challenge: Challenge };

export default function ChallengeDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeDetailsRecord | null>(null);
  const [attempts, setAttempts] = useState<ChallengeAttempt[] | undefined>();
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/challenges/${id}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Could not load challenge.');
        if (active) {
          setChallenge(body.challenge as ChallengeDetailsRecord);
          setAttempts(body.attempts);
        }
      })
      .catch((cause: unknown) => active && setError(cause instanceof Error ? cause.message : 'Could not load challenge.'));
    return () => { active = false; };
  }, [id]);

  async function start() {
    if (!challenge) return;
    setStarting(true);
    setError('');
    try {
      const response = await fetch(`/api/challenges/${id}/attempts`, { method: 'POST' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Sign in to try this challenge.');
      sessionStorage.setItem('pending_challenge', JSON.stringify({ ...(challenge.challenge as Challenge), reference: '' }));
      sessionStorage.setItem('pending_challenge_id', id);
      router.push('/studio');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start this challenge.');
    } finally {
      setStarting(false);
    }
  }

  if (error && !challenge) {
    return <main className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100"><div className="mx-auto max-w-3xl"><p className="rounded-lg border border-rose-500/30 p-4 text-rose-300" role="alert">{error}</p><Link href="/challenges" className="mt-4 inline-block text-sm text-zinc-300 underline">Back to library</Link></div></main>;
  }
  if (!challenge) return <main className="min-h-screen bg-zinc-950 px-4 py-16 text-center text-sm text-zinc-400">Loading challenge...</main>;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"><ArrowLeft size={15} aria-hidden="true" /> Challenge Library</Link>
        <header className="mt-5 border-b border-zinc-800 pb-6">
          <p className="text-xs text-zinc-500">{challenge.topic} · {challenge.language} · Level {challenge.level} · {challenge.challenge_type}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{challenge.title}</h1>
          <p className="mt-3 max-w-3xl leading-6 text-zinc-300">{challenge.summary}</p>
          <p className="mt-3 text-xs text-zinc-500">Created by {challenge.owner_name}</p>
        </header>

        <div className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            {challenge.reason && <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"><h2 className="text-sm font-semibold">Why this problem matters</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{challenge.reason}</p></section>}
            {challenge.learning_goal && <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"><h2 className="text-sm font-semibold">Practice goal</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{challenge.learning_goal}</p></section>}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h2 className="text-sm font-semibold">Task</h2>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{challenge.challenge.task}</div>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Files in this challenge</h3>
              <ul className="mt-2 space-y-2 font-mono text-xs text-zinc-300">{challenge.challenge.files.map((file) => <li key={file.path} className="flex items-center gap-2"><span>{file.isEditable ? 'Edit' : <Lock size={12} aria-label="Read only" />}</span>{file.path}</li>)}</ul>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Examples</h3>
              <ul className="mt-2 space-y-2">{challenge.challenge.tests.map((test, index) => <li key={`${test.input}-${index}`} className="rounded-lg bg-zinc-950 p-3 text-xs"><p className="text-zinc-400">{test.description || `Test ${index + 1}`}</p><p className="mt-1 font-mono text-zinc-300">Input: {test.input}</p><p className="font-mono text-zinc-300">Expected: {test.expected}</p></li>)}</ul>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h2 className="font-semibold">Ready to practice?</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">Work through the task in the KeepCoding workspace.</p>
              <button type="button" onClick={() => void start()} disabled={starting} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#88BDA4] px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300">{starting ? 'Starting...' : 'Try challenge'} <ArrowRight size={15} aria-hidden="true" /></button>
              {error && <p className="mt-3 text-xs text-rose-300" role="alert">{error} <Link href="/login" className="underline">Sign in</Link></p>}
            </section>
            {attempts && <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"><h2 className="font-semibold">Solver activity</h2><p className="mt-1 text-xs text-zinc-400">Only you can see the people who tried this challenge.</p>{attempts.length === 0 ? <p className="mt-3 text-sm text-zinc-500">No attempts yet.</p> : <ul className="mt-3 divide-y divide-zinc-800">{attempts.map((attempt) => <li key={attempt.solver_id} className="py-3"><p className="text-sm text-zinc-200">{attempt.solver_name}</p><p className="mt-1 text-xs text-zinc-500">{attempt.completed_at ? 'Completed' : 'Started'} · {new Date(attempt.started_at).toLocaleDateString()}</p></li>)}</ul>}</section>}
          </aside>
        </div>
      </div>
    </main>
  );
}
