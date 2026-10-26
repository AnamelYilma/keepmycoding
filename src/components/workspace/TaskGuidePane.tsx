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
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden text-xs">
      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800 bg-zinc-900 px-3">
        <button
          type="button"
          onClick={() => setActiveTab('task')}
          className={`px-3 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'task'
              ? 'border-zinc-200 text-zinc-100'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Task and Tests
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cheatsheet')}
          className={`px-3 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'cheatsheet'
              ? 'border-zinc-200 text-zinc-100'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Cheat Sheet
        </button>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 leading-relaxed">
        {activeTab === 'task' ? (
          <>
            {/* Task Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                <span>Objective</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 whitespace-pre-wrap font-sans">
                {task}
              </div>
            </div>

            {/* Test Specifications */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Test Specifications ({tests.length})</span>
              </div>
              <div className="space-y-2">
                {tests.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5 font-mono text-[11px]"
                  >
                    {t.description && (
                      <div className="font-sans text-xs font-medium text-zinc-300">
                        {t.description}
                      </div>
                    )}
                    {t.input && (
                      <div className="text-zinc-400">
                        <span className="text-zinc-500">Input: </span>
                        <span className="text-zinc-200">{t.input}</span>
                      </div>
                    )}
                    <div className="text-zinc-400">
                      <span className="text-zinc-500">Expected: </span>
                      <span className="text-emerald-400 font-semibold">{t.expected}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints Collapsible */}
            <div className="pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setHintsOpen(!hintsOpen)}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {hintsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="font-medium">Practice Tips</span>
              </button>
              {hintsOpen && (
                <div className="mt-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs space-y-1.5">
                  <p>1. Think about boundary conditions: null, empty string, negative numbers, or expired tokens.</p>
                  <p>2. Keep code simple and focused. You do not need to add unneeded abstractions or external packages.</p>
                  <p>3. Submit to the judge when ready for an instant mental dry-run evaluation.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Cheat Sheet Tab */
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Language Quick Reference ({language})</span>
            </div>

            <div className="space-y-3 font-mono text-[11px] text-zinc-300">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="font-sans font-medium text-zinc-200">Comparison & Equality</div>
                <div className="text-zinc-400">=== (strict equality)</div>
                <div className="text-zinc-400">Object.is(a, b)</div>
                <div className="text-zinc-500 font-sans italic text-[10px]">Constant-time compare:</div>
                <div className="text-zinc-400">mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="font-sans font-medium text-zinc-200">Timers & Debounce</div>
                <div className="text-zinc-400">const timer = setTimeout(fn, ms);</div>
                <div className="text-zinc-400">clearTimeout(timer);</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="font-sans font-medium text-zinc-200">Safe String Manipulation</div>
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
