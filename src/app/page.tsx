'use client';

import { useState } from 'react';
import { Code2, ShieldCheck, History, Layers, Terminal, BookOpen } from 'lucide-react';
import { MasterPromptCard } from '@/components/home/MasterPromptCard';
import { PasteChallengeBox } from '@/components/home/PasteChallengeBox';
import { HistoryDrawer } from '@/components/home/HistoryDrawer';
import { HowItWorksModal } from '@/components/home/HowItWorksModal';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { ResultModal } from '@/components/result/ResultModal';
import { useWorkspaceFiles } from '@/hooks/useWorkspaceFiles';
import { saveHistoryRecord, getHistory } from '@/lib/storage/history';
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
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400 text-sm">
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
  const [historyCount, setHistoryCount] = useState<number>(() => {
    return typeof window !== 'undefined' ? getHistory().length : 0;
  });

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

  // Home Setup View
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Header Navigation for Guests & Developers */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand mark & title (no Zap icon) */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">KeepCoding</span>
              <span className="text-[11px] text-zinc-500 font-mono">v0.1</span>
            </div>
          </div>

          {/* Guest Navigation */}
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => {
                setActiveTab('prompt');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-200 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            >
              Practice
            </button>

            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>How It Works</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs transition-colors"
            >
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                  {historyCount}
                </span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Private Judge</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col space-y-8">
        {/* Calm Hero Section - No floating pill badge */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
            Keep your coding intuition sharp.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Deliberate hands-on practice. Read, think, and write code by hand in an isolated editor with a private AI judge.
          </p>
        </div>

        {/* Focused Segmented Tab Control with High-Contrast Primary Accent */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'prompt'
                  ? 'bg-[#88BDA4] text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Get Practice Prompt</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'paste'
                  ? 'bg-[#88BDA4] text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>2. Paste & Start</span>
            </button>
          </div>
        </div>

        {/* Tab Viewport */}
        <div>
          {activeTab === 'prompt' ? (
            <MasterPromptCard onGoToWorkspace={() => setActiveTab('paste')} />
          ) : (
            <PasteChallengeBox
              onStartChallenge={handleStartChallenge}
              onGoToPrompt={() => setActiveTab('prompt')}
            />
          )}
        </div>
      </main>

      {/* Guest "How It Works" Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartPractice={() => {
          setIsHowItWorksOpen(false);
          setActiveTab('prompt');
        }}
      />

      {/* Practice History Slide-Over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onHistoryChange={refreshHistoryCount}
      />

      {/* Minimal Clean Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        KeepCoding: Deliberate hands-on practice for developers.
      </footer>
    </div>
  );
}
