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
    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Validation Issues ({errors.length})</span>
        </div>
        {fixPrompt && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Fix Prompt' : 'Copy Fix Prompt'}</span>
          </button>
        )}
      </div>

      <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
        {errors.map((error, idx) => (
          <li key={idx} className="leading-relaxed">
            {error}
          </li>
        ))}
      </ul>

      {fixPrompt && (
        <p className="text-[11px] text-zinc-500">
          Tip: Click &quot;Copy Fix Prompt&quot; above and send it to your AI to quickly repair these tags.
        </p>
      )}
    </div>
  );
}
