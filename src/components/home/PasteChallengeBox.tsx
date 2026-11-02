'use client';

import { useState, useMemo, useRef } from 'react';
import {
  Terminal,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronLeft,
} from 'lucide-react';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { ValidationFeedback } from './ValidationFeedback';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';
import { Challenge } from '@/lib/types/challenge';

interface PasteChallengeBoxProps {
  onStartChallenge: (challenge: Challenge) => void;
  onGoToPrompt?: () => void;
}

export function PasteChallengeBox({ onStartChallenge, onGoToPrompt }: PasteChallengeBoxProps) {
  const [rawText, setRawText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Live validation
  const validation = useMemo(() => {
    if (!rawText.trim()) return null;
    return validateRawChallenge(rawText);
  }, [rawText]);

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_CHALLENGES.find((s) => s.id === sampleId);
    if (sample) {
      setRawText(sample.raw);
    }
  };

  const handleQuickSample = () => {
    if (SAMPLE_CHALLENGES.length > 0) {
      setRawText(SAMPLE_CHALLENGES[0].raw);
    }
  };

  const handleQuickLaunchSample = () => {
    if (SAMPLE_CHALLENGES.length > 0) {
      const sample = SAMPLE_CHALLENGES[0];
      setRawText(sample.raw);
      const val = validateRawChallenge(sample.raw);
      if (val.valid && val.challenge) {
        onStartChallenge(val.challenge);
      }
    }
  };

  const handleStart = () => {
    if (validation && validation.valid && validation.challenge) {
      onStartChallenge(validation.challenge);
    }
  };

  const handleClear = () => {
    setRawText('');
  };

  const handleScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const isEmpty = !rawText.trim();
  const isValid = validation?.valid === true;

  const linesCount = useMemo(() => {
    if (!rawText) return 12;
    const count = rawText.split('\n').length;
    return Math.max(count, 12);
  }, [rawText]);

  return (
    <div className="bg-[#11131A]/90 backdrop-blur-md border border-white/8 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xl relative overflow-hidden">
      {/* Box Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#090A0F] border border-white/10 flex items-center justify-center text-[#88BDA4] shadow-sm">
              <Terminal className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-zinc-100">Step 2: Paste Challenge Block & Enter Workspace</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Paste the raw response from your AI containing tagged challenge blocks, or click &quot;Launch Sample Demo&quot; to test immediately.
          </p>
        </div>

        {/* Top Controls: 1-Click Sample & Clear */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={handleQuickLaunchSample}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-white text-[#090A0F] font-semibold text-xs transition-all cursor-pointer shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#090A0F]" aria-hidden="true" />
            <span>Launch Sample Demo</span>
          </button>

          <button
            type="button"
            onClick={handleQuickSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#171a24] hover:bg-[#1f2330] text-zinc-300 border border-white/10 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
            <span>Paste Sample</span>
          </button>

          <select
            onChange={(e) => {
              if (e.target.value) handleSelectSample(e.target.value);
            }}
            defaultValue=""
            aria-label="Select sample challenge"
            className="bg-[#090A0F] border border-white/10 rounded-full px-3.5 py-2 text-xs text-zinc-300 hover:text-zinc-100 focus:outline-none focus:border-[#88BDA4]/40 focus-visible:ring-2 focus-visible:ring-[#88BDA4] transition-colors cursor-pointer"
          >
            <option value="" disabled className="bg-[#090A0F] text-zinc-400">
              More Samples...
            </option>
            {SAMPLE_CHALLENGES.map((sample) => (
              <option key={sample.id} value={sample.id} className="bg-[#090A0F] text-zinc-200">
                {sample.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleClear}
            disabled={isEmpty}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#090A0F] text-zinc-400 hover:text-zinc-200 border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            title="Clear textarea"
            aria-label="Clear challenge input"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Frame with Line Numbers */}
      <div className="space-y-3.5">
        <div className="relative flex rounded-2xl border border-white/10 bg-[#090A0F] focus-within:border-[#88BDA4]/50 focus-within:ring-1 focus-within:ring-[#88BDA4]/30 transition-all overflow-hidden shadow-inner">
          {/* Gutter */}
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="w-11 py-4 pl-2 pr-3 font-mono text-[11px] text-zinc-500 bg-[#0b0d13] border-r border-white/6 select-none text-right overflow-hidden shrink-0 leading-[1.625rem]"
          >
            {Array.from({ length: linesCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>

          {/* Monospace Textarea */}
          <textarea
            ref={textareaRef}
            onScroll={handleScroll}
            rows={12}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            aria-label="Raw challenge specification block"
            placeholder={`---METADATA---
track: 1
level: 2
type: Fix
editableLanguage: typescript
editableFiles: src/token-validator.ts

---TASK---
Describe task specifications here...

---FILE: src/token-validator.ts---
// Code to inspect and modify...

---TESTS---
// Test cases...

---REFERENCE---
// Correct reference answer...`}
            className="w-full bg-transparent p-4 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none resize-y leading-[1.625rem] min-h-[260px]"
            spellCheck={false}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (isValid && validation?.challenge) {
                  handleStart();
                }
              }
            }}
          />
        </div>

        {/* Live Validation Status Card */}
        {isEmpty ? (
          <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/6 text-xs text-zinc-400 flex items-center justify-between">
            <span>Awaiting challenge input. Paste AI output above or click &quot;Launch Sample Demo&quot;.</span>
            <span className="font-mono text-[11px] text-zinc-400">0 characters</span>
          </div>
        ) : isValid && validation.challenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#090A0F] border border-[#88BDA4]/30 text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#11131A] border border-[#88BDA4]/40 flex items-center justify-center text-[#88BDA4] shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-zinc-300 font-mono text-xs flex-wrap">
                <span className="text-[#88BDA4] font-semibold">Valid Challenge</span>
                <span className="text-zinc-500">|</span>
                <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-zinc-200">
                  Track {validation.challenge.metadata.track}
                </span>
                <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[#88BDA4]">
                  Level {validation.challenge.metadata.level}
                </span>
                <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-zinc-300">
                  {validation.challenge.metadata.editableLanguage}
                </span>
                <span className="text-zinc-400">
                  {validation.challenge.files.length} {validation.challenge.files.length === 1 ? 'file' : 'files'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#171a24] hover:bg-[#1f2330] text-[#88BDA4] border border-[#88BDA4]/30 font-mono text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          validation && !validation.valid && (
            <ValidationFeedback errors={validation.errors} fixPrompt={validation.fixPrompt} />
          )
        )}
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/8">
        <div>
          {onGoToPrompt && (
            <button
              type="button"
              onClick={onGoToPrompt}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#88BDA4] transition-colors font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Need to configure a challenge prompt first?</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={!isValid}
          className={`inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
            isValid
              ? 'bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] active:scale-[0.98] cursor-pointer shadow-[#88BDA4]/20'
              : 'bg-[#171a24] text-zinc-400 border border-white/6 cursor-not-allowed opacity-50'
          }`}
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
