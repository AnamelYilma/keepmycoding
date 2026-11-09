'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, CheckCircle2, Globe, Lock, Shield, User, ArrowLeft, Loader2 } from 'lucide-react';
import AppNav from '@/components/navigation/AppNav';

interface JoinPageProps {
  token: string;
}

interface InviteData {
  valid: boolean;
  invite: {
    id: string;
    token: string;
    expires_at: string | null;
    uses_count: number;
    max_uses: number | null;
  };
  challenge: {
    id: string;
    owner_id: string;
    owner_name: string;
    title: string;
    summary: string;
    topic: string;
    language: string;
    track: number;
    level: number;
    challenge_type: string;
    visibility: 'private' | 'public' | 'temporary';
    reason?: string;
    learning_goal?: string;
    created_at: string;
  };
  user: {
    id: string;
    isOwner: boolean;
    isMember: boolean;
  } | null;
}

export default function JoinPage({ token }: JoinPageProps) {
  const router = useRouter();
  const [data, setData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/invites/${token}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Invalid invitation.');
        if (active) setData(body);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not validate invitation.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleAcceptInvite = async () => {
    if (!data?.challenge) return;
    setJoining(true);
    setError('');

    try {
      const res = await fetch(`/api/invites/${token}`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Could not accept invitation.');

      // Navigate to the challenge workspace
      router.push(`/challenges/${data.challenge.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join challenge.');
      setJoining(false);
    }
  };

  const handleGuestPractice = async () => {
    if (!data?.challenge) return;
    setJoining(true);
    try {
      // Fetch full challenge with invite token
      const res = await fetch(`/api/challenges/${data.challenge.id}?invite=${token}`);
      const body = await res.json();
      if (!res.ok || !body?.challenge?.challenge) {
        throw new Error(body.error || 'Could not load challenge workspace.');
      }
      sessionStorage.setItem('active_workspace_challenge', JSON.stringify(body.challenge.challenge));
      sessionStorage.setItem('active_workspace_id', data.challenge.id);
      router.push(`/studio?id=${data.challenge.id}&invite=${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not launch guest practice.');
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        <AppNav />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex items-center gap-3 text-zinc-400 text-sm font-mono px-4 py-2 rounded-full bg-[#11131A] border border-white/10">
            <Loader2 className="w-4 h-4 animate-spin text-[#88BDA4]" aria-hidden="true" />
            <span>Validating challenge invitation...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        <AppNav />
        <main className="flex-1 px-4 py-16 flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#12151e] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Shield size={24} aria-hidden="true" />
            </div>
            <h1 className="text-lg font-semibold text-zinc-100">Invitation Not Available</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {error || 'This invitation link is invalid, expired, or has reached its usage limit.'}
            </p>
            <div className="pt-2">
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <ArrowLeft size={14} aria-hidden="true" /> Browse Public Challenges
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { challenge, user } = data;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppNav />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#12151e] p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Top Pill / Inviter Note */}
          <div className="flex items-center gap-2.5 text-xs text-zinc-400 pb-4 border-b border-zinc-800/80">
            <div className="w-7 h-7 rounded-full bg-[#88BDA4]/10 border border-[#88BDA4]/30 flex items-center justify-center text-[#88BDA4]">
              <User size={14} aria-hidden="true" />
            </div>
            <span>
              Invited by <strong className="text-zinc-200 font-semibold">{challenge.owner_name}</strong>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="font-mono text-zinc-400 text-[11px]">{challenge.topic}</span>
          </div>

          {/* Challenge Headline */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-zinc-200 text-xs font-semibold">
                {challenge.language}
              </span>
              <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-xs text-zinc-300">
                Level {challenge.level}
              </span>
              <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-xs text-zinc-300">
                {challenge.challenge_type}
              </span>
              {challenge.visibility === 'private' ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  <Lock size={12} aria-hidden="true" /> Private Challenge
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  <Globe size={12} aria-hidden="true" /> Public Challenge
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              {challenge.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {challenge.summary}
            </p>
          </div>

          {challenge.reason && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 text-xs text-zinc-300">
              <strong className="text-[#88BDA4] font-semibold block mb-1">Why this challenge matters:</strong>
              <p className="leading-relaxed">{challenge.reason}</p>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </p>
          )}

          {/* Action Callouts */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-3">
            {user ? (
              // Authenticated user
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleAcceptInvite}
                  disabled={joining}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#88BDA4] hover:bg-[#9cd1b8] px-5 py-3 text-sm font-semibold text-zinc-950 transition-all shadow-md shadow-[#88BDA4]/20 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  {joining ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      <span>Enrolling into challenge...</span>
                    </>
                  ) : (
                    <>
                      <span>{user.isMember || user.isOwner ? 'Open Challenge' : 'Accept Invitation & Practice'}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-zinc-500">
                  This challenge will be added to your <span className="text-zinc-300">Shared with Me</span> tab.
                </p>
              </div>
            ) : (
              // Unauthenticated visitor
              <div className="space-y-3">
                <Link
                  href={`/login?next=/join/${token}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#88BDA4] hover:bg-[#9cd1b8] px-5 py-3 text-sm font-semibold text-zinc-950 transition-all shadow-md shadow-[#88BDA4]/20 cursor-pointer"
                >
                  <span>Sign In to Accept & Save Progress</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">or</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>

                <button
                  type="button"
                  onClick={handleGuestPractice}
                  disabled={joining}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
                >
                  {joining ? (
                    <>
                      <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                      <span>Opening workspace...</span>
                    </>
                  ) : (
                    <span>Try as Guest in Studio Workspace</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
