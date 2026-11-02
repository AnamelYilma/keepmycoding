'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { ChallengeTest } from '@/lib/types/challenge';

interface TaskGuidePaneProps {
  task: string;
  tests: ChallengeTest[];
  language: string;
}

export function TaskGuidePane({ task, tests, language }: TaskGuidePaneProps) {
  const [activeTab, setActiveTab] = useState<'task' | 'cheatsheet'>('task');
  const [hintsOpen, setHintsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full bg-[#11131A]/85 backdrop-blur-md border border-white/8 rounded-xl overflow-hidden text-xs shadow-lg">
      {/* Sleek Segmented Pill Tabs */}
      <div className="border-b border-white/8 bg-[#090A0F]/90 px-3 py-2 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#11131A] border border-white/10" role="tablist" aria-label="Task guide view">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'task'}
            onClick={() => setActiveTab('task')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              activeTab === 'task'
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Task & Tests</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cheatsheet'}
            onClick={() => setActiveTab('cheatsheet')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              activeTab === 'cheatsheet'
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cheat Sheet</span>
          </button>
        </div>

        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider hidden lg:inline">
          {language}
        </span>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 leading-relaxed">
        {activeTab === 'task' ? (
          <>
            {/* Task Description */}
            <div className="space-y-2">
              <h2 className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase tracking-wider text-[11px] font-mono">
                <BookOpen className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                <span>Task Specification</span>
              </h2>
              <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-300 whitespace-pre-wrap font-sans text-xs leading-relaxed shadow-inner">
                {task}
              </div>
            </div>

            {/* Test Specifications */}
            <div className="space-y-2">
              <h2 className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase tracking-wider text-[11px] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                <span>Acceptance Tests ({tests.length})</span>
              </h2>
              <div className="space-y-2.5">
                {tests.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5 font-mono text-[11px]"
                  >
                    {t.description && (
                      <div className="font-sans text-xs font-medium text-zinc-200">
                        {t.description}
                      </div>
                    )}
                    {t.input && (
                      <div className="text-zinc-400">
                        <span className="text-zinc-400 font-sans text-[11px]">Input: </span>
                        <span className="text-zinc-200">{t.input}</span>
                      </div>
                    )}
                    <div className="text-zinc-400">
                      <span className="text-zinc-400 font-sans text-[11px]">Expected: </span>
                      <span className="text-[#88BDA4] font-semibold">{t.expected}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Tips Collapsible */}
            <div className="pt-2 border-t border-white/8">
              <button
                type="button"
                onClick={() => setHintsOpen(!hintsOpen)}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded px-1 py-0.5"
              >
                {hintsOpen ? <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
                <span className="font-medium font-mono text-[11px]">Practice Tips</span>
              </button>
              {hintsOpen && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-[#090A0F] border border-white/8 text-zinc-300 text-xs space-y-2 leading-relaxed">
                  <p>1. Analyze boundary conditions: null, empty string, negative numbers, or expired tokens.</p>
                  <p>2. Keep implementations simple and focused. Avoid unnecessary external dependencies.</p>
                  <p>3. Submit to the judge when ready for an automated mental dry-run evaluation.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Cheat Sheet Tab */
          <div className="space-y-4">
            <h2 className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase tracking-wider text-[11px] font-mono">
              <HelpCircle className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
              <span>Language Reference ({language})</span>
            </h2>

            <div className="space-y-3 font-mono text-[11px] text-zinc-300">
              <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
                <div className="font-sans font-medium text-zinc-200 text-xs">Comparison & Equality</div>
                <div className="text-zinc-400">=== (strict equality)</div>
                <div className="text-zinc-400">Object.is(a, b)</div>
                <div className="text-zinc-400 font-sans italic text-[11px]">Constant-time compare:</div>
                <div className="text-zinc-400">mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
                <div className="font-sans font-medium text-zinc-200 text-xs">Timers & Debounce</div>
                <div className="text-zinc-400">const timer = setTimeout(fn, ms);</div>
                <div className="text-zinc-400">clearTimeout(timer);</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
                <div className="font-sans font-medium text-zinc-200 text-xs">Safe String Manipulation</div>
                <div className="text-zinc-400">str.trim()</div>
                <div className="text-zinc-400">str.replace(/[^\w]/g, &apos;&apos;)</div>
                <div className="text-zinc-400">encodeURIComponent(str)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
