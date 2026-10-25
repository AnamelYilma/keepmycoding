// Core challenge data structures matching the Tagged Challenge Specification

export type ChallengeType = 
  | 'Write' 
  | 'Build' 
  | 'Fix' 
  | 'Find bug' 
  | 'Explain' 
  | 'Predict output' 
  | 'Edge cases';

export type ChallengeTrack = 
  | '1 User identity and access'
  | '2 Interactive UI and state'
  | '3 API and persistence'
  | '4 Data security';

export interface ChallengeFile {
  path: string;
  content: string;
  editable: boolean;
}

export interface ChallengeMetadata {
  track: string;
  level: number; // 1 to 12
  type: ChallengeType | string;
  editableLanguage: string; // Exactly one editable language
  editableFiles: string[];
}

export interface ParsedChallenge {
  metadata: ChallengeMetadata;
  task: string;
  files: ChallengeFile[];
  tests: string;
  reference: string;
  answerFile?: string; // For text-answer types
}

export type Verdict = 'PASS' | 'FAIL';

export interface JudgeVerdict {
  verdict: Verdict;
  summary: string;
  breakdown: string;
  model: string;
  advice: string;
  fix?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  track: string;
  level: number;
  title: string;
  verdict: Verdict;
}
