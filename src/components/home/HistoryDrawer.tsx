'use client';

import { useState, useEffect } from 'react';
import { History, Trash2, X } from 'lucide-react';
import { getHistory, clearHistory, HistoryRecord } from '@/lib/storage/history';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onHistoryChange?: () => void;
}

export function HistoryDrawer({ isOpen, onClose, onHistoryChange }: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    return typeof window !== 'undefined' ? getHistory() : [];
  });

  // Handle escape key
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

  const handleClear = () => {
    if (confirm('Clear all practice history? This action cannot be undone.')) {
      clearHistory();
      setHistory([]);
      onHistoryChange?.();
    }
  };

  const passedCount = history.filter((h) => h.verdict === 'PASS').length;
  const passRate = history.length > 0 ? Math.round((passedCount / history.length) * 100) : 0;
  const uniqueTracks = Array.from(new Set(history.map((h) => h.track))).sort();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-label="Practice history panel"
        className="relative w-full max-w-md bg-[#090A0F] border-l border-white/8 p-6 flex flex-col shadow-2xl z-10 overflow-hidden"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#11131A] border border-white/10 flex items-center justify-center text-[#88BDA4] shadow-sm">
              <History className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Practice History</h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                {history.length} completed {history.length === 1 ? 'session' : 'sessions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-zinc-400 hover:text-rose-400 hover:bg-[#11131A] border border-transparent hover:border-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
                title="Clear all records"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              title="Close panel"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Summary Stats Card */}
        {history.length > 0 && (
          <div className="my-4 p-4 rounded-xl bg-[#11131A] border border-white/8 grid grid-cols-3 gap-2 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Total</span>
              <span className="text-sm font-semibold font-mono text-zinc-100">{history.length}</span>
            </div>
            <div className="space-y-0.5 border-x border-white/8">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Pass Rate</span>
              <span className="text-sm font-semibold font-mono text-[#88BDA4]">{passRate}%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Tracks</span>
              <span className="text-sm font-semibold font-mono text-zinc-100">{uniqueTracks.length} / 4</span>
            </div>
          </div>
        )}

        {/* History Records List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-400 space-y-1">
              <p>No practice history recorded yet.</p>
              <p className="text-[11px] text-zinc-400">Submit a challenge solution to begin logging progress.</p>
            </div>
          ) : (
            history.map((record) => {
              const isPass = record.verdict === 'PASS';
              const isPartial = record.verdict === 'PARTIAL';
              const dateStr = new Date(record.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={record.id}
                  className="p-3.5 rounded-xl bg-[#11131A] border border-white/8 hover:border-white/15 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                          isPass
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : isPartial
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {record.verdict}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Track {record.track} (Lvl {record.level})
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">{dateStr}</span>
                  </div>

                  <p className="text-zinc-200 font-medium truncate">{record.taskTitle}</p>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                    <span>{record.type}</span>
                    <span>|</span>
                    <span>{record.language}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
