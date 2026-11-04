'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Terminal,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronDown,
  Check,
  Copy,
} from 'lucide-react';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { ValidationFeedback } from './ValidationFeedback';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';
import { Challenge } from '@/lib/types/challenge';
import { generateMasterPrompt } from '@/lib/prompts/master-prompt';
import { getHistory } from '@/lib/storage/history';

interface PasteChallengeBoxProps {
  onStartChallenge: (challenge: Challenge) => void;
  onGoToPrompt?: () => void;
  promptOptions?: {
    track: number;
    level: number;
    type: string;
    language: string;
  };
}

export function PasteChallengeBox({
  onStartChallenge,
  onGoToPrompt,
  promptOptions,
}: PasteChallengeBoxProps) {
  const [rawText, setRawText] = useState<string>('');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [isSampleDropdownOpen, setIsSampleDropdownOpen] = useState<boolean>(false);
  const [inputWarning, setInputWarning] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const quickPresets = [
    { id: 'track1-jwt-fix', label: '1. JWT Expiry Bug' },
    { id: 'track2-debounce-hook', label: '2. Debounce Hook' },
    { id: 'track4-timing-safe', label: '3. Timing Safe Compare' },
  ];

  const handleCopyPromptFromSelection = async () => {
    const history = getHistory();
    const currentTrack = promptOptions?.track ?? 1;
    const currentLevel = promptOptions?.level ?? 2;
    const currentType = promptOptions?.type ?? 'Fix Bug';
    const currentLanguage = promptOptions?.language ?? 'TypeScript';

    const promptText = generateMasterPrompt({
      track: currentTrack,
      level: currentLevel,
      type: currentType,
      language: currentLanguage,
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
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt in paste box:', err);
    }
  };

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSampleDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSampleDropdownOpen(false);
      }
    }
    if (isSampleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSampleDropdownOpen]);

  // Live validation
  const validation = useMemo(() => {
    if (!rawText.trim()) return null;
    return validateRawChallenge(rawText);
  }, [rawText]);

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setIsSampleDropdownOpen(false);
    setInputWarning(null);
    const sample = SAMPLE_CHALLENGES.find((s) => s.id === sampleId);
    if (sample) {
      setRawText(sample.raw);
    }
  };

  const handleQuickSample = () => {
    setInputWarning(null);
    if (SAMPLE_CHALLENGES.length > 0) {
      setSelectedSampleId(SAMPLE_CHALLENGES[0].id);
      setRawText(SAMPLE_CHALLENGES[0].raw);
    }
  };

  const handleLaunch = () => {
    if (!rawText.trim()) {
      setInputWarning('Editor is empty. Paste your AI challenge block below, or click "Load Sample" to load a challenge first.');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }
    setInputWarning(null);
    const val = validateRawChallenge(rawText);
    if (val.valid && val.challenge) {
      onStartChallenge(val.challenge);
    }
  };

  const handleStart = () => {
    handleLaunch();
  };

  const handleClear = () => {
    setRawText('');
    setInputWarning(null);
  };

  const handleScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const isEmpty = !rawText.trim();
  const isValid = validation?.valid === true;

  const linesCount = useMemo(() => {
    if (!rawText) return 12;
    const count = rawText.split('\n').length;
    return Math.max(count, 12);
  }, [rawText]);

  return (
    <div className="bg-[#11131A] border border-white/10 rounded-2xl shadow-2xl relative">
      {/* 1. Header Row: Title & Direct Prompt Copy */}
      <div className="p-6 sm:p-7 border-b border-white/8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#090A0F] border border-white/10 flex items-center justify-center text-[#88BDA4] shadow-sm shrink-0">
              <Terminal className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                Input Challenge Block
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Paste your AI output, or test directly with the preset toggles below.
              </p>
            </div>
          </div>

          {/* Copy Selected Prompt Button right inside Paste Tab */}
          <button
            type="button"
            onClick={handleCopyPromptFromSelection}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/12 bg-[#181d2a] hover:bg-[#202738] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] shrink-0"
            title="Copy prompt for your selected options"
          >
            {copiedPrompt ? (
              <Check className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
            )}
            <span>
              {copiedPrompt
                ? 'Prompt Copied'
                : `Copy Selected Prompt (Track ${promptOptions?.track ?? 1} • Lvl ${promptOptions?.level ?? 2})`}
            </span>
          </button>
        </div>

        {/* 2. Utilitarian Action Toolbar: 3 Sample Toggles + Dropdown + Clear */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 3 Quick Sample Toggles */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#090A0F] border border-white/8" role="tablist" aria-label="Quick sample presets">
              <span className="text-[10px] font-mono uppercase text-zinc-500 px-2 py-0.5 select-none hidden md:inline">
                Preset Toggles:
              </span>
              {quickPresets.map((preset) => {
                const isSelected = selectedSampleId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectSample(preset.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#88BDA4] text-[#090A0F] font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Popover Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsSampleDropdownOpen((prev) => !prev)}
                aria-expanded={isSampleDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select sample challenge"
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer border ${
                  isSampleDropdownOpen
                    ? 'bg-[#1b202c] border-[#88BDA4]/60 text-zinc-100 ring-1 ring-[#88BDA4]/40'
                    : 'bg-[#090A0F] border-white/10 text-zinc-300 hover:border-white/20 hover:text-zinc-100'
                }`}
              >
                <span className="max-w-[130px] truncate">
                  {selectedSampleId
                    ? SAMPLE_CHALLENGES.find((s) => s.id === selectedSampleId)?.label.split(' - ')[0] || 'Selected'
                    : 'More Samples'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    isSampleDropdownOpen ? 'rotate-180 text-[#88BDA4]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Popover Dropdown Menu */}
              {isSampleDropdownOpen && (
                <div
                  role="listbox"
                  aria-label="Sample challenges"
                  className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-[#0e1118] border-2 border-zinc-700/80 p-1.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-white/8 mb-1">
                    Preset Challenges
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto pr-0.5">
                    {SAMPLE_CHALLENGES.map((sample) => {
                      const isSelected = selectedSampleId === sample.id;
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectSample(sample.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-start justify-between gap-2.5 ${
                            isSelected
                              ? 'bg-[#1b202c] text-white border border-[#88BDA4]/30'
                              : 'text-zinc-300 hover:bg-[#151821] hover:text-white'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-zinc-100 truncate text-xs">
                              {sample.label}
                            </div>
                            <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-zinc-400">
                              <span className="text-[#88BDA4]">Track {sample.track}</span>
                              <span>•</span>
                              <span>Level {sample.level}</span>
                              <span>•</span>
                              <span>{sample.language}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#88BDA4] shrink-0 mt-0.5" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            disabled={isEmpty}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#090A0F] text-zinc-400 hover:text-zinc-200 border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            title="Clear textarea"
            aria-label="Clear challenge input"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* 3. Editor Surface with Guidance and Line Numbers */}
      <div className="p-6 sm:p-7 space-y-4">
        {/* Visual Guided Stepper for Users */}
        <div className="p-3.5 rounded-xl bg-[#141824] border border-zinc-700/80 text-xs text-zinc-300 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#88BDA4] text-[#090A0F] font-bold text-xs flex items-center justify-center shrink-0">
              ?
            </span>
            <div className="leading-relaxed">
              <span className="font-semibold text-white">How to use: </span>
              <span>
                Paste your AI-generated challenge text into the editor below, or click <strong className="text-[#88BDA4]">&quot;Load Sample&quot;</strong> above to load a demo instantly.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickSample}
            className="self-start md:self-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#222838] hover:bg-[#2b3347] text-xs font-semibold text-white border border-zinc-600/80 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
            <span>Load Quick Demo</span>
          </button>
        </div>

        {/* Warning notification if user attempts to launch without any input */}
        {inputWarning && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span>{inputWarning}</span>
            </div>
            <button
              type="button"
              onClick={handleQuickSample}
              className="underline hover:text-white font-semibold cursor-pointer shrink-0"
            >
              Load Sample Now
            </button>
          </div>
        )}

        <div className="relative flex rounded-xl border-2 border-zinc-700/80 bg-[#07080C] focus-within:border-[#88BDA4] focus-within:ring-2 focus-within:ring-[#88BDA4]/30 transition-all overflow-hidden shadow-inner">
          {/* Gutter */}
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="w-12 py-4 pl-2 pr-3.5 font-mono text-[11px] font-semibold text-zinc-400 bg-[#121622] border-r-2 border-zinc-700/80 select-none text-right overflow-hidden shrink-0 leading-[1.625rem]"
          >
            {Array.from({ length: linesCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            onScroll={handleScroll}
            rows={12}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              if (inputWarning) setInputWarning(null);
            }}
            aria-label="Raw challenge specification block"
            placeholder={`---METADATA---
track: 1
level: 2
type: Fix
editableLanguage: typescript
editableFiles: src/token-validator.ts

---TASK---
Describe task specifications here...

---FILE: src/token-validator.ts---
// Code to inspect and modify...

---TESTS---
// Test cases...

---REFERENCE---
// Correct reference answer...`}
            className="w-full bg-[#07080C] p-4 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-y leading-[1.625rem] min-h-[280px]"
            spellCheck={false}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (isValid && validation?.challenge) {
                  handleStart();
                }
              }
            }}
          />
        </div>

        {/* Live Validation Bar */}
        {isEmpty ? (
          <div className="p-3.5 rounded-xl bg-[#141824] border border-zinc-700/80 text-xs text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-500 animate-pulse" />
              <span>Awaiting challenge input. Paste AI output above or click &quot;Load Sample&quot;.</span>
            </span>
            <span className="font-mono text-[11px] text-zinc-400 font-semibold">0 characters</span>
          </div>
        ) : isValid && validation.challenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0e1616] border-2 border-[#88BDA4] text-xs shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#88BDA4] text-[#090A0F] flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#090A0F]" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-zinc-200 font-mono text-xs flex-wrap">
                <span className="text-[#88BDA4] font-bold">Valid Challenge</span>
                <span className="text-zinc-500">|</span>
                <span className="rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-zinc-100 font-semibold">
                  Track {validation.challenge.metadata.track}
                </span>
                <span className="rounded-md bg-[#88BDA4]/15 border border-[#88BDA4]/40 px-2 py-0.5 text-[#88BDA4] font-bold">
                  Level {validation.challenge.metadata.level}
                </span>
                <span className="rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-zinc-200">
                  {validation.challenge.metadata.editableLanguage}
                </span>
                <span className="text-zinc-300">
                  {validation.challenge.files.length} {validation.challenge.files.length === 1 ? 'file' : 'files'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-mono text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          validation && !validation.valid && (
            <ValidationFeedback errors={validation.errors} fixPrompt={validation.fixPrompt} />
          )
        )}
      </div>

      {/* 4. Footer Actions */}
      <div className="p-6 sm:p-7 pt-4 bg-[#0d0f17] border-t border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {onGoToPrompt && (
            <button
              type="button"
              onClick={onGoToPrompt}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#88BDA4] transition-colors font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Need to configure a prompt first? Back to Step 1</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={!isValid}
          className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
            isValid
              ? 'bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] active:scale-[0.98] cursor-pointer shadow-[#88BDA4]/20'
              : 'bg-[#171a24] text-zinc-500 border border-white/6 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
