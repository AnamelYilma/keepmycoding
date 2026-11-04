'use client';

import { useEffect } from 'react';
import { X, ExternalLink, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';

interface ExternalAIGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToPaste: () => void;
}

const AI_PROVIDERS = [
  {
    name: 'Claude',
    company: 'Anthropic',
    url: 'https://claude.ai',
    desc: 'Highest adherence to multi-file tags, contracts, and realistic bug scenarios.',
  },
  {
    name: 'ChatGPT',
    company: 'OpenAI',
    url: 'https://chatgpt.com',
    desc: 'Strong algorithmic edge cases and structured unit test suites.',
  },
  {
    name: 'Gemini',
    company: 'Google',
    url: 'https://gemini.google.com',
    desc: 'Fast generation times and high compliance with typed code templates.',
  },
];

export function ExternalAIGuideModal({
  isOpen,
  onClose,
  onGoToPaste,
}: ExternalAIGuideModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-guide-title"
        className="relative w-full max-w-xl bg-[#11131A] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#090A0F] border border-white/10 flex items-center justify-center text-[#88BDA4] shadow-sm">
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="ai-guide-title" className="text-sm font-semibold text-zinc-100">
                Run Prompt in External AI
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Step 3 of your deliberate practice loop
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            aria-label="Close guide"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* 3 Step Instructions */}
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/8 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-zinc-200">
              <span className="w-5 h-5 rounded-full bg-[#88BDA4] text-[#090A0F] text-[10px] font-bold flex items-center justify-center">
                1
              </span>
              <span>Open your favorite conversational model:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {AI_PROVIDERS.map((ai) => (
                <a
                  key={ai.name}
                  href={ai.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#141824] hover:bg-[#1b2233] border border-white/10 hover:border-[#88BDA4]/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="font-semibold text-zinc-200 text-xs flex items-center justify-between">
                      <span>{ai.name}</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-[#88BDA4] transition-colors" />
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">{ai.company}</div>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-normal">
                    {ai.desc}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-zinc-200">
              <span className="w-5 h-5 rounded-full bg-[#88BDA4] text-[#090A0F] text-[10px] font-bold flex items-center justify-center">
                2
              </span>
              <span>Paste the master prompt &amp; hit send:</span>
            </div>
            <p className="text-zinc-400 text-[11px] pl-7">
              The AI will generate a strict specification block containing <code className="text-[#88BDA4] font-mono">---METADATA---</code>, <code className="text-[#88BDA4] font-mono">---TASK---</code>, and editable files.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/8 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-zinc-200">
              <span className="w-5 h-5 rounded-full bg-[#88BDA4] text-[#090A0F] text-[10px] font-bold flex items-center justify-center">
                3
              </span>
              <span>Copy the entire response and paste it into KeepCoding:</span>
            </div>
            <p className="text-zinc-400 text-[11px] pl-7">
              Switch to Step 4 (&quot;Paste Block&quot;) to validate the challenge and launch your isolated 3-column workspace.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-white/8">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToPaste();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs tracking-wide transition-all shadow-md shadow-[#88BDA4]/15 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <span>Proceed to Step 4: Paste Block</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#090A0F]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
