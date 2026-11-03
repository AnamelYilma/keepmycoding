'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, History, Layers, Terminal, ArrowRight, LogOut, User } from 'lucide-react';
import { MasterPromptCard } from '@/components/home/MasterPromptCard';
import { PasteChallengeBox } from '@/components/home/PasteChallengeBox';
import { HistoryDrawer } from '@/components/home/HistoryDrawer';
import { HowItWorksModal } from '@/components/home/HowItWorksModal';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { ResultModal } from '@/components/result/ResultModal';
import { useWorkspaceFiles } from '@/hooks/useWorkspaceFiles';
import { saveHistoryRecord, getHistory } from '@/lib/storage/history';
import { Challenge, ChallengeFile, JudgeResult } from '@/lib/types/challenge';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { signOutAction } from '@/app/auth/actions';

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
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Home View State: Segmented tab, Guest Modal & History slide-over
  const [activeTab, setActiveTab] = useState<'prompt' | 'paste'>('prompt');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(() => {
    return typeof window !== 'undefined' ? getHistory().length : 0;
  });

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setUserEmail(data.user.email);
        }
      });
    } catch {
      // Supabase unconfigured or offline
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('pending_challenge');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Challenge;
          sessionStorage.removeItem('pending_challenge');
          if (parsed && parsed.files && parsed.files.length > 0) {
            setActiveChallenge(parsed);
          }
        } catch (e) {
          console.error('Failed to parse pending challenge', e);
        }
      }
    }
  }, []);

  const refreshHistoryCount = () => {
    setHistoryCount(getHistory().length);
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setJudgeResult(null);
    setShowResultModal(false);
  };

  const handleBackToSetup = () => {
    setActiveChallenge(null);
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
      // Save record to local history
      saveHistoryRecord({
        track: activeChallenge.metadata.track,
        level: activeChallenge.metadata.level,
        type: activeChallenge.metadata.type,
        taskTitle: activeChallenge.task.slice(0, 80).replace(/[\r\n]+/g, ' '),
        verdict: judgeResult.verdict,
        language: activeChallenge.metadata.editableLanguage || 'code',
      });
      refreshHistoryCount();
    }

    setShowResultModal(false);
    setActiveChallenge(null);
  };

  // If a challenge is active, render the full workspace
  if (activeChallenge) {
    return (
      <>
        <ActiveWorkspaceView
          key={`${activeChallenge.metadata.track}-${activeChallenge.metadata.level}-${activeChallenge.metadata.type}`}
          challenge={activeChallenge}
          onBack={handleBackToSetup}
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

  // Studio setup view
  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 relative selection:bg-[#88BDA4]/20 selection:text-[#88BDA4]">
      {/* Subtle ambient lighting */}
      <div className="ambient-glow ambient-glow-mint top-[-120px] left-1/2 -translate-x-1/2 w-[720px] h-[340px] opacity-25 pointer-events-none" />

      {/* Modern Top Header matching landing page */}
      <header className="border-b border-white/8 bg-[#090A0F]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/studio"
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-lg"
            aria-label="KeepCoding Studio home"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/images/logo.png"
                alt="KeepCoding logo"
                width={32}
                height={32}
                priority
                className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(136,189,164,0.35)]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-base font-bold text-[#F4F4F5] tracking-tight leading-none group-hover:text-white transition-colors">
                KeepCoding
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#88BDA4] mt-1 leading-none">
                ZERO-AI GYM
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 text-xs" aria-label="Studio navigation">
            <Link
              href="/"
              className="hidden sm:inline-flex rounded-full px-3.5 py-1.5 text-zinc-400 border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-zinc-100 transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              Landing page
            </Link>
            <Link
              href="/prompt"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-zinc-300 border border-white/10 bg-[#11131A] hover:border-white/20 hover:bg-[#171a24] hover:text-white transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <Layers className="h-3.5 w-3.5 text-[#88BDA4]" aria-hidden="true" />
              <span>Prompt Wizard</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-zinc-400 border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-zinc-100 transition-all font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <BookOpen className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              <span>How it works</span>
            </button>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#11131A] px-3.5 py-1.5 text-zinc-300 hover:border-white/20 hover:bg-[#171a24] hover:text-zinc-100 transition-all font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <History className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1 rounded-full bg-[#88BDA4]/15 px-1.5 py-0.2 font-mono text-[10px] text-[#88BDA4] border border-[#88BDA4]/20">
                  {historyCount}
                </span>
              )}
            </button>

            {userEmail ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                  <User size={13} className="text-[#88BDA4]" aria-hidden="true" />
                  <span className="max-w-[120px] truncate">{userEmail}</span>
                </span>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#11131A] px-3 py-1.5 text-zinc-400 hover:border-red-500/30 hover:bg-red-950/20 hover:text-red-300 transition-all font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    title="Sign out of account"
                  >
                    <LogOut size={13} aria-hidden="true" />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#11131A] px-3.5 py-1.5 text-zinc-300 hover:border-white/20 hover:bg-[#171a24] hover:text-white transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              >
                <span>Sign in</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-4xl flex-col space-y-8 px-4 py-10 sm:px-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Hands-on coding without distractions.
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-400">
            Configure a structured prompt with your target track and tier to copy to your external AI, or paste your challenge block to begin active practice.
          </p>
        </div>

        {/* Clean, Modern Workflow Tabs */}
        <div className="flex justify-center" role="tablist" aria-label="Studio workflow steps">
          <div className="grid grid-cols-2 max-w-lg w-full gap-2 p-1.5 rounded-2xl bg-[#11131A] border border-white/10 shadow-2xl">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'prompt'}
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
                activeTab === 'prompt'
                  ? 'bg-[#1b202c] border border-[#88BDA4]/40 shadow-lg'
                  : 'border border-transparent hover:bg-white/[0.04] text-zinc-400'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'prompt'
                    ? 'bg-[#88BDA4] text-[#090A0F]'
                    : 'bg-[#090A0F] border border-white/10 text-zinc-400'
                }`}
              >
                <Layers className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-[10px] font-mono uppercase tracking-wider ${
                    activeTab === 'prompt' ? 'text-[#88BDA4]' : 'text-zinc-400'
                  }`}
                >
                  Step 1
                </div>
                <div
                  className={`text-xs font-semibold truncate ${
                    activeTab === 'prompt' ? 'text-zinc-100' : 'text-zinc-300'
                  }`}
                >
                  Configure Prompt
                </div>
              </div>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'paste'}
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
                activeTab === 'paste'
                  ? 'bg-[#1b202c] border border-[#88BDA4]/40 shadow-lg'
                  : 'border border-transparent hover:bg-white/[0.04] text-zinc-400'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'paste'
                    ? 'bg-[#88BDA4] text-[#090A0F]'
                    : 'bg-[#090A0F] border border-white/10 text-zinc-400'
                }`}
              >
                <Terminal className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-[10px] font-mono uppercase tracking-wider ${
                    activeTab === 'paste' ? 'text-[#88BDA4]' : 'text-zinc-400'
                  }`}
                >
                  Step 2
                </div>
                <div
                  className={`text-xs font-semibold truncate ${
                    activeTab === 'paste' ? 'text-zinc-100' : 'text-zinc-300'
                  }`}
                >
                  Paste & Workspace
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Card Panels */}
        {activeTab === 'prompt' ? (
          <MasterPromptCard onGoToWorkspace={() => setActiveTab('paste')} />
        ) : (
          <PasteChallengeBox
            onStartChallenge={handleStartChallenge}
            onGoToPrompt={() => setActiveTab('prompt')}
          />
        )}
      </main>

      {/* How it Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartPractice={() => {
          setIsHowItWorksOpen(false);
          setActiveTab('prompt');
        }}
      />

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onHistoryChange={refreshHistoryCount}
      />
    </div>
  );
}
