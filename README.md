# KeepCoding

Deliberate, active coding practice for developers. Build real muscle memory and maintain your engineering intuition in an isolated in-browser workspace with private AI judging.

---

## Why KeepCoding Exists

Modern AI coding assistants (Copilot, Cursor, ChatGPT, Claude) can make software development faster, but relying on passive code acceptance can erode developer intuition. When developers stop writing syntax by hand, tracing execution flows, and wrestling with edge cases, core problem-solving mental models fade.

KeepCoding is a distraction-free practice environment (a "Zero-AI Gym") designed to counter this atrophy:
- **Active hands-on coding:** You read specifications, analyze system constraints, and type code by hand.
- **Production-grade scenarios:** Practice debugging race conditions, patching security holes, writing transaction boundaries, and building resilient APIs.
- **Privacy-first evaluation:** Submit your work to a private server-side AI judge (Google AI Studio Gemini) or work offline with the deterministic local evaluator.
- **Zero AI slop:** Utilitarian, high-contrast dark interface built for developer concentration with no decorative hype icons, no pastel washes, and no marketing fluff.

---

## System Architecture and Practice Loop

KeepCoding connects prompt calibration, external AI generation, structured ingestion, multi-file browser editing, and multi-tier evaluation into a continuous practice cycle.

```
+-----------------------------------------------------------------------------------+
| 1. CALIBRATE & INTERVIEW                                                          |
| Select Track (1-10), Level (1-12), Challenge Type & Language                      |
| (/prompt wizard or /challenges/create author interview)                          |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 2. GENERATE VIA EXTERNAL AI                                                       |
| Paste prompt into Claude, ChatGPT, Gemini, or local LLMs                          |
| AI generates standardized KeepCoding tagged blocks (METADATA, TASK, FILES, etc.)  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 3. INGEST & VALIDATE                                                              |
| Robust tag parser strips outer fences, normalizes line endings & validates limits |
| Enforces max 10 code files, <1000 lines/file, <300 lines reference                |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 4. HANDS-ON WORKSPACE (/studio)                                                   |
| Column 1: Task specification, contracts & test criteria                           |
| Column 2: CodeMirror 6 multi-file editor with read-only file locks                |
| Column 3: Live AST/Regex symbol outline with click-to-line navigation             |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 5. PRIVATE SERVER-SIDE JUDGE (/api/judge)                                         |
| Primary: Google AI Studio Gemini API (Gemini 1.5 Flash / 2.0 Flash)               |
| Fallback: Deterministic local evaluator (runs 100% offline without API key)       |
| Output: 3-tier verdict, root-cause diagnosis, learning concepts & spoiler guard  |
+-----------------------------------------------------------------------------------+
```

---

## Core Features

### 1. The 3-Column Hands-on Studio (`/studio`)
The practice workspace is structured to eliminate friction and keep attention locked on the code:
- **Specification Pane:** Displays task goals, architectural constraints, input/output contracts, and human-readable test descriptions.
- **Multi-File Code Editor:** Powered by CodeMirror 6 with syntax highlighting for TypeScript, JavaScript, Python, Go, Rust, HTML, and CSS. Features tabs for switching files, visual locks for read-only companion files, dirty-state indicators, and single-file or workspace-wide reset options.
- **Symbol Outline:** Automatically extracts functions, classes, interfaces, types, and methods with instant line-jumping navigation.
- **Responsive Navigation:** Desktop 3-column view collapses responsively into clean tab navigation (Code, Task, Files) on mobile screens.

### 2. Challenge Library and Community Catalog (`/challenges`)
Practice curated challenges or contribute your own:
- **Facet Search & Filtering:** Filter challenges by search query, engineering topic, language, difficulty level (1 to 12), challenge type, and visibility.
- **Visibility Levels:**
  - `built-in`: Curated reference challenges available immediately out of the box.
  - `public`: Community challenges open to every KeepCoding developer.
  - `private`: Personal challenges saved to your authenticated account dashboard.
  - `temporary`: One-time practice mode that auto-discards after completion.
- **Attempt Tracking:** Visual indicators mark challenges as "In progress" or "Completed" with timestamps for completed runs.

### 3. Challenge Creator & Interview Wizard (`/challenges/create`)
Create high-quality challenges using two distinct authoring workflows:
- **Suggest Mode:** Generates a structured prompt that directs external AI to produce an immediate production challenge tailored to a chosen domain and difficulty.
- **Interview Mode:** Prompts the AI to interview you step by step about a real production bug, tricky concept, or code snippet you want to turn into a challenge.
- **Author Learning Reflections:** Attach learning goals, rationale, deep-dive explanations, reference solutions, and verified reference URLs that unlock for solvers after they pass.

