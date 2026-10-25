'use client';

import { useState, useEffect } from 'react';
import { History, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { getHistory, clearHistory, HistoryRecord } from '@/lib/storage/history';

export function HistoryDrawer() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const refreshHistory = () => {
    setHistory(getHistory());
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const handleClear = () => {
    if (confirm('Clear challenge history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-xs space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-zinc-300 font-medium hover:text-zinc-100 transition-colors"
        >
          <History className="w-4 h-4 text-zinc-400" />
          <span>Practice History ({history.length} completed)</span>
        </button>

        {isOpen && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto pt-2 border-t border-zinc-850">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-850 text-[11px]"
            >
              <div className="flex items-center gap-2 truncate">
                {item.verdict === 'PASS' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span className="font-medium text-zinc-300 truncate">
                  {item.taskTitle}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 shrink-0">
                <span>Trk {item.track}</span>
                <span>Lvl {item.level}</span>
                <span className="text-zinc-400">{item.language}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
