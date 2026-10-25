// KeepCoding - Master Prompt Generator
// Generates instructions for external chat AI to produce valid tagged challenges

import { formatHistoryForPrompt, HistoryRecord } from '../storage/history';

export interface PromptOptions {
  track: number;
  level: number;
  type: string;
  language: string;
  history?: HistoryRecord[];
}

export const TRACK_DEFINITIONS: Record<number, { title: string; summary: string }> = {
  1: {
    title: 'User identity and access',
    summary: 'Authentication, token handling, session lifecycles, RBAC, password security, and credential verification.',
  },
  2: {
    title: 'Interactive UI and state',
    summary: 'Component state, reactive updates, event debouncing, DOM coordination, and optimistic rendering.',
  },
  3: {
    title: 'API and persistence',
    summary: 'REST/JSON endpoints, SQL queries, transactional safety, cache invalidation, and data transformation.',
  },
  4: {
    title: 'Data security',
    summary: 'Input sanitization, injection mitigation, constant-time operations, cryptographic integrity, and boundary checks.',
  },
};

export const CHALLENGE_TYPES = [
  'Write',
  'Build',
  'Fix',
  'Find bug',
  'Explain',
  'Predict output',
  'Edge cases',
] as const;

export const SUPPORTED_LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'HTML/CSS',
] as const;

/**
 * Builds the complete master prompt for external AI generation.
 */
export function generateMasterPrompt(options: PromptOptions): string {
  const trackInfo = TRACK_DEFINITIONS[options.track] || TRACK_DEFINITIONS[1];
  const historyText = formatHistoryForPrompt(options.history || []);

  return `You are the KeepCoding Challenge Architect.
Generate an active, hands-on coding challenge tailored specifically to the developer's requested track, level, and language.

DEVELOPER REQUEST:
- Track ${options.track}: ${trackInfo.title} (${trackInfo.summary})
- Difficulty Level: ${options.level} (Scale: 1 = foundational, 12 = deep production resilience)
- Challenge Type: ${options.type}
- Primary Language: ${options.language}

PREVIOUS CHALLENGE HISTORY (DO NOT REPEAT CONCEPTS FROM THESE):
${historyText}

TAGGED FORMAT SPECIFICATION:
Your response must use the exact KeepCoding tagged block format below.
Do not wrap your entire answer in conversational preamble. Start directly with ---METADATA---:

---METADATA---
track: ${options.track}
level: ${options.level}
type: ${options.type}
editableLanguage: ${options.language.toLowerCase()}
editableFiles: [comma-separated path(s) developer should edit, e.g. src/auth.ts]

---TASK---
[Crisp, clear, technical task instructions. State the exact goal, edge cases to watch for, and acceptance criteria. Keep it concise.]

---FILE: path/to/file.ext---
[Source code for the file. For multi-file challenges, use multiple ---FILE: path--- blocks.
Append (readonly) in the tag like ---FILE: path/config.ts (readonly)--- for read-only companion files.]

---TESTS---
Input: [concrete input]
Expected: [expected output or behavior]
Description: [what this test validates]

Input: [edge case input]
Expected: [expected output]
Description: [edge case behavior]

---REFERENCE---
[Concise reference solution or targeted diff showing the correct implementation.
STRICT REQUIREMENT: Must be 45 lines or fewer. NEVER duplicate entire multi-file projects here.]

${
  options.type === 'Explain' || options.type === 'Find bug' || options.type === 'Predict output'
    ? `OPTIONAL FOR TEXT-ANSWER CHALLENGES:
---ANSWER_FILE: answer.md---
# Your analysis / explanation goes here:
`
    : ''
}
CRITICAL VALIDATION RULES:
1. Maximum 5 code files.
2. Every file must be under 200 lines.
3. Exactly 1 editable language (${options.language.toLowerCase()}).
4. Reference solution must be under 45 lines.
5. Code must be realistic, production-minded, and self-contained.
6. Provide at least 2 distinct test cases.
`;
}
