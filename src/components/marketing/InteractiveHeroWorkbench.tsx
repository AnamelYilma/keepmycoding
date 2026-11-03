'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  FileCode, 
  RotateCcw, 
  ArrowRight 
} from 'lucide-react';

interface TestCase {
  id: string;
  label: string;
  exp: number;
  now: number;
  expected: boolean;
}

const TEST_CASES: TestCase[] = [
  { id: 't1', label: 'Past timestamp', exp: 1000, now: 1500, expected: true },
  { id: 't2', label: 'Future timestamp', exp: 2000, now: 1500, expected: false },
];

export default function InteractiveHeroWorkbench() {
  const [operator, setOperator] = useState<string>('>=');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'spec'>('editor');

  const evaluateCondition = (exp: number, now: number, op: string): boolean => {
    switch (op) {
      case '<=': return exp <= now;
      case '<': return exp < now;
      case '>=': return exp >= now;
      case '>': return exp > now;
      default: return false;
    }
  };

  const results = TEST_CASES.map(tc => {
    const actual = evaluateCondition(tc.exp, tc.now, operator);
    const passed = actual === tc.expected;
    return { ...tc, actual, passed };
  });

  const passedCount = results.filter(r => r.passed).length;
  const isAllPassed = passedCount === TEST_CASES.length;

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 220);
  };

  const handleSelectOperator = (op: string) => {
    setOperator(op);
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 180);
  };

  const handleReset = () => {
    setOperator('>=');
    handleRunTests();
  };

  return (
    <div className="w-full glass-card overflow-hidden shadow-2xl transition-all duration-300">
      {/* Top window frame bar */}
      <div className="bg-[#171a24] border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-zinc-400 text-xs font-mono shrink-0">|</span>
          <div className="flex items-center gap-2 min-w-0">
            <Code2 size={14} className="text-[#88BDA4] shrink-0" aria-hidden="true" />
            <span className="text-xs font-mono font-medium text-zinc-300 truncate">
              Track 01 / Level 02: JWT Expiration Fix
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11131A] border border-white/[0.08] text-[11px] font-mono text-[#88BDA4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#88BDA4]" />
            Interactive Simulation
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            title="Reset simulation to initial broken state"
            aria-label="Reset simulation"
          >
            <RotateCcw size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main 3-column / 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] bg-[#090A0F]">
        
        {/* Column 1: Specification (4 cols on lg) */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-[#11131A]/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                01. Specification
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                TypeScript
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Fix Token Expiration Logic</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                A security token must be flagged as expired if its expiration timestamp is earlier than or equal to the current unix time.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Acceptance Criteria
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-[#090A0F] border border-white/[0.06] text-zinc-300">
                  <span className="text-[#88BDA4]">exp: 1000</span>, now: 1500 <br />
                  <span className="text-zinc-400">→ Expected: </span>
                  <span className="text-emerald-400 font-bold">true</span> (expired)
                </div>
                <div className="p-2 rounded-lg bg-[#090A0F] border border-white/[0.06] text-zinc-300">
                  <span className="text-[#88BDA4]">exp: 2000</span>, now: 1500 <br />
                  <span className="text-zinc-400">→ Expected: </span>
                  <span className="text-zinc-400 font-bold">false</span> (active)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <Lock size={12} className="text-zinc-400" aria-hidden="true" />
              <span>src/types.ts</span>
              <span className="text-zinc-400 text-[10px] ml-auto">READ-ONLY</span>
            </div>
          </div>
        </div>

        {/* Column 2: Code Editor (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col bg-[#090A0F]">
          {/* Editor Tab Bar */}
          <div className="bg-[#11131A] border-b border-white/[0.08] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-200">
              <FileCode size={13} className="text-[#88BDA4]" aria-hidden="true" />
              <span>src/token-validator.ts</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#88BDA4]" />
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Editable</span>
          </div>

          {/* Interactive Code Content */}
          <div className="p-4 font-mono text-xs text-zinc-300 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5 leading-relaxed overflow-x-auto">
              <div className="text-zinc-400">
                <span className="select-none text-zinc-400 w-5 inline-block text-right mr-3">1</span>
                <span className="text-purple-400">import</span> type &#123; TokenPayload &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;./types&apos;</span>;
              </div>
              <div className="text-zinc-400">
                <span className="select-none text-zinc-400 w-5 inline-block text-right mr-3">2</span>
              </div>
              <div>
                <span className="select-none text-zinc-400 w-5 inline-block text-right mr-3">3</span>
                <span className="text-purple-400">export function</span> <span className="text-blue-400">isTokenExpired</span>(
              </div>
              <div>
                <span className="select-none text-zinc-400 w-5 inline-block text-right mr-3">4</span>
                &nbsp;&nbsp;token: TokenPayload,
              </div>
              <div>
                <span className="select-none text-zinc-400 w-5 inline-block text-right mr-3">5</span>
                &nbsp;&nbsp;now: <span className="text-amber-400">number</span>
              </div>
              <div>
                <span className="select-none text-zinc-400 w-5 inline-block text-right mr-3">6</span>
                ): <span className="text-amber-400">boolean</span> &#123;
              </div>

              {/* The active target line */}
              <div className="bg-[#171a24] -mx-4 px-4 py-2 border-y border-[#88BDA4]/30 my-2 flex items-center flex-wrap gap-2">
                <span className="select-none text-[#88BDA4] font-bold w-5 inline-block text-right mr-3">7</span>
                <span className="text-purple-400">return</span>
                <span className="text-zinc-200">token.exp</span>
                
                {/* Operator selector button */}
                <div className="inline-flex items-center gap-1 bg-[#11131A] p-0.5 rounded border border-white/[0.15]">
                  {['<=', '<', '>=', '>'].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => handleSelectOperator(op)}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                        operator === op 
                          ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]'
                      }`}
                      aria-label={`Select operator ${op}`}
                    >
                      {op}
                    </button>
                  ))}
                </div>

                <span className="text-zinc-200">now;</span>
              </div>

              <div>
                <span className="select-none text-zinc-400 w-5 inline-block text-right mr-3">8</span>
                &#125;
              </div>
            </div>

            {/* Quick helper controls */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Select operator above to test logic</span>
              <button
                type="button"
                onClick={() => handleSelectOperator(operator === '<=' ? '>=' : '<=')}
                className="text-[#88BDA4] hover:text-[#9cd1b8] underline underline-offset-2 transition-colors font-sans"
              >
                {operator === '<=' ? 'Test bug (>=)' : 'Apply fix (<=)'}
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Live Judge & Verification (3 cols on lg) */}
        <div className="lg:col-span-3 p-5 flex flex-col justify-between bg-[#11131A]/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                03. Test Verdict
              </span>
              <button
                type="button"
                onClick={handleRunTests}
                disabled={isRunning}
                className="btn-primary text-xs py-1 px-3.5 flex items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
                aria-label="Run test evaluation"
              >
                <Play size={11} fill="currentColor" aria-hidden="true" />
                <span>Run</span>
              </button>
            </div>

            {/* Verdict Card */}
            <div 
              aria-live="polite"
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                isRunning 
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-400' 
                  : isAllPassed 
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <span className="w-4 h-4 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
                ) : isAllPassed ? (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertCircle size={16} className="text-rose-400 shrink-0" aria-hidden="true" />
                )}
                <span className="font-mono font-bold text-xs">
                  {isRunning 
                    ? 'EVALUATING...' 
                    : isAllPassed 
                      ? 'PASS (2/2 Passed)' 
                      : `FAIL (${passedCount}/2 Passed)`}
                </span>
              </div>
              <p className="text-[11px] mt-1 text-zinc-400">
                {isRunning
                  ? 'Running test assertions...'
                  : isAllPassed 
                    ? 'Valid: expired tokens reject and active tokens pass.' 
                    : 'Buggy: comparison flags future tokens as expired.'}
              </p>
            </div>

            {/* Test Assertions Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Assertions
              </span>
              <div className="space-y-1.5">
                {results.map((r) => (
                  <div
                    key={r.id}
                    className="p-2 rounded-lg bg-[#090A0F] border border-white/[0.06] flex items-center justify-between text-[11px] font-mono"
                  >
                    <div>
                      <span className="text-zinc-300 block">{r.label}</span>
                      <span className="text-zinc-400 text-[10px]">
                        exp: {r.exp} / now: {r.now}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${r.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {r.passed ? 'MATCH' : 'MISMATCH'}
                      </span>
                      <span className="text-zinc-400 block text-[10px]">
                        {String(r.actual)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">Automated Judge</span>
            <span className="text-[#88BDA4]">Deterministic</span>
          </div>
        </div>

      </div>

      {/* Workbench bottom bar */}
      <div className="bg-[#11131A] border-t border-white/[0.08] px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>KeepCoding never fills in or replaces your code for you.</span>
        </div>
        <Link 
          href="/studio" 
          className="text-zinc-300 hover:text-white flex items-center gap-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-md"
        >
          <span>Open Full Workspace Studio</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
