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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-7 space-y-6 shadow-sm">
      {/* Box Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-semibold text-zinc-100">Step 2: Paste Challenge Block & Enter Workspace</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Paste the raw response from your AI containing the tagged challenge blocks, or click &quot;Try Sample Challenge&quot; to test instantly.
          </p>
        </div>

        {/* Top Controls: 1-Click Sample & Clear */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={handleQuickLaunchSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-950" />
            <span>Launch Sample Demo</span>
          </button>

          <button
            type="button"
            onClick={handleQuickSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Paste Sample</span>
          </button>

          <select
            onChange={(e) => {
              if (e.target.value) handleSelectSample(e.target.value);
            }}
            defaultValue=""
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
          >
            <option value="" disabled>
              More Samples...
            </option>
            {SAMPLE_CHALLENGES.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleClear}
            disabled={isEmpty}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-950 text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors text-xs"
            title="Clear textarea"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Frame with Line Numbers */}
      <div className="space-y-3">
        <div className="relative flex rounded-xl border border-zinc-800 bg-zinc-950 focus-within:border-zinc-700 transition-colors overflow-hidden">
          {/* Gutter */}
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="w-10 py-3.5 pl-2 pr-2 font-mono text-[11px] text-zinc-600 bg-zinc-950 border-r border-zinc-850 select-none text-right overflow-hidden shrink-0 leading-[1.625rem]"
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
            className="w-full bg-transparent p-3.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-y leading-[1.625rem] min-h-[260px]"
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
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-zinc-500 flex items-center justify-between">
            <span>Awaiting challenge input. Paste AI output above or try the sample button.</span>
            <span className="font-mono text-[11px] text-zinc-600">0 characters</span>
          </div>
        ) : isValid && validation.challenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-zinc-300 font-mono text-xs flex-wrap">
                <span className="text-emerald-400 font-medium">Valid Challenge</span>
                <span className="text-zinc-700">|</span>
                <span>Track {validation.challenge.metadata.track}</span>
                <span className="text-zinc-700">|</span>
                <span>Level {validation.challenge.metadata.level}</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">{validation.challenge.metadata.editableLanguage}</span>
                <span className="text-zinc-700">|</span>
                <span>{validation.challenge.files.length} {validation.challenge.files.length === 1 ? 'file' : 'files'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-zinc-700 font-mono text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          validation && !validation.valid && (
            <ValidationFeedback errors={validation.errors} fixPrompt={validation.fixPrompt} />
          )
        )}
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-zinc-800">
        <div>
          {onGoToPrompt && (
            <button
              type="button"
              onClick={onGoToPrompt}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Need to generate a challenge prompt first?</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={!isValid}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
            isValid
              ? 'bg-[#88BDA4] hover:bg-[#7aa892] text-zinc-950 active:scale-[0.99] cursor-pointer'
              : 'bg-zinc-850 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-50'
          }`}
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
