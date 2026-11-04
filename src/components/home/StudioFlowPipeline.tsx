'use client';

export function StudioFlowPipeline() {
  return (
    <div
      aria-label="Workflow step overview"
      className="rounded-xl border border-white/8 bg-[#11131A] px-4 py-3 text-xs text-zinc-400 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center font-mono text-[11px]">
        <span className="text-zinc-200">1. Choose option</span>
        <span className="text-zinc-500" aria-hidden="true">→</span>
        <span className="text-zinc-200">2. Copy prompt</span>
        <span className="text-zinc-500" aria-hidden="true">→</span>
        <span className="text-zinc-200">3. Give to your AI</span>
        <span className="text-zinc-500" aria-hidden="true">→</span>
        <span className="text-zinc-200">4. Paste back</span>
        <span className="text-zinc-500" aria-hidden="true">→</span>
        <span className="text-[#88BDA4] font-medium">5. Load &amp; practice</span>
      </div>
    </div>
  );
}
