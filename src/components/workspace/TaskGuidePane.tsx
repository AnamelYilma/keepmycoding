'use client';

import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  FileCode,
  ShieldCheck,
  Terminal,
  Compass,
} from 'lucide-react';
import { ChallengeTest } from '@/lib/types/challenge';

export interface TaskGuidePaneProps {
  task: string;
  tests: ChallengeTest[];
  language: string;
  challengeType?: string;
}

export interface TaskSection {
  title: string;
  content: string;
}

export function parseTaskSections(rawTask: string): TaskSection[] {
  const normalized = rawTask.replace(/\r\n/g, '\n').trim();
  
  // Exclude known sub-item labels from becoming top-level sections
  const SUB_LABELS = new Set([
    'search', 'functions', 'function', 'edit', 'reference', 'input', 'expected', 
    'description', 'current', 'expected', 'concept', 'syntax', 'framework', 
    'tip 1', 'tip 2', 'tip 3', 'tip 4', 'test 1', 'test 2', 'test 3', 'test 4', 'test 5', 'test 6', 'test 7',
    'note', 'warning', 'important'
  ]);

  // Top-level sections regex:
  // 1) Markdown header: ## Title
  // 2) Standalone uppercase header on its own line followed by a blank line: TITLE\n\n
  // 3) Colon header on own line: Title:\n or Title: \n
  const headerRegex = /(?:^|\n)(?:#{1,4}\s*([^\n]+)|([A-Z][A-Z0-9 &/_()',:-]{2,65})(?=\n\n)|(?!\d+\.\s)([A-Za-z][A-Za-z0-9 &/_()',-]{2,55}):(?:\s*\n|\s+))/g;
  
  const matches: Array<{ title: string; index: number; length: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = headerRegex.exec(normalized)) !== null) {
    const rawTitle = (match[1] || match[2] || match[3] || '').trim();
    if (SUB_LABELS.has(rawTitle.toLowerCase())) {
      continue;
    }
    matches.push({
      title: rawTitle,
      index: match.index,
      length: match[0].length,
    });
  }

  if (matches.length === 0) {
    return [];
  }

  const sections: TaskSection[] = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const start = current.index + current.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : normalized.length;
    sections.push({
      title: current.title,
      content: normalized.slice(start, end).trim(),
    });
  }

  return sections;
}

export function getBadgeClass(rawLabel: string) {
  const lower = rawLabel.toLowerCase();
  if (lower === 'current') return 'text-amber-400 bg-amber-400/10 border-amber-400/25';
  if (lower === 'expected') return 'text-[#88BDA4] bg-[#88BDA4]/10 border-[#88BDA4]/25';
  if (lower === 'edit') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25';
  if (lower === 'reference') return 'text-sky-300 bg-sky-400/10 border-sky-400/25';
  if (lower === 'concept') return 'text-purple-300 bg-purple-400/10 border-purple-400/25';
  if (lower === 'syntax') return 'text-sky-300 bg-sky-400/10 border-sky-400/25';
  if (lower === 'framework') return 'text-[#88BDA4] bg-[#88BDA4]/10 border-[#88BDA4]/25';
  if (lower.startsWith('tip')) return 'text-amber-300 bg-amber-400/10 border-amber-400/25';
  if (lower.startsWith('test')) return 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25';
  return 'text-zinc-200 bg-white/10 border-white/20';
}

export interface SubBlock {
  label: string;
  text: string;
  search: string | null;
}

export function parseSubBlocks(content: string): SubBlock[] {
  const lines = content.replace(/\r\n/g, '\n').trim().split('\n');
  const blocks: SubBlock[] = [];
  let currentBlock: { label: string; lines: string[]; search: string | null } = {
    label: '',
    lines: [],
    search: null,
  };

  const LABEL_REGEX = /^(Concept|Syntax|Framework|Current|Expected|Edit|Reference|Tip\s*\d*|Test\s*\d*|Invariant|Note|Tip):\s*(.*)$/i;
  const BARE_LABEL_REGEX = /^(Concept|Syntax|Framework|Current|Expected|Edit|Reference|Tip\s*\d*|Test\s*\d*|Invariant|Note|Tip)$/i;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check for Search: "..."
    const searchMatch = trimmed.match(/\(?Search:\s*["']([^"']+)["']\)?/i);
    if (searchMatch) {
      if (currentBlock.lines.length > 0 || currentBlock.label) {
        currentBlock.search = searchMatch[1];
        blocks.push({
          label: currentBlock.label,
          text: currentBlock.lines.join(' '),
          search: currentBlock.search,
        });
        currentBlock = { label: '', lines: [], search: null };
      }
      continue;
    }

    const stripped = trimmed.replace(/^[-*•]\s*/, '');

    // Check for Label: text
    const labelMatch = stripped.match(LABEL_REGEX);
    if (labelMatch) {
      if (currentBlock.lines.length > 0 || currentBlock.label) {
        blocks.push({
          label: currentBlock.label,
          text: currentBlock.lines.join(' '),
          search: currentBlock.search,
        });
      }
      currentBlock = {
        label: labelMatch[1],
        lines: labelMatch[2] ? [labelMatch[2]] : [],
        search: null,
      };
      continue;
    }

    // Check for bare label on its own line
    const bareMatch = stripped.match(BARE_LABEL_REGEX);
    if (bareMatch) {
      if (currentBlock.lines.length > 0 || currentBlock.label) {
        blocks.push({
          label: currentBlock.label,
          text: currentBlock.lines.join(' '),
          search: currentBlock.search,
        });
      }
      currentBlock = {
        label: bareMatch[1],
        lines: [],
        search: null,
      };
      continue;
    }

    currentBlock.lines.push(stripped);
  }

  if (currentBlock.lines.length > 0 || currentBlock.label) {
    blocks.push({
      label: currentBlock.label,
      text: currentBlock.lines.join(' '),
      search: currentBlock.search,
    });
  }

  return blocks;
}

