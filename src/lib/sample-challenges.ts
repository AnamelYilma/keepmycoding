// KeepCoding - Built-in Sample Challenges for Instant Testing

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
  {
    id: 'track1-jwt-fix',
    label: 'Track 1 (Level 2) - JWT Expiration Fix (TypeScript)',
    track: 1,
    level: 2,
    type: 'Fix',
    language: 'TypeScript',
    raw: `---METADATA---
track: 1
level: 2
type: Fix
editableLanguage: typescript
editableFiles: src/token-validator.ts

---TASK---
Fix the token verification bug where expired tokens are accepted because the timestamp comparison is reversed.
Ensure tokens expiring exactly now or in the past return false.

---FILE: src/token-validator.ts---
export interface TokenPayload {
  userId: string;
  exp: number; // Unix timestamp in seconds
  role: string;
}

export function isTokenExpired(token: TokenPayload, currentTimestampSec: number): boolean {
  // BUG: The developer inverted the condition, accepting expired tokens!
  return token.exp >= currentTimestampSec;
}

export function canAccessAdmin(token: TokenPayload, nowSec: number): boolean {
  if (isTokenExpired(token, nowSec)) {
    return false;
  }
  return token.role === 'admin';
}

---FILE: src/types.ts (readonly)---
export interface AuthResult {
  valid: boolean;
  reason?: string;
}

---TESTS---
Input: token with exp: 1000, now: 1500
Expected: isTokenExpired should return true (token expired)
Description: Token in the past is expired

Input: token with exp: 2000, now: 1500
Expected: isTokenExpired should return false (token still valid)
Description: Token in future is active

---REFERENCE---
export function isTokenExpired(token: TokenPayload, currentTimestampSec: number): boolean {
  return token.exp <= currentTimestampSec;
}
`,
  },
  {
    id: 'track2-debounce-state',
    label: 'Track 2 (Level 3) - Debounce State Hook (TypeScript)',
    track: 2,
    level: 3,
    type: 'Write',
    language: 'TypeScript',
    raw: `---METADATA---
track: 2
level: 3
type: Write
editableLanguage: typescript
editableFiles: src/debounce.ts

---TASK---
Write a lightweight debounce utility function that cancels pending calls if triggered before the delay expires.
Return a function with an additional .cancel() method to immediately cancel any pending timer.

---FILE: src/debounce.ts---
export type AnyFunction = (...args: any[]) => any;

export interface DebouncedFunction<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export function debounce<T extends AnyFunction>(fn: T, delayMs: number): DebouncedFunction<T> {
  // Implement debouncing logic with cancel support
  let timer: any = null;

  const debounced = (...args: Parameters<T>) => {
    // Write your implementation here
  };

  debounced.cancel = () => {
    // Write cancellation here
  };

  return debounced;
}

---TESTS---
Input: debounce(callback, 100) called 3 times in 20ms
Expected: callback executed exactly once after 100ms with last arguments
Description: Multiple rapid calls are coalesced into a single delayed call

Input: debounce(callback, 100) followed by .cancel()
Expected: callback never executes
Description: Calling cancel aborts scheduled execution

---REFERENCE---
export function debounce<T extends AnyFunction>(fn: T, delayMs: number): DebouncedFunction<T> {
  let timer: any = null;
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delayMs);
  };
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return debounced;
}
`,
  },
  {
    id: 'track4-timing-attack',
    label: 'Track 4 (Level 4) - Constant-Time String Compare (TypeScript)',
    track: 4,
    level: 4,
    type: 'Fix',
    language: 'TypeScript',
    raw: `---METADATA---
track: 4
level: 4
type: Fix
editableLanguage: typescript
editableFiles: src/timing-safe.ts

---TASK---
Fix the signature comparison to prevent timing attacks.
Naive comparison (a === b) early-exits on the first mismatched byte, leaking matching length via execution time.
Implement constant-time comparison that iterates through all bytes regardless of mismatches.

---FILE: src/timing-safe.ts---
export function timingSafeEqual(a: string, b: string): boolean {
  // BUG: Naive equality leaks timing information based on matching prefix length
  if (a.length !== b.length) {
    return false;
  }
  return a === b;
}

---TESTS---
Input: 'secret-hash-123', 'secret-hash-123'
Expected: true
Description: Identical strings return true in constant time

Input: 'secret-hash-123', 'wrong-token-999'
Expected: false
Description: Different strings return false without early-exit leaks

---REFERENCE---
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
`,
  },
];
