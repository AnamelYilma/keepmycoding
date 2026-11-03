import { FileCode, Terminal, ShieldCheck } from 'lucide-react';

const PILLARS = [
  {
    step: '01',
    title: 'Choose a track',
    description: 'Select focused engineering scenarios from 4 domains across 12 progressive tiers.',
    metric: 'Levels 1 to 12',
    icon: FileCode,
  },
  {
    step: '02',
    title: 'Type the fix by hand',
    description: 'Solve the bug in an isolated browser editor with zero AI auto-fill and locked reference guards.',
    metric: 'Zero auto-complete',
    icon: Terminal,
  },
  {
    step: '03',
    title: 'Verify with tests',
    description: 'Run automated assertions to inspect exact input/output diffs and immediate pass/fail verdict.',
    metric: 'Instant feedback',
    icon: ShieldCheck,
  },
];

export default function ValuePillars() {
  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-[#090A0F] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Section Header (Clean & Minimalist without AI pill badges) */}
        <div className="max-w-2xl mx-auto text-center space-y-2.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            How KeepCoding works
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-lg mx-auto">
            Three steps. Zero auto-complete. Built for muscle memory over passive reading.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.step}
                className="glass-card p-6 flex flex-col justify-between group hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Top card header */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#171a24] border border-white/[0.08] flex items-center justify-center text-[#88BDA4] group-hover:border-[#88BDA4]/40 transition-colors">
                      <Icon size={20} strokeWidth={2} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#090A0F] border border-white/[0.06]">
                      STEP {pillar.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                {/* Compact bottom footer */}
                <div className="pt-4 mt-5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Focus</span>
                  <span className="text-[#88BDA4] font-medium">{pillar.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