export function getSectionIcon(title: string) {
  const upper = title.toUpperCase();
  if (upper.includes('GOAL') || upper.includes('OBJECTIVE')) {
    return <Terminal className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />;
  }
  if (upper.includes('STUCK') || upper.includes('LEARN') || upper.includes('KNOW') || upper.includes('PREREQUISITE')) {
    return <Compass className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />;
  }
  if (upper.includes('TIP') || upper.includes('WATCHOUT') || upper.includes('HINT')) {
    return <HelpCircle className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />;
  }
  if (upper.includes('CURRENT') || upper.includes('EXPECTED') || upper.includes('BEHAVIOR')) {
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />;
  }
  if (upper.includes('WHERE') || upper.includes('TARGET') || upper.includes('FILE')) {
    return <FileCode className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />;
  }
  if (
    upper.includes('EDGE') ||
    upper.includes('INVARIANT') ||
    upper.includes('SECURITY') ||
    upper.includes('FAILURE') ||
    upper.includes('CONSTRAINT')
  ) {
    return <ShieldCheck className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />;
  }
  if (upper.includes('APPROACH') || upper.includes('STEP') || upper.includes('ACCEPTANCE')) {
    return <CheckCircle2 className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />;
  }
  return <BookOpen className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />;
}

export function formatInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-[12px] border border-white/10 mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Highlights prefixes (Current, Expected, Edit, Reference, Concept, Syntax, Framework, Tip)
 * and turns (Search: "...") into an interactive, clickable 1-click Google search pill.
 */