### 4. Privacy Model and Solver Protection
KeepCoding implements strict privacy boundaries between solvers and challenge authors:
- **Zero Solver Code Storage:** Challenge attempt records store only solver account metadata, start timestamps, and completion timestamps. The solver's submitted code is never stored in attempt tables and is never visible to challenge authors.
- **Protected Reference Solutions:** Reference solutions and author explanations are stored in a separate table (`challenge_solutions`) protected by Supabase Row-Level Security (RLS). They are never sent to the browser prior to a verified pass.
- **Post-Pass Reveal:** When a solver achieves a passing verdict (`PASS`), the server securely retrieves and reveals the author's explanation, reference solution, and documentation sources.

### 5. Multi-Tier AI Judge and Deterministic Offline Engine
- **Cloud AI Judge:** Evaluates submissions against task requirements and reference solutions using Google AI Studio Gemini API (`gemini-1.5-flash`, `gemini-2.0-flash`). Authentication uses secure HTTP headers (`x-goog-api-key`) with zero secret exposure to the client.
- **Deterministic Local Evaluator:** Activates automatically when no API key is configured or when external network calls fail. Inspects modified files, delimiter/syntax balance, inverted logic patterns, token alignment, and test criteria.
- **3-Tier Verdicts:** Clear outcomes (`PASS`, `PARTIAL`, `FAIL`).
- **Root-Cause Diagnostic:** Categorizes errors as `CONCEPT / LOGIC` (business logic, invariant violations, edge cases) or `SYNTAX / IDIOM` (language constructs, typos, missing delimiters).
- **No-Spoiler Learning:** Provides "What to Learn to Solve This" concepts and search keywords. Reference solutions are hidden behind an explicit spoiler guard so you can study hints and retry on your own.

### 6. Authentication and Guest Mode
- **Instant Guest Access:** Jump directly into `/studio` without an account to start practicing immediately.
- **Supabase Authentication:** Secure email/password authentication supporting registration, sign-in, password reset, and session callbacks.
- **Developer Profiles:** Captures primary role, experience level, full name, and optional preferences during sign-up to calibrate challenge recommendations.

---

## Curriculum Tracks and Difficulty Levels

### 10 Engineering Practice Tracks

1. **Backend authentication & access control:** JWT validation, token rotation, session lifecycles, OAuth2 grants, RBAC permissions, and password hashing.
2. **Frontend UI & component craft:** Responsive layouts, design token contracts, interactive compound widgets, accessibility attributes, and visual micro-states.
3. **Frontend auth & guarded forms:** Login and signup flows, password confirmation, validation state machines, route protection, and auth session persistence.
4. **Frontend state & optimistic flows:** Reactive stores, event debouncing, optimistic cache updates, race condition defense, and asynchronous teardown.
5. **Backend business logic & domain rules:** Complex business invariants, validation pipelines, data transformation algorithms, transaction coordination, and error boundaries.
6. **API & database persistence:** REST and GraphQL contract endpoints, SQL queries, migrations, transactional safety, cache invalidation, and cursor pagination.
7. **Data security & runtime hardening:** Timing attack prevention, input sanitization, injection mitigation, constant-time cryptographic checks, and boundary asserts.
8. **Distributed systems & cloud workers:** Queue processing, idempotency keys, background job workers, event retry backoff, and asynchronous webhook pipelines.
9. **CLI, tooling & file parsers:** Command line utilities, streaming file parsers, binary protocol decoders, AST transformations, and memory efficiency.
10. **Mobile & offline synchronization:** Offline-first storage, optimistic local queues, delta reconciliation, connection rehydration, and platform bridge logic.

### 12-Level Difficulty Progression

- **Levels 1 to 3 (Foundations & Handlers):** Basic contracts, syntax idioms, parameter parsing, clean return types, and initial error branching.
- **Levels 4 to 7 (State & Security Invariants):** Race conditions, timing defenses, debounce lifecycles, RBAC enforcement, and form validation state machines.
- **Levels 8 to 10 (Transactions & Edge Cases):** Concurrency isolation, cache invalidation, optimistic rollbacks, SQL boundary conditions, and stream decoders.
- **Levels 11 to 12 (Scale, Resilience & Distributed Consensus):** Distributed queue workers, idempotency keys, clock drift tolerance, and zero-downtime schema evolution.

