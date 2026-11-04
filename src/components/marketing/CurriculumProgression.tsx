import { Terminal, ShieldCheck, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TIERS = [
  {
    phase: 'Tiers 01 to 04',
    title: 'Foundational Contracts',
    summary: 'Pure functions, input sanitization, and deterministic logic.',
    icon: Code2,
    examples: ['JWT expiration checks', 'Cursor token formatting', 'Payload validation guards'],
  },
  {
    phase: 'Tiers 05 to 08',
    title: 'Async State & Concurrency',
    summary: 'Race condition prevention, request debouncing, and cache lifecycle.',
    icon: Terminal,
    examples: ['Stale response discards', 'Debounce timers with teardown', 'In-memory sliding window'],
  },
  {
    phase: 'Tiers 09 to 12',
    title: 'Production Resilience',
    summary: 'Idempotency keys, timing attack resistance, and circuit breakers.',
    icon: ShieldCheck,
    examples: ['Constant-time hash comparison', 'Token bucket rate limiters', 'Retry backoff contracts'],
  },
];

export default function CurriculumProgression() {
  return (
    <section id="curriculum" className="py-16 sm:py-24 bg-[#090A0F] relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono font-bold text-[#88BDA4] uppercase tracking-wider">
            12-Tier Curriculum
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F4F4F5]">
            Progressive difficulty from basic logic to system resilience.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl leading-relaxed">
            Every tier targets a specific category of real production vulnerabilities that AI completions frequently miss.
          </p>
        </div>

        {/* 3 Progression Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TIERS.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#12151e] border border-white/12 flex flex-col justify-between space-y-6 hover:border-[#88BDA4]/40 transition-all shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#88BDA4] tracking-wider uppercase">
                      {tier.phase}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#181d2a] border border-white/10 flex items-center justify-center text-zinc-300">
                      <Icon size={16} aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {tier.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {tier.summary}
                  </p>

                  <div className="pt-2 border-t border-white/8 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Target Scenarios
                    </span>
                    <ul className="space-y-1.5 text-xs font-mono text-zinc-300">
                      {tier.examples.map((ex, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-[#88BDA4] font-bold">›</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/8">
                  <Link
                    href={`/studio`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#88BDA4] hover:text-[#9cd1b8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded"
                  >
                    <span>Practice these tiers</span>
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
