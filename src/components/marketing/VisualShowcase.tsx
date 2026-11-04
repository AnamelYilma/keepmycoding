import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Terminal, Lock } from 'lucide-react';

export default function VisualShowcase() {
  return (
    <section className="py-20 sm:py-28 bg-[#090A0F] relative border-t border-white/10 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div 
        className="ambient-glow ambient-glow-mint w-[400px] h-[400px] top-1/2 left-1/4 -translate-y-1/2 opacity-20 pointer-events-none"
        aria-hidden="true" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#12151e] border border-white/12 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center shadow-2xl relative overflow-hidden">
          
          {/* Left Column: Bold Typography & Minimal Bullets (7 of 12 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#88BDA4] uppercase tracking-wider">
                Deliberate Mastery
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Code you can write <br />
                <span className="text-[#88BDA4]">in the dark.</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-lg pt-1">
                AI writes boilerplate in seconds. KeepCoding ensures your engineering instincts stay razor sharp when production incidents hit.
              </p>
            </div>

            {/* 2 Clean Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#88BDA4]">
                  <Terminal size={14} aria-hidden="true" />
                  <span className="font-bold">ZERO AUTO-COMPLETE</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No ghost suggestions. You type the logic from memory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#88BDA4]">
                  <Lock size={14} aria-hidden="true" />
                  <span className="font-bold">MULTI-FILE ARCHITECTURE</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real companion files and locked contract test suites.
                </p>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="pt-2">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs sm:text-sm shadow-lg shadow-[#88BDA4]/20 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              >
                <span>Launch Practice Studio</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Artwork (5 of 12 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/images/taking-control.png"
                alt="Developer taking control"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-transparent to-transparent opacity-60" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
