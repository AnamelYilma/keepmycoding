'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Layers, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import {
  generateMasterPrompt,
  TRACK_DEFINITIONS,
  CHALLENGE_TYPES,
  SUPPORTED_LANGUAGES,
} from '@/lib/prompts/master-prompt';
import { getHistory } from '@/lib/storage/history';

interface MasterPromptCardProps {
  onGoToWorkspace?: () => void;
  nextStepLabel?: string;
  onQuickLoadSample?: () => void;
  selectedTrack?: number;
  selectedLevel?: number;
  selectedType?: string;
  selectedLanguage?: string;
  onOptionsChange?: (options: { track: number; level: number; type: string; language: string }) => void;
}

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Security', 'Systems & Architecture'] as const;

const CHALLENGE_TYPE_DESCRIPTIONS: Record<string, string> = {
  'Fix Bug': 'Find and repair broken conditions, inversions, or regressions',
  'Build Logic': 'Implement missing functions, algorithms, or components',
  'Refactor': 'Clean up and optimize code structure without altering behavior',
  'Find Bug': 'Spot hidden logic flaws, security vulnerabilities, or bad invariants',
  'Edge Cases': 'Harden logic against extreme bounds, nulls, and exploits',
  'Explain & Analyze': 'Diagnose execution flow and system mechanics in text',
};

const LEVEL_TIERS = [
  { range: '1 to 3', defaultLevel: 2, label: 'Pure functions', desc: 'Input-output algorithms and pure logic' },
  { range: '4 to 6', defaultLevel: 5, label: 'State & middleware', desc: 'Component state, caching, and middleware' },
  { range: '7 to 9', defaultLevel: 8, label: 'Full feature', desc: 'Multi-step features and contract flows' },
  { range: '10 to 12', defaultLevel: 11, label: 'Edge cases & security', desc: 'Concurrency, hardening, and boundary exploits' },
] as const;

function getTierForLevel(lvl: number) {
  if (lvl <= 3) return LEVEL_TIERS[0];
  if (lvl <= 6) return LEVEL_TIERS[1];
  if (lvl <= 9) return LEVEL_TIERS[2];
  return LEVEL_TIERS[3];
}

