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
Write the task explanation using EXACTLY these section headers, in this order.
CRITICAL CLARITY RULE: Use plain, simple English words. Avoid heavy jargon. Keep sentences short and easy for non-native speakers to understand instantly.

ACTION:
[1 or 2 words: BUILD, FIX BUG, REFACTOR, FIND BUG, or EDGE CASES]

GOAL:
1 to 2 short sentences stating the exact objective in plain English. Keep it simple and direct.

CURRENT VS EXPECTED BEHAVIOR:
- Current: What the code currently does wrong or what is missing.
- Expected: What the code must do when working correctly.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
Short bullet points detailing what the developer needs to understand before writing code. Cover concept, syntax, and framework, with exact search queries in parentheses:
- Concept: [Core pattern or invariant] (Search: "exact topic to search on YouTube/Google")
- Syntax: [Language-specific idiom, struct receiver, type, or error pattern] (Search: "language syntax query")
- Framework: [Library or module API pattern] (Search: "framework query")

PRACTICAL TIPS & WATCHOUTS:
2 to 3 concrete code tips and boundary checks (e.g. timestamp seconds vs milliseconds, <= vs < boundary comparisons, slice bounds, nil checks).

WHERE TO WORK:
- Edit: [file path and function name to inspect/modify]
- Reference: [read-only companion files and what each is for]

HOW TO APPROACH THIS:
3 to 4 numbered investigation steps guiding how to think about and debug the problem. Guide the developer's reasoning, but DO NOT provide the code solution. Use simple, direct words.

EDGE CASES TO WATCH:
Bullet points covering boundary inputs, equal-value thresholds, or special states.`
    : `---TASK---
Write the task specification using EXACTLY these section headers, in this order.
CRITICAL CLARITY RULE: Use plain, simple English words. Avoid heavy jargon. Keep sentences short and easy for non-native speakers to understand instantly.

ACTION:
[1 or 2 words: BUILD, FIX BUG, REFACTOR, FIND BUG, or EDGE CASES]

OBJECTIVE & ARCHITECTURAL CONTEXT:
1-2 simple sentences stating the system goal, layer, and purpose in plain English without unnecessary academic words.

CURRENT VS EXPECTED BEHAVIOR:
- Current: What the code currently does wrong or what is missing.
- Expected: What the code must do when working correctly.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
Short bullet points listing the core patterns, language primitives, or system concepts required. Include recommended search keywords in parentheses:
- Concept: [Core pattern or role in architecture] (Search: "exact topic to google")
- Syntax: [Language syntax or type pattern] (Search: "syntax query")
- Framework: [System module or library contract] (Search: "framework query")

PRACTICAL TIPS & WATCHOUTS:
2 to 3 concrete code tips and boundary checks.

TARGET BOUNDARY:
- Editable: [target file(s) and entrypoints]
- System Contracts: [interfaces, schemas, or companion modules]

FAILURE MODES & SYSTEM INVARIANTS:
State invariants, concurrency, or integrity rules that must be maintained. Keep sentences simple and direct.

HOW TO APPROACH THIS:
3 to 4 numbered investigation steps guiding how to approach the architecture safely.

EDGE CASES & CONSTRAINTS:
Specific boundary conditions, exploit vectors, or scale/timing limits to guard against.`;

  return `You are the KeepCoding Challenge Architect.
Do not write the challenge immediately. First ask whether the developer already has a topic, real problem, coding technique, or code they want to turn into a challenge, or wants you to suggest a topic. Ask one focused follow-up question at a time until you understand their goal. If they bring code or a repository link, ask what matters and include only the relevant code in the final challenge. The challenge must be understandable without opening external links. If they want you to suggest a topic, choose one based on the selected track, level, and language.

DEVELOPER REQUEST:
- Track ${options.track}: ${trackInfo.title} (${trackInfo.summary})
- Difficulty Level: ${options.level} (Scale: 1 = foundational, 12 = deep production resilience)
- Challenge Type: ${options.type}
- Primary Language: ${options.language}

LEVEL-BASED TASK COUNT & COGNITIVE DIFFICULTY CURVE (STRICTLY REQUIRED):
Beginner levels must NEVER be overwhelmed with multi-function systems. Advanced levels must NEVER have trivial 1-line fixes.
- Levels 1 to 2 (Foundations & Quick Wins):
  * Task / Function Count: EXACTLY 1 focused function or bug fix (maximum 2 small helper functions).
  * Acceptance Test Count: 2 to 3 tests.
  * Code Scope: 5 to 15 lines of code to write/edit.
  * Cognitive Focus: Single-parameter validation, return types, defensive boundary check, pure functions (e.g. validate formatted email or slug, calculate discount or boundary clamp, verify timestamp with margin).
  * CRITICAL BAN: NEVER ask for a 1-character or 1-line trivial fix (e.g. NEVER just change <= to >=). The solver must write a real function with defensive checks. NEVER ask for a full state machine or more than 2 functions at Level 1 or 2!
