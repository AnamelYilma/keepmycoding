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
GOAL:
Fix the token verification bug so expired tokens are rejected and valid active tokens are permitted.

WHERE TO WORK:
- Edit: src/token-validator.ts (inspect the isTokenExpired function)
- Reference: src/types.ts (readonly AuthResult interface)

CURRENT VS EXPECTED BEHAVIOR:
- Current: The expiration condition is inverted (token.exp >= currentTimestampSec), treating expired tokens as valid and locking out active users.
- Expected: Any token whose expiration timestamp is less than or equal to the current timestamp must return true for isTokenExpired.

HOW TO APPROACH THIS:
1. Compare token.exp with currentTimestampSec. Remember that a smaller timestamp represents an earlier time in the past.
2. Determine what should happen when token.exp is strictly less than the current time.
3. Determine what should happen when token.exp is exactly equal to currentTimestampSec (tokens expiring right now are expired).
4. Update the comparison in isTokenExpired without altering function signatures or return types.

EDGE CASES TO WATCH:
- Exact boundary: When token.exp === currentTimestampSec, the token has reached its expiration limit and must be considered expired.
- Active token: When token.exp > currentTimestampSec, the token is still active and valid.

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
  {
    id: 'track2-tabs-state',
    label: 'Track 2 (Level 2) - Frontend UI Accessible Tabs (TypeScript)',
    track: 2,
    level: 2,
    type: 'Build UI',
    language: 'TypeScript',
    raw: `---METADATA---
track: 2
level: 2
type: Build UI
editableLanguage: typescript
editableFiles: src/tabs-model.ts

---TASK---
Implement tab state transition logic for an accessible tabs component.
When navigateTabs is called with 'next' or 'prev', wrap around the tab list indices.
Ensure disabled tabs are skipped during keyboard navigation.

---FILE: src/tabs-model.ts---
export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export function getNextActiveIndex(tabs: TabItem[], currentIndex: number, direction: 'next' | 'prev'): number {
  if (tabs.length === 0) return -1;
  const step = direction === 'next' ? 1 : -1;
  let idx = currentIndex;
  for (let i = 0; i < tabs.length; i++) {
    idx = (idx + step + tabs.length) % tabs.length;
    if (!tabs[idx].disabled) {
      return idx;
    }
  }
  return currentIndex;
}

---TESTS---
Input: tabs: [{id:'a'}, {id:'b', disabled:true}, {id:'c'}], currentIndex: 0, direction: 'next'
Expected: 2
Description: Skips disabled tab 'b' and selects tab 'c'

Input: tabs: [{id:'a'}, {id:'b'}], currentIndex: 1, direction: 'next'
Expected: 0
Description: Wraps around from last tab back to first tab

---REFERENCE---
export function getNextActiveIndex(tabs: TabItem[], currentIndex: number, direction: 'next' | 'prev'): number {
  if (tabs.length === 0) return -1;
  const step = direction === 'next' ? 1 : -1;
  let idx = currentIndex;
  for (let i = 0; i < tabs.length; i++) {
    idx = (idx + step + tabs.length) % tabs.length;
    if (!tabs[idx].disabled) {
      return idx;
    }
  }
  return currentIndex;
}
`,
  },
  {
    id: 'track3-login-validator',
    label: 'Track 3 (Level 2) - Frontend Login & Auth Form Validator (TypeScript)',
    track: 3,
    level: 2,
    type: 'Frontend Login',
    language: 'TypeScript',
    raw: `---METADATA---
track: 3
level: 2
type: Frontend Login
editableLanguage: typescript
editableFiles: src/login-validator.ts

---TASK---
Validate user login credentials before dispatching authentication requests.
Return valid: false with specific error message if email does not contain '@' or if password is under 8 characters.

---FILE: src/login-validator.ts---
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateLoginInput(email: string, password: string): ValidationResult {
  if (!email || !email.includes('@') || email.trim().length < 5) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  return { valid: true };
}

---TESTS---
Input: 'user@example.com', 'short'
Expected: valid: false, error: 'Password must be at least 8 characters long'
Description: Rejects short password

Input: 'admin@keepcoding.dev', 'securePass123'
Expected: valid: true
Description: Accepts valid email and compliant password

---REFERENCE---
export function validateLoginInput(email: string, password: string): ValidationResult {
  if (!email || !email.includes('@') || email.trim().length < 5) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  return { valid: true };
}
`,
  },
  {
    id: 'track5-discount-rules',
    label: 'Track 5 (Level 3) - Backend Business Logic Engine (TypeScript)',
    track: 5,
    level: 3,
    type: 'Backend Logic',
    language: 'TypeScript',
    raw: `---METADATA---
track: 5
level: 3
type: Backend Logic
editableLanguage: typescript
editableFiles: src/discount-engine.ts

---TASK---
Calculate net order price applying promotional discount percentages.
Cap maximum discount at 50% of subtotal. Add shipping of 10 if order after discount is under 50.

---FILE: src/discount-engine.ts---
export interface OrderQuote {
  subtotal: number;
  discountAmount: number;
  shipping: number;
  total: number;
}

export function calculateOrderQuote(subtotal: number, discountPercent: number): OrderQuote {
  const cappedPercent = Math.min(Math.max(0, discountPercent), 50);
  const discountAmount = Math.round((subtotal * cappedPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = discountedSubtotal < 50 ? 10 : 0;
  return {
    subtotal,
    discountAmount,
    shipping,
    total: discountedSubtotal + shipping,
  };
}

---TESTS---
Input: subtotal: 100, discountPercent: 20
Expected: total: 80, discountAmount: 20, shipping: 0
Description: Standard 20% discount with free shipping over 50

Input: subtotal: 40, discountPercent: 10
Expected: total: 46, discountAmount: 4, shipping: 10
Description: Subtotal under 50 triggers shipping fee

---REFERENCE---
export function calculateOrderQuote(subtotal: number, discountPercent: number): OrderQuote {
  const cappedPercent = Math.min(Math.max(0, discountPercent), 50);
  const discountAmount = Math.round((subtotal * cappedPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = discountedSubtotal < 50 ? 10 : 0;
  return {
    subtotal,
    discountAmount,
    shipping,
    total: discountedSubtotal + shipping,
  };
}
`,
  },
  {
    id: 'track6-cursor-pagination',
    label: 'Track 6 (Level 3) - API Cursor Pagination Builder (TypeScript)',
    track: 6,
    level: 3,
    type: 'API & Persistence',
    language: 'TypeScript',
    raw: `---METADATA---
track: 6
level: 3
type: API & Persistence
editableLanguage: typescript
editableFiles: src/cursor-paginator.ts

---TASK---
Implement a pagination helper that takes an array of items with id properties, a cursor string, and a limit.
Return the sliced items, nextCursor (id of the last item if more exist), and hasMore boolean.

---FILE: src/cursor-paginator.ts---
export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function paginateByCursor<T extends { id: string }>(
  allSortedItems: T[],
  cursor: string | null,
  limit: number
): PaginatedResult<T> {
  let startIndex = 0;
  if (cursor) {
    const foundIdx = allSortedItems.findIndex((item) => item.id === cursor);
    if (foundIdx !== -1) {
      startIndex = foundIdx + 1;
    }
  }
  const slice = allSortedItems.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < allSortedItems.length;
  const nextCursor = hasMore && slice.length > 0 ? slice[slice.length - 1].id : null;
  return {
    items: slice,
    nextCursor,
    hasMore,
  };
}

---TESTS---
Input: items: [{id:'1'}, {id:'2'}, {id:'3'}], cursor: null, limit: 2
Expected: items count 2, hasMore: true, nextCursor: '2'
Description: First page returns first 2 items with nextCursor

Input: items: [{id:'1'}, {id:'2'}, {id:'3'}], cursor: '2', limit: 2
Expected: items count 1, hasMore: false, nextCursor: null
Description: Last page returns remaining item with null nextCursor

---REFERENCE---
export function paginateByCursor<T extends { id: string }>(
  allSortedItems: T[],
  cursor: string | null,
  limit: number
): PaginatedResult<T> {
  let startIndex = 0;
  if (cursor) {
    const foundIdx = allSortedItems.findIndex((item) => item.id === cursor);
    if (foundIdx !== -1) {
      startIndex = foundIdx + 1;
    }
  }
  const slice = allSortedItems.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < allSortedItems.length;
  const nextCursor = hasMore && slice.length > 0 ? slice[slice.length - 1].id : null;
  return {
    items: slice,
    nextCursor,
    hasMore,
  };
}
`,
  },
  {
    id: 'track9-cli-parser',
    label: 'Track 9 (Level 3) - CLI Key-Value Flag Parser (TypeScript)',
    track: 9,
    level: 3,
    type: 'System / CLI Tooling',
    language: 'TypeScript',
    raw: `---METADATA---
track: 9
level: 3
type: System / CLI Tooling
editableLanguage: typescript
editableFiles: src/cli-parser.ts

---TASK---
Parse command-line argument strings formatted as --key=value, --flag (boolean true), or positional arguments.
Return an object separating parsed flags from positional arguments.

---FILE: src/cli-parser.ts---
export interface ParsedArgs {
  flags: Record<string, string | boolean>;
  positionals: string[];
}

export function parseCliArgs(args: string[]): ParsedArgs {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const trimmed = arg.slice(2);
      if (trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        flags[k] = v.join('=');
      } else {
        flags[trimmed] = true;
      }
    } else {
      positionals.push(arg);
    }
  }
  return { flags, positionals };
}

---TESTS---
Input: ['build', '--out=dist', '--minify']
Expected: positionals: ['build'], flags: { out: 'dist', minify: true }
Description: Parses command and mixed flags

Input: ['--debug', 'server.ts']
Expected: positionals: ['server.ts'], flags: { debug: true }
Description: Parses boolean flag and file positional

---REFERENCE---
export function parseCliArgs(args: string[]): ParsedArgs {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const trimmed = arg.slice(2);
      if (trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        flags[k] = v.join('=');
      } else {
        flags[trimmed] = true;
      }
    } else {
      positionals.push(arg);
    }
  }
  return { flags, positionals };
}
`,
  },
];