export function MasterPromptCard({
  onGoToWorkspace,
  nextStepLabel,
  selectedTrack,
  selectedLevel,
  selectedType,
  selectedLanguage,
  onOptionsChange,
}: MasterPromptCardProps) {
  const [track, setTrack] = useState<number>(selectedTrack ?? 1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [level, setLevel] = useState<number>(selectedLevel ?? 2);
  const [type, setType] = useState<string>(selectedType ?? 'Fix Bug');
  const [language, setLanguage] = useState<string>(selectedLanguage ?? 'TypeScript');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Sync with prop changes if provided
  useEffect(() => {
    if (selectedTrack !== undefined) setTrack(selectedTrack);
  }, [selectedTrack]);

  useEffect(() => {
    if (selectedLevel !== undefined) setLevel(selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedType !== undefined) setType(selectedType);
  }, [selectedType]);

  useEffect(() => {
    if (selectedLanguage !== undefined) setLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const notifyChange = (t: number, lvl: number, typ: string, lang: string) => {
    onOptionsChange?.({
      track: t,
      level: lvl,
      type: typ,
      language: lang,
    });
  };

  // Custom Dropdown states
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsTypeDropdownOpen(false);
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeTier = getTierForLevel(level);

  const handleCopyPrompt = async () => {
    const history = getHistory();
    const promptText = generateMasterPrompt({
      track,
      level,
      type,
      language,
      history,
    });

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(promptText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard writeText failed, trying fallback:', err);
      try {
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy master prompt:', fallbackErr);
      }
    }
  };

  return (
    <div className="bg-[#11131A] border border-white/10 rounded-2xl shadow-2xl relative">
      {/* 1. Header Bar: Title and Copy Action */}
      <div className="p-6 sm:p-7 border-b border-white/8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#090A0F] border border-white/10 flex items-center justify-center text-[#88BDA4] shadow-sm shrink-0">
              <Layers className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                Configure Practice Prompt
              </h2>
            </div>
          </div>

          <button
            onClick={handleCopyPrompt}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs tracking-wide shadow-md shadow-[#88BDA4]/20 active:scale-[0.98] transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#090A0F]" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4 text-[#090A0F]" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied Prompt' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      {/* 2. Structured Settings Sections */}
      <div className="p-6 sm:p-7 space-y-7">
        {/* Section A: Focus Track */}
        <div className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              01. Practice Track
            </span>
            <span className="text-xs font-mono text-[#88BDA4]">
              Track {track} of {Object.keys(TRACK_DEFINITIONS).length} selected
            </span>
          </div>

          {/* Domain Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-1 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] ${
                  selectedCategory === cat
                    ? 'bg-[#88BDA4]/15 text-[#88BDA4] border border-[#88BDA4]/40 font-semibold'
                    : 'bg-[#090A0F] text-zinc-400 border border-white/8 hover:text-zinc-200 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
            {Object.entries(TRACK_DEFINITIONS)
              .filter(([_, info]) => selectedCategory === 'All' || info.category === selectedCategory)
              .map(([key, info]) => {
                const trkNum = parseInt(key, 10);
                const isSelected = track === trkNum;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTrack(trkNum)}
                    className={`text-left p-4 rounded-xl border transition-all relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
                      isSelected
                        ? 'bg-[#181d28] border-2 border-[#88BDA4] text-white shadow-md'
                        : 'bg-[#090A0F] border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-200 hover:bg-[#11141c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                          Track {trkNum}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-white/5">
                          {info.category}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#88BDA4] bg-[#88BDA4]/15 px-2 py-0.5 rounded-md border border-[#88BDA4]/30">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-zinc-100 mt-2">
                      {info.title}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {info.summary}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Section B: Difficulty Level */}
        <div className="space-y-3.5 pt-2 border-t border-white/6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              02. Target Level
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#88BDA4] bg-[#88BDA4]/10 border border-[#88BDA4]/25 px-2.5 py-0.5 rounded-md">
                Level {level} of 12
              </span>
              <span className="text-zinc-600 text-xs">|</span>
              <span className="text-xs text-zinc-300 font-medium">{activeTier.label}</span>
            </div>
          </div>

          {/* Custom High-Contrast Level Slider */}
          <input
            id="difficulty-level-slider"
            aria-label="Difficulty level from 1 to 12"
            type="range"
            min="1"
            max="12"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value, 10))}
            className="w-full custom-slider cursor-pointer"
          />

          {/* Tier Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {LEVEL_TIERS.map((tier) => {
              const isCurrentTier = activeTier.range === tier.range;
              return (
                <button
                  key={tier.range}
                  type="button"
                  onClick={() => setLevel(tier.defaultLevel)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
                    isCurrentTier
                      ? 'bg-[#181d28] border border-[#88BDA4]/60 text-white ring-1 ring-[#88BDA4]/40'
                      : 'bg-[#090A0F] border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-mono text-[10px] font-semibold text-zinc-400">
                    Levels {tier.range}
                  </div>
                  <div className="font-medium text-xs text-zinc-200 truncate mt-1">
                    {tier.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section C: Format & Language with Custom Stylized Popover Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/6">
          {/* Custom Challenge Type Dropdown */}
          <div className="space-y-1.5" ref={typeDropdownRef}>
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 block">
              03. Challenge Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsTypeDropdownOpen((prev) => !prev);
                  setIsLangDropdownOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isTypeDropdownOpen}
                className={`w-full flex items-center justify-between bg-[#161922] border-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer ${
                  isTypeDropdownOpen
                    ? 'border-[#88BDA4] ring-2 ring-[#88BDA4]/20 bg-[#1b212e]'
                    : 'border-zinc-700/80 hover:border-zinc-500 hover:bg-[#1a1f2b]'
                }`}
              >
                <span>{type}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#88BDA4] transition-transform duration-200 ${
                    isTypeDropdownOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isTypeDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-[#0e1118] border-2 border-zinc-700/80 p-1.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 max-h-56 overflow-y-auto"
                >
                  {CHALLENGE_TYPES.map((t) => {
                    const isSelected = type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setType(t);
                          notifyChange(track, level, t, language);
                          setIsTypeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#1e2636] text-white border border-[#88BDA4]/40 font-semibold'
                            : 'text-zinc-300 hover:bg-[#151922] hover:text-white'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="text-zinc-100 font-medium">{t}</div>
                          {CHALLENGE_TYPE_DESCRIPTIONS[t] && (
                            <div className="text-[10px] text-zinc-400 truncate mt-0.5 font-normal">
                              {CHALLENGE_TYPE_DESCRIPTIONS[t]}
                            </div>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Custom Language Dropdown */}
          <div className="space-y-1.5" ref={langDropdownRef}>
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 block">
              04. Primary Language
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangDropdownOpen((prev) => !prev);
                  setIsTypeDropdownOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isLangDropdownOpen}
                className={`w-full flex items-center justify-between bg-[#161922] border-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer ${
                  isLangDropdownOpen
                    ? 'border-[#88BDA4] ring-2 ring-[#88BDA4]/20 bg-[#1b212e]'
                    : 'border-zinc-700/80 hover:border-zinc-500 hover:bg-[#1a1f2b]'
                }`}
              >
                <span>{language}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#88BDA4] transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isLangDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-[#0e1118] border-2 border-zinc-700/80 p-1.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 max-h-56 overflow-y-auto"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = language === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setLanguage(lang);
                          notifyChange(track, level, type, lang);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1e2636] text-white border border-[#88BDA4]/40 font-semibold'
                            : 'text-zinc-300 hover:bg-[#151922] hover:text-white'
                        }`}
                      >
                        <span>{lang}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Bar: Preview Toggle on Left, Two Buttons on Right (Copy & Next) */}
      <div className="p-6 sm:p-7 pt-4 bg-[#0d0f17] border-t border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded"
        >
          {showPreview ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{showPreview ? 'Hide prompt preview' : 'Preview prompt text'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyPrompt}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/12 bg-[#181d2a] hover:bg-[#202738] text-white font-semibold text-xs tracking-wide shadow-sm active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied Prompt' : 'Copy Prompt'}</span>
          </button>

          {onGoToWorkspace && (
            <button
              type="button"
              onClick={onGoToWorkspace}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs tracking-wide shadow-md shadow-[#88BDA4]/20 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <span>{nextStepLabel || 'Next: Paste Challenge to Start Practice'}</span>
              <ArrowRight className="w-4 h-4 text-[#090A0F]" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Prompt Preview */}
      {showPreview && (
        <div className="p-4 mx-6 mb-6 rounded-xl bg-[#07080C] border border-white/10 font-mono text-[11px] text-zinc-300 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
          {generateMasterPrompt({
            track,
            level,
            type,
            language,
            history: getHistory(),
          })}
        </div>
      )}
    </div>
  );
}
