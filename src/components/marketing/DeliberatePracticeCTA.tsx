import Link from 'next/link';
import { ArrowRight, Code2, Terminal, CheckCircle2 } from 'lucide-react';

export default function DeliberatePracticeCTA() {
  return (
    <section className="py-14 sm:py-20 bg-[#090A0F] relative border-t border-white/[0.06] overflow-hidden">
      <div 
        className="ambient-glow ambient-glow-mint w-[360px] h-[360px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true" 
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 sm:p-10 text-center space-y-6 relative overflow-hidden border-[#88BDA4]/20 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          
          {/* Heading */}
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Do one deliberate rep today.
            </h2>
            <p className="text-sm text-zinc-400 font-sans max-w-md mx-auto">
              No account required. Jump straight into an isolated coding workspace.
            </p>
          </div>

          {/* Action button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href="/prompt"
              className="btn-secondary px-5 py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <span>1. Prompt Wizard</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/studio"
              className="btn-primary px-6 py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2 rounded-full shadow-[0_4px_20px_rgba(136,189,164,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0F]"
            >
              <span>2. Launch Practice Studio</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Badges */}
          <div className="pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#88BDA4]" aria-hidden="true" />
              <span>In-Browser Workbench</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal size={13} className="text-[#88BDA4]" aria-hidden="true" />
              <span>Zero Setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Code2 size={13} className="text-[#88BDA4]" aria-hidden="true" />
              <span>Free &amp; Open</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
