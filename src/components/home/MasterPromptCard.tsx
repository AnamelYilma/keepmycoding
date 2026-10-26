'use client';

import { useState } from 'react';
import { Copy, Check, Layers, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
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
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy master prompt:', err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-7 space-y-6 shadow-sm">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-semibold text-zinc-100">Step 1: Configure & Copy Master Prompt</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Pick your track, difficulty tier, and format. Paste the prompt to your preferred external AI to get a tagged practice challenge.
          </p>
        </div>

        <button
          onClick={handleCopyPrompt}
          type="button"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#88BDA4] hover:bg-[#7aa892] text-zinc-950 font-medium text-xs transition-colors shadow-sm shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-zinc-950" /> : <Copy className="w-4 h-4 text-zinc-950" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Master Prompt'}</span>
        </button>
      </div>

      {/* Focus Track Selection */}
      <div className="space-y-2.5">
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
                className={`text-left p-3.5 rounded-xl border text-xs transition-all relative ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-650 text-zinc-100 shadow-sm ring-1 ring-zinc-700'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Track {trkNum}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700">
                      Active
                    </span>
                  )}
                </div>
                <div className="font-medium text-sm text-zinc-200 mt-1">
                  {info.title}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1 line-clamp-1 leading-relaxed">
                  {info.summary}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Level & Tiers */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-200">2. Difficulty Level</label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-zinc-200">Level {level} / 12</span>
            <span className="text-zinc-600 text-xs">|</span>
            <span className="text-xs text-zinc-400 font-medium">{activeTier.label}: {activeTier.desc}</span>
          </div>
        </div>

        {/* Level Range Slider */}
        <input
          type="range"
          min="1"
          max="12"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value, 10))}
          className="w-full accent-[#88BDA4] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
        />

        {/* 4 Intuitive Level Tier Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {LEVEL_TIERS.map((tier) => {
            const isCurrentTier = activeTier.range === tier.range;
            return (
              <button
                key={tier.range}
                type="button"
                onClick={() => setLevel(tier.defaultLevel)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                  isCurrentTier
                    ? 'bg-zinc-800 border-zinc-650 text-zinc-100'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div className="font-mono text-[10px] text-zinc-500">{tier.range}</div>
                <div className="font-medium text-[11px] text-zinc-200 truncate mt-0.5">{tier.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Type & Primary Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Challenge Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-200 block">3. Challenge Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
          >
            {CHALLENGE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-200 block">4. Primary Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Bar & Quick Link */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showPreview ? 'Hide master prompt preview' : 'Preview generated prompt text'}</span>
        </button>

        {onGoToWorkspace && (
          <button
            type="button"
            onClick={onGoToWorkspace}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-medium self-start sm:self-auto"
          >
            <span>Already have a challenge block? Go to Enter Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Prompt Preview Collapse */}
      {showPreview && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-400 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