- Levels 3 to 5 (State Invariants & Handlers):
  * Task / Function Count: 2 to 3 functions or tasks.
  * Acceptance Test Count: 3 to 5 tests.
  * Code Scope: 10 to 25 lines of code (writing a full function, middleware handler, or multi-step validator. STRICT RULE: NEVER a trivial 1-line or 1-word fix).
  * Cognitive Focus: Language-appropriate handler or state invariant:
    - TypeScript: Debounce hook, form field touched UX, or optimistic toggle.
    - Go / Rust / Python / PHP: HTTP authorization header parser, in-memory cache, pagination bounds, or query sanitizer.
- Levels 6 to 8 (Multi-State & Edge Case Invariants):
  * Task / Function Count: 4 to 5 functions or tasks.
  * Acceptance Test Count: 5 to 7 tests.
  * Code Scope: 18 to 40 lines of code (implementing coordinated functions, transaction handling, or data transformations).
  * Cognitive Focus: Full form validation state machine (e.g. multi-field signup form with touched, error visibility, and submit readiness), transaction commit/rollback, token refresher with clock-skew tolerance, or RBAC route guards.
- Levels 9 to 12 (Scale, Resilience & Concurrency):
  * Task / Function Count: 6 to 8 coordinated tasks or functions.
  * Acceptance Test Count: 7 to 10+ tests.
  * Code Scope: 25 to 50 lines of code (concurrency locks, rate limiting sliding windows, cryptographic validation, or fault boundaries).
  * Cognitive Focus: Distributed queue workers, sliding-window rate limiters, multi-resource consensus, optimistic locking, idempotent message processors.

LANGUAGE ECOSYSTEM ALIGNMENT (STRICTLY REQUIRED):
- Match the problem naturally to the target language:
  * TypeScript / JavaScript: Modern web UI, async promises, discriminated unions, form validation, client state.
  * Go: Goroutines, channels, HTTP handlers, middleware, JSON decoders, microservice resilience. (NEVER generate browser DOM or form touched state machines for Go!)
  * Rust: Memory safety, Result/Option error handling, traits, iterators, CLI tools. (NEVER generate browser DOM or form touched state machines for Rust!)
  * Python: Data manipulation, list comprehensions, FastAPI/Flask route logic, file parsers.
  * PHP: Web request lifecycle, HTTP middleware, SQL query builders, arrays. (NEVER generate browser DOM form touched state machines for PHP!)

ANTI-SPOON-FEEDING & CLARITY RULE:
Under CURRENT VS EXPECTED BEHAVIOR and HOW TO APPROACH THIS, define what the code must do and list the acceptance criteria.
NEVER reveal the exact code diff, bug line, or step-by-step solution pseudo-code in the task guide. The developer must debug and write the code themselves.

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
1. Use only the files needed for the task, usually 1 to 4. Maximum 10 code files.
2. Strongly prefer fewer than 500 lines per file. Never exceed 1000 lines in a file.
3. Exactly 1 editable language (${options.language.toLowerCase()}).
4. Under ---FILE: ...---, output clean raw code only without code fences (\`\`\`) or language headers.
5. Reference solution must be under 300 lines.
6. Code must be realistic, production-minded, and self-contained.
7. Provide test cases calibrated to the level: 2 to 3 tests for Levels 1-2; 3 to 5 tests for Levels 3-5; 5 to 7 tests for Levels 6-8; 7 to 10 tests for Levels 9-12. Never exceed 3 tests for Level 1 or 2.
8. Under ---TASK---, NEVER provide the final solution code or exact code diff. The goal is hands-on practice.
9. Under ---TESTS---, write clear human-readable test descriptions explaining the behavior being verified (e.g. "Expired token must be rejected").
10. NEVER use em dash characters. Use standard hyphens (-), colons (:), or commas.
`;
}

export interface ChallengeAuthorPromptInput {
  mode: 'idea' | 'suggest';
  language: string;
  level: number;
  domain?: string;
  challengeType?: string;
  context?: string;
}

