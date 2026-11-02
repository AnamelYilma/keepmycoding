'use client';

import { CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle, Code2 } from 'lucide-react';
import { JudgeResult } from '@/lib/types/challenge';

interface ResultModalProps {
  result: JudgeResult | null;
  isOpen: boolean;
  onTryAgain: () => void;
  onNextChallenge: () => void;
}

export function ResultModal({
  result,
  isOpen,
  onTryAgain,
  onNextChallenge,
}: ResultModalProps) {
  if (!isOpen || !result) return null;

  const isPass = result.verdict === 'PASS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-dialog-title"
        className="w-full max-w-2xl bg-[#11131A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with verdict */}
        <div className="p-6 border-b border-white/8 bg-[#090A0F]/80 flex items-center justify-between" aria-live="polite">
          <div className="flex items-center gap-3.5">
            {isPass ? (
              <div className="w-10 h-10 rounded-xl bg-[#11131A] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#11131A] border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-sm">
                <XCircle className="w-5 h-5 text-rose-400" aria-hidden="true" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span
                  id="result-dialog-title"
                  className={`text-xs font-bold tracking-wider font-mono px-2.5 py-0.5 rounded-full border ${
                    isPass
                      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                      : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                  }`}
                >
                  {result.verdict}
                </span>
                <span className="text-xs text-zinc-400 font-mono">Judge Evaluation</span>
              </div>
              <p className="text-xs text-zinc-200 mt-1.5 font-medium leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs leading-relaxed">
          {/* Breakdown */}
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
              Evaluation Breakdown
            </h3>
            <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-inner">
              {result.breakdown}
            </div>
          </div>

          {/* Advice */}
          {result.advice && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
                <HelpCircle className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                <span>Intuition Advice</span>
              </div>
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-300 leading-relaxed text-xs">
                {result.advice}
              </div>
            </div>
          )}

          {/* Code Fix Recommendation if failed */}
          {result.fix && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
                <Code2 className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                <span>Reference Fix</span>
              </div>
              <pre className="p-4 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-200 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {result.fix}
              </pre>
            </div>
          )}

          {/* Evaluator note */}
          <div className="pt-2 text-[10px] text-zinc-400 font-mono">
            Evaluator: {result.model}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-white/8 bg-[#090A0F]/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onTryAgain}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#171a24] hover:bg-[#1f2330] text-zinc-300 border border-white/10 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Review Code</span>
          </button>

          <button
            type="button"
            onClick={onNextChallenge}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs tracking-wide shadow-md shadow-[#88BDA4]/20 transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <span>{isPass ? 'Save and Continue' : 'Finish Challenge'}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
