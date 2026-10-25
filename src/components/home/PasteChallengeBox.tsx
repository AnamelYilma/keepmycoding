'use client';

import { useState, useMemo } from 'react';
import { Terminal, CheckCircle2, AlertCircle, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { ValidationFeedback } from './ValidationFeedback';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';
import { Challenge } from '@/lib/types/challenge';

interface PasteChallengeBoxProps {
  onStartChallenge: (challenge: Challenge) => void;
}

export function PasteChallengeBox({ onStartChallenge }: PasteChallengeBoxProps) {
  const [rawText, setRawText] = useState<string>('');

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

  const handleStart = () => {
    if (validation && validation.valid && validation.challenge) {
      onStartChallenge(validation.challenge);
    }
  };

  const handleClear = () => {
    setRawText('');
  };

  const isEmpty = !rawText.trim();
  const isValid = validation?.valid === true;

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-medium text-zinc-200">2. Ingest Challenge</h2>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sample:</span>
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) handleSelectSample(e.target.value);
            }}
            defaultValue=""
            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
          >
            <option value="" disabled>
              Select test challenge...
            </option>
            {SAMPLE_CHALLENGES.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={10}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`Paste the AI's response here. Must include:
---METADATA---
---TASK---
---FILE: path---
---TESTS---
---REFERENCE---`}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 resize-y leading-relaxed"
        />

        {/* Live validation badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border backdrop-blur">
          {isEmpty ? (
            <span className="text-zinc-500 border-transparent">Awaiting input</span>
          ) : isValid ? (
            <span className="flex items-center gap-1 text-emerald-400 border-zinc-800 bg-zinc-950/90">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Valid challenge
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 border-zinc-800 bg-zinc-950/90">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Invalid ({validation?.errors.length} issues)
            </span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleClear}
          disabled={isEmpty}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        <button
          type="button"
          onClick={handleStart}
          disabled={!isValid}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Validation feedback if invalid */}
      {validation && !validation.valid && (
        <ValidationFeedback errors={validation.errors} fixPrompt={validation.fixPrompt} />
      )}
    </div>
  );
}
