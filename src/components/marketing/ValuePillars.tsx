'use client';

import { useState } from 'react';
import { Layers, Terminal, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    step: '01',
    title: 'Choose a Domain',
    detail: 'Pick from 4 core engineering domains across 12 progressive tiers.',
    tag: 'Tiers 01 to 12',
    icon: Layers,
  },
  {
    step: '02',
    title: 'Write Code by Hand',
    detail: 'Solve the bug in an isolated editor with zero AI auto-fill and locked reference files.',
    tag: 'Pure Muscle Memory',
    icon: Terminal,
  },
  {
    step: '03',
    title: 'Verify with Tests',
    detail: 'Automated test assertions grade your implementation against edge cases in milliseconds.',
    tag: 'Instant Feedback',
    icon: ShieldCheck,
  },
];

export default function ValuePillars() {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#090A0F] relative border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header: Minimal & Confident */}
        <div className="max-w-xl space-y-2">
          <div className="text-xs font-mono font-bold text-[#88BDA4] uppercase tracking-wider">
            Practice Loop
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F4F4F5]">
            How KeepCoding works.
          </h2>
          <p className="text-sm text-zinc-400 font-sans">
            Three simple steps designed to build durable muscle memory.
          </p>
        </div>

        {/* 3 Step Bento Cards with Interactive Hover State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isHovered = activeStep === idx;

            return (
              <div
                key={s.step}
                onMouseEnter={() => setActiveStep(idx)}
                className={`p-7 rounded-2xl transition-all duration-200 flex flex-col justify-between space-y-6 border cursor-pointer ${
                  isHovered
                    ? 'bg-[#141724] border-[#88BDA4]/40 shadow-xl shadow-[#88BDA4]/5 -translate-y-1'
                    : 'bg-[#12151e] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-mono font-bold transition-colors ${
                      isHovered ? 'text-[#88BDA4]' : 'text-zinc-500'
                    }`}>
                      {s.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isHovered
                        ? 'bg-[#88BDA4] text-[#090A0F]'
                        : 'bg-[#181d2a] border border-white/10 text-zinc-400'
                    }`}>
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                      {s.detail}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/8 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Method</span>
                  <span className={`font-medium transition-colors ${
                    isHovered ? 'text-[#88BDA4]' : 'text-zinc-300'
                  }`}>
                    {s.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
