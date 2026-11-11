import { SampleChallengeOption } from '../types';

export const PYTHON_CHALLENGES: SampleChallengeOption[] = [
  // ==========================================
  // LEVEL 1 (2 Challenges) - Foundations
  // ==========================================
  {
    id: 'py-l1-input-sanitizer',
    label: 'Track 1 (Level 1) - Input Sanitizer & Slugifier (Python)',
    track: 1,
    level: 1,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 1
level: 1
type: Build Feature
topic: Backend API & Middleware
title: Input Sanitizer and URL Slugifier
editableLanguage: python
editableFiles: solution.py

---TASK---
ACTION:
BUILD

GOAL:
Build a slugifier function that normalizes a string into a clean, URL-safe slug by lowercasing, trimming, removing non-alphanumeric characters, and replacing whitespace with single hyphens.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The slugify function returns the raw string unchanged, leaving whitespace, uppercase letters, and special characters.
- Expected: Returns a lowercase string with spaces and underscores replaced by single hyphens, stripped of punctuation, and trimmed.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: URL slug normalization and regex sanitization (Search: "url slugify regex python")
- Syntax: Python re.sub, str.strip, and str.lower (Search: "python string regex replace hyphens")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Multiple consecutive spaces should collapse into a single hyphen, not multiple hyphens.
- Tip: Remove leading and trailing hyphens from the final slug.

WHERE TO WORK:
- Edit: solution.py (Target function: slugify)

HOW TO APPROACH THIS:
1. Trim leading and trailing whitespace from the input and convert to lowercase.
2. Replace any non-alphanumeric characters (except spaces, underscores, and hyphens) with empty strings.
3. Replace one or more consecutive spaces or underscores with a single hyphen.
4. Strip any hyphens from the beginning or end of the result.

EDGE CASES TO WATCH:
- Multiple spaces: "Hello   World" -> "hello-world"
- Leading/trailing symbols: "---Keep Coding---" -> "keep-coding"
- Special characters: "What's New in 2026!?" -> "whats-new-in-2026"

---FILE: solution.py---
import re

def slugify(text: str) -> str:
    # TODO: Lowercase, sanitize, collapse spaces to hyphens, and strip boundary hyphens.
    return text

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
import re

def slugify(text: str) -> str:
    cleaned = text.lower().strip()
    cleaned = re.sub(r'[^a-z0-9\\s_-]', '', cleaned)
    cleaned = re.sub(r'[\\s_]+', '-', cleaned)
    return cleaned.strip('-')
`,
  },
  {
    id: 'py-l1-expiry-guard',
    label: 'Track 1 (Level 1) - Token Expiry Timestamp Guard (Python)',
    track: 1,
    level: 1,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 1
level: 1
type: Build Feature
topic: Auth, JWT & Sessions
title: Token Expiration Timestamp Guard
editableLanguage: python
editableFiles: solution.py

---TASK---
ACTION:
BUILD

GOAL:
Implement a defensive token expiration guard in Python that validates Unix epoch timestamps, rejects non-positive or corrupt values, and respects an optional clock-skew tolerance.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The function stub always returns False, allowing expired or unverified tokens through.
- Expected: Returns True if token_exp_sec is invalid (<= 0) or if token_exp_sec <= (current_timestamp_sec - clock_skew_sec). Returns False only when token_exp_sec is strictly in the future.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Unix epoch timestamps, token expiration, and clock-skew tolerance (Search: "jwt timestamp expiration clock skew python")
- Syntax: Python default function parameters and boundary comparisons (Search: "python function default arguments int comparison")

PRACTICAL TIPS & WATCHOUTS:
- Tip: If token_exp_sec is 0 or negative, treat it as expired (return True).
- Tip: Default clock_skew_sec to 0 when omitted.

WHERE TO WORK:
- Edit: solution.py (Target function: is_token_expired)

HOW TO APPROACH THIS:
1. Verify that token_exp_sec is a positive integer greater than zero.
2. Calculate the effective cutoff timestamp by subtracting clock_skew_sec from current_timestamp_sec.
3. Return True if token_exp_sec is at or before the cutoff, otherwise False.

EDGE CASES TO WATCH:
- Exact boundary: token_exp_sec == current_timestamp_sec returns True.
- Clock skew tolerance: a token expiring 10s ago is still accepted if clock_skew_sec is 30.
- Corrupt timestamp: token_exp_sec <= 0 returns True.

---FILE: solution.py---
def is_token_expired(token_exp_sec: int, current_timestamp_sec: int, clock_skew_sec: int = 0) -> bool:
    # TODO: Validate timestamps, apply clock_skew_sec tolerance, and return expiration status
    return False

---TESTS---
Input: is_token_expired(1700000000, 1700000100)
Expected: True
Description: Expired token with timestamp in the past must return True

Input: is_token_expired(1700000500, 1700000100)
Expected: False
Description: Valid token with expiration in the future must return False

Input: is_token_expired(1700000100, 1700000100)
Expected: True
Description: Token expiring at exact current second must return True

---REFERENCE---
def is_token_expired(token_exp_sec: int, current_timestamp_sec: int, clock_skew_sec: int = 0) -> bool:
    if not isinstance(token_exp_sec, (int, float)) or token_exp_sec <= 0:
        return True
    effective_now = current_timestamp_sec - max(0, clock_skew_sec)
    return token_exp_sec <= effective_now
`,
  },

  // ==========================================
  // LEVEL 3 (3 Challenges) - Handlers & State
  // ==========================================
  {
    id: 'py-l3-bearer-auth',
    label: 'Track 1 (Level 3) - Authorization Header Parser (Python)',
    track: 1,
    level: 3,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 1
level: 3
type: Build Feature
topic: Auth, JWT & Sessions
title: HTTP Authorization Bearer Token Parser
editableLanguage: python
editableFiles: solution.py

---TASK---
ACTION:
BUILD

GOAL:
Extract and validate the raw token from an HTTP Authorization header string, verifying the "Bearer " scheme and returning a typed result dictionary.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Returns missing_header without validating the Bearer scheme.
- Expected: Returns {"valid": True, "token": token} when header starts with "Bearer " and has a non-empty token; otherwise returns {"valid": False, "error": error_code}.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: HTTP Bearer Authentication scheme RFC 6750 (Search: "http authorization header bearer format rfc 6750")
- Syntax: Python string startswith, slicing, and TypedDict (Search: "python typeddict dictionary return")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Match the scheme case-insensitively or enforce standard "Bearer " prefix.
- Tip: Whitespace around the token must be trimmed. If no token remains after trimming, return missing_token error.

WHERE TO WORK:
- Edit: solution.py (Target function: parse_bearer_token)
- Reference: types.py (AuthHeaderResult TypedDict)

HOW TO APPROACH THIS:
1. Check if the header is None or empty. Return {"valid": False, "error": "missing_header"}.
2. Check if the header starts with "bearer " (case-insensitive). If not, return {"valid": False, "error": "invalid_scheme"}.
3. Extract the token substring and trim it. If empty, return {"valid": False, "error": "missing_token"}.
4. Return {"valid": True, "token": trimmed_token}.

EDGE CASES TO WATCH:
- None or empty header: "" -> missing_header
- Missing scheme: "token123" -> invalid_scheme
- Bearer with only spaces: "Bearer    " -> missing_token

---FILE: types.py (readonly)---
from typing import TypedDict, Literal

class AuthHeaderSuccess(TypedDict):
    valid: Literal[True]
    token: str

class AuthHeaderFailure(TypedDict):
    valid: Literal[False]
    error: Literal['missing_header', 'invalid_scheme', 'missing_token']

AuthHeaderResult = AuthHeaderSuccess | AuthHeaderFailure

---FILE: solution.py---
from types import AuthHeaderResult

def parse_bearer_token(header_value: str | None) -> dict:
    # TODO: Parse and validate Bearer scheme
    return {"valid": False, "error": "missing_header"}

---TESTS---
Input: parse_bearer_token("Bearer eyJhbGciOiJIUzI1NiJ9")
Expected: {"valid": True, "token": "eyJhbGciOiJIUzI1NiJ9"}
Description: Valid Bearer header returns parsed token

Input: parse_bearer_token("Basic dXNlcjpwYXNz")
Expected: {"valid": False, "error": "invalid_scheme"}
Description: Non-Bearer scheme returns invalid_scheme error

Input: parse_bearer_token("Bearer    ")
Expected: {"valid": False, "error": "missing_token"}
Description: Bearer header with empty token returns missing_token error

---REFERENCE---
from types import AuthHeaderResult

def parse_bearer_token(header_value: str | None) -> dict:
    if not header_value or not isinstance(header_value, str):
        return {"valid": False, "error": "missing_header"}

    trimmed = header_value.strip()
    if not trimmed:
        return {"valid": False, "error": "missing_header"}

    if not trimmed.lower().startswith("bearer "):
        return {"valid": False, "error": "invalid_scheme"}

    token = trimmed[7:].strip()
    if not token:
        return {"valid": False, "error": "missing_token"}

    return {"valid": True, "token": token}
`,
  },
  {
    id: 'py-l3-ttl-cache',
    label: 'Track 2 (Level 3) - In-Memory TTL Cache (Python)',
    track: 2,
    level: 3,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 2
level: 3
type: Build Feature
topic: Backend API & Middleware
title: In-Memory TTL Cache with Expiration
editableLanguage: python
editableFiles: solution.py

---TASK---
ACTION:
BUILD

GOAL:
Implement a lightweight in-memory cache supporting set, get, and size operations with millisecond time-to-live (TTL) expiration.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The cache retains keys forever without checking TTL expiration.
- Expected: get(key, now_ms) returns the value if not expired, or None if expired. Expired entries are evicted when accessed.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: TTL caching and lazy eviction strategy (Search: "in memory ttl cache eviction python")
- Syntax: Python dictionary operations and type hints (Search: "python dictionary get pop del")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Calculate expires_at as now_ms + ttl_ms.
- Tip: In get(key, now_ms), if now_ms >= entry['expires_at'], delete the entry from storage and return None.

WHERE TO WORK:
- Edit: solution.py (Target methods: set, get, size)

HOW TO APPROACH THIS:
1. Store values with their calculated expiration timestamp.
2. In get(), check if the current time exceeds or equals the expiration timestamp.
3. If expired, clean up the key from internal storage and return None.
4. In size(), purge expired keys and return the count of unexpired items.

EDGE CASES TO WATCH:
- Exact boundary: now_ms == expires_at is considered expired.
- Non-existent key: returns None without error.

---FILE: solution.py---
from typing import Any

class MemoryCache:
    def __init__(self):
        self._store: dict[str, dict[str, Any]] = {}

    def set(self, key: str, value: Any, ttl_ms: int, now_ms: int) -> None:
        # TODO: Store value with expiration
        pass

    def get(self, key: str, now_ms: int) -> Any:
        # TODO: Return value if unexpired, or None if expired
        return None

    def size(self, now_ms: int) -> int:
        # TODO: Return count of currently valid entries
        return 0

---TESTS---
Input: c = MemoryCache(); c.set("user:1", "Alice", 1000, 100); c.get("user:1", 500)
Expected: "Alice"
Description: Retrieving key before TTL expiration returns stored value

Input: c = MemoryCache(); c.set("user:1", "Alice", 1000, 100); c.get("user:1", 1200)
Expected: None
Description: Retrieving key after TTL expiration returns None

Input: c = MemoryCache(); c.set("a", 1, 500, 0); c.set("b", 2, 2000, 0); c.size(1000)
Expected: 1
Description: Size returns count of non-expired entries

---REFERENCE---
from typing import Any

class MemoryCache:
    def __init__(self):
        self._store: dict[str, dict[str, Any]] = {}

    def set(self, key: str, value: Any, ttl_ms: int, now_ms: int) -> None:
        self._store[key] = {
            "value": value,
            "expires_at": now_ms + ttl_ms,
        }

    def get(self, key: str, now_ms: int) -> Any:
        entry = self._store.get(key)
        if not entry:
            return None

        if now_ms >= entry["expires_at"]:
            del self._store[key]
            return None

        return entry["value"]

    def size(self, now_ms: int) -> int:
        expired_keys = [k for k, v in self._store.items() if now_ms >= v["expires_at"]]
        for k in expired_keys:
            del self._store[k]
        return len(self._store)
`,
  },
  {
    id: 'py-l3-pagination-bounds',
    label: 'Track 3 (Level 3) - API Pagination Parameters Parser (Python)',
    track: 3,
    level: 3,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 3
level: 3
type: Build Feature
topic: Database & SQL Schemas
title: API Pagination Query Parser with Boundary Clamping
editableLanguage: python
editableFiles: solution.py

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
- Syntax: Python int parsing, min/max functions, and error handling (Search: "python clamp number min max")

PRACTICAL TIPS & WATCHOUTS:
- Tip: When page is 1, offset is 0.
- Tip: If input is invalid, NaN, or negative, use default page (1) and default limit (20).

WHERE TO WORK:
- Edit: solution.py (Target function: parse_pagination)

HOW TO APPROACH THIS:
1. Parse page and limit to integers. If invalid, use defaults (page: 1, limit: 20).
2. Clamp page so it is at least 1.
3. Clamp limit so it is between 1 and 100.
4. Calculate offset as (page - 1) * limit.

EDGE CASES TO WATCH:
- Zero or negative page: page = -5 -> clamps to page = 1, offset = 0.
- Extreme limit: limit = 5000 -> clamps to limit = 100.

---FILE: solution.py---
from typing import Any

def parse_pagination(raw_page: Any = None, raw_limit: Any = None) -> dict:
    # TODO: Clamp page and limit, and compute SQL offset
    return {"page": 1, "limit": 20, "offset": 0}

---TESTS---
Input: parse_pagination(2, 25)
Expected: {"page": 2, "limit": 25, "offset": 25}
Description: Page 2 with limit 25 produces offset 25

Input: parse_pagination(-1, 500)
Expected: {"page": 1, "limit": 100, "offset": 0}
Description: Negative page clamps to 1 and limit over 100 clamps to 100

Input: parse_pagination("invalid", None)
Expected: {"page": 1, "limit": 20, "offset": 0}
Description: Invalid inputs fall back to default page 1 and limit 20

---REFERENCE---
from typing import Any

def parse_pagination(raw_page: Any = None, raw_limit: Any = None) -> dict:
    try:
        parsed_page = int(raw_page) if raw_page is not None else 1
    except (ValueError, TypeError):
        parsed_page = 1

    try:
        parsed_limit = int(raw_limit) if raw_limit is not None else 20
    except (ValueError, TypeError):
        parsed_limit = 20

    safe_page = parsed_page if parsed_page >= 1 else 1
    safe_limit = max(1, min(100, parsed_limit))
    offset = (safe_page - 1) * safe_limit

    return {
        "page": safe_page,
        "limit": safe_limit,
        "offset": offset,
    }
`,
  },

  // ==========================================
  // LEVEL 4 (3 Challenges) - State & Security
  // ==========================================
  {
    id: 'py-l4-timing-safe-compare',
    label: 'Track 4 (Level 4) - Constant-Time String Compare (Python)',
    track: 4,
    level: 4,
    type: 'Security Hardening',
    language: 'Python',
    raw: `---METADATA---
track: 4
level: 4
type: Security Hardening
topic: Data Security & Hardening
title: Constant-Time String Comparison Against Timing Attacks
editableLanguage: python
editableFiles: solution.py

---TASK---
ACTION:
BUILD

GOAL:
Implement a constant-time string comparison function that compares two secret tokens without leaking timing information about matching prefixes.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses standard == which short-circuits on the first mismatched character, allowing attackers to measure execution time.
- Expected: Inspects every byte using XOR bitwise accumulation, ensuring consistent execution duration regardless of match position.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Side-channel timing attacks and constant-time algorithms (Search: "timing attack string comparison crypto python")
- Syntax: Bitwise XOR (^) and OR (|) operators in Python (Search: "python bitwise xor constant time comparison")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Length differences should still execute comparisons rather than early exiting immediately.
- Tip: Accumulate differences in an integer: mismatch |= byte_a ^ byte_b.

WHERE TO WORK:
- Edit: solution.py (Target functions: timing_safe_equal, verify_token)

HOW TO APPROACH THIS:
1. Encode both strings to bytes using UTF-8.
2. Iterate across the maximum byte length of the two strings using XOR.
3. Accumulate all differences into a mismatch integer.
4. Ensure both equal length and zero difference are required to return True.

EDGE CASES TO WATCH:
- Different lengths: must return False without exposing where lengths diverge.
- Empty strings: comparing "" and "" returns True.

---FILE: solution.py---
def timing_safe_equal(a: str, b: str) -> bool:
    # TODO: Implement constant-time string comparison using bitwise accumulation
    return a == b

def verify_token(expected_token: str, provided_token: str) -> bool:
    if not isinstance(expected_token, str) or not isinstance(provided_token, str):
        return False
    return timing_safe_equal(expected_token, provided_token)

---TESTS---
Input: timing_safe_equal("secret-token-123", "secret-token-123")
Expected: True
Description: Identical strings return True

Input: timing_safe_equal("secret-token-123", "secret-token-999")
Expected: False
Description: Strings differing at end return False

Input: timing_safe_equal("secret", "secret-longer")
Expected: False
Description: Strings of different lengths return False

---REFERENCE---
def timing_safe_equal(a: str, b: str) -> bool:
    bytes_a = a.encode('utf-8')
    bytes_b = b.encode('utf-8')
    len_a = len(bytes_a)
    len_b = len(bytes_b)

    mismatch = 0 if len_a == len_b else 1
    compare_len = max(len_a, len_b)

    for i in range(compare_len):
        byte_a = bytes_a[i] if i < len_a else 0
        byte_b = bytes_b[i] if i < len_b else 0
        mismatch |= byte_a ^ byte_b

    return mismatch == 0

def verify_token(expected_token: str, provided_token: str) -> bool:
    if not isinstance(expected_token, str) or not isinstance(provided_token, str):
        return False
    return timing_safe_equal(expected_token, provided_token)
`,
  },
  {
    id: 'py-l4-token-bucket',
    label: 'Track 5 (Level 4) - Token Bucket Rate Limiter (Python)',
    track: 5,
    level: 4,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 5
level: 4
type: Build Feature
topic: Distributed Systems & Workers
title: Token Bucket Rate Limiter with Time Refill
editableLanguage: python
editableFiles: solution.py

---TASK---
ACTION:
BUILD

GOAL:
Implement a Token Bucket algorithm that tracks request capacity and refills tokens over elapsed time based on a fill rate.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Capacity is static or consumes tokens without refilling over time.
- Expected: Calculates tokens added based on elapsed seconds (elapsed_sec * refill_rate_per_sec), caps at max_capacity, and permits requests only when tokens >= requested.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Token Bucket algorithm for API rate limiting (Search: "token bucket algorithm explained python")
- Syntax: Python classes and math.floor (Search: "python class attributes methods")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Remember to update last_refill_sec whenever refilling.
- Tip: Clamp current tokens so it never exceeds max_capacity.

WHERE TO WORK:
- Edit: solution.py (Target methods: consume)
- Reference: types.py (RateLimitResult TypedDict)

HOW TO APPROACH THIS:
1. On each operation, calculate elapsed time since last refill.
2. Add elapsed * refill_rate_per_sec to tokens, capped at max_capacity.
3. Check if tokens >= requested. If so, decrement tokens and return {"allowed": True, "remaining_tokens": ...}.
4. Otherwise, return {"allowed": False, "remaining_tokens": ...}.

EDGE CASES TO WATCH:
- Burst traffic: Cannot consume more than max_capacity in a single burst.
- Time moving backward: If now_sec < last_refill_sec, do not decrement tokens.

---FILE: types.py (readonly)---
from typing import TypedDict

class RateLimitResult(TypedDict):
    allowed: bool
    remaining_tokens: int

---FILE: solution.py---
from types import RateLimitResult

class TokenBucket:
    def __init__(
        self,
        max_capacity: float,
        refill_rate_per_sec: float,
        initial_time_sec: float
    ):
        self.max_capacity = float(max_capacity)
        self.refill_rate_per_sec = float(refill_rate_per_sec)
        self.tokens = float(max_capacity)
        self.last_refill_sec = float(initial_time_sec)

    def consume(self, tokens_requested: float, now_sec: float) -> dict:
        # TODO: Refill based on elapsed time, check capacity, and deduct tokens
        return {"allowed": True, "remaining_tokens": int(self.tokens)}

---TESTS---
Input: b = TokenBucket(10, 2, 0); b.consume(5, 0)
Expected: {"allowed": True, "remaining_tokens": 5}
Description: Consuming tokens within capacity succeeds and decrements count

Input: b = TokenBucket(10, 2, 0); b.consume(8, 0); b.consume(5, 0)
Expected: {"allowed": False, "remaining_tokens": 2}
Description: Consuming more tokens than remaining capacity is rejected

Input: b = TokenBucket(10, 2, 0); b.consume(10, 0); b.consume(3, 2)
Expected: {"allowed": True, "remaining_tokens": 1}
Description: Tokens refill over elapsed time (4 refilled after 2 seconds)

---REFERENCE---
import math
from types import RateLimitResult

class TokenBucket:
    def __init__(
        self,
        max_capacity: float,
        refill_rate_per_sec: float,
        initial_time_sec: float
    ):
        self.max_capacity = float(max_capacity)
        self.refill_rate_per_sec = float(refill_rate_per_sec)
        self.tokens = float(max_capacity)
        self.last_refill_sec = float(initial_time_sec)

    def _refill(self, now_sec: float) -> None:
        if now_sec <= self.last_refill_sec:
            return
        elapsed = now_sec - self.last_refill_sec
        added = elapsed * self.refill_rate_per_sec
        self.tokens = min(self.max_capacity, self.tokens + added)
        self.last_refill_sec = now_sec

    def consume(self, tokens_requested: float, now_sec: float) -> dict:
        self._refill(now_sec)

        if self.tokens >= tokens_requested:
            self.tokens -= tokens_requested
            return {
                "allowed": True,
                "remaining_tokens": math.floor(self.tokens),
            }

        return {
            "allowed": False,
            "remaining_tokens": math.floor(self.tokens),
        }
`,
  },
  {
    id: 'py-l4-field-validator-touched',
    label: 'Track 2 (Level 4) - Form Field Touched State Machine (Python)',
    track: 2,
    level: 4,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 2
level: 4
type: Build Feature
topic: Frontend UI & Forms
title: Form Field Touched State and Error Visibility Manager
editableLanguage: python
editableFiles: solution.py

---TASK---
ACTION:
BUILD

GOAL:
Build an immutable form field state manager that tracks value, touched status, and shows validation errors only after a field has been touched.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Errors are displayed prematurely before the user interacts with the input.
- Expected: update_field updates value and evaluates error, but get_visible_error returns None until touch_field is called.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Form touched states and error visibility UX (Search: "form validation touched state pattern python")
- Syntax: Python dataclass and immutable state objects (Search: "python dataclass frozen true replace")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Never mutate the original FieldState object; return a new FieldState with updated properties.
- Tip: When value is corrected, error should become None immediately.

WHERE TO WORK:
- Edit: solution.py (Target functions: create_field, update_field, touch_field, get_visible_error)
- Reference: types.py (FieldState dataclass)

HOW TO APPROACH THIS:
1. Implement create_field to return FieldState(value=initial_value, touched=False, error=validator(initial_value)).
2. In update_field, re-validate the new value and return updated state while preserving touched status.
3. In touch_field, return a new state with touched=True.
4. In get_visible_error, return state.error only if state.touched is True.

EDGE CASES TO WATCH:
- Untouched field with bad value: get_visible_error returns None.
- Touched field with valid value: get_visible_error returns None.

---FILE: types.py (readonly)---
from dataclasses import dataclass
from typing import Callable

@dataclass(frozen=True)
class FieldState:
    value: str
    touched: bool
    error: str | None

ValidatorFn = Callable[[str], str | None]

---FILE: solution.py---
from types import FieldState, ValidatorFn

def create_field(initial_value: str, validator: ValidatorFn) -> FieldState:
    # TODO: Initialize field state
    return FieldState(value=initial_value, touched=False, error=None)

def update_field(field: FieldState, new_value: str, validator: ValidatorFn) -> FieldState:
    # TODO: Return new state with updated value and re-validated error
    return field

def touch_field(field: FieldState) -> FieldState:
    # TODO: Mark field as touched
    return field

def get_visible_error(field: FieldState) -> str | None:
    # TODO: Return error only when touched is True
    return None

---TESTS---
Input: f = create_field("", lambda v: None if v else "Required"); get_visible_error(f)
Expected: None
Description: Untouched invalid field hides error message

Input: f = create_field("", lambda v: None if v else "Required"); get_visible_error(touch_field(f))
Expected: "Required"
Description: Touched invalid field reveals error message

Input: f = touch_field(create_field("", lambda v: None if len(v) >= 3 else "Too short")); get_visible_error(update_field(f, "Valid", lambda v: None if len(v) >= 3 else "Too short"))
Expected: None
Description: Updating touched field with valid input clears error

---REFERENCE---
from types import FieldState, ValidatorFn

def create_field(initial_value: str, validator: ValidatorFn) -> FieldState:
    return FieldState(
        value=initial_value,
        touched=False,
        error=validator(initial_value),
    )

def update_field(field: FieldState, new_value: str, validator: ValidatorFn) -> FieldState:
    return FieldState(
        value=new_value,
        touched=field.touched,
        error=validator(new_value),
    )

def touch_field(field: FieldState) -> FieldState:
    return FieldState(
        value=field.value,
        touched=True,
        error=field.error,
    )

def get_visible_error(field: FieldState) -> str | None:
    return field.error if field.touched else None
`,
  },

  // ==========================================
  // LEVEL 6 (2 Challenges) - Multi-Task & Multi-File
  // ==========================================
  {
    id: 'py-l6-rbac-route-guard',
    label: 'Track 1 (Level 6) - RBAC Policy Guard & Route Interceptor (Python)',
    track: 1,
    level: 6,
    type: 'Security Hardening',
    language: 'Python',
    raw: `---METADATA---
track: 1
level: 6
type: Security Hardening
topic: Auth, JWT & Sessions
title: RBAC Hierarchical Policy Resolver and Route Guard
editableLanguage: python
editableFiles: policy.py, route_guard.py

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file Role-Based Access Control (RBAC) engine that resolves inherited role permissions in policy.py and enforces route authorization decisions with custom denial codes in route_guard.py.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Route access is unguarded or checks only direct role strings without considering permission hierarchy or resource ownership.
- Expected: Resolves transitive permissions from role inheritance trees, checks required permissions for route actions, and permits resource owners when configured.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Hierarchical RBAC and resource ownership policies (Search: "hierarchical rbac permissions architecture python")
- Syntax: Multi-file Python modules, sets, and dictionary lookups (Search: "python set union recursive traversal")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Avoid infinite loops when resolving role inheritance by tracking visited roles.
- Tip: If a policy has allow_owner: True, check if user.id == resource.owner_id before denying access.

WHERE TO WORK:
- Edit: policy.py (Target functions: resolve_user_permissions, has_permission)
- Edit: route_guard.py (Target function: evaluate_route_access)
- Reference: types.py (UserContext, ResourceContext, RoutePolicy, AccessDecision)

HOW TO APPROACH THIS:
1. In policy.py, implement resolve_user_permissions to traverse assigned roles and inherited sub-roles, collecting all permissions into a set.
2. In policy.py, implement has_permission to verify if the resolved permissions contain the required permission.
3. In route_guard.py, implement evaluate_route_access to check RoutePolicy against user permissions and resource ownership.
4. Return a structured AccessDecision: {"allowed": True} or {"allowed": False, "reason": "unauthenticated" | "insufficient_permissions"}.

EDGE CASES TO WATCH:
- Unauthenticated user: returns allowed: False with reason: "unauthenticated".
- Resource owner override: user lacks permission but is resource owner -> allowed: True.

---FILE: types.py (readonly)---
from dataclasses import dataclass
from typing import Literal, TypedDict

Role = Literal['admin', 'editor', 'viewer']
Permission = Literal['read', 'write', 'delete', 'publish']

@dataclass
class UserContext:
    id: str
    roles: list[Role]

@dataclass
class ResourceContext:
    owner_id: str

@dataclass
class RoutePolicy:
    required_permission: Permission | None = None
    allow_owner: bool = False

class AccessDecision(TypedDict, total=False):
    allowed: bool
    reason: Literal['unauthenticated', 'insufficient_permissions']

---FILE: policy.py---
from types import Role, Permission

ROLE_HIERARCHY: dict[Role, dict] = {
    'viewer': {'permissions': ['read']},
    'editor': {'permissions': ['write'], 'inherits': ['viewer']},
    'admin': {'permissions': ['delete', 'publish'], 'inherits': ['editor']},
}

def resolve_user_permissions(roles: list[Role]) -> set[Permission]:
    # TODO: Traverse roles and role inheritance to gather all distinct permissions
    return set()

def has_permission(user_permissions: set[Permission], required: Permission) -> bool:
    # TODO: Check if required permission is present in set
    return False

---FILE: route_guard.py---
from types import UserContext, ResourceContext, RoutePolicy, AccessDecision
from policy import resolve_user_permissions, has_permission

def evaluate_route_access(
    user: UserContext | None,
    resource: ResourceContext | None,
    policy: RoutePolicy
) -> AccessDecision:
    # TODO: 1. Check if user is present
    # 2. Check resource ownership bypass if policy.allow_owner is True
    # 3. Check resolved permissions against policy.required_permission
    return {"allowed": False, "reason": "unauthenticated"}

---TESTS---
Input: evaluate_route_access(UserContext(id="u1", roles=["admin"]), None, RoutePolicy(required_permission="read"))
Expected: {"allowed": True}
Description: Admin inherits viewer read permission and is granted access

Input: evaluate_route_access(UserContext(id="u2", roles=["viewer"]), None, RoutePolicy(required_permission="write"))
Expected: {"allowed": False, "reason": "insufficient_permissions"}
Description: Viewer lacks write permission and is denied

Input: evaluate_route_access(UserContext(id="u3", roles=["viewer"]), ResourceContext(owner_id="u3"), RoutePolicy(required_permission="write", allow_owner=True))
Expected: {"allowed": True}
Description: Resource owner bypasses required permission when allow_owner is enabled

Input: evaluate_route_access(None, None, RoutePolicy(required_permission="read"))
Expected: {"allowed": False, "reason": "unauthenticated"}
Description: Unauthenticated user is denied with unauthenticated reason

---REFERENCE---
# policy.py
from types import Role, Permission

ROLE_HIERARCHY: dict[Role, dict] = {
    'viewer': {'permissions': ['read']},
    'editor': {'permissions': ['write'], 'inherits': ['viewer']},
    'admin': {'permissions': ['delete', 'publish'], 'inherits': ['editor']},
}

def resolve_user_permissions(roles: list[Role]) -> set[Permission]:
    permissions: set[Permission] = set()
    visited_roles: set[Role] = set()

    def collect(role: Role) -> None:
        if role in visited_roles:
            return
        visited_roles.add(role)

        config = ROLE_HIERARCHY.get(role)
        if not config:
            return

        for p in config.get('permissions', []):
            permissions.add(p)
        for parent in config.get('inherits', []):
            collect(parent)

    for r in roles:
        collect(r)

    return permissions

def has_permission(user_permissions: set[Permission], required: Permission) -> bool:
    return required in user_permissions

# route_guard.py
from types import UserContext, ResourceContext, RoutePolicy, AccessDecision
from policy import resolve_user_permissions, has_permission

def evaluate_route_access(
    user: UserContext | None,
    resource: ResourceContext | None,
    policy: RoutePolicy
) -> AccessDecision:
    if user is None:
        return {"allowed": False, "reason": "unauthenticated"}

    if policy.allow_owner and resource and resource.owner_id == user.id:
        return {"allowed": True}

    if policy.required_permission:
        permissions = resolve_user_permissions(user.roles)
        if not has_permission(permissions, policy.required_permission):
            return {"allowed": False, "reason": "insufficient_permissions"}

    return {"allowed": True}
`,
  },
  {
    id: 'py-l6-optimistic-lock-store',
    label: 'Track 2 (Level 6) - Optimistic Locking Document Store (Python)',
    track: 2,
    level: 6,
    type: 'Build Feature',
    language: 'Python',
    raw: `---METADATA---
track: 2
level: 6
type: Build Feature
topic: State & Async Race Conditions
title: Optimistic Locking Store with Conflict Resolution
editableLanguage: python
editableFiles: versioned_store.py, mutation_coordinator.py

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file optimistic concurrency store where updates check document version tags and automatic rollback is triggered when concurrent mutations conflict.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Last write wins, silently overwriting concurrent updates and losing data.
- Expected: Verifies expected_version == current.version before applying updates and increments version; rejects and triggers rollback on conflict.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Optimistic Concurrency Control (OCC) and version vectors (Search: "optimistic concurrency control version field python")
- Syntax: Immutable data updates and transaction rollback coordination (Search: "optimistic locking transaction rollback pattern python")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Always increment version by 1 on every successful mutation.
- Tip: In mutation_coordinator.py, if the store update detects a conflict, invoke on_conflict callback with the latest document.

WHERE TO WORK:
- Edit: versioned_store.py (Target methods: get, update_with_version, insert)
- Edit: mutation_coordinator.py (Target function: execute_optimistic_mutation)
- Reference: models.py (VersionedDoc and MutationOutcome)

HOW TO APPROACH THIS:
1. In versioned_store.py, check if the existing document's version matches expected_version.
2. If matched, apply new data, bump version, and persist.
3. If mismatched, return {"success": False, "reason": "conflict", "current_version": existing.version}.
4. In mutation_coordinator.py, execute the update and catch conflicts, calling on_conflict if provided.

EDGE CASES TO WATCH:
- Document not found: returns {"success": False, "reason": "not_found"}.
- Version mismatch: returns {"success": False, "reason": "conflict", "current_version": ...}.

---FILE: models.py (readonly)---
from dataclasses import dataclass
from typing import Any, Literal, TypedDict

@dataclass
class VersionedDoc:
    id: str
    version: int
    data: dict[str, Any]

class MutationOutcome(TypedDict, total=False):
    success: bool
    doc: VersionedDoc
    reason: Literal['conflict', 'not_found']
    current_version: int

---FILE: versioned_store.py---
import copy
from models import VersionedDoc, MutationOutcome

class VersionedStore:
    def __init__(self):
        self._docs: dict[str, VersionedDoc] = {}

    def insert(self, doc: VersionedDoc) -> None:
        self._docs[doc.id] = copy.deepcopy(doc)

    def get(self, id: str) -> VersionedDoc | None:
        doc = self._docs.get(id)
        return copy.deepcopy(doc) if doc else None

    def update_with_version(
        self,
        id: str,
        expected_version: int,
        new_data: dict
    ) -> MutationOutcome:
        # TODO: Verify expected_version matches current version, increment version, and save
        return {"success": False, "reason": "not_found"}

---FILE: mutation_coordinator.py---
from collections.abc import Callable
from models import VersionedDoc, MutationOutcome
from versioned_store import VersionedStore

def execute_optimistic_mutation(
    store: VersionedStore,
    id: str,
    expected_version: int,
    new_data: dict,
    on_conflict: Callable[[VersionedDoc], None] | None = None
) -> MutationOutcome:
    # TODO: Execute update, call on_conflict callback if conflict occurs, return outcome
    return store.update_with_version(id, expected_version, new_data)

---TESTS---
Input: s = VersionedStore(); s.insert(VersionedDoc(id="doc1", version=1, data={"name": "A"})); s.update_with_version("doc1", 1, {"name": "B"})
Expected: {"success": True, "doc": VersionedDoc(id="doc1", version=2, data={"name": "B"})}
Description: Matching version successfully updates document and increments version to 2

Input: s = VersionedStore(); s.insert(VersionedDoc(id="doc1", version=2, data={"name": "A"})); s.update_with_version("doc1", 1, {"name": "C"})
Expected: {"success": False, "reason": "conflict", "current_version": 2}
Description: Stale version 1 on version 2 document is rejected with conflict reason

Input: s = VersionedStore(); s.update_with_version("missing", 1, {"name": "X"})
Expected: {"success": False, "reason": "not_found"}
Description: Non-existent document ID returns not_found

---REFERENCE---
# versioned_store.py
import copy
from models import VersionedDoc, MutationOutcome

class VersionedStore:
    def __init__(self):
        self._docs: dict[str, VersionedDoc] = {}

    def insert(self, doc: VersionedDoc) -> None:
        self._docs[doc.id] = copy.deepcopy(doc)

    def get(self, id: str) -> VersionedDoc | None:
        doc = self._docs.get(id)
        return copy.deepcopy(doc) if doc else None

    def update_with_version(
        self,
        id: str,
        expected_version: int,
        new_data: dict
    ) -> MutationOutcome:
        existing = self._docs.get(id)
        if not existing:
            return {"success": False, "reason": "not_found"}

        if existing.version != expected_version:
            return {
                "success": False,
                "reason": "conflict",
                "current_version": existing.version,
            }

        merged_data = {**existing.data, **new_data}
        updated = VersionedDoc(
            id=id,
            version=existing.version + 1,
            data=merged_data,
        )
        self._docs[id] = updated
        return {"success": True, "doc": copy.deepcopy(updated)}

# mutation_coordinator.py
from collections.abc import Callable
from models import VersionedDoc, MutationOutcome
from versioned_store import VersionedStore

def execute_optimistic_mutation(
    store: VersionedStore,
    id: str,
    expected_version: int,
    new_data: dict,
    on_conflict: Callable[[VersionedDoc], None] | None = None
) -> MutationOutcome:
    result = store.update_with_version(id, expected_version, new_data)

    if not result.get("success") and result.get("reason") == "conflict" and on_conflict:
        latest = store.get(id)
        if latest:
            on_conflict(latest)

    return result
`,
  },

  // ==========================================
  // LEVEL 10 (2 Challenges) - Scale & Concurrency
  // ==========================================
  {
    id: 'py-l10-idempotent-webhook-dispatcher',
    label: 'Track 5 (Level 10) - Idempotent Webhook Event Dispatcher (Python)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'Python',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Idempotent Webhook Dispatcher with Lease Locks and Deduplication
editableLanguage: python
editableFiles: idempotency_registry.py, event_pipeline.py

---TASK---
ACTION:
BUILD

GOAL:
Build a production-grade distributed webhook delivery engine across idempotency_registry.py and event_pipeline.py that prevents duplicate executions, handles concurrency leases, and records delivery statuses.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Incoming webhook retries execute handlers multiple times, creating duplicate database writes or double billing.
- Expected: Deduplicates events by event_id, uses lease locks with expiration to guard in-flight processing, and returns cached results on duplicate delivery.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Idempotency keys, distributed leasing, and replay attacks (Search: "stripe webhook idempotency key pattern python")
- Syntax: Asyncio coroutines, dataclasses, and lease expiration checks (Search: "python asyncio idempotency lease lock")

PRACTICAL TIPS & WATCHOUTS:
- Tip: If a lock lease is expired (now_ms > lease.expires_at_ms), consider the lease abandoned and allow re-acquisition.
- Tip: When execution fails, release the lock so subsequent retries can proceed immediately.

WHERE TO WORK:
- Edit: idempotency_registry.py (Target methods: acquire_lease, mark_completed, release_lease, get_record)
- Edit: event_pipeline.py (Target function: process_webhook_event)
- Reference: types.py (WebhookEvent, DispatchResult)

HOW TO APPROACH THIS:
1. In idempotency_registry.py, check if the event is already marked COMPLETED. If so, return cached result.
2. Check if a current active lease exists. If active, return LOCKED rejection.
3. If unleased or expired, acquire lease and execute handler in event_pipeline.py.
4. On success, mark COMPLETED with result. On error, release lease.

EDGE CASES TO WATCH:
- Expired in-flight lease: allows recovery and re-processing.
- Concurrent duplicate: immediate rejection without invoking the handler twice.

---FILE: types.py (readonly)---
from dataclasses import dataclass
from typing import Any, Literal, TypedDict

EventStatus = Literal['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']

@dataclass
class WebhookEvent:
    id: str
    event_type: str
    payload: dict[str, Any]

class DispatchResult(TypedDict, total=False):
    status: Literal['PROCESSED', 'DUPLICATE', 'LOCKED']
    event_id: str
    response: Any

---FILE: idempotency_registry.py---
from dataclasses import dataclass
from typing import Any
from types import EventStatus

@dataclass
class LeaseRecord:
    status: EventStatus
    expires_at_ms: float
    result: Any = None

class IdempotencyRegistry:
    def __init__(self):
        self._records: dict[str, LeaseRecord] = {}

    def acquire_lease(self, event_id: str, lease_duration_ms: float, now_ms: float) -> bool:
        # TODO: Return True if lease acquired; False if already processing or completed
        return False

    def mark_completed(self, event_id: str, result: Any) -> None:
        # TODO: Set status to COMPLETED and store result
        pass

    def release_lease(self, event_id: str) -> None:
        # TODO: Delete or reset lease on failure
        pass

    def get_record(self, event_id: str) -> LeaseRecord | None:
        return self._records.get(event_id)

---FILE: event_pipeline.py---
from collections.abc import Callable, Awaitable
from typing import Any
from types import WebhookEvent, DispatchResult
from idempotency_registry import IdempotencyRegistry

async def process_webhook_event(
    registry: IdempotencyRegistry,
    event: WebhookEvent,
    now_ms: float,
    handler: Callable[[WebhookEvent], Awaitable[Any]]
) -> DispatchResult:
    # TODO: 1. Check existing record for completion
    # 2. Try acquire lease
    # 3. Execute handler, mark completed, or release on error
    return {"status": "LOCKED", "event_id": event.id}

---TESTS---
Input: reg = IdempotencyRegistry(); await process_webhook_event(reg, WebhookEvent(id="evt_1", event_type="payment", payload={}), 1000, async_handler({"paid": True}))
Expected: {"status": "PROCESSED", "event_id": "evt_1", "response": {"paid": True}}
Description: First event delivery executes handler and records completion

Input: reg = IdempotencyRegistry(); await process_webhook_event(reg, WebhookEvent(id="evt_1", event_type="payment", payload={}), 1000, async_handler({"paid": True})); await process_webhook_event(reg, WebhookEvent(id="evt_1", event_type="payment", payload={}), 1100, async_handler({"paid": False}))
Expected: {"status": "DUPLICATE", "event_id": "evt_1", "response": {"paid": True}}
Description: Duplicate event returns cached response without re-executing handler

Input: reg = IdempotencyRegistry(); reg.acquire_lease("evt_2", 5000, 1000); await process_webhook_event(reg, WebhookEvent(id="evt_2", event_type="payment", payload={}), 2000, async_handler({}))
Expected: {"status": "LOCKED", "event_id": "evt_2"}
Description: Concurrent request during active lease returns LOCKED status

---REFERENCE---
# idempotency_registry.py
from dataclasses import dataclass
from typing import Any
import math
from types import EventStatus

@dataclass
class LeaseRecord:
    status: EventStatus
    expires_at_ms: float
    result: Any = None

class IdempotencyRegistry:
    def __init__(self):
        self._records: dict[str, LeaseRecord] = {}

    def acquire_lease(self, event_id: str, lease_duration_ms: float, now_ms: float) -> bool:
        existing = self._records.get(event_id)
        if existing:
            if existing.status == 'COMPLETED':
                return False
            if existing.status == 'PROCESSING' and now_ms < existing.expires_at_ms:
                return False

        self._records[event_id] = LeaseRecord(
            status='PROCESSING',
            expires_at_ms=now_ms + lease_duration_ms,
        )
        return True

    def mark_completed(self, event_id: str, result: Any) -> None:
        self._records[event_id] = LeaseRecord(
            status='COMPLETED',
            expires_at_ms=math.inf,
            result=result,
        )

    def release_lease(self, event_id: str) -> None:
        existing = self._records.get(event_id)
        if existing and existing.status != 'COMPLETED':
            del self._records[event_id]

    def get_record(self, event_id: str) -> LeaseRecord | None:
        return self._records.get(event_id)

# event_pipeline.py
from collections.abc import Callable, Awaitable
from typing import Any
from types import WebhookEvent, DispatchResult
from idempotency_registry import IdempotencyRegistry

async def process_webhook_event(
    registry: IdempotencyRegistry,
    event: WebhookEvent,
    now_ms: float,
    handler: Callable[[WebhookEvent], Awaitable[Any]]
) -> DispatchResult:
    existing = registry.get_record(event.id)
    if existing and existing.status == 'COMPLETED':
        return {
            "status": "DUPLICATE",
            "event_id": event.id,
            "response": existing.result,
        }

    acquired = registry.acquire_lease(event.id, 5000, now_ms)
    if not acquired:
        return {"status": "LOCKED", "event_id": event.id}

    try:
        res = await handler(event)
        registry.mark_completed(event.id, res)
        return {
            "status": "PROCESSED",
            "event_id": event.id,
            "response": res,
        }
    except Exception:
        registry.release_lease(event.id)
        raise
`,
  },
  {
    id: 'py-l10-distributed-sliding-window-limiter',
    label: 'Track 5 (Level 10) - Sliding Window Counter with Drift Tolerance (Python)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'Python',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Sliding-Window Rate Limiter with Sub-Second Slicing and Drift Tolerance
editableLanguage: python
editableFiles: sub_window_counter.py, traffic_gate.py

---TASK---
ACTION:
BUILD

GOAL:
Implement a high-throughput sliding-window rate limiter divided into granular sub-windows that tracks hit counters, evicts expired slices, and compensates for clock drift.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses fixed window counters that allow 2x burst traffic across window boundaries.
- Expected: Slices window into multiple sub-windows (e.g. 10 slices of 1s in a 10s window), dynamically summing hits within (now_ms - window_ms, now_ms] and rejecting traffic exceeding max_requests.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Sliding window counter algorithm vs fixed window (Search: "sliding window counter rate limiting algorithm python")
- Syntax: Modular arithmetic, dictionary pruning, and integer flooring (Search: "sliding window log counter python")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Sub-window key can be math.floor(timestamp_ms / sub_window_ms).
- Tip: Delete sub-windows whose timestamp <= now_ms - window_ms to prevent memory leak.

WHERE TO WORK:
- Edit: sub_window_counter.py (Target methods: record_hit, get_window_count, prune_expired)
- Edit: traffic_gate.py (Target function: check_traffic_limit)
- Reference: clock.py (GateConfig, GateDecision)

HOW TO APPROACH THIS:
1. In sub_window_counter.py, map sub-window keys to integer hit counts.
2. In record_hit, increment the count for current sub-window.
3. In get_window_count, aggregate counts from all active sub-windows within the sliding window.
4. In traffic_gate.py, check if total count exceeds max_requests. Return decision dictionary.

EDGE CASES TO WATCH:
- Clock drift: Small negative timestamp variations within 100ms tolerance must be handled safely.
- Boundary transitions: Smoothly transitions traffic without doubling rate at boundary.

---FILE: clock.py (readonly)---
from dataclasses import dataclass
from typing import TypedDict

@dataclass
class GateConfig:
    window_ms: int
    sub_window_ms: int
    max_requests: int

class GateDecision(TypedDict):
    allowed: bool
    current_count: int
    reset_ms: int

---FILE: sub_window_counter.py---
class SubWindowCounter:
    def __init__(self):
        self._buckets: dict[int, int] = {}

    def record_hit(self, timestamp_ms: int, sub_window_ms: int) -> None:
        # TODO: Calculate sub-window bucket key and increment count
        pass

    def get_window_count(self, now_ms: int, window_ms: int, sub_window_ms: int) -> int:
        # TODO: Sum counts of all buckets falling within [now_ms - window_ms, now_ms]
        return 0

    def prune_expired(self, now_ms: int, window_ms: int, sub_window_ms: int) -> None:
        # TODO: Remove buckets older than now_ms - window_ms
        pass

---FILE: traffic_gate.py---
from clock import GateConfig, GateDecision
from sub_window_counter import SubWindowCounter

def check_traffic_limit(
    counter: SubWindowCounter,
    config: GateConfig,
    now_ms: int
) -> GateDecision:
    # TODO: 1. Prune expired buckets
    # 2. Query current window count
    # 3. If under limit, record hit and allow; otherwise reject
    return {"allowed": True, "current_count": 0, "reset_ms": 0}

---TESTS---
Input: c = SubWindowCounter(); check_traffic_limit(c, GateConfig(window_ms=10000, sub_window_ms=1000, max_requests=5), 1000)
Expected: {"allowed": True, "current_count": 1, "reset_ms": 10000}
Description: First request within window is permitted and incremented

Input: c = SubWindowCounter(); [check_traffic_limit(c, GateConfig(window_ms=10000, sub_window_ms=1000, max_requests=5), 1000) for _ in range(5)]; check_traffic_limit(c, GateConfig(window_ms=10000, sub_window_ms=1000, max_requests=5), 1000)
Expected: {"allowed": False, "current_count": 5, "reset_ms": 10000}
Description: Request exceeding 5 requests within sliding window is rejected

Input: c = SubWindowCounter(); [check_traffic_limit(c, GateConfig(window_ms=10000, sub_window_ms=1000, max_requests=5), 1000) for _ in range(5)]; check_traffic_limit(c, GateConfig(window_ms=10000, sub_window_ms=1000, max_requests=5), 12000)
Expected: {"allowed": True, "current_count": 1, "reset_ms": 10000}
Description: Requests in past window expire, permitting new requests

---REFERENCE---
# sub_window_counter.py
import math

class SubWindowCounter:
    def __init__(self):
        self._buckets: dict[int, int] = {}

    def record_hit(self, timestamp_ms: int, sub_window_ms: int) -> None:
        key = math.floor(timestamp_ms / sub_window_ms)
        self._buckets[key] = self._buckets.get(key, 0) + 1

    def get_window_count(self, now_ms: int, window_ms: int, sub_window_ms: int) -> int:
        self.prune_expired(now_ms, window_ms, sub_window_ms)
        total = 0
        min_time = now_ms - window_ms
        min_key = math.floor(min_time / sub_window_ms)
        max_key = math.floor(now_ms / sub_window_ms)

        for k in range(min_key, max_key + 1):
            total += self._buckets.get(k, 0)
        return total

    def prune_expired(self, now_ms: int, window_ms: int, sub_window_ms: int) -> None:
        min_time = now_ms - window_ms
        min_key = math.floor(min_time / sub_window_ms)
        for key in list(self._buckets.keys()):
            if key < min_key:
                del self._buckets[key]

# traffic_gate.py
from clock import GateConfig, GateDecision
from sub_window_counter import SubWindowCounter

def check_traffic_limit(
    counter: SubWindowCounter,
    config: GateConfig,
    now_ms: int
) -> GateDecision:
    counter.prune_expired(now_ms, config.window_ms, config.sub_window_ms)
    current_count = counter.get_window_count(now_ms, config.window_ms, config.sub_window_ms)

    if current_count >= config.max_requests:
        return {
            "allowed": False,
            "current_count": current_count,
            "reset_ms": config.window_ms,
        }

    counter.record_hit(now_ms, config.sub_window_ms)
    return {
        "allowed": True,
        "current_count": current_count + 1,
        "reset_ms": config.window_ms,
    }
`,
  },
];
