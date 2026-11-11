'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock, Timer, Globe, Users, Share2 } from 'lucide-react';
import type { ChallengeAttempt, PublicChallengeRecord } from '@/lib/challenges/library';
import type { Challenge } from '@/lib/types/challenge';
import AppNav from '@/components/navigation/AppNav';
import { TaskSpecificationView } from '@/components/workspace/TaskGuidePane';
import { InviteModal } from '@/components/challenges/InviteModal';

type ChallengeDetailsRecord = Omit<PublicChallengeRecord, 'challenge'> & { challenge: Challenge };

export default function ChallengeDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeDetailsRecord | null>(null);
  const [attempts, setAttempts] = useState<ChallengeAttempt[] | undefined>();
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

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
      sessionStorage.setItem('active_workspace_challenge', JSON.stringify({ ...(challenge.challenge as Challenge), reference: '' }));
      sessionStorage.setItem('active_workspace_id', id);
      sessionStorage.setItem('pending_challenge', JSON.stringify({ ...(challenge.challenge as Challenge), reference: '' }));
      sessionStorage.setItem('pending_challenge_id', id);
      router.push(`/studio?id=${id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start this challenge.');
    } finally {
      setStarting(false);
    }
  }

  if (error && !challenge) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        <AppNav />
        <main className="flex-1 px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <p className="rounded-lg border border-rose-500/30 p-4 text-rose-300" role="alert">{error}</p>
            <Link href="/challenges" className="mt-4 inline-block text-sm text-zinc-300 underline">Back to library</Link>
          </div>
        </main>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        <AppNav />
        <main className="flex-1 px-4 py-16 text-center text-sm text-zinc-400">Loading challenge...</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
              <ArrowLeft size={15} aria-hidden="true" /> Challenge Library
            </Link>
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 hover:border-zinc-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-100 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Share this challenge with others"
            >
              <Share2 size={14} className="text-[#88BDA4]" aria-hidden="true" />
              <span>Share Challenge</span>
            </button>
          </div>
          <header className="mt-5 border-b border-zinc-800 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-zinc-300 font-semibold">{challenge.language}</span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60">Level {challenge.level}</span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60">{challenge.challenge_type}</span>
                <span>· {challenge.topic}</span>
                {challenge.visibility === 'temporary' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    <Timer size={12} aria-hidden="true" /> Temporary
                  </span>
                )}
                {challenge.visibility === 'private' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                    <Lock size={12} aria-hidden="true" /> Private
                  </span>
                )}
                {challenge.visibility === 'public' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    <Globe size={12} aria-hidden="true" /> Public
                  </span>
                )}
              </div>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{challenge.title}</h1>
            <p className="mt-3 max-w-3xl leading-6 text-zinc-300">{challenge.summary}</p>
            <p className="mt-3 text-xs text-zinc-500">Created by {challenge.owner_name}</p>
          </header>

          <div className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              {challenge.reason && (
                <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h2 className="text-sm font-semibold">Why this problem matters</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{challenge.reason}</p>
                </section>
              )}
              {challenge.learning_goal && (
                <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h2 className="text-sm font-semibold">Practice goal</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{challenge.learning_goal}</p>
                </section>
              )}
              <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h2 className="text-sm font-semibold mb-3">Task Specification</h2>
                <TaskSpecificationView task={challenge.challenge.task} challengeType={challenge.challenge_type} />
                <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Files in this challenge</h3>
                <ul className="mt-2 space-y-2 font-mono text-xs text-zinc-300">
                  {challenge.challenge.files.map((file) => (
                    <li key={file.path} className="flex items-center gap-2">
                      <span>{file.isEditable ? 'Edit' : <Lock size={12} aria-label="Read only" />}</span>
                      {file.path}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Examples</h3>
                <ul className="mt-2 space-y-2">
                  {challenge.challenge.tests.map((test, index) => (
                    <li key={`${test.input}-${index}`} className="rounded-lg bg-zinc-950 p-3 text-xs">
                      <p className="text-zinc-400">{test.description || `Test ${index + 1}`}</p>
                      <p className="mt-1 font-mono text-zinc-300">Input: {test.input}</p>
                      <p className="font-mono text-zinc-300">Expected: {test.expected}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h2 className="font-semibold">Ready to practice?</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">Work through the task in the KeepCoding workspace.</p>
                <button
                  type="button"
                  onClick={() => void start()}
                  disabled={starting}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#88BDA4] px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                >
                  {starting ? 'Starting...' : 'Try challenge'} <ArrowRight size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setInviteOpen(true)}
                  className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Share2 size={14} className="text-[#88BDA4]" aria-hidden="true" />
                  <span>{challenge.visibility === 'public' ? 'Share Challenge' : 'Invite Developers'}</span>
                </button>
                {error && (
                  <p className="mt-3 text-xs text-rose-300" role="alert">
                    {error} <Link href="/login" className="underline">Sign in</Link>
                  </p>
                )}
              </section>
              {attempts && (
                <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h2 className="font-semibold">Solver activity</h2>
                  <p className="mt-1 text-xs text-zinc-400">Only you can see the people who tried this challenge.</p>
                  {attempts.length === 0 ? (
                    <p className="mt-3 text-sm text-zinc-500">No attempts yet.</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-zinc-800">
                      {attempts.map((attempt) => (
                        <li key={attempt.solver_id} className="py-3">
                          <p className="text-sm text-zinc-200">{attempt.solver_name}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {attempt.completed_at ? 'Completed' : 'Started'} · {new Date(attempt.started_at).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}
            </aside>
          </div>
        </div>
      </main>

      {inviteOpen && (
        <InviteModal
          challengeId={id}
          challengeTitle={challenge.title}
          visibility={challenge.visibility}
          isOpen={inviteOpen}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </div>
  );
}
