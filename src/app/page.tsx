'use client';

import { useState } from 'react';
import { Code2, ShieldCheck, Terminal } from 'lucide-react';
import { MasterPromptCard } from '@/components/home/MasterPromptCard';
import { PasteChallengeBox } from '@/components/home/PasteChallengeBox';
import { HistoryDrawer } from '@/components/home/HistoryDrawer';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { ResultModal } from '@/components/result/ResultModal';
import { useWorkspaceFiles } from '@/hooks/useWorkspaceFiles';
import { saveHistoryRecord } from '@/lib/storage/history';
import { Challenge, JudgeResult } from '@/lib/types/challenge';

export default function Home() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Active workspace file manager
  const workspace = useWorkspaceFiles(activeChallenge?.files || []);

  const handleStartChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setJudgeResult(null);
    setShowResultModal(false);
  };

  const handleBackToSetup = () => {
    if (workspace.isDirty) {
      if (!confirm('Leave workspace? Unsaved changes will be lost.')) {
        return;
      }
    }
    setActiveChallenge(null);
  };

  const handleSubmitToJudge = async () => {
    if (!activeChallenge) return;

    setIsJudging(true);
    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: activeChallenge,
          userFiles: workspace.files,
        }),
      });

      if (!response.ok) {
        throw new Error(`Judge evaluation failed with status ${response.status}`);
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
    }

    setShowResultModal(false);
    setActiveChallenge(null);
  };

  // If a challenge is active, render the full workspace
  if (activeChallenge && workspace.activeFile) {
    return (
      <>
        <WorkspaceLayout
          challenge={activeChallenge}
          files={workspace.files}
          activeFile={workspace.activeFile}
          activeFilePath={workspace.activeFilePath}
          onSelectFile={workspace.setActiveFilePath}
          onUpdateFileContent={workspace.updateFileContent}
          isFileDirty={workspace.isFileDirty}
          isDirty={workspace.isDirty}
          onResetFile={workspace.resetFile}
          onResetAll={workspace.resetAllFiles}
          isJudging={isJudging}
          onSubmit={handleSubmitToJudge}
          onBack={handleBackToSetup}
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

  // Home / Setup View
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-zinc-100">KeepCoding</span>
              <span className="ml-2 text-xs text-zinc-500 font-mono">v0.1</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              Private Judge
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Keep your coding intuition sharp.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Active practice only. Read, think, and write code by hand in an isolated workspace.
            Evaluated by a private dry-run judge with actionable feedback.
          </p>
        </div>

        {/* 2-Step Ingestion Flow */}
        <div className="space-y-6">
          {/* Step 1: Generate Master Prompt */}
          <MasterPromptCard />

          {/* Step 2: Paste and Validate Challenge */}
          <PasteChallengeBox onStartChallenge={handleStartChallenge} />

          {/* Completed History Record */}
          <HistoryDrawer />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        KeepCoding: Active coding practice
      </footer>
    </div>
  );
}
