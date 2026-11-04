import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const COMPARISONS = [
  {
    aiAspect: 'Passive Tab-Completion',
    aiDetail: 'Accepting AI suggestions skips the mental simulation needed to spot edge cases.',
    handAspect: 'Active Mental Simulation',
    handDetail: 'Typing logic by hand forces you to verify parameter bounds, null checks, and error contracts.',
  },
  {
    aiAspect: 'Shallow Syntax Exposure',
    aiDetail: 'Reading code looks familiar, but recall collapses when debugging under incident pressure.',
    handAspect: 'Durable Muscle Memory',
    handDetail: 'Writing code in an isolated editor cements standard library APIs into instinctive recall.',
  },
  {
    aiAspect: 'Unverified Copy-Pasting',
    aiDetail: 'Snippets that look plausible often fail subtle concurrency or timing constraints.',
    handAspect: 'Automated Assertion Verification',
    handDetail: 'Every challenge includes rigorous test suites that verify behavior against exact expected outputs.',
  },
];

export default function WhyHandCoding() {
  return (
    <section id="why-hand-coding" className="py-16 sm:py-24 bg-[#090A0F] relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono font-bold text-[#88BDA4] uppercase tracking-wider">
            Deliberate Practice Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F4F4F5]">
            Why engineers still need to code by hand.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl leading-relaxed">
            AI tools write code for you every day. KeepCoding is where you verify you still know how it works from first principles.
          </p>
        </div>

        {/* High-Contrast Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Column A: Passive AI Generation */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#12151e] border border-rose-500/20 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/8">
              <span className="w-2 h-2 rounded-full bg-rose-400" aria-hidden="true" />
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-rose-300">
                Passive Auto-Completion
              </h3>
            </div>

            <div className="space-y-6">
              {COMPARISONS.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <strong className="text-sm font-semibold text-zinc-200">
                      {item.aiAspect}
                    </strong>
                  </div>
                  <p className="text-xs text-zinc-400 pl-6 leading-relaxed">
                    {item.aiDetail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Active Muscle Memory */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#12151e] border border-[#88BDA4]/30 space-y-6 shadow-xl shadow-[#88BDA4]/5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/8">
              <span className="w-2 h-2 rounded-full bg-[#88BDA4]" aria-hidden="true" />
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-[#88BDA4]">
                Deliberate Hands-On Reps
              </h3>
            </div>

            <div className="space-y-6">
              {COMPARISONS.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#88BDA4] shrink-0 mt-0.5" aria-hidden="true" />
                    <strong className="text-sm font-semibold text-white">
                      {item.handAspect}
                    </strong>
                  </div>
                  <p className="text-xs text-zinc-300 pl-6 leading-relaxed">
                    {item.handDetail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inline Next Step CTA */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-white/8">
          <p className="text-xs font-mono text-zinc-400">
            No local environment or packages needed. Runs entirely in your browser.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#88BDA4] hover:text-[#9cd1b8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded px-2 py-1"
          >
            <span>Open Practice Studio</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
