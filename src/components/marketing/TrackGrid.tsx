import Link from 'next/link';
import { Lock, Layers, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

const TRACKS = [
  {
    id: '01',
    title: 'Identity & Access',
    icon: Lock,
    summary: 'Token expiration, session lifecycles, and permission checks.',
    topics: ['JWT Validation', 'Sessions', 'Permissions'],
  },
  {
    id: '02',
    title: 'Interactive UI & State',
    icon: Layers,
    summary: 'Debouncing, race condition defense, and event teardown.',
    topics: ['Race Conditions', 'Debounce', 'Async State'],
  },
  {
    id: '03',
    title: 'APIs & Persistence',
    icon: Cpu,
    summary: 'Rate limiting buckets, cursor pagination, and idempotent APIs.',
    topics: ['Rate Limiting', 'Pagination', 'Idempotency'],
  },
  {
    id: '04',
    title: 'Data Security',
    icon: ShieldCheck,
    summary: 'Timing attack mitigation, sanitization, and input safety.',
    topics: ['Constant Time', 'Sanitization', 'Safety Bounds'],
  },
];

export default function TrackGrid() {
  return (
    <section id="tracks" className="py-14 sm:py-20 bg-[#090A0F] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Section Header (Clean & Minimalist without AI pill badges) */}
        <div className="max-w-2xl mx-auto text-center space-y-2.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Core engineering domains
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-lg mx-auto">
            Four focused tracks from basic pure functions to production resilience.
          </p>
        </div>

        {/* 2x2 Track Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className="glass-card p-6 flex flex-col justify-between group hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Card top */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#171a24] border border-white/[0.08] flex items-center justify-center text-[#88BDA4] group-hover:border-[#88BDA4]/40 transition-colors">
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {track.title}
                      </h3>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                    {track.summary}
                  </p>

                  {/* Topic tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {track.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#090A0F] border border-white/[0.06] text-zinc-400"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-4 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500">Practice track</span>
                  <Link
                    href={`/studio?track=${parseInt(track.id, 10)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#88BDA4] hover:text-[#9cd1b8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded px-1 py-0.5"
                    aria-label={`Enter Track ${track.id}: ${track.title}`}
                  >
                    <span>Enter track</span>
                    <ArrowRight size={13} aria-hidden="true" />
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
