'use client';

import { useState } from 'react';
import { MasterPromptCard } from '@/components/home/MasterPromptCard';
import { PasteChallengeBox } from '@/components/home/PasteChallengeBox';
import { HistoryDrawer } from '@/components/home/HistoryDrawer';
import { HowItWorksModal } from '@/components/home/HowItWorksModal';
import { PracticeLoopLanding } from '@/components/landing/PracticeLoopLanding';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { ResultModal } from '@/components/result/ResultModal';
import { useWorkspaceFiles } from '@/hooks/useWorkspaceFiles';
import { saveHistoryRecord, getHistory } from '@/lib/storage/history';
import { Challenge, ChallengeFile, JudgeResult } from '@/lib/types/challenge';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';

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

  const handleStartSample = () => {
    const sample = SAMPLE_CHALLENGES[0];
    if (!sample) return;

    const validation = validateRawChallenge(sample.raw);
    if (validation.valid && validation.challenge) {
      handleStartChallenge(validation.challenge);
    }
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <PracticeLoopLanding
        onStartSample={handleStartSample}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyCount}
      />

      <section id="practice-setup" className="border-t border-zinc-800 bg-zinc-950 px-4 py-16 sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col space-y-8">
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-primary">
              Build your own repetition
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
              Bring a challenge into the loop.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
              Configure a prompt with the track and difficulty you want, or paste a structured challenge you already have.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'prompt'
                    ? 'bg-[#88BDA4] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                1. Get Practice Prompt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'paste'
                    ? 'bg-[#88BDA4] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                2. Paste & Start
              </button>
            </div>
          </div>

          {activeTab === 'prompt' ? (
            <MasterPromptCard onGoToWorkspace={() => setActiveTab('paste')} />
          ) : (
            <PasteChallengeBox
              onStartChallenge={handleStartChallenge}
              onGoToPrompt={() => setActiveTab('prompt')}
            />
          )}
        </div>
      </section>

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartPractice={() => {
          setIsHowItWorksOpen(false);
          setActiveTab('prompt');
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onHistoryChange={refreshHistoryCount}
      />
    </div>
  );
}
