'use client';

import { useState, useEffect } from 'react';
import { Code2, ShieldCheck, History, Layers, Terminal } from 'lucide-react';
import { MasterPromptCard } from '@/components/home/MasterPromptCard';
import { PasteChallengeBox } from '@/components/home/PasteChallengeBox';
import { HistoryDrawer } from '@/components/home/HistoryDrawer';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { ResultModal } from '@/components/result/ResultModal';
import { useWorkspaceFiles } from '@/hooks/useWorkspaceFiles';
import { saveHistoryRecord, getHistory } from '@/lib/storage/history';
import { Challenge, JudgeResult } from '@/lib/types/challenge';

export default function Home() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Home View State: Segmented tab & History slide-over
  const [activeTab, setActiveTab] = useState<'prompt' | 'paste'>('prompt');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);

  const refreshHistoryCount = () => {
    setHistoryCount(getHistory().length);
  };

  useEffect(() => {
    refreshHistoryCount();
  }, []);

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

  // Home Setup View
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Header Navigation */}
      <header className="border-b border-zinc-850 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">KeepCoding</span>
              <span className="text-[11px] text-zinc-500 font-mono">v0.1</span>
            </div>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 ml-1">
              Active Practice
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs transition-colors"
            >
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span>Practice History</span>
              {historyCount > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                  {historyCount}
                </span>
              )}
            </button>

            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Private Judge</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col space-y-8">
        {/* Calm Hero Section */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
            Keep your coding intuition sharp.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Hands-on practice. Read, think, and write code by hand in an isolated editor with a private AI judge.
          </p>
        </div>

        {/* Focused Segmented Tab Control */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'prompt'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Get Practice Prompt</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'paste'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
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

      {/* Practice History Slide-Over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onHistoryChange={refreshHistoryCount}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        KeepCoding: Deliberate hands-on practice for developers.
      </footer>
    </div>
  );
}
