'use client';

import { useState, useEffect } from 'react';
import { History, CheckCircle2, XCircle, Trash2, X } from 'lucide-react';
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
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col shadow-2xl z-10 overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Practice History</h3>
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
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
                title="Clear all records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              title="Close panel"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Stats Card */}
        {history.length > 0 && (
          <div className="my-4 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 grid grid-cols-3 gap-2 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Total</span>
              <span className="text-sm font-semibold font-mono text-zinc-100">{history.length}</span>
            </div>
            <div className="space-y-0.5 border-x border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Pass Rate</span>
              <span className="text-sm font-semibold font-mono text-emerald-400">{passRate}%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Tracks</span>
              <span className="text-xs font-medium text-zinc-300">
                {uniqueTracks.length > 0 ? uniqueTracks.map((t) => `T${t}`).join(', ') : 'None'}
              </span>
            </div>
          </div>
        )}

        {/* List of completed challenges */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          {history.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <History className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-300">No practice sessions yet</p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Submit code to the private judge to evaluate your solution and build your practice record.
                </p>
              </div>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    {item.verdict === 'PASS' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-medium text-xs text-zinc-200 truncate">
                      {item.taskTitle}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      item.verdict === 'PASS'
                        ? 'text-emerald-400 border-zinc-800 bg-zinc-950'
                        : 'text-rose-400 border-zinc-800 bg-zinc-950'
                    }`}
                  >
                    {item.verdict}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Track {item.track}</span>
                    <span>/</span>
                    <span>Level {item.level}</span>
                    <span>/</span>
                    <span className="text-zinc-400">{item.language}</span>
                  </div>

                  <span className="text-[10px]">
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer */}
        <div className="pt-4 border-t border-zinc-800 text-center text-[11px] text-zinc-600">
          History is saved locally in your browser
        </div>
      </div>
    </div>
  );
}
