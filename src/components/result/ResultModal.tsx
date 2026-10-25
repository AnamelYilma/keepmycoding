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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with verdict */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPass ? (
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-400 shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold tracking-wider font-mono px-2 py-0.5 rounded border ${
                    isPass
                      ? 'text-emerald-400 border-zinc-800 bg-zinc-900'
                      : 'text-rose-400 border-zinc-800 bg-zinc-900'
                  }`}
                >
                  {result.verdict}
                </span>
                <span className="text-xs text-zinc-400">Judge Evaluation</span>
              </div>
              <p className="text-xs text-zinc-200 mt-1.5 font-medium leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed">
          {/* Breakdown */}
          <div className="space-y-1.5">
            <h3 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
              Evaluation Breakdown
            </h3>
            <div className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-850 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap">
              {result.breakdown}
            </div>
          </div>

          {/* Advice */}
          {result.advice && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>Intuition Advice</span>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-850 text-zinc-300">
                {result.advice}
              </div>
            </div>
          )}

          {/* Code Fix Recommendation if failed */}
          {result.fix && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reference Fix</span>
              </div>
              <pre className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-200 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                {result.fix}
              </pre>
            </div>
          )}

          {/* Evaluator note */}
          <div className="pt-2 text-[10px] text-zinc-500 font-mono">
            Evaluator: {result.model}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <button
            type="button"
            onClick={onTryAgain}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Review Code</span>
          </button>

          <button
            type="button"
            onClick={onNextChallenge}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors shadow-sm"
          >
            <span>{isPass ? 'Save and Continue' : 'Finish Challenge'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
