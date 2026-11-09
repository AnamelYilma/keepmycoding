'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AppNav from '@/components/navigation/AppNav';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { ResultModal } from '@/components/result/ResultModal';
import { useWorkspaceFiles } from '@/hooks/useWorkspaceFiles';
import { saveHistoryRecord } from '@/lib/storage/history';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { Challenge, ChallengeFile, JudgeResult } from '@/lib/types/challenge';

interface ActiveWorkspaceViewProps {
  challenge: Challenge;
  onBack: () => void;
  isJudging: boolean;
  onSubmit: (userFiles: ChallengeFile[]) => void;
}

function ActiveWorkspaceView({
  challenge,
  onBack,
  isJudging,
  onSubmit,
}: ActiveWorkspaceViewProps) {
  const workspace = useWorkspaceFiles(challenge.files);
  const activeFile = workspace.activeFile || workspace.files[0] || challenge.files[0];

  const handleBack = () => {
    if (workspace.isDirty) {
      if (!confirm('Leave workspace? Unsaved changes will be lost.')) {
        return;
      }
    }
    onBack();
  };

  if (!activeFile) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090A0F] text-zinc-400 text-sm">
        No files found in challenge.
      </div>
    );
  }

  return (
    <WorkspaceLayout
      challenge={challenge}
      files={workspace.files.length > 0 ? workspace.files : challenge.files}
      activeFile={activeFile}
      activeFilePath={workspace.activeFilePath || activeFile.path}
      onSelectFile={workspace.setActiveFilePath}
      onUpdateFileContent={workspace.updateFileContent}
      isFileDirty={workspace.isFileDirty}
      isDirty={workspace.isDirty}
      onResetFile={workspace.resetFile}
      onResetAll={workspace.resetAllFiles}
      isJudging={isJudging}
      onSubmit={() => onSubmit(workspace.files.length > 0 ? workspace.files : challenge.files)}
      onBack={handleBack}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const challengeIdParam = searchParams.get('id');
  const builtinParam = searchParams.get('builtin');
  const trackParam = searchParams.get('track');
  const inviteParam = searchParams.get('invite');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Try reading from active session storage (DO NOT delete immediately on mount to survive StrictMode and reload)
    const stored =
      sessionStorage.getItem('active_workspace_challenge') ||
      sessionStorage.getItem('pending_challenge');
    const storedId =
      sessionStorage.getItem('active_workspace_id') ||
      sessionStorage.getItem('pending_challenge_id') ||
      challengeIdParam;

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Challenge;
        if (parsed && parsed.files && parsed.files.length > 0) {
          setActiveChallenge(parsed);
          setActiveChallengeId(storedId || null);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached workspace challenge', e);
      }
    }

    // 2. Try loading by challenge ID from API
    if (challengeIdParam) {
      let active = true;
      const fetchUrl = inviteParam
        ? `/api/challenges/${challengeIdParam}?invite=${encodeURIComponent(inviteParam)}`
        : `/api/challenges/${challengeIdParam}`;
      fetch(fetchUrl)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load challenge');
          const body = await res.json();
          if (active && body?.challenge?.challenge) {
            const parsed = body.challenge.challenge as Challenge;
            setActiveChallenge(parsed);
            setActiveChallengeId(challengeIdParam);
            sessionStorage.setItem('active_workspace_challenge', JSON.stringify(parsed));
            sessionStorage.setItem('active_workspace_id', challengeIdParam);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) {
            router.replace('/challenges');
          }
        });
      return () => {
        active = false;
      };
    }

    // 3. Try loading built-in sample challenge by ID or track
    if (builtinParam || trackParam) {
      const match = builtinParam
        ? SAMPLE_CHALLENGES.find((s) => s.id === builtinParam)
        : SAMPLE_CHALLENGES.find((s) => s.track === Number(trackParam));

      if (match) {
        const parsed = validateRawChallenge(match.raw).challenge;
        if (parsed) {
          setActiveChallenge(parsed);
          setActiveChallengeId(`builtin:${match.id}`);
          sessionStorage.setItem('active_workspace_challenge', JSON.stringify(parsed));
          sessionStorage.setItem('active_workspace_id', `builtin:${match.id}`);
          setLoading(false);
          return;
        }
      }
    }

    // 4. No challenge data found anywhere: cleanly redirect to challenge library
    setLoading(false);
    router.replace('/challenges');
  }, [challengeIdParam, builtinParam, trackParam, router]);

  const handleExitWorkspace = () => {
    sessionStorage.removeItem('active_workspace_challenge');
    sessionStorage.removeItem('active_workspace_id');
    sessionStorage.removeItem('pending_challenge');
    sessionStorage.removeItem('pending_challenge_id');

    if (activeChallengeId && !activeChallengeId.startsWith('builtin:')) {
      router.push(`/challenges/${activeChallengeId}`);
    } else {
      router.push('/challenges');
    }
  };

  const handleSubmitToJudge = async (userFiles: ChallengeFile[]) => {
    if (!activeChallenge) return;

    setIsJudging(true);
    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: activeChallenge,
          ...(activeChallengeId && !activeChallengeId.startsWith('builtin:')
            ? { challengeId: activeChallengeId }
            : {}),
          userFiles,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.error || `Judge evaluation failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      const result = (await response.json()) as JudgeResult;
      setJudgeResult(result);
      setShowResultModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown evaluation error';
      console.error('Judge submission error:', err);
      setJudgeResult({
        verdict: 'FAIL',
        summary: `Submission encountered a system error: ${msg}`,
        breakdown: '- An error occurred while evaluating the code submission.',
        model: 'system-error',
        advice: 'Check your network connection and server logs, then try again.',
      });
      setShowResultModal(true);
    } finally {
      setIsJudging(false);
    }
  };

  const handleTryAgain = () => {
    setShowResultModal(false);
  };

  const handleNextChallenge = () => {
    if (activeChallenge && judgeResult) {
      saveHistoryRecord({
        track: activeChallenge.metadata.track,
        level: activeChallenge.metadata.level,
        type: activeChallenge.metadata.type,
        taskTitle: activeChallenge.task.slice(0, 80).replace(/[\r\n]+/g, ' '),
        verdict: judgeResult.verdict,
        language: activeChallenge.metadata.editableLanguage || 'code',
      });
    }

    sessionStorage.removeItem('active_workspace_challenge');
    sessionStorage.removeItem('active_workspace_id');
    sessionStorage.removeItem('pending_challenge');
    sessionStorage.removeItem('pending_challenge_id');

    setShowResultModal(false);
    if (activeChallengeId && !activeChallengeId.startsWith('builtin:')) {
      router.push(`/challenges/${activeChallengeId}`);
    } else {
      router.push('/challenges');
    }
  };

  // If a challenge is active, render the full isolated workspace
  if (activeChallenge) {
    return (
      <>
        <ActiveWorkspaceView
          key={`${activeChallenge.metadata.track}-${activeChallenge.metadata.level}-${activeChallenge.metadata.type}`}
          challenge={activeChallenge}
          onBack={handleExitWorkspace}
          isJudging={isJudging}
          onSubmit={handleSubmitToJudge}
        />

        <ResultModal
          result={judgeResult}
          isOpen={showResultModal}
          onTryAgain={handleTryAgain}
          onNextChallenge={handleNextChallenge}
        />
      </>
    );
  }

  // Redirecting / Loading state with semantic main landmark
  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 flex flex-col font-sans">
      <AppNav />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex items-center gap-3 text-zinc-400 text-sm font-mono px-4 py-2 rounded-full bg-[#11131A] border border-white/10">
          <Loader2 className="w-4 h-4 animate-spin text-[#88BDA4]" aria-hidden="true" />
          <span>{loading ? 'Opening challenge workspace...' : 'Redirecting to challenges...'}</span>
        </div>
      </main>
    </div>
  );
}
