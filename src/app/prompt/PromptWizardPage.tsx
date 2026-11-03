'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  History,
  Layers,
  Terminal,
  ArrowRight,
  Sparkle,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { MasterPromptCard } from '@/components/home/MasterPromptCard';
import { PasteChallengeBox } from '@/components/home/PasteChallengeBox';
import { HistoryDrawer } from '@/components/home/HistoryDrawer';
import { HowItWorksModal } from '@/components/home/HowItWorksModal';
import { getHistory } from '@/lib/storage/history';
import { Challenge } from '@/lib/types/challenge';

export function PromptWizardPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState<number>(() => {
    return typeof window !== 'undefined' ? getHistory().length : 0;
  });

  const refreshHistoryCount = () => {
    setHistoryCount(getHistory().length);
  };

  const handleStartChallenge = (challenge: Challenge) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_challenge', JSON.stringify(challenge));
    }
    router.push('/studio');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 relative selection:bg-[#88BDA4]/20 selection:text-[#88BDA4]">
      {/* Ambient background mint glow */}
      <div className="ambient-glow ambient-glow-mint top-[-120px] left-1/2 -translate-x-1/2 w-[720px] h-[340px] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/8 bg-[#090A0F]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/prompt"
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-lg"
            aria-label="KeepCoding Prompt Wizard home"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/logo2nd.png"
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

          <nav className="flex items-center gap-2 text-xs" aria-label="Prompt navigation">
            <Link
              href="/"
              className="hidden sm:inline-flex rounded-full px-3.5 py-1.5 text-zinc-400 border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-zinc-100 transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              Home
            </Link>
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-zinc-300 border border-white/10 bg-[#11131A] hover:border-white/20 hover:bg-[#171a24] hover:text-white transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <span>Direct Studio</span>
              <ArrowRight className="h-3 w-3 text-zinc-400" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-zinc-400 border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-zinc-100 transition-all font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <BookOpen className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              <span>Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#11131A] px-3.5 py-1.5 text-zinc-300 hover:border-white/20 hover:bg-[#171a24] hover:text-zinc-100 transition-all font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <History className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="ml-1 rounded-full bg-[#88BDA4]/15 px-1.5 py-0.2 font-mono text-[10px] text-[#88BDA4] border border-[#88BDA4]/20">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-4xl flex-col space-y-8 px-4 py-10 sm:px-6 relative z-10">
        {/* Intro */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#88BDA4]/25 bg-[#88BDA4]/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#88BDA4]">
            Prompting &amp; Onboarding Loop
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Generate your challenge prompt.
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-400">
            Follow the 3-step loop: configure and copy the master prompt, pass it to your favorite LLM, then paste the challenge back to enter your coding workspace.
          </p>
        </div>

        {/* 3-Step Wizard Navigation Indicator */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#11131A] border border-white/10 p-1.5 rounded-2xl shadow-xl">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              activeStep === 1
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                activeStep === 1 ? 'bg-[#090A0F] text-[#88BDA4]' : 'bg-white/10 text-zinc-300'
              }`}
            >
              1
            </span>
            <span className="hidden sm:inline">Configure Prompt</span>
            <span className="sm:hidden">1. Prompt</span>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              activeStep === 2
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                activeStep === 2 ? 'bg-[#090A0F] text-[#88BDA4]' : 'bg-white/10 text-zinc-300'
              }`}
            >
              2
            </span>
            <span className="hidden sm:inline">Copy to External AI</span>
            <span className="sm:hidden">2. AI Copy</span>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              activeStep === 3
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                activeStep === 3 ? 'bg-[#090A0F] text-[#88BDA4]' : 'bg-white/10 text-zinc-300'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">Paste &amp; Start Workspace</span>
            <span className="sm:hidden">3. Paste</span>
          </button>
        </div>

        {/* Step Views */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <MasterPromptCard onGoToWorkspace={() => setActiveStep(2)} />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11131A] hover:bg-[#171a24] text-zinc-200 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              >
                <span>Continue to Step 2 (External AI Guidance)</span>
                <ArrowRight className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="bg-[#11131A]/90 backdrop-blur-md border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-2 border-b border-white/8 pb-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#88BDA4] bg-[#88BDA4]/10 border border-[#88BDA4]/25 px-2.5 py-0.5 rounded-full">
                Step 2 Guidance
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">
                Send prompt to your external AI model
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                KeepCoding is BYOM (Bring Your Own Model). You can use any leading conversational AI tool:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-2">
                <div className="font-semibold text-xs text-zinc-200">Claude (Anthropic)</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  Excellent at strict schema compliance and realistic edge case bugs.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-2">
                <div className="font-semibold text-xs text-zinc-200">ChatGPT (OpenAI)</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  Great algorithmic challenge variations and clear test assertions.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-2">
                <div className="font-semibold text-xs text-zinc-200">Gemini (Google)</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  Fast response times and high adherence to multi-file templates.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090A0F] border border-[#88BDA4]/25 space-y-2 text-xs text-zinc-300">
              <div className="font-medium text-[#88BDA4] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
                <span>What to do with the response:</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Copy the entire AI reply (including the <code className="text-[#88BDA4] font-mono">---METADATA---</code>, <code className="text-[#88BDA4] font-mono">---TASK---</code>, and file blocks), then proceed to Step 3 to paste it into the editor.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/8">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded px-2 py-1"
              >
                Back to Prompt Configuration
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs transition-all shadow-md shadow-[#88BDA4]/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              >
                <span>Proceed to Step 3 (Paste &amp; Open Workspace)</span>
                <ArrowRight className="w-4 h-4 text-[#090A0F]" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <PasteChallengeBox
              onStartChallenge={handleStartChallenge}
              onGoToPrompt={() => setActiveStep(1)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartPractice={() => {
          setIsHowItWorksOpen(false);
          setActiveStep(1);
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
