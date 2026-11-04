import Link from 'next/link';
import { Lock, Layers, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

interface TrackDefinition {
  id: string;
  num: number;
  title: string;
  domain: string;
  tags: string[];
  contract: string;
  icon: typeof Lock;
}

const TRACKS: TrackDefinition[] = [
  {
    id: '01',
    num: 1,
    title: 'Identity & Access',
    domain: 'AUTH & SESSIONS',
    tags: ['JWT Expiration', 'Clock Skew', 'Session Revocation'],
    contract: 'isTokenExpired(token, epoch)',
    icon: Lock,
  },
  {
    id: '02',
    num: 2,
    title: 'Interactive UI & State',
    domain: 'ASYNC & CONCURRENCY',
    tags: ['Debounce Hooks', 'Race Conditions', 'State Tearing'],
    contract: 'useDebouncedCallback(fn, 200ms)',
    icon: Layers,
  },
  {
    id: '03',
    num: 3,
    title: 'APIs & Persistence',
    domain: 'RATE LIMITS & QUEUES',
    tags: ['Token Bucket', 'Cursor Pagination', 'Idempotency'],
    contract: 'TokenBucket.consume(tokens)',
    icon: Cpu,
  },
  {
    id: '04',
    num: 4,
    title: 'Data Security & Timing',
    domain: 'CRYPTO DEFENSE',
    tags: ['Timing Attack Defense', 'Constant-Time Compare', 'Sanitization'],
    contract: 'timingSafeEqual(hashA, hashB)',
    icon: ShieldCheck,
  },
];

export default function TrackGrid() {
  return (
    <section id="tracks" className="py-20 sm:py-28 bg-[#090A0F] relative border-t border-white/[0.08] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Heading: Clean, bold, no decorative mini-tags */}
        <div className="max-w-xl space-y-2.5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F4F5]">
            Four Engineering Tracks
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            12 progressive tiers. Zero boilerplate. Real failure modes.
          </p>
        </div>

        {/* 2x2 Clean Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className="p-6 sm:p-7 rounded-2xl bg-[#11131A] border border-white/[0.08] hover:border-[#88BDA4]/40 transition-all duration-200 flex flex-col justify-between space-y-6 group shadow-lg hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-[#88BDA4]">TRACK {track.id}</span>
                      <span className="text-zinc-500">//</span>
                      <span className="text-zinc-400 font-medium">{track.domain}</span>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-[#171a24] border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-[#88BDA4] transition-colors">
                      <Icon size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#88BDA4] transition-colors">
                    {track.title}
                  </h3>

                  {/* Scannable Key Topic Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {track.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-[#090A0F] border border-white/[0.06] text-zinc-300 text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Target Contract Signature */}
                  <div className="p-2.5 rounded-lg bg-[#090A0F] border border-white/[0.06] text-xs font-mono text-zinc-400 flex items-center justify-between">
                    <span className="text-zinc-500">Contract</span>
                    <span className="text-[#88BDA4] font-medium">{track.contract}</span>
                  </div>

                </div>

                {/* Footer Link */}
                <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500">
                    Tiers 01 to 12
                  </span>
                  <Link
                    href={`/studio?track=${track.num}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#88BDA4] hover:text-[#9cd1b8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] py-1 px-1 rounded"
                  >
                    <span>Enter Track 0{track.num}</span>
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
