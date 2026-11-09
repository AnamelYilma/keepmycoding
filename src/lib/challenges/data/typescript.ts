import { SampleChallengeOption } from '../types';

export const TYPESCRIPT_CHALLENGES: SampleChallengeOption[] = [
  // ==========================================
  // LEVEL 1 (2 Challenges) - Foundations
  // ==========================================
  {
    id: 'ts-l1-expiry-guard',
    label: 'Track 1 (Level 1) - Token Expiry Timestamp Guard (TypeScript)',
    track: 1,
    level: 1,
    type: 'Fix Bug',
    language: 'TypeScript',
    raw: `---METADATA---
track: 1
level: 1
type: Fix Bug
topic: Auth, JWT & Sessions
title: Token Expiration Timestamp Guard
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
FIX BUG

GOAL:
Fix the expiration check so tokens whose expiration time has arrived or passed are marked as expired.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The comparator uses >= instead of <=, marking valid tokens as expired and expired tokens as valid.
- Expected: Returns true if tokenExpSec is less than or equal to currentTimestampSec, and false if tokenExpSec is in the future.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Unix epoch timestamps comparison (Search: "unix epoch timestamp seconds comparison")
- Syntax: TypeScript boolean relational operators <= vs > (Search: "typescript comparison operators")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Remember that earlier timestamps are smaller numbers. If tokenExpSec is 100 and now is 200, the token expired in the past.
- Tip: A token expiring at the exact current second (tokenExpSec === currentTimestampSec) is expired.

WHERE TO WORK:
- Edit: src/solution.ts (Target function: isTokenExpired)

HOW TO APPROACH THIS:
1. Inspect the comparison between tokenExpSec and currentTimestampSec.
2. Verify that when tokenExpSec is less than or equal to currentTimestampSec, the token is expired.
3. Fix the relational operator.

EDGE CASES TO WATCH:
- Exact boundary: When tokenExpSec === currentTimestampSec, returns true.
- Future token: When tokenExpSec > currentTimestampSec, returns false.

---FILE: src/solution.ts---
export function isTokenExpired(tokenExpSec: number, currentTimestampSec: number): boolean {
  // BUG: The comparison is currently reversed
  return tokenExpSec >= currentTimestampSec;
}

---TESTS---
Input: isTokenExpired(1700000000, 1700000100)
Expected: true
Description: Expired token with timestamp in the past must return true

Input: isTokenExpired(1700000500, 1700000100)
Expected: false
Description: Valid token with expiration in the future must return false

Input: isTokenExpired(1700000100, 1700000100)
Expected: true
Description: Token expiring at exact current second must return true

---REFERENCE---
export function isTokenExpired(tokenExpSec: number, currentTimestampSec: number): boolean {
  return tokenExpSec <= currentTimestampSec;
}
`,
  },
  {
    id: 'ts-l1-input-sanitizer',
    label: 'Track 1 (Level 1) - Input Sanitizer & Slugifier (TypeScript)',
    track: 1,
    level: 1,
    type: 'Build Feature',
    language: 'TypeScript',
    raw: `---METADATA---
track: 1
level: 1
type: Build Feature
topic: Backend API & Middleware
title: Input Sanitizer and URL Slugifier
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
BUILD

GOAL:
Build a slugifier function that normalizes a string into a clean, URL-safe slug by lowercasing, trimming, removing non-alphanumeric characters, and replacing whitespace with single hyphens.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The slugify function returns the raw string unchanged, leaving whitespace, uppercase letters, and special characters.
- Expected: Returns a lowercase string with spaces and underscores replaced by single hyphens, stripped of punctuation, and trimmed.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: URL slug normalization and regex sanitization (Search: "url slugify regex typescript")
- Syntax: String trim, toLowerCase, and replaceAll with regex (Search: "javascript string replace regex hyphens")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Multiple consecutive spaces should collapse into a single hyphen, not multiple hyphens.
- Tip: Remove leading and trailing hyphens from the final slug.

WHERE TO WORK:
- Edit: src/solution.ts (Target function: slugify)

HOW TO APPROACH THIS:
1. Trim leading and trailing whitespace from the input and convert to lowercase.
2. Replace any non-alphanumeric characters (except spaces and hyphens) with empty strings.
3. Replace one or more consecutive spaces or underscores with a single hyphen.
4. Trim any hyphens from the beginning or end of the result.

EDGE CASES TO WATCH:
- Multiple spaces: "Hello   World" -> "hello-world"
- Leading/trailing symbols: "---Keep Coding---" -> "keep-coding"
- Special characters: "What's New in 2026!?" -> "whats-new-in-2026"

---FILE: src/solution.ts---
export function slugify(text: string): string {
  // TODO: Lowercase, sanitize, collapse spaces to hyphens, and strip boundary hyphens.
  return text;
}

---TESTS---
Input: slugify("Hello World")
Expected: "hello-world"
Description: Simple two-word title must become lowercase hyphenated slug

Input: slugify("What's New in 2026!?")
Expected: "whats-new-in-2026"
Description: Special punctuation and exclamation marks must be removed

Input: slugify("   Clean   Code   ")
Expected: "clean-code"
Description: Multiple consecutive spaces and boundary spaces must collapse into clean slug

---REFERENCE---
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
`,
  },

  // ==========================================
  // LEVEL 3 (3 Challenges) - Handlers & State
  // ==========================================
  {
    id: 'ts-l3-bearer-auth',
    label: 'Track 1 (Level 3) - Authorization Header Parser (TypeScript)',
    track: 1,
    level: 3,
    type: 'Build Feature',
    language: 'TypeScript',
    raw: `---METADATA---
track: 1
level: 3
type: Build Feature
topic: Auth, JWT & Sessions
title: HTTP Authorization Bearer Token Parser
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
BUILD

GOAL:
Extract and validate the raw token from an HTTP Authorization header string, verifying the "Bearer " scheme and returning a typed result.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Returns null or unparsed headers without validating the Bearer scheme.
- Expected: Returns { valid: true, token: string } when header starts with "Bearer " and has a non-empty token; otherwise returns { valid: false, error: string }.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: HTTP Bearer Authentication scheme RFC 6750 (Search: "http authorization header bearer format rfc 6750")
- Syntax: TypeScript discriminated unions and string startsWith/slice (Search: "typescript discriminated union return type")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Match the scheme case-insensitively or enforce standard "Bearer " prefix.
- Tip: Whitespace around the token must be trimmed. If no token remains after trimming, return an error.

WHERE TO WORK:
- Edit: src/solution.ts (Target function: parseBearerToken)
- Reference: src/types.ts (AuthHeaderResult union)

HOW TO APPROACH THIS:
1. Check if the header is null, undefined, or empty. Return { valid: false, error: "missing_header" }.
2. Check if the header starts with "Bearer " (case-sensitive or insensitive). If not, return { valid: false, error: "invalid_scheme" }.
3. Extract the token substring and trim it. If empty, return { valid: false, error: "missing_token" }.
4. Return { valid: true, token: trimmedToken }.

EDGE CASES TO WATCH:
- Empty header: "" -> missing_header
- Missing scheme: "token123" -> invalid_scheme
- Bearer with only spaces: "Bearer    " -> missing_token

---FILE: src/types.ts (readonly)---
export type AuthHeaderResult =
  | { valid: true; token: string }
  | { valid: false; error: 'missing_header' | 'invalid_scheme' | 'missing_token' };

---FILE: src/solution.ts---
import { AuthHeaderResult } from './types';

export function parseBearerToken(headerValue: string | null | undefined): AuthHeaderResult {
  // TODO: Parse and validate Bearer scheme
  return { valid: false, error: 'missing_header' };
}

---TESTS---
Input: parseBearerToken("Bearer eyJhbGciOiJIUzI1NiJ9")
Expected: { valid: true, token: "eyJhbGciOiJIUzI1NiJ9" }
Description: Valid Bearer header returns parsed token

Input: parseBearerToken("Basic dXNlcjpwYXNz")
Expected: { valid: false, error: "invalid_scheme" }
Description: Non-Bearer scheme returns invalid_scheme error

Input: parseBearerToken("Bearer    ")
Expected: { valid: false, error: "missing_token" }
Description: Bearer header with empty token returns missing_token error

---REFERENCE---
import { AuthHeaderResult } from './types';

export function parseBearerToken(headerValue: string | null | undefined): AuthHeaderResult {
  if (!headerValue || typeof headerValue !== 'string') {
    return { valid: false, error: 'missing_header' };
  }

  const trimmed = headerValue.trim();
  if (!trimmed) {
    return { valid: false, error: 'missing_header' };
  }

  if (!trimmed.toLowerCase().startsWith('bearer ')) {
    return { valid: false, error: 'invalid_scheme' };
  }

  const token = trimmed.slice(7).trim();
  if (!token) {
    return { valid: false, error: 'missing_token' };
  }

  return { valid: true, token };
}
`,
  },
  {
    id: 'ts-l3-ttl-cache',
    label: 'Track 2 (Level 3) - In-Memory TTL Cache (TypeScript)',
    track: 2,
    level: 3,
    type: 'Build Feature',
    language: 'TypeScript',
    raw: `---METADATA---
track: 2
level: 3
type: Build Feature
topic: Backend API & Middleware
title: In-Memory TTL Cache with Expiration
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
BUILD

GOAL:
Implement a lightweight in-memory cache supporting set, get, and size operations with millisecond time-to-live (TTL) expiration.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The cache retains keys forever without checking TTL expiration.
- Expected: get(key, now) returns the value if not expired, or null if expired. Expired entries are evicted when accessed.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: TTL caching and lazy eviction strategy (Search: "in memory ttl cache eviction javascript")
- Syntax: TypeScript Map collection and generic parameters (Search: "typescript map store key value")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Calculate expiresAt as nowMs + ttlMs.
- Tip: In get(key, nowMs), if nowMs >= entry.expiresAt, delete the entry from the map and return null.

WHERE TO WORK:
- Edit: src/solution.ts (Target methods: set, get, size)

HOW TO APPROACH THIS:
1. Store values with their calculated expiration timestamp.
2. In get(), check if the current time exceeds the expiration timestamp.
3. If expired, clean up the key from internal storage and return null.

EDGE CASES TO WATCH:
- Exact boundary: nowMs === expiresAt is considered expired.
- Non-existent key: returns null without error.

---FILE: src/solution.ts---
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  set(key: string, value: T, ttlMs: number, nowMs: number): void {
    // TODO: store value with expiration
  }

  get(key: string, nowMs: number): T | null {
    // TODO: return value if unexpired, or null if expired
    return null;
  }

  size(nowMs: number): number {
    // TODO: return count of currently valid entries
    return 0;
  }
}

---TESTS---
Input: const c = new MemoryCache(); c.set("user:1", "Alice", 1000, 100); c.get("user:1", 500)
Expected: "Alice"
Description: Retrieving key before TTL expiration returns stored value

Input: const c = new MemoryCache(); c.set("user:1", "Alice", 1000, 100); c.get("user:1", 1200)
Expected: null
Description: Retrieving key after TTL expiration returns null

Input: const c = new MemoryCache(); c.set("a", 1, 500, 0); c.set("b", 2, 2000, 0); c.size(1000)
Expected: 1
Description: Size returns count of non-expired entries

---REFERENCE---
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  set(key: string, value: T, ttlMs: number, nowMs: number): void {
    this.store.set(key, {
      value,
      expiresAt: nowMs + ttlMs,
    });
  }

  get(key: string, nowMs: number): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (nowMs >= entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  size(nowMs: number): number {
    let count = 0;
    for (const [key, entry] of this.store.entries()) {
      if (nowMs < entry.expiresAt) {
        count++;
      } else {
        this.store.delete(key);
      }
    }
    return count;
  }
}
`,
  },
  {
    id: 'ts-l3-pagination-bounds',
    label: 'Track 3 (Level 3) - API Pagination Parameters Parser (TypeScript)',
    track: 3,
    level: 3,
    type: 'Build Feature',
    language: 'TypeScript',
    raw: `---METADATA---
track: 3
level: 3
type: Build Feature
topic: Database & SQL Schemas
title: API Pagination Query Parser with Boundary Clamping
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
BUILD

GOAL:
Parse and clamp pagination query parameters (page and limit) into safe database SQL query offset and limit values.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Raw inputs are unvalidated, permitting negative pages or massive limits that can overload the database.
- Expected: Clamps page to >= 1 (default 1) and limit to range [1, 100] (default 20), calculating offset = (page - 1) * limit.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: SQL OFFSET and LIMIT pagination formulas (Search: "sql offset limit pagination formula")
- Syntax: Math.max, Math.min, and Number.parseInt in TypeScript (Search: "javascript math min max clamp")

PRACTICAL TIPS & WATCHOUTS:
- Tip: When page is 1, offset is 0.
- Tip: If input is NaN or negative, use default page (1) and default limit (20).

WHERE TO WORK:
- Edit: src/solution.ts (Target function: parsePagination)

HOW TO APPROACH THIS:
1. Parse page and limit to integers. If invalid, use defaults (page: 1, limit: 20).
2. Clamp page so it is at least 1.
3. Clamp limit so it is between 1 and 100.
4. Calculate offset as (page - 1) * limit.

EDGE CASES TO WATCH:
- Zero or negative page: page = -5 -> clamps to page = 1, offset = 0.
- Extreme limit: limit = 5000 -> clamps to limit = 100.

---FILE: src/solution.ts---
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(rawPage?: unknown, rawLimit?: unknown): PaginationParams {
  // TODO: Clamp page and limit, and compute SQL offset
  return { page: 1, limit: 20, offset: 0 };
}

---TESTS---
Input: parsePagination(2, 25)
Expected: { page: 2, limit: 25, offset: 25 }
Description: Page 2 with limit 25 produces offset 25

Input: parsePagination(-1, 500)
Expected: { page: 1, limit: 100, offset: 0 }
Description: Negative page clamps to 1 and limit over 100 clamps to 100

Input: parsePagination("invalid", undefined)
Expected: { page: 1, limit: 20, offset: 0 }
Description: Invalid inputs fall back to default page 1 and limit 20

---REFERENCE---
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(rawPage?: unknown, rawLimit?: unknown): PaginationParams {
  const parsedPage = typeof rawPage === 'number' ? rawPage : parseInt(String(rawPage), 10);
  const parsedLimit = typeof rawLimit === 'number' ? rawLimit : parseInt(String(rawLimit), 10);

  const safePage = Number.isFinite(parsedPage) && parsedPage >= 1 ? Math.floor(parsedPage) : 1;
  const safeLimit = Number.isFinite(parsedLimit)
    ? Math.max(1, Math.min(100, Math.floor(parsedLimit)))
    : 20;

  const offset = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    offset,
  };
}
`,
  },

  // ==========================================
  // LEVEL 4 (3 Challenges) - State & Security
  // ==========================================
  {
    id: 'ts-l4-timing-safe-compare',
    label: 'Track 4 (Level 4) - Constant-Time String Compare (TypeScript)',
    track: 4,
    level: 4,
    type: 'Security Hardening',
    language: 'TypeScript',
    raw: `---METADATA---
track: 4
level: 4
type: Security Hardening
topic: Data Security & Hardening
title: Constant-Time String Comparison Against Timing Attacks
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
BUILD

GOAL:
Implement a constant-time string comparison function that compares two secret tokens without leaking timing information about matching prefixes.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses standard === which short-circuits on the first mismatched character, allowing attackers to measure execution time.
- Expected: Inspects every byte using XOR bitwise accumulation, ensuring consistent execution duration regardless of match position.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Side-channel timing attacks and constant-time algorithms (Search: "timing attack string comparison crypto")
- Syntax: Bitwise XOR (^) and OR (|) operators in TypeScript (Search: "bitwise xor constant time comparison javascript")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Length differences should still execute comparisons rather than early exiting immediately.
- Tip: Accumulate differences in an integer: diff |= charA ^ charB.

WHERE TO WORK:
- Edit: src/solution.ts (Target functions: timingSafeEqual, verifyToken)

HOW TO APPROACH THIS:
1. Compare character codes across both strings using XOR.
2. Accumulate all differences into a bitwise result.
3. Ensure both equal length and zero difference are required to return true.

EDGE CASES TO WATCH:
- Different lengths: must return false without exposing where the lengths diverge.
- Empty strings: comparing "" and "" returns true.

---FILE: src/solution.ts---
export function timingSafeEqual(a: string, b: string): boolean {
  // TODO: Implement constant-time string comparison using bitwise accumulation
  return a === b;
}

export function verifyToken(expectedToken: string, providedToken: string): boolean {
  if (typeof expectedToken !== 'string' || typeof providedToken !== 'string') {
    return false;
  }
  return timingSafeEqual(expectedToken, providedToken);
}

---TESTS---
Input: timingSafeEqual("secret-token-123", "secret-token-123")
Expected: true
Description: Identical strings return true

Input: timingSafeEqual("secret-token-123", "secret-token-999")
Expected: false
Description: Strings differing at end return false

Input: timingSafeEqual("secret", "secret-longer")
Expected: false
Description: Strings of different lengths return false

---REFERENCE---
export function timingSafeEqual(a: string, b: string): boolean {
  const lenA = a.length;
  const lenB = b.length;

  let mismatch = lenA === lenB ? 0 : 1;
  const compareLen = Math.max(lenA, lenB);

  for (let i = 0; i < compareLen; i++) {
    const codeA = i < lenA ? a.charCodeAt(i) : 0;
    const codeB = i < lenB ? b.charCodeAt(i) : 0;
    mismatch |= codeA ^ codeB;
  }

  return mismatch === 0;
}

export function verifyToken(expectedToken: string, providedToken: string): boolean {
  if (typeof expectedToken !== 'string' || typeof providedToken !== 'string') {
    return false;
  }
  return timingSafeEqual(expectedToken, providedToken);
}
`,
  },
  {
    id: 'ts-l4-token-bucket',
    label: 'Track 5 (Level 4) - Token Bucket Rate Limiter (TypeScript)',
    track: 5,
    level: 4,
    type: 'Build Feature',
    language: 'TypeScript',
    raw: `---METADATA---
track: 5
level: 4
type: Build Feature
topic: Distributed Systems & Workers
title: Token Bucket Rate Limiter with Time Refill
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
BUILD

GOAL:
Implement a Token Bucket algorithm that tracks request capacity and refills tokens over elapsed time based on a fill rate.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Capacity is static or consumes tokens without refilling over time.
- Expected: Calculates tokens added based on elapsed seconds (elapsedSec * refillRatePerSec), caps at maxCapacity, and permits requests only when tokens >= requested.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Token Bucket algorithm for API rate limiting (Search: "token bucket algorithm explained")
- Syntax: TypeScript class state and Math.min for capacity clamping (Search: "token bucket rate limiter typescript")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Remember to update lastRefillTimestampSec whenever refilling.
- Tip: Clamp currentTokens so it never exceeds maxCapacity.

WHERE TO WORK:
- Edit: src/solution.ts (Target methods: consume, getTokens)
- Reference: src/types.ts (RateLimitResult)

HOW TO APPROACH THIS:
1. On each operation, calculate elapsed time since last refill.
2. Add elapsed * refillRatePerSec to tokens, capped at maxCapacity.
3. Check if tokens >= cost. If so, decrement tokens and return { allowed: true }.
4. Otherwise, return { allowed: false, remainingTokens }.

EDGE CASES TO WATCH:
- Burst traffic: Cannot consume more than maxCapacity in a single burst.
- Time moving backward: If nowSec < lastRefill, do not decrement tokens.

---FILE: src/types.ts (readonly)---
export interface RateLimitResult {
  allowed: boolean;
  remainingTokens: number;
}

---FILE: src/solution.ts---
import { RateLimitResult } from './types';

export class TokenBucket {
  private tokens: number;
  private lastRefillSec: number;

  constructor(
    public readonly maxCapacity: number,
    public readonly refillRatePerSec: number,
    initialTimeSec: number
  ) {
    this.tokens = maxCapacity;
    this.lastRefillSec = initialTimeSec;
  }

  consume(tokensRequested: number, nowSec: number): RateLimitResult {
    // TODO: Refill based on elapsed time, check capacity, and deduct tokens
    return { allowed: true, remainingTokens: this.tokens };
  }
}

---TESTS---
Input: const b = new TokenBucket(10, 2, 0); b.consume(5, 0)
Expected: { allowed: true, remainingTokens: 5 }
Description: Consuming tokens within capacity succeeds and decrements count

Input: const b = new TokenBucket(10, 2, 0); b.consume(8, 0); b.consume(5, 0)
Expected: { allowed: false, remainingTokens: 2 }
Description: Consuming more tokens than remaining capacity is rejected

Input: const b = new TokenBucket(10, 2, 0); b.consume(10, 0); b.consume(3, 2)
Expected: { allowed: true, remainingTokens: 1 }
Description: Tokens refill over elapsed time (4 refilled after 2 seconds)

---REFERENCE---
import { RateLimitResult } from './types';

export class TokenBucket {
  private tokens: number;
  private lastRefillSec: number;

  constructor(
    public readonly maxCapacity: number,
    public readonly refillRatePerSec: number,
    initialTimeSec: number
  ) {
    this.tokens = maxCapacity;
    this.lastRefillSec = initialTimeSec;
  }

  private refill(nowSec: number): void {
    if (nowSec <= this.lastRefillSec) return;
    const elapsed = nowSec - this.lastRefillSec;
    const added = elapsed * this.refillRatePerSec;
    this.tokens = Math.min(this.maxCapacity, this.tokens + added);
    this.lastRefillSec = nowSec;
  }

  consume(tokensRequested: number, nowSec: number): RateLimitResult {
    this.refill(nowSec);

    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return {
        allowed: true,
        remainingTokens: Math.floor(this.tokens),
      };
    }

    return {
      allowed: false,
      remainingTokens: Math.floor(this.tokens),
    };
  }
}
`,
  },
  {
    id: 'ts-l4-field-validator-touched',
    label: 'Track 2 (Level 4) - Form Field Touched State Machine (TypeScript)',
    track: 2,
    level: 4,
    type: 'Build Feature',
    language: 'TypeScript',
    raw: `---METADATA---
track: 2
level: 4
type: Build Feature
topic: Frontend UI & Forms
title: Form Field Touched State and Error Visibility Manager
editableLanguage: typescript
editableFiles: src/solution.ts

---TASK---
ACTION:
BUILD

GOAL:
Build an immutable form field state manager that tracks value, touched status, and shows validation errors only after a field has been touched.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Errors are displayed prematurely before the user interacts with the input.
- Expected: updateField updates value and evaluates error, but getVisibleError returns null until touchField is called.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Form touched states and error visibility UX (Search: "form validation touched state pattern")
- Syntax: TypeScript readonly properties and immutable copy (Search: "typescript immutable object update")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Never mutate the original FieldState object; always return a new object with updated properties.
- Tip: When value is corrected, error should become null immediately.

WHERE TO WORK:
- Edit: src/solution.ts (Target functions: createField, updateField, touchField, getVisibleError)

HOW TO APPROACH THIS:
1. Implement createField to return { value, touched: false, error: validate(value) }.
2. In updateField, re-validate the new value and return updated state while preserving touched status.
3. In touchField, return a new state with touched: true.
4. In getVisibleError, return state.error only if state.touched is true.

EDGE CASES TO WATCH:
- Untouched field with bad value: getVisibleError returns null.
- Touched field with valid value: getVisibleError returns null.

---FILE: src/types.ts (readonly)---
export interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

export type ValidatorFn = (value: string) => string | null;

---FILE: src/solution.ts---
import { FieldState, ValidatorFn } from './types';

export function createField(initialValue: string, validator: ValidatorFn): FieldState {
  // TODO: initialize field state
  return { value: initialValue, touched: false, error: null };
}

export function updateField(field: FieldState, newValue: string, validator: ValidatorFn): FieldState {
  // TODO: return new state with updated value and re-validated error
  return field;
}

export function touchField(field: FieldState): FieldState {
  // TODO: mark field as touched
  return field;
}

export function getVisibleError(field: FieldState): string | null {
  // TODO: return error only when touched is true
  return null;
}

---TESTS---
Input: const f = createField("", v => v ? null : "Required"); getVisibleError(f)
Expected: null
Description: Untouched invalid field hides error message

Input: const f = createField("", v => v ? null : "Required"); getVisibleError(touchField(f))
Expected: "Required"
Description: Touched invalid field reveals error message

Input: const f = touchField(createField("", v => v.length >= 3 ? null : "Too short")); getVisibleError(updateField(f, "Valid", v => v.length >= 3 ? null : "Too short"))
Expected: null
Description: Updating touched field with valid input clears error

---REFERENCE---
import { FieldState, ValidatorFn } from './types';

export function createField(initialValue: string, validator: ValidatorFn): FieldState {
  return {
    value: initialValue,
    touched: false,
    error: validator(initialValue),
  };
}

export function updateField(field: FieldState, newValue: string, validator: ValidatorFn): FieldState {
  return {
    ...field,
    value: newValue,
    error: validator(newValue),
  };
}

export function touchField(field: FieldState): FieldState {
  return {
    ...field,
    touched: true,
  };
}

export function getVisibleError(field: FieldState): string | null {
  return field.touched ? field.error : null;
}
`,
  },

  // ==========================================
  // LEVEL 6 (2 Challenges) - Multi-Task & Multi-File
  // ==========================================
  {
    id: 'ts-l6-rbac-route-guard',
    label: 'Track 1 (Level 6) - RBAC Policy Guard & Route Interceptor (TypeScript)',
    track: 1,
    level: 6,
    type: 'Security Hardening',
    language: 'TypeScript',
    raw: `---METADATA---
track: 1
level: 6
type: Security Hardening
topic: Auth, JWT & Sessions
title: RBAC Hierarchical Policy Resolver and Route Guard
editableLanguage: typescript
editableFiles: src/policy.ts, src/route-guard.ts

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file Role-Based Access Control (RBAC) engine that resolves inherited role permissions in policy.ts and enforces route authorization decisions with custom denial codes in route-guard.ts.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Route access is unguarded or checks only direct role strings without considering permission hierarchy or resource ownership.
- Expected: Resolves transitive permissions from role inheritance trees, checks required permissions for route actions, and permits resource owners when configured.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Hierarchical RBAC and resource ownership policies (Search: "hierarchical rbac permissions architecture")
- Syntax: Multi-file TypeScript exports, Sets, and Map lookups (Search: "typescript set union permission resolution")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Avoid infinite loops when resolving role inheritance by tracking visited roles.
- Tip: If a policy has allowOwner: true, check if user.id === resource.ownerId before denying access.

WHERE TO WORK:
- Edit: src/policy.ts (Target functions: resolveUserPermissions, hasPermission)
- Edit: src/route-guard.ts (Target functions: evaluateRouteAccess, createAccessDecision)
- Reference: src/types.ts (Companion roles, permissions, and request context)

HOW TO APPROACH THIS:
1. In src/policy.ts, implement resolveUserPermissions to traverse assigned roles and inherited sub-roles, collecting all permissions into a Set.
2. In src/policy.ts, implement hasPermission to verify if the resolved permissions contain the required permission.
3. In src/route-guard.ts, implement evaluateRouteAccess to check the RoutePolicy against user permissions and resource ownership.
4. Return a structured AccessDecision: { allowed: true } or { allowed: false, reason: 'insufficient_permissions' | 'unauthenticated' }.

EDGE CASES TO WATCH:
- Unauthenticated user: returns allowed: false with reason: "unauthenticated".
- Resource owner override: user lacks permission but is resource owner -> allowed: true.

---FILE: src/types.ts (readonly)---
export type Role = 'admin' | 'editor' | 'viewer';
export type Permission = 'read' | 'write' | 'delete' | 'publish';

export interface UserContext {
  id: string;
  roles: Role[];
}

export interface ResourceContext {
  ownerId: string;
}

export interface RoutePolicy {
  requiredPermission?: Permission;
  allowOwner?: boolean;
}

export type AccessDecision =
  | { allowed: true }
  | { allowed: false; reason: 'unauthenticated' | 'insufficient_permissions' };

---FILE: src/policy.ts---
import { Role, Permission } from './types';

export const ROLE_HIERARCHY: Record<Role, { permissions: Permission[]; inherits?: Role[] }> = {
  viewer: { permissions: ['read'] },
  editor: { permissions: ['write'], inherits: ['viewer'] },
  admin: { permissions: ['delete', 'publish'], inherits: ['editor'] },
};

export function resolveUserPermissions(roles: Role[]): Set<Permission> {
  // TODO: Traverse roles and role inheritance to gather all distinct permissions
  return new Set();
}

export function hasPermission(userPermissions: Set<Permission>, required: Permission): boolean {
  // TODO: Check if required permission is present in set
  return false;
}

---FILE: src/route-guard.ts---
import { UserContext, ResourceContext, RoutePolicy, AccessDecision } from './types';
import { resolveUserPermissions, hasPermission } from './policy';

export function evaluateRouteAccess(
  user: UserContext | null | undefined,
  resource: ResourceContext | null | undefined,
  policy: RoutePolicy
): AccessDecision {
  // TODO: 1. Check if user is present
  // 2. Check resource ownership bypass if policy.allowOwner is true
  // 3. Check resolved permissions against policy.requiredPermission
  return { allowed: false, reason: 'unauthenticated' };
}

---TESTS---
Input: evaluateRouteAccess({ id: "u1", roles: ["admin"] }, null, { requiredPermission: "read" })
Expected: { allowed: true }
Description: Admin inherits viewer read permission and is granted access

Input: evaluateRouteAccess({ id: "u2", roles: ["viewer"] }, null, { requiredPermission: "write" })
Expected: { allowed: false, reason: "insufficient_permissions" }
Description: Viewer lacks write permission and is denied

Input: evaluateRouteAccess({ id: "u3", roles: ["viewer"] }, { ownerId: "u3" }, { requiredPermission: "write", allowOwner: true })
Expected: { allowed: true }
Description: Resource owner bypasses required permission when allowOwner is enabled

Input: evaluateRouteAccess(null, null, { requiredPermission: "read" })
Expected: { allowed: false, reason: "unauthenticated" }
Description: Unauthenticated user is denied with unauthenticated reason

---REFERENCE---
// src/policy.ts
import { Role, Permission } from './types';

export const ROLE_HIERARCHY: Record<Role, { permissions: Permission[]; inherits?: Role[] }> = {
  viewer: { permissions: ['read'] },
  editor: { permissions: ['write'], inherits: ['viewer'] },
  admin: { permissions: ['delete', 'publish'], inherits: ['editor'] },
};

export function resolveUserPermissions(roles: Role[]): Set<Permission> {
  const permissions = new Set<Permission>();
  const visitedRoles = new Set<Role>();

  function collect(role: Role) {
    if (visitedRoles.has(role)) return;
    visitedRoles.add(role);

    const config = ROLE_HIERARCHY[role];
    if (!config) return;

    for (const p of config.permissions) {
      permissions.add(p);
    }
    if (config.inherits) {
      for (const parent of config.inherits) {
        collect(parent);
      }
    }
  }

  for (const r of roles) {
    collect(r);
  }

  return permissions;
}

export function hasPermission(userPermissions: Set<Permission>, required: Permission): boolean {
  return userPermissions.has(required);
}

// src/route-guard.ts
import { UserContext, ResourceContext, RoutePolicy, AccessDecision } from './types';
import { resolveUserPermissions, hasPermission } from './policy';

export function evaluateRouteAccess(
  user: UserContext | null | undefined,
  resource: ResourceContext | null | undefined,
  policy: RoutePolicy
): AccessDecision {
  if (!user) {
    return { allowed: false, reason: 'unauthenticated' };
  }

  if (policy.allowOwner && resource && resource.ownerId === user.id) {
    return { allowed: true };
  }

  if (policy.requiredPermission) {
    const permissions = resolveUserPermissions(user.roles);
    if (!hasPermission(permissions, policy.requiredPermission)) {
      return { allowed: false, reason: 'insufficient_permissions' };
    }
  }

  return { allowed: true };
}
`,
  },
  {
    id: 'ts-l6-optimistic-lock-store',
    label: 'Track 2 (Level 6) - Optimistic Locking Document Store (TypeScript)',
    track: 2,
    level: 6,
    type: 'Build Feature',
    language: 'TypeScript',
    raw: `---METADATA---
track: 2
level: 6
type: Build Feature
topic: State & Async Race Conditions
title: Optimistic Locking Store with Conflict Resolution
editableLanguage: typescript
editableFiles: src/versioned-store.ts, src/mutation-coordinator.ts

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file optimistic concurrency store where updates check document version tags and automatic rollback is triggered when concurrent mutations conflict.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Last write wins, silently overwriting concurrent updates and losing data.
- Expected: Verifies expectedVersion === current.version before applying updates and increments version; rejects and triggers rollback on conflict.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Optimistic Concurrency Control (OCC) and version vectors (Search: "optimistic concurrency control version field")
- Syntax: Immutable data updates and transaction rollback coordination (Search: "optimistic locking transaction rollback pattern")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Always increment version by 1 on every successful mutation.
- Tip: In mutation-coordinator.ts, if the store update throws or fails, invoke rollbackHandler with original state.

WHERE TO WORK:
- Edit: src/versioned-store.ts (Target methods: get, updateWithVersion, insert)
- Edit: src/mutation-coordinator.ts (Target function: executeOptimisticMutation)
- Reference: src/models.ts (Document and MutationResult interfaces)

HOW TO APPROACH THIS:
1. In src/versioned-store.ts, check if the existing document's version matches expectedVersion.
2. If matched, apply new data, bump version, and persist.
3. If mismatched, return { success: false, conflict: true }.
4. In src/mutation-coordinator.ts, execute the update and catch conflicts, recording audit metrics.

EDGE CASES TO WATCH:
- Document not found: returns { success: false, notFound: true }.
- Version mismatch: returns { success: false, conflict: true, currentVersion }.

---FILE: src/models.ts (readonly)---
export interface VersionedDoc {
  id: string;
  version: number;
  data: Record<string, unknown>;
}

export type MutationOutcome =
  | { success: true; doc: VersionedDoc }
  | { success: false; reason: 'conflict' | 'not_found'; currentVersion?: number };

---FILE: src/versioned-store.ts---
import { VersionedDoc, MutationOutcome } from './models';

export class VersionedStore {
  private docs = new Map<string, VersionedDoc>();

  insert(doc: VersionedDoc): void {
    this.docs.set(doc.id, { ...doc });
  }

  get(id: string): VersionedDoc | null {
    const doc = this.docs.get(id);
    return doc ? { ...doc } : null;
  }

  updateWithVersion(id: string, expectedVersion: number, newData: Record<string, unknown>): MutationOutcome {
    // TODO: Verify expectedVersion matches current version, increment version, and save
    return { success: false, reason: 'not_found' };
  }
}

---FILE: src/mutation-coordinator.ts---
import { VersionedStore } from './versioned-store';
import { MutationOutcome, VersionedDoc } from './models';

export function executeOptimisticMutation(
  store: VersionedStore,
  id: string,
  expectedVersion: number,
  newData: Record<string, unknown>,
  onConflict?: (currentDoc: VersionedDoc) => void
): MutationOutcome {
  // TODO: Execute update, call onConflict callback if conflict occurs, return outcome
  return store.updateWithVersion(id, expectedVersion, newData);
}

---TESTS---
Input: const s = new VersionedStore(); s.insert({ id: "doc1", version: 1, data: { name: "A" } }); s.updateWithVersion("doc1", 1, { name: "B" })
Expected: { success: true, doc: { id: "doc1", version: 2, data: { name: "B" } } }
Description: Matching version successfully updates document and increments version to 2

Input: const s = new VersionedStore(); s.insert({ id: "doc1", version: 2, data: { name: "A" } }); s.updateWithVersion("doc1", 1, { name: "C" })
Expected: { success: false, reason: "conflict", currentVersion: 2 }
Description: Stale version 1 on version 2 document is rejected with conflict reason

Input: const s = new VersionedStore(); s.updateWithVersion("missing", 1, { name: "X" })
Expected: { success: false, reason: "not_found" }
Description: Non-existent document ID returns not_found

---REFERENCE---
// src/versioned-store.ts
import { VersionedDoc, MutationOutcome } from './models';

export class VersionedStore {
  private docs = new Map<string, VersionedDoc>();

  insert(doc: VersionedDoc): void {
    this.docs.set(doc.id, { ...doc });
  }

  get(id: string): VersionedDoc | null {
    const doc = this.docs.get(id);
    return doc ? { ...doc } : null;
  }

  updateWithVersion(id: string, expectedVersion: number, newData: Record<string, unknown>): MutationOutcome {
    const existing = this.docs.get(id);
    if (!existing) {
      return { success: false, reason: 'not_found' };
    }

    if (existing.version !== expectedVersion) {
      return {
        success: false,
        reason: 'conflict',
        currentVersion: existing.version,
      };
    }

    const updated: VersionedDoc = {
      id,
      version: existing.version + 1,
      data: { ...existing.data, ...newData },
    };

    this.docs.set(id, updated);
    return { success: true, doc: { ...updated } };
  }
}

// src/mutation-coordinator.ts
import { VersionedStore } from './versioned-store';
import { MutationOutcome, VersionedDoc } from './models';

export function executeOptimisticMutation(
  store: VersionedStore,
  id: string,
  expectedVersion: number,
  newData: Record<string, unknown>,
  onConflict?: (currentDoc: VersionedDoc) => void
): MutationOutcome {
  const result = store.updateWithVersion(id, expectedVersion, newData);

  if (!result.success && result.reason === 'conflict' && onConflict) {
    const latest = store.get(id);
    if (latest) {
      onConflict(latest);
    }
  }

  return result;
}
`,
  },

  // ==========================================
  // LEVEL 10 (2 Challenges) - Scale & Concurrency
  // ==========================================
  {
    id: 'ts-l10-idempotent-webhook-dispatcher',
    label: 'Track 5 (Level 10) - Idempotent Webhook Event Dispatcher (TypeScript)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'TypeScript',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Idempotent Webhook Dispatcher with Lease Locks and Deduplication
editableLanguage: typescript
editableFiles: src/idempotency-registry.ts, src/event-pipeline.ts

---TASK---
ACTION:
BUILD

GOAL:
Build a production-grade distributed webhook delivery engine across idempotency-registry.ts and event-pipeline.ts that prevents duplicate executions, handles concurrency leases, and records delivery statuses.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Incoming webhook retries execute handlers multiple times, creating duplicate database writes or double billing.
- Expected: Deduplicates events by eventId or SHA-256 payload digest, uses lease locks with expiration to guard in-flight processing, and returns cached results on duplicate delivery.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Idempotency keys, distributed leasing, and replay attacks (Search: "stripe webhook idempotency key pattern")
- Syntax: Multi-file architecture and async state machine pipelines (Search: "typescript idempotency store lease")

PRACTICAL TIPS & WATCHOUTS:
- Tip: If a lock lease is expired (nowMs > lease.expiresAtMs), consider the lease abandoned and allow re-acquisition.
- Tip: When execution fails, release the lock so subsequent retries can proceed immediately.

WHERE TO WORK:
- Edit: src/idempotency-registry.ts (Target methods: acquireLease, markCompleted, releaseLease, getStatus)
- Edit: src/event-pipeline.ts (Target function: processWebhookEvent)
- Reference: src/types.ts (WebhookEvent, DispatchResult interfaces)

HOW TO APPROACH THIS:
1. In src/idempotency-registry.ts, check if the event is already marked COMPLETED. If so, return cached result.
2. Check if a current active lease exists. If active, return IN_FLIGHT rejection.
3. If unleased or expired, acquire lease and execute handler in src/event-pipeline.ts.
4. On success, mark COMPLETED with result. On error, release lease.

EDGE CASES TO WATCH:
- Expired in-flight lease: allows recovery and re-processing.
- Concurrent duplicate: immediate rejection without invoking the handler twice.

---FILE: src/types.ts (readonly)---
export type EventStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface WebhookEvent {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
}

export interface DispatchResult {
  status: 'PROCESSED' | 'DUPLICATE' | 'LOCKED';
  eventId: string;
  response?: unknown;
}

---FILE: src/idempotency-registry.ts---
import { EventStatus } from './types';

interface LeaseRecord {
  status: EventStatus;
  expiresAtMs: number;
  result?: unknown;
}

export class IdempotencyRegistry {
  private records = new Map<string, LeaseRecord>();

  acquireLease(eventId: string, leaseDurationMs: number, nowMs: number): boolean {
    // TODO: Return true if lease acquired; false if already processing or completed
    return false;
  }

  markCompleted(eventId: string, result: unknown): void {
    // TODO: Set status to COMPLETED and store result
  }

  releaseLease(eventId: string): void {
    // TODO: Delete or reset lease on failure
  }

  getRecord(eventId: string): LeaseRecord | null {
    return this.records.get(eventId) || null;
  }
}

---FILE: src/event-pipeline.ts---
import { WebhookEvent, DispatchResult } from './types';
import { IdempotencyRegistry } from './idempotency-registry';

export async function processWebhookEvent(
  registry: IdempotencyRegistry,
  event: WebhookEvent,
  nowMs: number,
  handler: (e: WebhookEvent) => Promise<unknown>
): Promise<DispatchResult> {
  // TODO: 1. Check existing record for completion
  // 2. Try acquire lease
  // 3. Execute handler, mark completed, or release on error
  return { status: 'LOCKED', eventId: event.id };
}

---TESTS---
Input: const reg = new IdempotencyRegistry(); await processWebhookEvent(reg, { id: "evt_1", eventType: "payment", payload: {} }, 1000, async () => ({ paid: true }))
Expected: { status: "PROCESSED", eventId: "evt_1", response: { paid: true } }
Description: First event delivery executes handler and records completion

Input: const reg = new IdempotencyRegistry(); await processWebhookEvent(reg, { id: "evt_1", eventType: "payment", payload: {} }, 1000, async () => ({ paid: true })); await processWebhookEvent(reg, { id: "evt_1", eventType: "payment", payload: {} }, 1100, async () => ({ paid: false }))
Expected: { status: "DUPLICATE", eventId: "evt_1", response: { paid: true } }
Description: Duplicate event returns cached response without re-executing handler

Input: const reg = new IdempotencyRegistry(); reg.acquireLease("evt_2", 5000, 1000); await processWebhookEvent(reg, { id: "evt_2", eventType: "payment", payload: {} }, 2000, async () => ({}))
Expected: { status: "LOCKED", eventId: "evt_2" }
Description: Concurrent request during active lease returns LOCKED status

---REFERENCE---
// src/idempotency-registry.ts
import { EventStatus } from './types';

interface LeaseRecord {
  status: EventStatus;
  expiresAtMs: number;
  result?: unknown;
}

export class IdempotencyRegistry {
  private records = new Map<string, LeaseRecord>();

  acquireLease(eventId: string, leaseDurationMs: number, nowMs: number): boolean {
    const existing = this.records.get(eventId);

    if (existing) {
      if (existing.status === 'COMPLETED') return false;
      if (existing.status === 'PROCESSING' && nowMs < existing.expiresAtMs) {
        return false;
      }
    }

    this.records.set(eventId, {
      status: 'PROCESSING',
      expiresAtMs: nowMs + leaseDurationMs,
    });
    return true;
  }

  markCompleted(eventId: string, result: unknown): void {
    this.records.set(eventId, {
      status: 'COMPLETED',
      expiresAtMs: Infinity,
      result,
    });
  }

  releaseLease(eventId: string): void {
    const existing = this.records.get(eventId);
    if (existing && existing.status !== 'COMPLETED') {
      this.records.delete(eventId);
    }
  }

  getRecord(eventId: string): LeaseRecord | null {
    return this.records.get(eventId) || null;
  }
}

// src/event-pipeline.ts
import { WebhookEvent, DispatchResult } from './types';
import { IdempotencyRegistry } from './idempotency-registry';

export async function processWebhookEvent(
  registry: IdempotencyRegistry,
  event: WebhookEvent,
  nowMs: number,
  handler: (e: WebhookEvent) => Promise<unknown>
): Promise<DispatchResult> {
  const existing = registry.getRecord(event.id);
  if (existing && existing.status === 'COMPLETED') {
    return {
      status: 'DUPLICATE',
      eventId: event.id,
      response: existing.result,
    };
  }

  const acquired = registry.acquireLease(event.id, 5000, nowMs);
  if (!acquired) {
    return { status: 'LOCKED', eventId: event.id };
  }

  try {
    const res = await handler(event);
    registry.markCompleted(event.id, res);
    return {
      status: 'PROCESSED',
      eventId: event.id,
      response: res,
    };
  } catch (err) {
    registry.releaseLease(event.id);
    throw err;
  }
}
`,
  },
  {
    id: 'ts-l10-distributed-sliding-window-limiter',
    label: 'Track 5 (Level 10) - Sliding Window Counter with Drift Tolerance (TypeScript)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'TypeScript',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Sliding-Window Rate Limiter with Sub-Second Slicing and Drift Tolerance
editableLanguage: typescript
editableFiles: src/sub-window-counter.ts, src/traffic-gate.ts

---TASK---
ACTION:
BUILD

GOAL:
Implement a high-throughput sliding-window rate limiter divided into granular sub-windows that tracks hit counters, evicts expired slices, and compensates for clock drift.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses fixed window counters that allow 2x burst traffic across window boundaries.
- Expected: Slices window into multiple sub-windows (e.g. 10 slices of 1s in a 10s window), dynamically summing hits within (nowMs - windowMs, nowMs] and rejecting traffic exceeding maxHits.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Sliding window counter algorithm vs fixed window (Search: "sliding window counter rate limiting algorithm")
- Syntax: Modular arithmetic, Map pruning, and distributed clock tolerance (Search: "sliding window log counter typescript")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Sub-window key can be Math.floor(timestampMs / subWindowSizeMs).
- Tip: Delete sub-windows whose timestamp <= nowMs - windowMs to prevent memory leak.

WHERE TO WORK:
- Edit: src/sub-window-counter.ts (Target methods: recordHit, getWindowCount, prune)
- Edit: src/traffic-gate.ts (Target function: checkTrafficLimit)
- Reference: src/clock.ts (RateLimitHeaders and GateConfig)

HOW TO APPROACH THIS:
1. In src/sub-window-counter.ts, map sub-window keys to integer hit counts.
2. In recordHit, increment the count for current sub-window.
3. In getWindowCount, aggregate counts from all active sub-windows within the sliding window.
4. In src/traffic-gate.ts, check if total count exceeds maxLimit. Return decision and headers.

EDGE CASES TO WATCH:
- Clock drift: Small negative timestamp variations within 100ms tolerance must be handled safely.
- Boundary transitions: Smoothly transitions traffic without doubling rate at boundary.

---FILE: src/clock.ts (readonly)---
export interface GateConfig {
  windowMs: number;
  subWindowMs: number;
  maxRequests: number;
}

export interface GateDecision {
  allowed: boolean;
  currentCount: number;
  resetMs: number;
}

---FILE: src/sub-window-counter.ts---
export class SubWindowCounter {
  private buckets = new Map<number, number>();

  recordHit(timestampMs: number, subWindowMs: number): void {
    // TODO: Calculate sub-window bucket key and increment count
  }

  getWindowCount(nowMs: number, windowMs: number, subWindowMs: number): number {
    // TODO: Sum counts of all buckets falling within [nowMs - windowMs, nowMs]
    return 0;
  }

  pruneExpired(nowMs: number, windowMs: number, subWindowMs: number): void {
    // TODO: Remove buckets older than nowMs - windowMs
  }
}

---FILE: src/traffic-gate.ts---
import { GateConfig, GateDecision } from './clock';
import { SubWindowCounter } from './sub-window-counter';

export function checkTrafficLimit(
  counter: SubWindowCounter,
  config: GateConfig,
  nowMs: number
): GateDecision {
  // TODO: 1. Prune expired buckets
  // 2. Query current window count
  // 3. If under limit, record hit and allow; otherwise reject
  return { allowed: true, currentCount: 0, resetMs: 0 };
}

---TESTS---
Input: const c = new SubWindowCounter(); checkTrafficLimit(c, { windowMs: 10000, subWindowMs: 1000, maxRequests: 5 }, 1000)
Expected: { allowed: true, currentCount: 1, resetMs: 10000 }
Description: First request within window is permitted and incremented

Input: const c = new SubWindowCounter(); for (let i = 0; i < 5; i++) checkTrafficLimit(c, { windowMs: 10000, subWindowMs: 1000, maxRequests: 5 }, 1000); checkTrafficLimit(c, { windowMs: 10000, subWindowMs: 1000, maxRequests: 5 }, 1000)
Expected: { allowed: false, currentCount: 5, resetMs: 10000 }
Description: Request exceeding 5 requests within sliding window is rejected

Input: const c = new SubWindowCounter(); for (let i = 0; i < 5; i++) checkTrafficLimit(c, { windowMs: 10000, subWindowMs: 1000, maxRequests: 5 }, 1000); checkTrafficLimit(c, { windowMs: 10000, subWindowMs: 1000, maxRequests: 5 }, 12000)
Expected: { allowed: true, currentCount: 1, resetMs: 10000 }
Description: Requests in past window expire, permitting new requests

---REFERENCE---
// src/sub-window-counter.ts
export class SubWindowCounter {
  private buckets = new Map<number, number>();

  recordHit(timestampMs: number, subWindowMs: number): void {
    const key = Math.floor(timestampMs / subWindowMs);
    this.buckets.set(key, (this.buckets.get(key) || 0) + 1);
  }

  getWindowCount(nowMs: number, windowMs: number, subWindowMs: number): number {
    this.pruneExpired(nowMs, windowMs, subWindowMs);
    let total = 0;
    const minTime = nowMs - windowMs;
    const minKey = Math.floor(minTime / subWindowMs);
    const maxKey = Math.floor(nowMs / subWindowMs);

    for (let k = minKey; k <= maxKey; k++) {
      total += this.buckets.get(k) || 0;
    }
    return total;
  }

  pruneExpired(nowMs: number, windowMs: number, subWindowMs: number): void {
    const minTime = nowMs - windowMs;
    const minKey = Math.floor(minTime / subWindowMs);

    for (const key of this.buckets.keys()) {
      if (key < minKey) {
        this.buckets.delete(key);
      }
    }
  }
}

// src/traffic-gate.ts
import { GateConfig, GateDecision } from './clock';
import { SubWindowCounter } from './sub-window-counter';

export function checkTrafficLimit(
  counter: SubWindowCounter,
  config: GateConfig,
  nowMs: number
): GateDecision {
  counter.pruneExpired(nowMs, config.windowMs, config.subWindowMs);
  const currentCount = counter.getWindowCount(nowMs, config.windowMs, config.subWindowMs);

  if (currentCount >= config.maxRequests) {
    return {
      allowed: false,
      currentCount,
      resetMs: config.windowMs,
    };
  }

  counter.recordHit(nowMs, config.subWindowMs);
  return {
    allowed: true,
    currentCount: currentCount + 1,
    resetMs: config.windowMs,
  };
}
`,
  },
];