export function generateChallengeAuthorPrompt(input: ChallengeAuthorPromptInput): string {
  const context = input.context?.trim();
  const domain = input.domain || 'Backend API & Middleware';
  const type = input.challengeType || 'Fix Bug';
  const langLower = input.language.toLowerCase();
  const fileExt = langLower === 'python' ? 'py' : langLower === 'go' ? 'go' : langLower === 'rust' ? 'rs' : 'ts';

  const domainGuidance: Record<string, string> = {
    'Backend API & Middleware': 'REST endpoints, request validation, HTTP status codes, error middleware, route handlers, and serialization.',
    'Auth, JWT & Sessions': 'JWT validation, token expiration, clock-skew tolerance, refresh token rotation, session lifecycle, RBAC guards, and password hashing.',
    'Database & SQL Schemas': 'SQL queries, relational constraints, transaction commit/rollback, schema migrations, indexing, and connection pools.',
    'Frontend UI & Forms': 'Form validation state machines, controlled inputs, accessible widgets (ARIA, keyboard navigation), design tokens, and layout contracts.',
    'State & Async Race Conditions': 'Event debouncing, throttling, optimistic UI updates, abort controller cancellation, async fetch race conditions, and client cache.',
    'Distributed Systems & Workers': 'Webhook verification, idempotency keys, background worker queues, exponential backoff, and rate limiters.',
    'Data Security & Hardening': 'Timing attack mitigation, input sanitization, SQL/NoSQL injection defense, constant-time comparisons, and boundary asserts.',
  };

  const domainSummary = domainGuidance[domain] || domainGuidance['Backend API & Middleware'];

  const suggestInstructions = `1. DO NOT ask the developer if they have an idea or ask vague questions.
2. In your very first reply, immediately output one complete, production-grade practice challenge matching the exact specifications below.
3. The problem must be a realistic, practical scenario that a real web developer faces in production, not a toy algorithm or math quiz.`;

  const ideaInstructions = `1. Review the developer's provided context below:
<developer_context>
${context || 'No specific context provided. Generate a realistic production scenario for this domain.'}
</developer_context>
2. Turn this context directly into one complete, focused practice challenge.
3. Do not engage in a long back-and-forth conversation. Immediately output the complete tagged challenge.`;

  return `You are the KeepCoding Challenge Architect for Web Developers.
Your mission is to generate a hands-on, production-grade coding challenge to build real developer muscle memory.

TARGET SPECIFICATION:
- Primary Language: ${input.language}
- Difficulty Level: ${input.level} of 12 (1 = basic handler/logic, 6 = mid-level edge case/security, 12 = deep production resilience/scale)
- Web Domain: ${domain} (${domainSummary})
- Challenge Type: ${type}

LEVEL-BASED TASK COUNT & COGNITIVE DIFFICULTY CURVE (STRICTLY REQUIRED):
Beginner levels must NEVER be overwhelmed with multi-function systems. Advanced levels must NEVER have trivial 1-line fixes.
- Levels 1 to 2 (Foundations & Quick Wins):
  * Task / Function Count: EXACTLY 1 focused function or bug fix (maximum 2 small helper functions).
  * Acceptance Test Count: 2 to 3 tests.
  * Code Scope: 5 to 15 lines of code to write/edit.
  * Cognitive Focus: Single-parameter validation, return types, defensive boundary check, pure functions (e.g. validate formatted email or slug, calculate discount or boundary clamp, verify timestamp with margin).
  * CRITICAL BAN: NEVER ask for a 1-character or 1-line trivial fix (e.g. NEVER just change <= to >=). The solver must write a real function with defensive checks. NEVER ask for a full state machine or more than 2 functions at Level 1 or 2!
- Levels 3 to 5 (State Invariants & Handlers):
  * Task / Function Count: 2 to 3 functions or tasks.
  * Acceptance Test Count: 3 to 5 tests.
  * Code Scope: 10 to 25 lines of code (writing a full function, middleware handler, or multi-step validator. STRICT RULE: NEVER a trivial 1-line or 1-word fix).
  * Cognitive Focus: Language-appropriate handler or state invariant:
    - TypeScript: Debounce hook, form field touched UX, or optimistic toggle.
    - Go / Rust / Python / PHP: HTTP authorization header parser, in-memory cache, pagination bounds, or query sanitizer.
- Levels 6 to 8 (Multi-State & Edge Case Invariants):
  * Task / Function Count: 4 to 5 functions or tasks.
  * Acceptance Test Count: 5 to 7 tests.
  * Code Scope: 18 to 40 lines of code (implementing coordinated functions, transaction handling, or data transformations).
  * Cognitive Focus: Full form validation state machine (e.g. multi-field signup form with touched, error visibility, and submit readiness), transaction commit/rollback, token refresher with clock-skew tolerance, or RBAC route guards.
- Levels 9 to 12 (Scale, Resilience & Concurrency):
  * Task / Function Count: 6 to 8 coordinated tasks or functions.
  * Acceptance Test Count: 7 to 10+ tests.
  * Code Scope: 25 to 50 lines of code (concurrency locks, rate limiting sliding windows, cryptographic validation, or fault boundaries).
  * Cognitive Focus: Distributed queue workers, sliding-window rate limiters, multi-resource consensus, optimistic locking, idempotent message processors.

LANGUAGE ECOSYSTEM ALIGNMENT (STRICTLY REQUIRED):
- Match the problem naturally to the target language:
  * TypeScript / JavaScript: Modern web UI, async promises, discriminated unions, form validation, client state.
  * Go: Goroutines, channels, HTTP handlers, middleware, JSON decoders, microservice resilience. (NEVER generate browser DOM or form touched state machines for Go!)
  * Rust: Memory safety, Result/Option error handling, traits, iterators, CLI tools. (NEVER generate browser DOM or form touched state machines for Rust!)
  * Python: Data manipulation, list comprehensions, FastAPI/Flask route logic, file parsers.
  * PHP: Web request lifecycle, HTTP middleware, SQL query builders, arrays. (NEVER generate browser DOM form touched state machines for PHP!)

ANTI-SPOON-FEEDING & CLARITY RULE:
Under CURRENT VS EXPECTED BEHAVIOR and HOW TO APPROACH THIS, define what the code must do and list the acceptance criteria.
NEVER reveal the exact code diff, bug line, or step-by-step solution pseudo-code in the task guide. The developer must debug and write the code themselves.

GENERATION INSTRUCTIONS:
${input.mode === 'suggest' ? suggestInstructions : ideaInstructions}

TAGGED FORMAT SPECIFICATION (CRITICAL: You MUST use this exact block format):
Output the challenge using the exact tags shown below. Do not use square brackets (never use [metadata] or [task]). Do not wrap code files in markdown backtick fences.

---METADATA---
track: 1
level: ${input.level}
type: ${type}
topic: ${domain}
title: [Punchy, practical 3 to 7 word challenge title, e.g. Verify Expired Access Tokens with Clock Skew]
editableLanguage: ${langLower}
editableFiles: src/solution.${fileExt}

---TASK---
Write the task explanation using EXACTLY these section headers, in this order.
CRITICAL CLARITY RULE: Use plain, simple English words. Avoid heavy jargon. Keep sentences short and easy for non-native English speakers to understand instantly.

ACTION:
[1 or 2 words: BUILD, FIX BUG, REFACTOR, or EDGE CASES]

GOAL:
1 to 2 short sentences in plain English stating the exact objective. Keep it simple and direct.

CURRENT VS EXPECTED BEHAVIOR:
- Current: What the code currently does wrong or what is missing.
- Expected: What the code must do when working correctly.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: [Core pattern or domain rule] (Search: "exact topic to search on YouTube/Google")
- Syntax: [Language syntax, method receiver, or error handling] (Search: "language syntax search query")
- Framework: [API, router, or package pattern] (Search: "framework search query")

PRACTICAL TIPS & WATCHOUTS:
- Tip: [Concrete code advice, e.g. units, boundary operator <= vs <, nil check, etc.]
- Tip: [Second practical tip]

WHERE TO WORK:
- Edit: src/solution.${fileExt} (Target functions: EXACTLY 1 function for Levels 1-2; 2-3 functions for Levels 3-5; 4-5 functions for Levels 6-8; 6-8 functions for Levels 9-12)
- Reference: src/types.${fileExt} (Companion types and models)

HOW TO APPROACH THIS:
1. [First investigation step]
2. [Second implementation step]
3. [Third verification step]

EDGE CASES TO WATCH:
Bullet points covering boundary inputs, equal-value thresholds, or special states.

---FILE: src/solution.${fileExt}---
[Provide the starter code that the solver will edit. Put clean raw code here without markdown backtick fences.
If you need additional companion files (e.g. types or models), use another ---FILE: path--- block and append (readonly) if it should not be edited, e.g.:
---FILE: src/types.${fileExt} (readonly)---]

---TESTS---
Input: [First concrete test input, e.g. validateToken("expired_jwt_token")]
Expected: [Expected output or return value, e.g. { valid: false, error: "token_expired" }]
Description: [What this test validates, e.g. Expired tokens must be rejected with token_expired code]

Input: [Second test input with edge cases, e.g. validateToken("valid_token_with_future_exp")]
Expected: [Expected output or return value, e.g. { valid: true, payload: { userId: "u123" } }]
Description: [What this test validates, e.g. Valid unexpired tokens must pass and return decoded payload]

---REFERENCE---
[Concise reference solution showing the correct, bug-free implementation under 300 lines.]

CRITICAL RULES:
1. Output MUST start with ---METADATA--- and end with ---REFERENCE---.
2. Put raw code directly inside ---FILE: ...--- without code fences (\`\`\`).
3. Under ---TESTS---, provide test cases calibrated to the level: 2 to 3 tests for Levels 1-2; 3 to 5 tests for Levels 3-5; 5 to 7 tests for Levels 6-8; 7 to 10 tests for Levels 9-12. Use the "Input: / Expected: / Description:" format. Do not write test framework files like describe() or it().
4. Avoid em dash characters. Keep descriptions clear, practical, and punchy.`;
}
