import Link from 'next/link';
import { Lock, Layers, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

const TRACKS = [
  {
    id: '01',
    num: 1,
    title: 'Identity & Access',
    icon: Lock,
    summary: 'Token expiration boundaries, session lifecycles, and authorization guards.',
    focus: 'JWT & Sessions',
  },
  {
    id: '02',
    num: 2,
    title: 'Interactive UI & State',
    icon: Layers,
    summary: 'Debouncing handlers, race condition defense, and async state tearing.',
    focus: 'Concurrency & Race Conditions',
  },
  {
    id: '03',
    num: 3,
    title: 'APIs & Persistence',
    icon: Cpu,
    summary: 'Token bucket rate limiting, cursor pagination, and idempotent mutations.',
    focus: 'Rate Limiting & Idempotency',
  },
  {
    id: '04',
    num: 4,
    title: 'Data Security',
    icon: ShieldCheck,
    summary: 'Timing attack prevention, input sanitization, and constant-time verification.',
    focus: 'Timing Safety & Sanitization',
  },
];

export default function TrackGrid() {
  return (
    <section id="tracks" className="py-20 sm:py-32 bg-[#090A0F] relative border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="max-w-xl space-y-3">
          <div className="text-xs font-mono font-bold text-[#88BDA4] uppercase tracking-wider">
            Curriculum Domains
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5]">
            Four core engineering tracks.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            12 progressive tiers targeting real production failure modes.
          </p>
        </div>

        {/* 2x2 Spacious Track Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <Link
                key={track.id}
                href={`/studio?track=${track.num}`}
                className="p-6 sm:p-8 rounded-2xl bg-[#12151e] border border-white/10 hover:border-[#88BDA4]/40 transition-all duration-200 group flex flex-col justify-between space-y-6 shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#88BDA4]">
                      TRACK {track.id}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#181d2a] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-[#88BDA4] transition-colors">
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#88BDA4] transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                    {track.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/8 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">{track.focus}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#88BDA4] group-hover:translate-x-0.5 transition-transform">
                    <span>Enter track</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
