// KeepCoding - Built-in Multi-Language Production Curriculum (60 Challenges)
// 12 Challenges per Language: TypeScript, Go, Python, PHP, Rust
// Level Distribution per Language: Level 1 (2), Level 3 (3), Level 4 (3), Level 6 (2, multi-file), Level 10 (2, multi-file)

import { TYPESCRIPT_CHALLENGES } from './challenges/data/typescript';
import { GOLANG_CHALLENGES } from './challenges/data/golang';
import { PYTHON_CHALLENGES } from './challenges/data/python';
import { PHP_CHALLENGES } from './challenges/data/php';
import { RUST_CHALLENGES } from './challenges/data/rust';

export interface SampleChallengeOption {
  id: string;
  label: string;
  track: number;
  level: number;
  type: string;
  language: string;
  raw: string;
}

export const SAMPLE_CHALLENGES: SampleChallengeOption[] = [
  ...TYPESCRIPT_CHALLENGES,
  ...GOLANG_CHALLENGES,
  ...PYTHON_CHALLENGES,
  ...PHP_CHALLENGES,
  ...RUST_CHALLENGES,
];
