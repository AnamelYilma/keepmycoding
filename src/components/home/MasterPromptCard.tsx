'use client';

import { useState } from 'react';
import { Copy, Check, Layers, FileCode } from 'lucide-react';
import {
  generateMasterPrompt,
  TRACK_DEFINITIONS,
  CHALLENGE_TYPES,
  SUPPORTED_LANGUAGES,
} from '@/lib/prompts/master-prompt';
import { getHistory } from '@/lib/storage/history';

export function MasterPromptCard() {
  const [track, setTrack] = useState<number>(1);
  const [level, setLevel] = useState<number>(2);
  const [type, setType] = useState<string>('Fix');
  const [language, setLanguage] = useState<string>('TypeScript');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

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

  const currentTrack = TRACK_DEFINITIONS[track] || TRACK_DEFINITIONS[1];

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-medium text-zinc-200">1. Generate Master Prompt</h2>
        </div>
        <button
          onClick={handleCopyPrompt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5 text-zinc-950" />}
          <span>{copied ? 'Copied Prompt' : 'Copy Master Prompt'}</span>
        </button>
      </div>

      {/* Track Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-300 block">Focus Track</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(TRACK_DEFINITIONS).map(([key, info]) => {
            const trkNum = parseInt(key, 10);
            const isSelected = track === trkNum;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTrack(trkNum)}
                className={`text-left p-3 rounded-lg border text-xs transition-colors ${
                  isSelected
                    ? 'bg-zinc-800/80 border-zinc-600 text-zinc-100'
                    : 'bg-zinc-950/40 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="font-medium text-zinc-200">
                  Track {trkNum}: {info.title}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{info.summary}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row for Level, Type, Language */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Difficulty Level */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-300">Level</label>
            <span className="text-xs font-mono text-zinc-400">Lvl {level} / 12</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value, 10))}
            className="w-full accent-zinc-200 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>1 (Basics)</span>
            <span>6 (Intermediate)</span>
            <span>12 (Hardened)</span>
          </div>
        </div>

        {/* Challenge Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300 block">Challenge Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
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
          <label className="text-xs font-medium text-zinc-300 block">Primary Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompt preview collapse */}
      <div className="pt-1 text-xs">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          {showPreview ? 'Hide Prompt Preview' : 'Show Prompt Preview'}
        </button>

        {showPreview && (
          <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-850 font-mono text-[11px] text-zinc-400 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
    </div>
  );
}
