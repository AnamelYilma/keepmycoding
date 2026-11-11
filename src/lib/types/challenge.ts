// KeepCoding - Core Challenge and Judge Types

export type Verdict = 'PASS' | 'PARTIAL' | 'FAIL';

export type MistakeType = 'CONCEPT' | 'SYNTAX' | 'NONE';

export type ChallengeTypeName =
  | 'Write'
  | 'Build'
  | 'Fix'
  | 'Find bug'
  | 'Explain'
  | 'Predict output'
  | 'Edge cases';

export interface ChallengeMetadata {
  track: number;
  level: number;
  type: string;
  editableLanguage: string;
  editableFiles: string[];
  title?: string;
  topic?: string;
  summary?: string;
  visibility?: 'public' | 'private' | 'temporary' | string;
}

export interface ChallengeFile {
  path: string;
  content: string;
  startContent: string;
  isEditable: boolean;
  isAnswerFile?: boolean;
}

export interface ChallengeTest {
  input: string;
  expected: string;
  description?: string;
}

export interface Challenge {
  metadata: ChallengeMetadata;
  task: string;
  files: ChallengeFile[];
  tests: ChallengeTest[];
  reference: string;
  answerFile?: ChallengeFile;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  fixPrompt?: string;
}

export interface JudgeResult {
  verdict: Verdict;
  mistakeType?: MistakeType;
  summary: string;
  breakdown: string;
  whatToLearn?: string;
  model: string;
  advice: string;
  fix?: string;
  authorLearning?: {
    explanation: string;
    referenceSolution: string;
    sources: { label: string; url: string }[];
  };
}

// History item for persistent client-side storage
export interface ChallengeHistoryEntry {
  id: string;
  timestamp: number;
  track: number;
  level: number;
  taskTitle: string;
  verdict: Verdict;
  metadata: ChallengeMetadata;
}
