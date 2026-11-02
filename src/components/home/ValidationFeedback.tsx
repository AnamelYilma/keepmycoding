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
    <div className="p-4 rounded-xl bg-[#090A0F] border border-rose-500/30 text-xs space-y-3 shadow-inner" role="alert" aria-live="polite">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Validation Issues ({errors.length})</span>
        </div>
        {fixPrompt && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171a24] hover:bg-[#1f2330] text-zinc-200 border border-white/10 transition-colors text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{copied ? 'Copied Fix Prompt' : 'Copy Fix Prompt'}</span>
          </button>
        )}
      </div>

      <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
        {errors.map((error, idx) => (
          <li key={idx} className="leading-relaxed font-mono text-[11px]">
            {error}
          </li>
        ))}
      </ul>

      {fixPrompt && (
        <p className="text-[11px] text-zinc-400">
          Tip: Click &quot;Copy Fix Prompt&quot; above and send it to your AI to quickly repair these tags.
        </p>
      )}
    </div>
  );
}