### Challenge Types
- **Fix Bug:** Debug and repair a broken production implementation.
- **Build Feature / Logic:** Implement missing business logic to satisfy an API contract.
- **Refactor:** Clean, optimize, and restructure existing code while preserving invariants.
- **Find Bug:** Locate vulnerabilities, logic flaws, or performance regressions.
- **Edge Cases:** Harden an implementation against boundary conditions and malicious inputs.
- **Explain & Analyze:** Inspect and explain complex execution behavior or output.

---

## Tagged Challenge Format Specification

Challenges adhere to a standardized block format that the KeepCoding parser validates:

```text
---METADATA---
track: 1
level: 3
type: Fix Bug
editableLanguage: typescript
editableFiles: src/token-validator.ts

---TASK---
ACTION: FIX BUG
GOAL: Reject expired JSON Web Tokens and handle clock-skew tolerance.

WHAT YOU NEED TO KNOW TO BUILD THIS:
- Unix timestamps vs milliseconds (Search: "jwt exp claim epoch seconds")
- Clock skew tolerance windows (Search: "jwt clock tolerance leeway")

WHERE TO WORK:
- Edit: src/token-validator.ts (verifyToken function)
- Reference: src/types.ts (readonly companion types)

CURRENT VS EXPECTED BEHAVIOR:
- Current: Tokens with past expiration dates are marked valid.
- Expected: Returns { valid: false, error: "token_expired" } when exp is past.

HOW TO APPROACH THIS:
1. Inspect the exp claim on the decoded payload.
2. Compare exp with Math.floor(Date.now() / 1000).
3. Apply the allowed leeway window before declaring expiration.

EDGE CASES TO WATCH:
- Missing exp claim in payload.
- Token issued with future timestamp beyond allowable clock skew.

---FILE: src/token-validator.ts---
import { TokenPayload, ValidationResult } from './types';

export function verifyToken(payload: TokenPayload, leewaySeconds = 0): ValidationResult {
  const now = Math.floor(Date.now() / 1000);
  // BUG: inverted comparison marks expired tokens as valid
  if (payload.exp && payload.exp >= now) {
    return { valid: false, error: 'token_expired' };
  }
  return { valid: true, payload };
}

---FILE: src/types.ts (readonly)---
export interface TokenPayload {
  userId: string;
  exp: number;
  iat: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  payload?: TokenPayload;
}

---TESTS---
Input: verifyToken({ userId: "u1", exp: 1000, iat: 900 }) where now = 2000
Expected: { valid: false, error: "token_expired" }
Description: Expired token must be rejected with token_expired code

Input: verifyToken({ userId: "u2", exp: 3000, iat: 2000 }) where now = 2500
Expected: { valid: true }
Description: Unexpired valid token must pass verification

---REFERENCE---
export function verifyToken(payload: TokenPayload, leewaySeconds = 0): ValidationResult {
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp + leewaySeconds < now) {
    return { valid: false, error: 'token_expired' };
  }
  return { valid: true, payload };
}
```

### Parser Constraints
- **File limits:** Maximum 10 code files (1 to 4 strongly recommended).
- **File length:** Maximum 1000 lines per file (under 500 lines preferred).
- **Reference solution:** Under 300 lines (avoids duplicating entire repositories).
- **Single editable language:** Exactly one editable language per challenge.
- **Automated fix prompts:** If a pasted challenge is missing tags or exceeds limits, KeepCoding outputs an actionable fix prompt you can paste back into your AI.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Editor** | CodeMirror 6 (`@uiw/react-codemirror`, language packs for JS/TS, Python, Go, HTML, CSS) |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, `@supabase/ssr`, `@supabase/supabase-js`) |
| **Styling** | Tailwind CSS v4, Lucide React icons, Obsidian/Mint custom palette |
| **AI Judging** | Google AI Studio Gemini API (`gemini-1.5-flash`, `gemini-2.0-flash`) |
| **Local Evaluation** | Custom deterministic tokenizer, AST balancer, and invariant analyzer |
| **Test Runner** | TSX test suite with automated quality, parser, judge, auth, and accessibility gates |

---

## Quick Start

### 1. Prerequisites
- **Node.js:** 20.x or higher
- **npm:** 10.x or higher

### 2. Clone and Install
```bash
git clone https://github.com/anamelyilma/keepcoding.git
cd keepcoding
npm install
```

### 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env.local
```

Configure `.env.local` based on your setup:
```env
# Optional: Google AI Studio API key for live Gemini judging
# If omitted or left empty, KeepCoding automatically uses the offline deterministic evaluator
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash

# Optional: Supabase configuration (Required for Community Challenge Library & User Accounts)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

