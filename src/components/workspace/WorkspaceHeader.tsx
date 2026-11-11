'use client';

import { ArrowLeft, RotateCcw, ShieldCheck, Loader2, Share2 } from 'lucide-react';
import { ChallengeMetadata } from '@/lib/types/challenge';

interface WorkspaceHeaderProps {
  metadata: ChallengeMetadata;
  isDirty: boolean;
  isJudging: boolean;
  onBack: () => void;
  onResetAll: () => void;
  onSubmit: () => void;
  onShare?: () => void;
}

export function WorkspaceHeader({
  metadata,
  isDirty,
  isJudging,
  onBack,
  onResetAll,
  onSubmit,
  onShare,
}: WorkspaceHeaderProps) {
  return (
    <header className="border-b border-white/8 bg-[#090A0F]/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 h-14 flex items-center justify-between">
      <h1 className="sr-only">
        KeepCoding Workspace - Track {metadata.track}: Level {metadata.level} {metadata.type}
      </h1>

      {/* Left: Setup Back Button and Breadcrumb Chips */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 rounded-full bg-[#11131A] hover:bg-[#171a24] text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
          <span>Back to Library</span>
        </button>

        <div className="h-4 w-[1px] bg-white/10 shrink-0" />

        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 overflow-hidden">
          <span className="text-zinc-200 font-semibold">Track {metadata.track}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-[#88BDA4] font-semibold">Level {metadata.level}</span>
          <span className="text-zinc-600 hidden sm:inline-flex">/</span>
          <span className="text-zinc-300 hidden sm:inline-flex">{metadata.type}</span>
          {metadata.editableLanguage && (
            <>
              <span className="text-zinc-600 hidden md:inline-flex">/</span>
              <span className="text-zinc-400 hidden md:inline-flex">{metadata.editableLanguage}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white bg-[#11131A] hover:bg-[#171a24] border border-white/10 hover:border-zinc-500 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            title="Share this challenge"
          >
            <Share2 className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">Share</span>
          </button>
        )}

        {isDirty && (
          <button
            type="button"
            onClick={onResetAll}
            disabled={isJudging}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 rounded-full text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-[#11131A] hover:bg-[#171a24] border border-white/10 transition-all cursor-pointer disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">Reset All</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isJudging}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs tracking-wide shadow-md shadow-[#88BDA4]/20 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          title="Submit solution for AI judge dry-run evaluation"
        >
          {isJudging ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#090A0F]" aria-hidden="true" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#090A0F]" aria-hidden="true" />
              <span>Submit to Judge</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
