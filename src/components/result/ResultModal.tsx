'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Code2,
  BookOpen,
} from 'lucide-react';
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
  const [showFix, setShowFix] = useState<boolean>(false);

  // Reset spoiler visibility whenever modal opens or result changes
  useEffect(() => {
    setShowFix(false);
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const isPass = result.verdict === 'PASS';
  const isPartial = result.verdict === 'PARTIAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-dialog-title"
        className="w-full max-w-2xl bg-[#11131A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with 3-tier verdict */}
        <div className="p-6 border-b border-white/8 bg-[#090A0F]/80 flex items-center justify-between" aria-live="polite">
          <div className="flex items-center gap-3.5">
            {isPass ? (
              <div className="w-10 h-10 rounded-xl bg-[#11131A] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              </div>
            ) : isPartial ? (
              <div className="w-10 h-10 rounded-xl bg-[#11131A] border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-400" aria-hidden="true" />
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
                      : isPartial
                      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                  }`}
                >
                  {isPass ? 'PASS' : isPartial ? 'PARTIALLY CORRECT' : 'NEEDS WORK'}
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
          {/* Mistake Root Cause Diagnostic */}
          {result.mistakeType && result.mistakeType !== 'NONE' && (
            <div className={`p-3 rounded-xl border flex items-start gap-3 ${
              result.mistakeType === 'SYNTAX'
                ? 'bg-sky-950/20 border-sky-500/30 text-sky-200'
                : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            }`}>
              <div className="shrink-0 mt-0.5">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  result.mistakeType === 'SYNTAX'
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                }`}>
                  {result.mistakeType === 'SYNTAX' ? 'MISTAKE: SYNTAX / IDIOM' : 'MISTAKE: CONCEPT / LOGIC'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-300">
                {result.mistakeType === 'SYNTAX'
                  ? 'Your logical intent is headed in the right direction, but the language syntax, method receiver, or type construct needs adjustment.'
                  : 'The core business logic, edge case handling, timing rule, or algorithm contract did not match expected requirements.'}
              </p>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
              Evaluation Breakdown
            </h3>
            <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-inner">
              {result.breakdown}
            </div>
          </div>

          {/* What to Learn & Study (No Spoilers) */}
          {result.whatToLearn && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
                <BookOpen className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                <span>What to Learn to Solve This</span>
              </div>
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-300 leading-relaxed text-xs space-y-1.5 shadow-inner">
                <div className="whitespace-pre-wrap">{result.whatToLearn}</div>
              </div>
            </div>
          )}

          {/* Intuition Advice */}
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

          {isPass && result.authorLearning && (
            <div className="space-y-3">
              {result.authorLearning.explanation && (
                <section className="space-y-2">
                  <h3 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">Author explanation</h3>
                  <div className="rounded-xl border border-white/8 bg-[#090A0F] p-4 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">{result.authorLearning.explanation}</div>
                </section>
              )}
              {result.authorLearning.referenceSolution && (
                <section className="space-y-2">
                  <h3 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">Reference solution</h3>
                  <pre className="rounded-xl border border-white/8 bg-[#090A0F] p-4 font-mono text-[11px] leading-relaxed text-zinc-200 whitespace-pre-wrap overflow-x-auto">{result.authorLearning.referenceSolution}</pre>
                </section>
              )}
              {result.authorLearning.sources.length > 0 && (
                <section className="space-y-2">
                  <h3 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">Sources</h3>
                  <ul className="space-y-1">{result.authorLearning.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-[#88BDA4] underline underline-offset-2">{source.label}</a></li>)}</ul>
                </section>
              )}
            </div>
          )}

          {/* Reference Solution Protected by Spoiler Guard */}
          {result.fix && (
            <div className="space-y-2 pt-2 border-t border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-400 uppercase tracking-wider text-[11px] font-mono">
                  <Code2 className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>Reference Solution (Spoiler Guard)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFix(!showFix)}
                  className="text-[11px] font-mono text-[#88BDA4] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] rounded px-1.5 py-0.5"
                >
                  {showFix ? 'Hide Solution' : 'Reveal Solution'}
                </button>
              </div>
              {showFix ? (
                <pre className="p-4 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-200 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {result.fix}
                </pre>
              ) : (
                <p className="text-[11px] text-zinc-400 italic">
                  Solution is hidden so you can study the hints and retry without spoilers. Click reveal if you want to inspect reference code.
                </p>
              )}
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
            <span>Review & Edit Code</span>
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
