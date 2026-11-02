'use client';

import { useState } from 'react';
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
}

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

export function MasterPromptCard({ onGoToWorkspace }: MasterPromptCardProps) {
  const [track, setTrack] = useState<number>(1);
  const [level, setLevel] = useState<number>(2);
  const [type, setType] = useState<string>('Fix');
  const [language, setLanguage] = useState<string>('TypeScript');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

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
    <div className="bg-[#11131A]/90 backdrop-blur-md border border-white/8 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xl relative overflow-hidden">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#090A0F] border border-white/10 flex items-center justify-center text-[#88BDA4] shadow-sm">
              <Layers className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-zinc-100">Step 1: Configure & Copy Master Prompt</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Pick your track, difficulty tier, and format. Paste the generated prompt to your preferred external AI to get a tagged practice challenge.
          </p>
        </div>

        <button
          onClick={handleCopyPrompt}
          type="button"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs tracking-wide shadow-md shadow-[#88BDA4]/15 active:scale-[0.98] transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
        >
          {copied ? <Check className="w-4 h-4 text-[#090A0F]" aria-hidden="true" /> : <Copy className="w-4 h-4 text-[#090A0F]" aria-hidden="true" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Master Prompt'}</span>
        </button>
      </div>

      {/* Focus Track Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-200">1. Focus Track</label>
          <span className="text-[11px] text-zinc-400 font-mono">Track {track} of 4 selected</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(TRACK_DEFINITIONS).map(([key, info]) => {
            const trkNum = parseInt(key, 10);
            const isSelected = track === trkNum;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTrack(trkNum)}
                className={`text-left p-4 rounded-xl border text-xs transition-all relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
                  isSelected
                    ? 'bg-[#171a24] border-[#88BDA4]/40 text-zinc-100 shadow-md ring-1 ring-[#88BDA4]/30'
                    : 'bg-[#090A0F] border-white/6 text-zinc-400 hover:border-white/15 hover:text-zinc-200 hover:bg-[#12151e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    Track {trkNum}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#88BDA4] bg-[#88BDA4]/15 px-2 py-0.5 rounded-full border border-[#88BDA4]/25">
                      Active
                    </span>
                  )}
                </div>
                <div className="font-medium text-sm text-zinc-200 mt-1.5">
                  {info.title}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
                  {info.summary}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Level & Tiers */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <label htmlFor="difficulty-level-slider" className="text-xs font-medium text-zinc-200">2. Difficulty Level</label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#88BDA4]">Level {level} / 12</span>
            <span className="text-zinc-500 text-xs">|</span>
            <span className="text-xs text-zinc-300 font-medium">{activeTier.label}: {activeTier.desc}</span>
          </div>
        </div>

        {/* Level Range Slider */}
        <input
          id="difficulty-level-slider"
          aria-label="Difficulty level from 1 to 12"
          type="range"
          min="1"
          max="12"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value, 10))}
          className="w-full accent-[#88BDA4] bg-[#090A0F] h-2 rounded-lg appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
        />

        {/* 4 Intuitive Level Tier Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {LEVEL_TIERS.map((tier) => {
            const isCurrentTier = activeTier.range === tier.range;
            return (
              <button
                key={tier.range}
                type="button"
                onClick={() => setLevel(tier.defaultLevel)}
                className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
                  isCurrentTier
                    ? 'bg-[#171a24] border-[#88BDA4]/40 text-zinc-100 ring-1 ring-[#88BDA4]/30'
                    : 'bg-[#090A0F] border-white/6 text-zinc-400 hover:border-white/15 hover:text-zinc-300 hover:bg-[#12151e]'
                }`}
              >
                <div className="font-mono text-[10px] text-zinc-400">Tier {tier.range}</div>
                <div className="font-medium text-xs text-zinc-200 truncate mt-1">{tier.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Type & Primary Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Challenge Type */}
        <div className="space-y-1.5">
          <label htmlFor="challenge-type-select" className="text-xs font-medium text-zinc-200 block">3. Challenge Type</label>
          <select
            id="challenge-type-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#090A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#88BDA4]/50 focus:ring-1 focus:ring-[#88BDA4]/30 focus-visible:ring-2 focus-visible:ring-[#88BDA4] cursor-pointer transition-colors"
          >
            {CHALLENGE_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#090A0F] text-zinc-200">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <label htmlFor="challenge-lang-select" className="text-xs font-medium text-zinc-200 block">4. Primary Language</label>
          <select
            id="challenge-lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-[#090A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#88BDA4]/50 focus:ring-1 focus:ring-[#88BDA4]/30 focus-visible:ring-2 focus-visible:ring-[#88BDA4] cursor-pointer transition-colors"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-[#090A0F] text-zinc-200">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Bar & Quick Link */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/8">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded"
        >
          {showPreview ? <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
          <span>{showPreview ? 'Hide master prompt preview' : 'Preview generated prompt text'}</span>
        </button>

        {onGoToWorkspace && (
          <button
            type="button"
            onClick={onGoToWorkspace}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#88BDA4] transition-colors font-medium self-start sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded"
          >
            <span>Already have a challenge block? Go to Paste Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Prompt Preview Collapse */}
      {showPreview && (
        <div className="p-4 rounded-xl bg-[#090A0F] border border-white/10 font-mono text-[11px] text-zinc-300 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
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
