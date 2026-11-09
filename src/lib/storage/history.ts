// KeepCoding - Local History Storage
// Manages completed challenge records in localStorage and formats them for prompt context

import { Verdict } from '../types/challenge';

export interface HistoryRecord {
  id: string;
  timestamp: number;
  track: number;
  trackName?: string;
  level: number;
  type: string;
  taskTitle: string;
  verdict: Verdict;
  language: string;
}

const STORAGE_KEY = 'keepcoding_history_v1';

export function getHistory(): HistoryRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load history from localStorage:', err);
    return [];
  }
}

export function saveHistoryRecord(record: Omit<HistoryRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: number }): HistoryRecord {
  const existing = getHistory();
  const fullRecord: HistoryRecord = {
    id: record.id || `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: record.timestamp || Date.now(),
    track: record.track,
    trackName: record.trackName,
    level: record.level,
    type: record.type,
    taskTitle: record.taskTitle,
    verdict: record.verdict,
    language: record.language,
  };

  const updated = [fullRecord, ...existing];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save history to localStorage:', err);
    }
  }

  return fullRecord;
}

export function clearHistory(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }
}

/**
 * Formats history for inclusion in the master prompt.
 * Keeps the most recent 20 challenges as detailed one-liners and summarizes older ones.
 */
export function formatHistoryForPrompt(records: HistoryRecord[]): string {
  if (!records || records.length === 0) {
    return 'No previous challenge history recorded.';
  }

  // Sort descending by timestamp (newest first)
  const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
  const recent = sorted.slice(0, 20);
  const older = sorted.slice(20);

  const lines: string[] = [];

  if (older.length > 0) {
    const trackCounts: Record<number, number> = {};
    for (const r of older) {
      trackCounts[r.track] = (trackCounts[r.track] || 0) + 1;
    }
    const trackBreakdown = Object.entries(trackCounts)
      .map(([trk, cnt]) => `Track ${trk}: ${cnt}`)
      .join(', ');
    lines.push(`(${older.length} earlier challenges completed: ${trackBreakdown})`);
  }

  for (const item of recent) {
    const safeTitle = item.taskTitle.replace(/[\r\n]+/g, ' ').slice(0, 60);
    lines.push(
      `- Track ${item.track}, Level ${item.level}, ${item.type} (${item.language}): "${safeTitle}" [${item.verdict}]`
    );
  }

  return lines.join('\n');
}
