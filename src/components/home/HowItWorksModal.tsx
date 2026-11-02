'use client';

import { useEffect } from 'react';
import { X, Layers, Terminal, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: () => void;
}

export function HowItWorksModal({ isOpen, onClose, onStartPractice }: HowItWorksModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
        className="relative w-full max-w-xl bg-[#11131A] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6 z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#090A0F] border border-white/10 flex items-center justify-center text-[#88BDA4] shadow-sm">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="how-it-works-title" className="text-sm font-semibold text-zinc-100">
                How KeepCoding Works
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Deliberate hands-on practice workflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* 3 Step Cards */}
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <div className="w-6 h-6 rounded-lg bg-[#11131A] border border-white/10 flex items-center justify-center text-[#88BDA4]">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span>1. Configure and Copy Master Prompt</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed pl-8">
              Choose your practice track and difficulty tier (Levels 1 to 12). Copy the prompt text and send it to your external AI of choice (Claude, ChatGPT, DeepSeek, or local LLM) to generate a structured practice challenge.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <div className="w-6 h-6 rounded-lg bg-[#11131A] border border-white/10 flex items-center justify-center text-[#88BDA4]">
                <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span>2. Solve in the Isolated Workspace</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed pl-8">
              Paste the tagged response or click Launch Sample Demo. Review task objectives, constraints, and locked companion files, then write your solution by hand in the in-browser multi-file editor.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <div className="w-6 h-6 rounded-lg bg-[#11131A] border border-white/10 flex items-center justify-center text-[#88BDA4]">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span>3. Evaluate with the Private AI Judge</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed pl-8">
              Submit your code for instant automated grading. The server-side judge verifies your logic against tests and specifications, returning a clear PASS/FAIL breakdown and intuition tips with zero secret leakage.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-white/8">
          <span className="text-[11px] text-zinc-400 font-mono">
            No registration or credit card required
          </span>

          <button
            type="button"
            onClick={() => {
              onClose();
              onStartPractice();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs tracking-wide transition-all shadow-md shadow-[#88BDA4]/15 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