export function formatBulletText(text: string) {
  // Extract (Search: "query") or Search: "query"
  const searchMatch = text.match(/\(?Search:\s*["']([^"']+)["']\)?/i);
  let contentText = text;
  let searchQuery: string | null = null;

  if (searchMatch) {
    searchQuery = searchMatch[1];
    contentText = (
      text.slice(0, searchMatch.index) +
      text.slice((searchMatch.index ?? 0) + searchMatch[0].length)
    ).trim();
  }

  const cleanText = contentText.replace(/^[-*•]\s*/, '');
  const prefixMatch = cleanText.match(/^(Current|Expected|Edit|Reference|Invariant|Note|Tip\s*\d*|Concept|Syntax|Framework):\s*(.*)$/i);

  if (prefixMatch) {
    const prefix = prefixMatch[1];
    const rest = prefixMatch[2];
    const badgeClass = getBadgeClass(prefix);

    return (
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2 min-w-0">
          <span className={`inline-block font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 self-start ${badgeClass}`}>
            {prefix}
          </span>
          <div className="text-zinc-200 leading-relaxed flex-1 min-w-0 break-words">
            {formatInlineCode(rest)}
          </div>
        </div>
        {searchQuery && (
          <div className="pt-0.5 w-full min-w-0">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`Search Google for "${searchQuery}"`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181d2a] hover:bg-[#22283a] text-[11px] font-mono text-[#88BDA4] border border-[#88BDA4]/30 hover:border-[#88BDA4]/60 transition-colors max-w-full overflow-hidden shadow-sm cursor-pointer"
            >
              <Compass className="w-3 h-3 text-[#88BDA4] shrink-0" aria-hidden="true" />
              <span className="truncate">Search: &ldquo;{searchQuery}&rdquo;</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      <div className="text-zinc-200 leading-relaxed break-words min-w-0">
        {formatInlineCode(cleanText)}
      </div>
      {searchQuery && (
        <div className="pt-0.5 w-full min-w-0">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Search Google for "${searchQuery}"`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181d2a] hover:bg-[#22283a] text-[11px] font-mono text-[#88BDA4] border border-[#88BDA4]/30 hover:border-[#88BDA4]/60 transition-colors max-w-full overflow-hidden shadow-sm cursor-pointer"
          >
            <Compass className="w-3 h-3 text-[#88BDA4] shrink-0" aria-hidden="true" />
            <span className="truncate">Search: &ldquo;{searchQuery}&rdquo;</span>
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Specification View that renders structured cards with Action Badge,
 * Goal, Current vs Expected, If Stuck guidance with search pills, and Tips.
 */
export function TaskSpecificationView({ task, challengeType }: { task: string; challengeType?: string }) {
  const rawSections = parseTaskSections(task);

  // Extract explicit ACTION section if present, or fall back to challengeType or "BUILD"
  const actionSection = rawSections.find((s) => s.title.toUpperCase() === 'ACTION');
  const actionWord = (
    actionSection?.content ||
    challengeType ||
    (task.toLowerCase().includes('fix') ? 'FIX BUG' : 'BUILD')
  ).trim().toUpperCase();

  // Filter out ACTION section from cards list since we feature it prominently at the top
  const structuredSections = rawSections.filter((s) => s.title.toUpperCase() !== 'ACTION');

  return (
    <div className="space-y-3.5 overflow-x-hidden min-w-0">
      {/* Top Action Header Badge */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#151926] border border-[#88BDA4]/35 shadow-sm min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-[11px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0">
            Action:
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#88BDA4]/15 border border-[#88BDA4]/40 text-[#88BDA4] font-mono text-xs font-bold tracking-wider uppercase shadow-sm truncate">
            {actionWord}
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 shrink-0">
          Specification Guide
        </span>
      </div>

      {/* Task Description Sections */}
      <div className="space-y-3 min-w-0">
        {structuredSections.length > 0 ? (
          <div className="space-y-3 min-w-0">
            {structuredSections.map((sec, idx) => {
              const isNumberedList = /^\d+\.\s+/m.test(sec.content);
              const isBulletList = /^[-*•]\s+/m.test(sec.content);
              const subBlocks = parseSubBlocks(sec.content);
              const hasStructuredSubBlocks = subBlocks.length > 1 || (subBlocks.length === 1 && (Boolean(subBlocks[0].label) || Boolean(subBlocks[0].search)));

              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#141824] border border-white/10 space-y-2.5 shadow-sm text-zinc-100 font-sans text-[13px] leading-relaxed overflow-hidden min-w-0 break-words"
                >
                  <h3 className="flex items-center gap-2 text-zinc-300 font-semibold uppercase tracking-wider text-[11px] font-mono">
                    {getSectionIcon(sec.title)}
                    <span>{sec.title}</span>
                  </h3>

                  {isNumberedList ? (
                    <div className="space-y-2 pl-0.5 min-w-0">
                      {sec.content.split('\n').filter((l) => l.trim()).map((line, lIdx) => {
                        const matchNum = line.match(/^(\d+)\.\s*(.*)$/);
                        if (matchNum) {
                          return (
                            <div key={lIdx} className="flex items-start gap-2 text-zinc-200 text-[13px] leading-relaxed min-w-0">
                              <span className="font-mono text-[#88BDA4] font-semibold text-xs select-none shrink-0 mt-0.5">
                                {matchNum[1]}.
                              </span>
                              <div className="flex-1 min-w-0 break-words">{formatBulletText(matchNum[2])}</div>
                            </div>
                          );
                        }
                        return (
                          <div key={lIdx} className="text-zinc-200 text-[13px] pl-4 leading-relaxed min-w-0 break-words">
                            {formatBulletText(line)}
                          </div>
                        );
                      })}
                    </div>
                  ) : isBulletList ? (
                    <div className="space-y-2 pl-0.5 min-w-0">
                      {sec.content.split('\n').filter((l) => l.trim()).map((line, lIdx) => {
                        const matchBullet = line.match(/^[-*•]\s*(.*)$/);
                        if (matchBullet) {
                          return (
                            <div key={lIdx} className="flex items-start gap-2 text-zinc-200 text-[13px] leading-relaxed min-w-0">
                              <span className="text-[#88BDA4] font-mono select-none shrink-0 mt-0.5">•</span>
                              <div className="flex-1 min-w-0 break-words">{formatBulletText(matchBullet[1])}</div>
                            </div>
                          );
                        }
                        return (
                          <div key={lIdx} className="text-zinc-200 text-[13px] pl-3 leading-relaxed min-w-0 break-words">
                            {formatBulletText(line)}
                          </div>
                        );
                      })}
                    </div>
                  ) : hasStructuredSubBlocks ? (
                    <div className="space-y-2.5 pt-0.5 min-w-0">
                      {subBlocks.map((block, bIdx) => {
                        const badgeClass = block.label ? getBadgeClass(block.label) : '';
                        return (
                          <div key={bIdx} className="p-2.5 rounded-lg bg-black/25 border border-white/5 space-y-1.5 min-w-0">
                            {block.label && (
                              <div className="flex items-center">
                                <span className={`inline-block font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${badgeClass}`}>
                                  {block.label}
                                </span>
                              </div>
                            )}
                            <div className="text-zinc-200 text-[13px] leading-relaxed min-w-0 break-words">
                              {formatInlineCode(block.text)}
                            </div>
                            {block.search && (
                              <div className="pt-0.5 w-full min-w-0">
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent(block.search)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Search Google for "${block.search}"`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181d2a] hover:bg-[#22283a] text-[11px] font-mono text-[#88BDA4] border border-[#88BDA4]/30 hover:border-[#88BDA4]/60 transition-colors max-w-full overflow-hidden shadow-sm cursor-pointer"
                                >
                                  <Compass className="w-3 h-3 text-[#88BDA4] shrink-0" aria-hidden="true" />
                                  <span className="truncate">Search: &ldquo;{block.search}&rdquo;</span>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-zinc-200 text-[13px] leading-relaxed min-w-0 break-words">
                      {formatBulletText(sec.content)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#141824] border border-white/10 text-zinc-200 whitespace-pre-wrap font-sans text-[13px] leading-relaxed shadow-sm min-w-0 break-words">
            {task}
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskGuidePane({ task, tests, language, challengeType }: TaskGuidePaneProps) {
  const [activeTab, setActiveTab] = useState<'task' | 'cheatsheet'>('task');
  const [hintsOpen, setHintsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full bg-[#10131d] border border-white/12 rounded-xl overflow-hidden text-xs shadow-lg min-w-0">
      {/* Top Segmented Pill Tabs */}
      <div className="border-b border-white/12 bg-[#090A0F] px-3.5 py-2.5 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#181d2a] border border-white/12" role="tablist" aria-label="Task guide view">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'task'}
            onClick={() => setActiveTab('task')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
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
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              activeTab === 'cheatsheet'
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cheat Sheet</span>
          </button>
        </div>

        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider hidden lg:inline bg-white/5 px-2 py-0.5 rounded border border-white/8">
          {language}
        </span>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 space-y-4 leading-relaxed min-w-0">
        {activeTab === 'task' ? (
          <>
            {/* Structured Task Specification View */}
            <TaskSpecificationView task={task} challengeType={challengeType} />

            {/* Test Specifications */}
            <div className="space-y-2.5 pt-1">
              <h2 className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase tracking-wider text-[11px] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                <span>Acceptance Tests ({tests.length})</span>
              </h2>
              <div className="space-y-2.5">
                {tests.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#141824] border border-white/10 space-y-1.5 font-mono text-xs"
                  >
                    {t.description && (
                      <div className="font-sans text-[13px] font-medium text-zinc-100">
                        {t.description}
                      </div>
                    )}
                    {t.input && (
                      <div className="text-zinc-400">
                        <span className="text-zinc-400 font-sans text-xs">Input: </span>
                        <span className="text-zinc-200 bg-black/30 px-1.5 py-0.5 rounded border border-white/8">{t.input}</span>
                      </div>
                    )}
                    {t.expected && (
                      <div className="text-zinc-400">
                        <span className="text-zinc-400 font-sans text-xs">Expected: </span>
                        <span className="text-[#88BDA4] bg-[#88BDA4]/10 px-1.5 py-0.5 rounded border border-[#88BDA4]/25">{t.expected}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#141824] border border-white/10 space-y-2">
              <h3 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
                Intuitive Engineering Principles
              </h3>
              <p className="text-zinc-400 text-xs">
                Solve this challenge without AI autopilot. Read companion contracts and implement the missing logic using deliberate mental simulation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-white/10 space-y-2 font-mono text-xs text-zinc-300">
              <div className="text-zinc-400 uppercase text-[10px] tracking-wider">Language Target</div>
              <div className="text-emerald-400 font-bold">{language}</div>
              <div className="pt-2 text-zinc-400 uppercase text-[10px] tracking-wider">Test Suite</div>
              <div>{tests.length} assertions configured</div>
            </div>

            {/* Expandable Hints */}
            <div className="rounded-xl border border-white/10 bg-[#141824] overflow-hidden">
              <button
                type="button"
                onClick={() => setHintsOpen(!hintsOpen)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                aria-expanded={hintsOpen}
              >
                <span className="font-mono text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Need a hint?
                </span>
                {hintsOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                )}
              </button>
              {hintsOpen && (
                <div className="p-3.5 pt-0 text-xs text-zinc-400 space-y-2 border-t border-white/5">
                  <p>1. Check the inputs of the failing tests.</p>
                  <p>2. Trace boundary values like zero, empty strings, or expired timestamps.</p>
                  <p>3. Look for inverted operators (e.g. &lt; instead of &gt;=).</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
