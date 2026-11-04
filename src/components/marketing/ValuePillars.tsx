'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ValuePillars() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#090A0F] relative border-t border-white/[0.08] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Heading: Clean, bold, zero fluff */}
        <div className="max-w-xl space-y-2.5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F4F5]">
            The Practice Loop
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            Three deliberate steps. Zero autocompletion. Real muscle memory.
          </p>
        </div>

        {/* 3-Stage Connected Pipeline */}
        <div className="relative">
          <div 
            className="hidden lg:block absolute top-10 left-16 right-16 h-px border-t border-dashed border-white/10 z-0" 
            aria-hidden="true" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            
            {/* Step 01 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#11131A] border border-white/[0.08] flex flex-col justify-between space-y-5 hover:border-white/[0.18] transition-colors">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono font-extrabold text-[#88BDA4]">01</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181d2a] text-zinc-400 border border-white/[0.06]">
                    CONTRACT
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Read Spec
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    Real failure modes &amp; locked types.
                  </p>
                </div>

                {/* Minimal Micro-Visual */}
                <div className="p-3 rounded-xl bg-[#090A0F] border border-white/[0.06] font-mono text-[11px] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[11px]">
                    <AlertTriangle size={13} aria-hidden="true" />
                    <span>JWT Clock Skew Bug</span>
                  </div>
                  <div className="text-zinc-500 text-[10px]">
                    Target: Reject expired tokens
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Phase 1 // Spec
              </div>
            </div>

            {/* Step 02 (Elevated Centerpiece) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141724] border border-[#88BDA4]/40 shadow-xl shadow-[#88BDA4]/5 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono font-extrabold text-[#88BDA4]">02</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#88BDA4]/15 text-[#88BDA4] font-semibold border border-[#88BDA4]/30">
                    ZERO-AI
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Fix by Hand
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans">
                    No ghosts. Pure keyboard recall.
                  </p>
                </div>

                {/* Minimal Code Visual */}
                <div className="p-3 rounded-xl bg-[#090A0F] border border-[#88BDA4]/20 font-mono text-[11px] space-y-1">
                  <div className="text-zinc-500 text-[10px]">token-validator.ts</div>
                  <div className="text-[#F4F4F5] bg-[#171a24] px-1.5 py-0.5 rounded border-l-2 border-[#88BDA4]">
                    return token.exp <span className="text-[#88BDA4] font-bold">&lt;=</span> now;
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#88BDA4] uppercase tracking-wider">
                Phase 2 // Recall
              </div>
            </div>

            {/* Step 03 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#11131A] border border-white/[0.08] flex flex-col justify-between space-y-5 hover:border-white/[0.18] transition-colors">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono font-extrabold text-[#88BDA4]">03</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0e1713] text-emerald-400 font-semibold border border-emerald-500/20">
                    AUTOMATED
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Run Tests
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    Instant sub-millisecond assertions.
                  </p>
                </div>

                {/* Minimal Result Visual */}
                <div className="p-3 rounded-xl bg-[#090A0F] border border-white/[0.06] font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} aria-hidden="true" />
                      <span>PASS (14ms)</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">2/2 edge cases</span>
                  </div>
                  <div className="text-zinc-500 text-[10px]">
                    Reflex reinforced
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Phase 3 // Verdict
              </div>
            </div>

          </div>
        </div>

        {/* Section Closure Link */}
        <div className="flex items-center justify-center pt-1">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#88BDA4] hover:text-[#9cd1b8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] px-2 py-1 rounded"
          >
            <span>Launch Practice Studio</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
