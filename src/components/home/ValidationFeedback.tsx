'use client';

import { useState } from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';

interface ValidationFeedbackProps {
  errors: string[];
  fixPrompt?: string;
}

export function ValidationFeedback({ errors, fixPrompt }: ValidationFeedbackProps) {
  const [copied, setCopied] = useState(false);

  if (!errors || errors.length === 0) return null;

  const handleCopy = async () => {
    if (!fixPrompt) return;
    try {
      await navigator.clipboard.writeText(fixPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy fix prompt:', err);
    }
  };

  return (
    <div className="mt-4 p-4 rounded-lg bg-zinc-900 border border-red-900/40 text-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Validation Errors ({errors.length})</span>
        </div>
        {fixPrompt && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Fix Prompt' : 'Copy Fix Prompt'}</span>
          </button>
        )}
      </div>

      <ul className="space-y-1 text-zinc-400 list-disc list-inside">
        {errors.map((error, idx) => (
          <li key={idx} className="leading-relaxed">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
