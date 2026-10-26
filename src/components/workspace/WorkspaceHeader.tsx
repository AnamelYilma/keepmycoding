'use client';

import { ArrowLeft, RotateCcw, ShieldCheck, Loader2 } from 'lucide-react';
import { ChallengeMetadata } from '@/lib/types/challenge';

interface WorkspaceHeaderProps {
  metadata: ChallengeMetadata;
  isDirty: boolean;
  isJudging: boolean;
  onBack: () => void;
  onResetAll: () => void;
  onSubmit: () => void;
}

export function WorkspaceHeader({
  metadata,
  isDirty,
  isJudging,
  onBack,
  onResetAll,
  onSubmit,
}: WorkspaceHeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40 px-4 h-14 flex items-center justify-between">
      {/* Left: Back button and challenge tags */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Setup</span>
        </button>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-200">
            Track {metadata.track}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
            Lvl {metadata.level}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            {metadata.type}
          </span>
          {metadata.editableLanguage && (
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
              {metadata.editableLanguage}
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {isDirty && (
          <button
            type="button"
            onClick={onResetAll}
            disabled={isJudging}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isJudging}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#88BDA4] hover:bg-[#7aa892] text-zinc-950 font-medium text-xs disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
        >
          {isJudging ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" />
              <span>Submit to Judge</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
