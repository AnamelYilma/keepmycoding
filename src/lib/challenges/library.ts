import type { Challenge, ChallengeFile, JudgeResult } from '@/lib/types/challenge';

export interface ChallengeSource {
  label: string;
  url: string;
}

export interface ChallengeLearning {
  explanation: string;
  sources: ChallengeSource[];
  referenceSolution: string;
}

export interface PublicChallengeRecord {
  id: string;
  owner_id: string;
  owner_name: string;
  title: string;
  summary: string;
  topic: string;
  language: string;
  track: number;
  level: number;
  challenge_type: string;
  visibility: 'private' | 'public';
  challenge?: Omit<Challenge, 'reference'>;
  reason: string;
  learning_goal: string;
  created_at: string;
}

export interface ChallengeAttempt {
  solver_id: string;
  solver_name: string;
  started_at: string;
  completed_at: string | null;
}

export interface LibraryJudgeResult extends JudgeResult {
  authorLearning?: ChallengeLearning;
}

export function isChallengeFileList(value: unknown): value is ChallengeFile[] {
  return Array.isArray(value) && value.every((file) =>
    file &&
    typeof file.path === 'string' &&
    typeof file.content === 'string' &&
    typeof file.startContent === 'string' &&
    typeof file.isEditable === 'boolean'
  );
}

export function normalizeSources(value: unknown): ChallengeSource[] | null {
  if (!Array.isArray(value) || value.length > 8) return null;
  const sources: ChallengeSource[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') return null;
    const record = item as Record<string, unknown>;
    if (typeof record.url !== 'string' || typeof record.label !== 'string') return null;
    try {
      const url = new URL(record.url.trim());
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
      if (record.label.trim().length > 120) return null;
      sources.push({ label: record.label.trim() || url.hostname, url: url.toString() });
    } catch {
      return null;
    }
  }

  return sources;
}