> **Note on Offline Mode:** KeepCoding works immediately out of the box with zero external dependencies. If you do not configure an `AI_API_KEY`, the deterministic local engine handles challenge grading locally in Node.js.

### 4. Supabase Setup (Optional for Accounts and Community Library)
If you wish to enable user accounts, community library storage, and solver activity tracking:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Execute the database migration in the Supabase SQL Editor:
   ```sql
   -- Run contents of:
   supabase/migrations/202611070001_challenge_library.sql
   ```
3. In Supabase under **Authentication -> URL Configuration**, set the Site URL to `http://localhost:3002` (or your production domain) and add `http://localhost:3002/auth/callback` to the redirect allowlist.
4. For instant local onboarding without waiting for confirmation emails, toggle **Confirm email** to **OFF** under **Authentication -> Providers -> Email**.
5. See [AUTH_SETUP.md](./AUTH_SETUP.md) for full instructions.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3002](http://localhost:3002) in your browser.

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on port 3002 with Turbopack |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the production Next.js server |
| `npm run lint` | Runs ESLint across the codebase |
| `npm test` | Runs the full 7-stage automated verification suite |

---

## Test Verification Suite

KeepCoding enforces high reliability through an automated test harness covering parser resilience, judge evaluation, workspace transitions, authentication flows, and accessibility compliance:

```bash
npm test
```

The test command runs 7 verification passes:
1. **Parser & Validator (`verify-parser.ts`):** 56 tests verifying tag parsing, outer fence stripping, CRLF handling, line length limits, file limits, and fix prompt generation.
2. **Judge Prompt & Parser (`verify-judge.ts`):** 21 tests validating system prompts, verdict parsing, mistake classifications, and fix diff extraction.
3. **End-to-End Workflow (`e2e-workflow.test.ts`):** Complete cycle test verifying prompt generation, sample challenge ingestion, and workspace dirty/reset states.
4. **Marketing Page Verification (`verify-marketing-page.ts`):** Validates design tokens, track grid links, and anti-AI slop rules on landing pages.
5. **Studio Workspace Verification (`verify-studio-workspace.ts`):** Validates multi-file tab switching, file locks, CodeMirror rendering, and mobile responsiveness.
6. **Auth Flow & Security (`verify-auth-flow.ts`):** Validates guest access, form action contracts, PKCE callbacks, and route protections.
7. **Web Quality & Accessibility Audit (`verify-web-quality-audit.ts`):** Checks WCAG 2.2 AA contrast compliance (4.5:1 ratio), focus rings, reduced motion queries, 44x44px touch targets, zero secret leaks, and zero forbidden icons or em dashes.

---

## Security Policy

KeepCoding adheres to strict security and secret protection standards:
- **Zero Secret Leakage:** Real API keys and credentials are never stored in client code, committed to git, or logged to the console.
- **Server-Side API Routes:** Judge evaluation requests pass through `/api/judge`. Upstream calls to Google AI Studio use server-side HTTP headers (`x-goog-api-key`).
- **Database Row-Level Security:** Supabase tables (`challenges`, `challenge_solutions`, `challenge_attempts`) use strict RLS policies. Challenge solutions are never readable by anyone except the author or server service role.
- **Sanitized Errors:** Upstream provider failures return clean user-facing error messages without exposing backend URLs, headers, or internal tracebacks.
- **Solver Privacy:** Solvers' submitted code is never stored in activity tables. Authors can see solver account names and attempt timestamps, but never solver code.

---

## Anti-AI Slop Design Philosophy

To preserve an authentic, focused developer atmosphere, KeepCoding follows design rules documented in [agent_learn.md](./agent_learn.md):
- **Utilitarian Icons Only:** Uses clean functional icons (`Code2`, `Terminal`, `Lock`, `CheckCircle2`, `AlertCircle`, `ArrowRight`). Decorative icons like `Sparkles`, `Wand2`, and `Zap` are strictly banned.
- **Deep Obsidian and Mint Palette:** Built on `#090A0F` canvas, `#11131A` elevated surfaces, and `#88BDA4` brand mint accent. Pastel washes, multi-colored card dashboards, and neon gradient blur blobs are prohibited.
- **Typography and Contrast:** High-contrast text pairing Geist Sans and Geist Mono. All interactive text satisfies WCAG 2.2 AA contrast standards against dark surfaces.
- **No Em Dashes:** The KeepCoding house style forbids em dash characters in favor of clean hyphens, colons, commas, or separate sentences.
- **No Marketing Fluff:** Zero buzzwords ("supercharge", "next-gen", "revolutionary", "seamlessly") and zero fake testimonials.

---

## License

This project is licensed under the [MIT License](./LICENSE).
