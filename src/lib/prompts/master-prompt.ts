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

export interface TrackDefinition {
  title: string;
  summary: string;
  category: 'Frontend' | 'Backend' | 'Security' | 'Systems & Architecture';
}

export const TRACK_DEFINITIONS: Record<number, TrackDefinition> = {
  1: {
    title: 'Backend authentication & access control',
    summary: 'JWT validation, token rotation, session lifecycles, OAuth2 grants, RBAC permissions, and password hashing.',
    category: 'Backend',
  },
  2: {
    title: 'Frontend UI & component craft',
    summary: 'Responsive layouts, design token contracts, interactive compound widgets, accessibility attributes, and visual micro-states.',
    category: 'Frontend',
  },
  3: {
    title: 'Frontend auth & guarded forms',
    summary: 'Login & signup flows, password confirmation, validation state machines, route protection, and auth session persistence.',
    category: 'Frontend',
  },
  4: {
    title: 'Frontend state & optimistic flows',
    summary: 'Reactive stores, event debouncing, optimistic cache updates, race condition defense, and asynchronous teardown.',
    category: 'Frontend',
  },
  5: {
    title: 'Backend business logic & domain rules',
    summary: 'Complex business invariants, validation pipelines, data transformation algorithms, transaction coordination, and error boundaries.',
    category: 'Backend',
  },
  6: {
    title: 'API & database persistence',
    summary: 'REST & GraphQL contract endpoints, SQL queries, migrations, transactional safety, cache invalidation, and cursor pagination.',
    category: 'Backend',
  },
  7: {
    title: 'Data security & runtime hardening',
    summary: 'Timing attack prevention, input sanitization, injection mitigation, constant-time cryptographic checks, and boundary asserts.',
    category: 'Security',
  },
  8: {
    title: 'Distributed systems & cloud workers',
    summary: 'Queue processing, idempotency keys, background job workers, event retry backoff, and asynchronous webhook pipelines.',
    category: 'Systems & Architecture',
  },
  9: {
    title: 'CLI, tooling & file parsers',
    summary: 'Command line utilities, streaming file parsers, binary protocol decoders, AST transformations, and memory efficiency.',
    category: 'Systems & Architecture',
  },
  10: {
    title: 'Mobile & offline synchronization',
    summary: 'Offline-first storage, optimistic local queues, delta reconciliation, connection rehydration, and platform bridge logic.',
    category: 'Systems & Architecture',
  },
};

export const CHALLENGE_TYPES = [
  'Fix Bug',
  'Build Logic',
  'Refactor',
  'Find Bug',
  'Edge Cases',
  'Explain & Analyze',
] as const;

export const SUPPORTED_LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'SQL',
  'HTML/CSS',
] as const;

/**
 * Builds the complete master prompt for external AI generation.
 */
export function generateMasterPrompt(options: PromptOptions): string {
  const trackInfo = TRACK_DEFINITIONS[options.track] || TRACK_DEFINITIONS[1];
  const historyText = formatHistoryForPrompt(options.history || []);
  const isGuidedLevel = options.level <= 5;

  const taskFormatSpec = isGuidedLevel
    ? `---TASK---
Write the task explanation using EXACTLY these section headers, in this order:

GOAL:
One sentence stating the exact objective in plain English. Keep it simple and direct.

WHERE TO WORK:
- Edit: [file path and function name to inspect/modify]
- Reference: [read-only companion files and what each is for]

CURRENT VS EXPECTED BEHAVIOR:
- Current: What the code currently does wrong or what is missing.
- Expected: What the code must do when working correctly.

HOW TO APPROACH THIS:
3 to 4 numbered investigation steps guiding how to think about and debug the problem. Guide the developer's reasoning, but DO NOT provide the code solution.

EDGE CASES TO WATCH:
Bullet points covering boundary inputs, equal-value thresholds, or special states.`
    : `---TASK---
Write the task specification using EXACTLY these section headers, in this order:

OBJECTIVE & ARCHITECTURAL CONTEXT:
1-2 sentences stating the system goal, architectural layer, and performance/security purpose.

TARGET BOUNDARY:
- Editable: [target file(s) and entrypoints]
- System Contracts: [interfaces, schemas, or companion modules]

FAILURE MODES & SYSTEM INVARIANTS:
State invariants, concurrency, failure modes, or integrity rules that must be maintained.

EDGE CASES & CONSTRAINTS:
Specific boundary conditions, exploit vectors, or scale/timing limits to guard against.

ACCEPTANCE CRITERIA:
Strict verifiable conditions required for completion.`;

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

${taskFormatSpec}

---FILE: path/to/file.ext---
[Source code for the file. For multi-file challenges, use multiple ---FILE: path--- blocks.
Append (readonly) in the tag like ---FILE: path/config.ts (readonly)--- for read-only companion files.
IMPORTANT: Put raw code directly under the ---FILE--- tag. DO NOT wrap the code in markdown backtick fences (no \`\`\`${options.language.toLowerCase()}) and DO NOT write the language name above the code.]

---TESTS---
Input: [concrete input]
Expected: [expected output or behavior]
Description: [what this test validates, e.g. Expired token must be rejected]

Input: [edge case input]
Expected: [expected output]
Description: [edge case behavior]

---REFERENCE---
[Concise reference solution or targeted diff showing the correct implementation.
STRICT REQUIREMENT: Must be 300 lines or fewer. NEVER duplicate entire multi-file projects here.]

${
  options.type.toLowerCase().includes('explain') || options.type.toLowerCase().includes('find bug') || options.type === 'Predict output'
    ? `OPTIONAL FOR TEXT-ANSWER CHALLENGES:
---ANSWER_FILE: answer.md---
# Your analysis / explanation goes here:
`
    : ''
}
CRITICAL VALIDATION RULES:
1. Maximum 10 code files.
2. Every file must be under 1000 lines.
3. Exactly 1 editable language (${options.language.toLowerCase()}).
4. Under ---FILE: ...---, output clean raw code only without code fences (\`\`\`) or language headers.
5. Reference solution must be under 300 lines.
6. Code must be realistic, production-minded, and self-contained.
7. Provide at least 2 distinct test cases.
8. Under ---TASK---, NEVER provide the final solution code or exact code diff. The goal is hands-on practice.
9. Under ---TESTS---, write clear human-readable test descriptions explaining the behavior being verified (e.g. "Expired token must be rejected").
10. NEVER use em dash characters. Use standard hyphens (-), colons (:), or commas.
`;
}
