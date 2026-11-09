import { SampleChallengeOption } from '../types';

export const RUST_CHALLENGES: SampleChallengeOption[] = [
  // ==========================================
  // LEVEL 1 (2 Challenges) - Foundations
  // ==========================================
  {
    id: 'rust-l1-input-sanitizer',
    label: 'Track 1 (Level 1) - Input Sanitizer & Slugifier (Rust)',
    track: 1,
    level: 1,
    type: 'Build Feature',
    language: 'Rust',
    raw: `---METADATA---
track: 1
level: 1
type: Build Feature
topic: Backend API & Middleware
title: Input Sanitizer and URL Slugifier
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
BUILD

GOAL:
Build a slugifier function that normalizes a string slice into a clean, URL-safe slug by lowercasing, trimming, removing non-alphanumeric characters, and replacing whitespace or underscores with single hyphens.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The slugify function returns the input text as an unmodified String, leaving spaces, uppercase letters, and punctuation.
- Expected: Returns a lowercase String with spaces and underscores replaced by single hyphens, stripped of punctuation, collapsed consecutive hyphens, and trimmed of boundary hyphens.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: URL slug normalization and ASCII sanitization (Search: "rust string slugify ascii sanitization")
- Syntax: Rust str methods trim, to_lowercase, chars, and is_ascii_alphanumeric (Search: "rust string manipulation chars filter")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Multiple consecutive spaces or underscores should collapse into a single hyphen, not multiple hyphens.
- Tip: Remove leading and trailing hyphens from the final slug.

WHERE TO WORK:
- Edit: src/solution.rs (Target function: slugify)

HOW TO APPROACH THIS:
1. Trim leading and trailing whitespace from the input and convert to lowercase.
2. Iterate through characters, keeping ASCII alphanumeric characters.
3. Replace consecutive spaces, underscores, or hyphens with a single hyphen.
4. Trim any hyphens from the start or end of the resulting string.

EDGE CASES TO WATCH:
- Multiple spaces: "Hello   World" -> "hello-world"
- Leading/trailing symbols: "---Keep Coding---" -> "keep-coding"
- Special characters: "What's New in 2026!?" -> "whats-new-in-2026"

---FILE: src/solution.rs---
pub fn slugify(text: &str) -> String {
    // TODO: Lowercase, sanitize, collapse spaces to hyphens, and strip boundary hyphens.
    text.to_string()
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
pub fn slugify(text: &str) -> String {
    let mut result = String::new();
    let mut last_was_hyphen = true;

    for c in text.trim().to_lowercase().chars() {
        if c.is_ascii_alphanumeric() {
            result.push(c);
            last_was_hyphen = false;
        } else if c == ' ' || c == '_' || c == '-' {
            if !last_was_hyphen {
                result.push('-');
                last_was_hyphen = true;
            }
        }
    }

    if result.ends_with('-') {
        result.pop();
    }

    result
}
`,
  },
  {
    id: 'rust-l1-expiry-guard',
    label: 'Track 1 (Level 1) - Token Expiry Timestamp Guard (Rust)',
    track: 1,
    level: 1,
    type: 'Fix Bug',
    language: 'Rust',
    raw: `---METADATA---
track: 1
level: 1
type: Fix Bug
topic: Auth, JWT & Sessions
title: Token Expiration Timestamp Guard
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
FIX BUG

GOAL:
Fix the expiration check so tokens whose expiration timestamp has arrived or passed are correctly identified as expired.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The comparator uses >= instead of <=, marking valid tokens as expired and expired tokens as valid.
- Expected: Returns true if token_exp_sec is less than or equal to current_timestamp_sec, and false if token_exp_sec is in the future.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Unix epoch timestamps comparison (Search: "unix epoch timestamp seconds comparison")
- Syntax: Rust relational comparison operators <= vs > (Search: "rust comparison operators boolean")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Earlier timestamps are smaller numbers. If token_exp_sec is 100 and current is 200, the token expired in the past.
- Tip: A token expiring at the exact current second (token_exp_sec == current_timestamp_sec) is expired.

WHERE TO WORK:
- Edit: src/solution.rs (Target function: is_token_expired)

HOW TO APPROACH THIS:
1. Inspect the comparison between token_exp_sec and current_timestamp_sec.
2. Verify that when token_exp_sec is less than or equal to current_timestamp_sec, the token is expired.
3. Fix the relational operator.

EDGE CASES TO WATCH:
- Exact boundary: When token_exp_sec == current_timestamp_sec, returns true.
- Future token: When token_exp_sec > current_timestamp_sec, returns false.

---FILE: src/solution.rs---
pub fn is_token_expired(token_exp_sec: i64, current_timestamp_sec: i64) -> bool {
    // BUG: The comparison is currently reversed
    token_exp_sec >= current_timestamp_sec
}

---TESTS---
Input: is_token_expired(1700000000, 1700000100)
Expected: true
Description: Expired token with timestamp in the past must return true

Input: is_token_expired(1700000500, 1700000100)
Expected: false
Description: Valid token with expiration in the future must return false

Input: is_token_expired(1700000100, 1700000100)
Expected: true
Description: Token expiring at exact current second must return true

---REFERENCE---
pub fn is_token_expired(token_exp_sec: i64, current_timestamp_sec: i64) -> bool {
    token_exp_sec <= current_timestamp_sec
}
`,
  },

  // ==========================================
  // LEVEL 3 (3 Challenges) - Handlers & State
  // ==========================================
  {
    id: 'rust-l3-bearer-auth',
    label: 'Track 1 (Level 3) - Authorization Header Parser (Rust)',
    track: 1,
    level: 3,
    type: 'Build Feature',
    language: 'Rust',
    raw: `---METADATA---
track: 1
level: 3
type: Build Feature
topic: Auth, JWT & Sessions
title: HTTP Authorization Bearer Token Parser
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
BUILD

GOAL:
Extract and validate the raw token from an HTTP Authorization header string, verifying the "Bearer " scheme and returning a typed AuthHeaderResult.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Always returns Invalid with MissingHeader without parsing the header.
- Expected: Returns AuthHeaderResult::Valid { token } when header starts with "Bearer " (case-insensitive) and contains a non-empty token; otherwise returns AuthHeaderResult::Invalid with the specific AuthHeaderError.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: HTTP Bearer Authentication scheme RFC 6750 (Search: "http authorization header bearer format rfc 6750")
- Syntax: Rust Option matching, string slicing, and enum variants (Search: "rust enum variant struct data")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Match the scheme case-insensitively using to_lowercase() or starts_with.
- Tip: Whitespace around the token must be trimmed. If no characters remain after trimming, return MissingToken.

WHERE TO WORK:
- Edit: src/solution.rs (Target function: parse_bearer_token)
- Reference: src/types.rs (AuthHeaderResult and AuthHeaderError enums)

HOW TO APPROACH THIS:
1. Check if header_value is None or if trimming yields an empty string. Return AuthHeaderResult::Invalid { error: AuthHeaderError::MissingHeader }.
2. Check if the trimmed header starts with "bearer " (case-insensitive). If not, return AuthHeaderResult::Invalid { error: AuthHeaderError::InvalidScheme }.
3. Extract the token substring starting after "Bearer ", then trim whitespace. If empty, return AuthHeaderResult::Invalid { error: AuthHeaderError::MissingToken }.
4. Return AuthHeaderResult::Valid { token: trimmed_token.to_string() }.

EDGE CASES TO WATCH:
- Empty header: Some("") -> MissingHeader
- Missing scheme: Some("token123") -> InvalidScheme
- Bearer with only whitespace: Some("Bearer    ") -> MissingToken

---FILE: src/types.rs (readonly)---
#[derive(Debug, PartialEq, Eq, Clone)]
pub enum AuthHeaderError {
    MissingHeader,
    InvalidScheme,
    MissingToken,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum AuthHeaderResult {
    Valid { token: String },
    Invalid { error: AuthHeaderError },
}

---FILE: src/solution.rs---
use crate::types::{AuthHeaderError, AuthHeaderResult};

pub fn parse_bearer_token(header_value: Option<&str>) -> AuthHeaderResult {
    // TODO: Parse and validate Bearer scheme
    AuthHeaderResult::Invalid {
        error: AuthHeaderError::MissingHeader,
    }
}

---TESTS---
Input: parse_bearer_token(Some("Bearer eyJhbGciOiJIUzI1NiJ9"))
Expected: AuthHeaderResult::Valid { token: "eyJhbGciOiJIUzI1NiJ9".to_string() }
Description: Valid Bearer header returns parsed token

Input: parse_bearer_token(Some("Basic dXNlcjpwYXNz"))
Expected: AuthHeaderResult::Invalid { error: AuthHeaderError::InvalidScheme }
Description: Non-Bearer scheme returns InvalidScheme error

Input: parse_bearer_token(Some("Bearer    "))
Expected: AuthHeaderResult::Invalid { error: AuthHeaderError::MissingToken }
Description: Bearer header with empty token returns MissingToken error

---REFERENCE---
use crate::types::{AuthHeaderError, AuthHeaderResult};

pub fn parse_bearer_token(header_value: Option<&str>) -> AuthHeaderResult {
    let header = match header_value {
        Some(h) => h.trim(),
        None => {
            return AuthHeaderResult::Invalid {
                error: AuthHeaderError::MissingHeader,
            }
        }
    };

    if header.is_empty() {
        return AuthHeaderResult::Invalid {
            error: AuthHeaderError::MissingHeader,
        };
    }

    if !header.to_lowercase().starts_with("bearer ") {
        return AuthHeaderResult::Invalid {
            error: AuthHeaderError::InvalidScheme,
        };
    }

    let token = header[7..].trim();
    if token.is_empty() {
        return AuthHeaderResult::Invalid {
            error: AuthHeaderError::MissingToken,
        };
    }

    AuthHeaderResult::Valid {
        token: token.to_string(),
    }
}
`,
  },
  {
    id: 'rust-l3-ttl-cache',
    label: 'Track 2 (Level 3) - In-Memory TTL Cache (Rust)',
    track: 2,
    level: 3,
    type: 'Build Feature',
    language: 'Rust',
    raw: `---METADATA---
track: 2
level: 3
type: Build Feature
topic: Backend API & Middleware
title: In-Memory TTL Cache with Expiration
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
BUILD

GOAL:
Implement a lightweight in-memory cache supporting set, get, and size operations with millisecond time-to-live (TTL) expiration in Rust.

CURRENT VS EXPECTED BEHAVIOR:
- Current: get returns None and size returns 0 without storing entries or checking expiration.
- Expected: get(key, now_ms) returns Some(value) if unexpired, or None if expired. Expired entries are evicted when accessed. size(now_ms) returns count of valid entries.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: TTL caching and lazy eviction strategy (Search: "in memory ttl cache eviction pattern")
- Syntax: Rust HashMap, generics with Clone trait, and Option return types (Search: "rust hashmap entry ttl cache")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Calculate expires_at as now_ms + ttl_ms.
- Tip: In get(key, now_ms), if now_ms >= entry.expires_at, remove the entry from the map and return None.
- Tip: In size(now_ms), evict all expired entries or count only active ones.

WHERE TO WORK:
- Edit: src/solution.rs (Target struct: MemoryCache<T>)

HOW TO APPROACH THIS:
1. Store values alongside their calculated expiration timestamp (now_ms + ttl_ms) in a HashMap.
2. In get(), verify if now_ms >= expires_at. If expired, remove the entry and return None.
3. In size(), prune expired entries and return the count of remaining active keys.

EDGE CASES TO WATCH:
- Exact boundary: now_ms == expires_at is considered expired.
- Non-existent key: returns None without error.

---FILE: src/solution.rs---
use std::collections::HashMap;

#[derive(Clone, Debug)]
struct CacheEntry<T> {
    value: T,
    expires_at: i64,
}

pub struct MemoryCache<T> {
    store: HashMap<String, CacheEntry<T>>,
}

impl<T: Clone> MemoryCache<T> {
    pub fn new() -> Self {
        Self {
            store: HashMap::new(),
        }
    }

    pub fn set(&mut self, key: &str, value: T, ttl_ms: i64, now_ms: i64) {
        // TODO: Store value with calculated expiration timestamp
    }

    pub fn get(&mut self, key: &str, now_ms: i64) -> Option<T> {
        // TODO: Return Some(value) if unexpired, or evict and return None if expired
        None
    }

    pub fn size(&mut self, now_ms: i64) -> usize {
        // TODO: Return count of currently valid unexpired entries
        0
    }
}

---TESTS---
Input: let mut c = MemoryCache::new(); c.set("user:1", "Alice".to_string(), 1000, 100); c.get("user:1", 500)
Expected: Some("Alice".to_string())
Description: Retrieving key before TTL expiration returns stored value

Input: let mut c = MemoryCache::new(); c.set("user:1", "Alice".to_string(), 1000, 100); c.get("user:1", 1200)
Expected: None
Description: Retrieving key after TTL expiration returns None

Input: let mut c = MemoryCache::new(); c.set("a", 1, 500, 0); c.set("b", 2, 2000, 0); c.size(1000)
Expected: 1
Description: Size returns count of non-expired entries

---REFERENCE---
use std::collections::HashMap;

#[derive(Clone, Debug)]
struct CacheEntry<T> {
    value: T,
    expires_at: i64,
}

pub struct MemoryCache<T> {
    store: HashMap<String, CacheEntry<T>>,
}

impl<T: Clone> MemoryCache<T> {
    pub fn new() -> Self {
        Self {
            store: HashMap::new(),
        }
    }

    pub fn set(&mut self, key: &str, value: T, ttl_ms: i64, now_ms: i64) {
        self.store.insert(
            key.to_string(),
            CacheEntry {
                value,
                expires_at: now_ms + ttl_ms,
            },
        );
    }

    pub fn get(&mut self, key: &str, now_ms: i64) -> Option<T> {
        if let Some(entry) = self.store.get(key) {
            if now_ms >= entry.expires_at {
                self.store.remove(key);
                None
            } else {
                Some(entry.value.clone())
            }
        } else {
            None
        }
    }

    pub fn size(&mut self, now_ms: i64) -> usize {
        self.store.retain(|_, entry| now_ms < entry.expires_at);
        self.store.len()
    }
}
`,
  },
  {
    id: 'rust-l3-pagination-bounds',
    label: 'Track 3 (Level 3) - API Pagination Parameters Parser (Rust)',
    track: 3,
    level: 3,
    type: 'Build Feature',
    language: 'Rust',
    raw: `---METADATA---
track: 3
level: 3
type: Build Feature
topic: Database & SQL Schemas
title: API Pagination Query Parser with Boundary Clamping
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
BUILD

GOAL:
Parse and clamp pagination query parameters (page and limit) into safe database SQL query offset and limit values in Rust.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses default constants (page: 1, limit: 20, offset: 0) without processing inputs.
- Expected: Clamps page to >= 1 (default 1) and limit to range [1, 100] (using clamp(1, 100)), calculating offset = (page - 1) * limit.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: SQL OFFSET and LIMIT pagination formulas (Search: "sql offset limit pagination formula")
- Syntax: Rust i64 clamp method and arithmetic (Search: "rust number clamp min max")

PRACTICAL TIPS & WATCHOUTS:
- Tip: When page is 1, offset is always 0.
- Tip: If page is 0 or negative, clamp it to 1. If limit is less than 1, clamp it to 1. If limit exceeds 100, clamp to 100.

WHERE TO WORK:
- Edit: src/solution.rs (Target function: parse_pagination)

HOW TO APPROACH THIS:
1. Ensure page is at least 1 (e.g., if page < 1 { 1 } else { page }).
2. Clamp limit to the inclusive range [1, 100] using limit.clamp(1, 100).
3. Calculate offset as (safe_page - 1) * safe_limit.
4. Construct and return PaginationParams.

EDGE CASES TO WATCH:
- Zero or negative page: page = -1 -> page = 1, offset = 0.
- Extreme limit: limit = 500 -> limit = 100.
- Zero limit: limit = 0 -> limit = 1.

---FILE: src/solution.rs---
#[derive(Debug, PartialEq, Eq, Clone)]
pub struct PaginationParams {
    pub page: i64,
    pub limit: i64,
    pub offset: i64,
}

pub fn parse_pagination(page: i64, limit: i64) -> PaginationParams {
    // TODO: Clamp page to >= 1, clamp limit to 1..=100, and calculate SQL offset
    PaginationParams {
        page: 1,
        limit: 20,
        offset: 0,
    }
}

---TESTS---
Input: parse_pagination(2, 25)
Expected: PaginationParams { page: 2, limit: 25, offset: 25 }
Description: Page 2 with limit 25 produces offset 25

Input: parse_pagination(-1, 500)
Expected: PaginationParams { page: 1, limit: 100, offset: 0 }
Description: Negative page clamps to 1 and limit over 100 clamps to 100

Input: parse_pagination(0, 0)
Expected: PaginationParams { page: 1, limit: 1, offset: 0 }
Description: Zero page clamps to 1 and zero limit clamps to 1

---REFERENCE---
#[derive(Debug, PartialEq, Eq, Clone)]
pub struct PaginationParams {
    pub page: i64,
    pub limit: i64,
    pub offset: i64,
}

pub fn parse_pagination(page: i64, limit: i64) -> PaginationParams {
    let safe_page = if page >= 1 { page } else { 1 };
    let safe_limit = limit.clamp(1, 100);
    let offset = (safe_page - 1) * safe_limit;

    PaginationParams {
        page: safe_page,
        limit: safe_limit,
        offset,
    }
}
`,
  },

  // ==========================================
  // LEVEL 4 (3 Challenges) - State & Security
  // ==========================================
  {
    id: 'rust-l4-timing-safe-compare',
    label: 'Track 4 (Level 4) - Constant-Time String Compare (Rust)',
    track: 4,
    level: 4,
    type: 'Security Hardening',
    language: 'Rust',
    raw: `---METADATA---
track: 4
level: 4
type: Security Hardening
topic: Data Security & Hardening
title: Constant-Time String Comparison Against Timing Attacks
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
BUILD

GOAL:
Implement a constant-time string comparison function in Rust that compares two secret strings without leaking timing information about matching prefixes or string lengths.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses standard equality (==) which short-circuits on the first mismatched byte, allowing attackers to measure execution time.
- Expected: Inspects every byte using XOR bitwise accumulation across the maximum length, ensuring consistent execution duration regardless of match position.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Side-channel timing attacks and constant-time algorithms (Search: "timing attack constant time string comparison")
- Syntax: Rust bitwise XOR (^) and OR (|) operators on byte slices (Search: "rust byte slice xor accumulation")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Length differences should still execute loop iterations across max_len rather than early exiting immediately.
- Tip: Accumulate differences in a u8 integer: mismatch |= byte_a ^ byte_b.

WHERE TO WORK:
- Edit: src/solution.rs (Target functions: timing_safe_equal, verify_token)

HOW TO APPROACH THIS:
1. Obtain byte slices of both inputs (a.as_bytes(), b.as_bytes()).
2. Track whether lengths differ in an initial mismatch accumulator (mismatch = if len_a == len_b { 0 } else { 1 }).
3. Iterate from 0 to max(len_a, len_b), picking 0 if index is out of bounds for either slice.
4. Accumulate XOR difference into mismatch: mismatch |= byte_a ^ byte_b.
5. Return mismatch == 0.

EDGE CASES TO WATCH:
- Different lengths: must return false without early return.
- Empty strings: comparing "" and "" returns true.

---FILE: src/solution.rs---
pub fn timing_safe_equal(a: &str, b: &str) -> bool {
    // TODO: Implement constant-time string comparison using XOR bitwise accumulation
    a == b
}

pub fn verify_token(expected_token: &str, provided_token: &str) -> bool {
    timing_safe_equal(expected_token, provided_token)
}

---TESTS---
Input: timing_safe_equal("secret-token-123", "secret-token-123")
Expected: true
Description: Identical strings return true

Input: timing_safe_equal("secret-token-123", "secret-token-999")
Expected: false
Description: Strings differing at end return false

Input: timing_safe_equal("secret", "secret-longer")
Expected: false
Description: Strings of different lengths return false

---REFERENCE---
pub fn timing_safe_equal(a: &str, b: &str) -> bool {
    let bytes_a = a.as_bytes();
    let bytes_b = b.as_bytes();

    let len_a = bytes_a.len();
    let len_b = bytes_b.len();

    let mut mismatch = if len_a == len_b { 0u8 } else { 1u8 };
    let max_len = len_a.max(len_b);

    for i in 0..max_len {
        let byte_a = if i < len_a { bytes_a[i] } else { 0 };
        let byte_b = if i < len_b { bytes_b[i] } else { 0 };
        mismatch |= byte_a ^ byte_b;
    }

    mismatch == 0
}

pub fn verify_token(expected_token: &str, provided_token: &str) -> bool {
    timing_safe_equal(expected_token, provided_token)
}
`,
  },
  {
    id: 'rust-l4-token-bucket',
    label: 'Track 5 (Level 4) - Token Bucket Rate Limiter (Rust)',
    track: 5,
    level: 4,
    type: 'Build Feature',
    language: 'Rust',
    raw: `---METADATA---
track: 5
level: 4
type: Build Feature
topic: Distributed Systems & Workers
title: Token Bucket Rate Limiter with Time Refill
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
BUILD

GOAL:
Implement a Token Bucket rate limiter struct in Rust that tracks token capacity and refills tokens over elapsed seconds according to a fill rate.

CURRENT VS EXPECTED BEHAVIOR:
- Current: consume always returns allowed = true without tracking capacity or refilling over time.
- Expected: Calculates tokens added based on elapsed seconds (elapsed_sec * refill_rate_per_sec), clamps at max_capacity, and permits requests only when tokens >= tokens_requested.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Token Bucket algorithm for rate limiting (Search: "token bucket algorithm rate limiting")
- Syntax: Rust struct with mutable methods (&mut self) and f64 arithmetic (Search: "rust struct mutable method state")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Update last_refill_sec whenever refilling occurs.
- Tip: Clamp current tokens so it never exceeds max_capacity.
- Tip: When allowed, deduct tokens_requested from available tokens.

WHERE TO WORK:
- Edit: src/solution.rs (Target struct: TokenBucket)
- Reference: src/types.rs (RateLimitResult)

HOW TO APPROACH THIS:
1. On consume, check if now_sec > last_refill_sec.
2. If time elapsed, add (now_sec - last_refill_sec) as f64 * refill_rate_per_sec, capped at max_capacity, and update last_refill_sec.
3. Check if tokens >= tokens_requested. If so, deduct and return allowed = true.
4. Otherwise, return allowed = false with floored remaining tokens.

EDGE CASES TO WATCH:
- Consuming full capacity: remaining tokens drop to 0.
- Time not advancing: if now_sec <= last_refill_sec, no tokens refilled.

---FILE: src/types.rs (readonly)---
#[derive(Debug, PartialEq, Eq, Clone)]
pub struct RateLimitResult {
    pub allowed: bool,
    pub remaining_tokens: i64,
}

---FILE: src/solution.rs---
use crate::types::RateLimitResult;

pub struct TokenBucket {
    pub max_capacity: f64,
    pub refill_rate_per_sec: f64,
    tokens: f64,
    last_refill_sec: i64,
}

impl TokenBucket {
    pub fn new(max_capacity: f64, refill_rate_per_sec: f64, initial_time_sec: i64) -> Self {
        Self {
            max_capacity,
            refill_rate_per_sec,
            tokens: max_capacity,
            last_refill_sec: initial_time_sec,
        }
    }

    pub fn consume(&mut self, tokens_requested: f64, now_sec: i64) -> RateLimitResult {
        // TODO: Refill based on elapsed time, check capacity, and deduct tokens
        RateLimitResult {
            allowed: true,
            remaining_tokens: self.tokens.floor() as i64,
        }
    }
}

---TESTS---
Input: let mut b = TokenBucket::new(10.0, 2.0, 0); b.consume(5.0, 0)
Expected: RateLimitResult { allowed: true, remaining_tokens: 5 }
Description: Consuming tokens within capacity succeeds and decrements count

Input: let mut b = TokenBucket::new(10.0, 2.0, 0); b.consume(8.0, 0); b.consume(5.0, 0)
Expected: RateLimitResult { allowed: false, remaining_tokens: 2 }
Description: Consuming more tokens than remaining capacity is rejected

Input: let mut b = TokenBucket::new(10.0, 2.0, 0); b.consume(10.0, 0); b.consume(3.0, 2)
Expected: RateLimitResult { allowed: true, remaining_tokens: 1 }
Description: Tokens refill over elapsed time (4 refilled after 2 seconds)

---REFERENCE---
use crate::types::RateLimitResult;

pub struct TokenBucket {
    pub max_capacity: f64,
    pub refill_rate_per_sec: f64,
    tokens: f64,
    last_refill_sec: i64,
}

impl TokenBucket {
    pub fn new(max_capacity: f64, refill_rate_per_sec: f64, initial_time_sec: i64) -> Self {
        Self {
            max_capacity,
            refill_rate_per_sec,
            tokens: max_capacity,
            last_refill_sec: initial_time_sec,
        }
    }

    fn refill(&mut self, now_sec: i64) {
        if now_sec <= self.last_refill_sec {
            return;
        }
        let elapsed = (now_sec - self.last_refill_sec) as f64;
        let added = elapsed * self.refill_rate_per_sec;
        self.tokens = self.max_capacity.min(self.tokens + added);
        self.last_refill_sec = now_sec;
    }

    pub fn consume(&mut self, tokens_requested: f64, now_sec: i64) -> RateLimitResult {
        self.refill(now_sec);

        if self.tokens >= tokens_requested {
            self.tokens -= tokens_requested;
            RateLimitResult {
                allowed: true,
                remaining_tokens: self.tokens.floor() as i64,
            }
        } else {
            RateLimitResult {
                allowed: false,
                remaining_tokens: self.tokens.floor() as i64,
            }
        }
    }
}
`,
  },
  {
    id: 'rust-l4-field-validator-touched',
    label: 'Track 2 (Level 4) - Form Field Touched State Machine (Rust)',
    track: 2,
    level: 4,
    type: 'Build Feature',
    language: 'Rust',
    raw: `---METADATA---
track: 2
level: 4
type: Build Feature
topic: Frontend UI & Forms
title: Form Field Touched State and Error Visibility Manager
editableLanguage: rust
editableFiles: src/solution.rs

---TASK---
ACTION:
BUILD

GOAL:
Build an immutable form field state manager in Rust that tracks value, touched status, and shows validation errors only after a field has been touched.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Field state methods return unmodified clones or default values without tracking touched status.
- Expected: create_field initializes field with touched = false; update_field updates value and re-validates while preserving touched; touch_field marks touched = true; get_visible_error returns Some(error) only when touched is true.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Form touched states and error visibility UX (Search: "form validation touched state pattern")
- Syntax: Rust immutable struct updates and function pointer types (Search: "rust function pointer fn argument")

PRACTICAL TIPS & WATCHOUTS:
- Tip: In update_field, remember to retain field.touched while re-evaluating validator(new_value).
- Tip: When input becomes valid, error should become None immediately.

WHERE TO WORK:
- Edit: src/solution.rs (Target functions: create_field, update_field, touch_field, get_visible_error)
- Reference: src/types.rs (FieldState struct and ValidatorFn type alias)

HOW TO APPROACH THIS:
1. Implement create_field: return FieldState with value, touched = false, and error = validator(initial_value).
2. Implement update_field: return new FieldState with new_value, preserved touched flag, and validator(new_value).
3. Implement touch_field: return FieldState with touched = true and existing value/error.
4. Implement get_visible_error: return field.error if field.touched is true, else None.

EDGE CASES TO WATCH:
- Untouched field with invalid input: get_visible_error returns None.
- Touched field with valid input: get_visible_error returns None.

---FILE: src/types.rs (readonly)---
#[derive(Debug, PartialEq, Eq, Clone)]
pub struct FieldState {
    pub value: String,
    pub touched: bool,
    pub error: Option<String>,
}

pub type ValidatorFn = fn(&str) -> Option<String>;

---FILE: src/solution.rs---
use crate::types::{FieldState, ValidatorFn};

pub fn create_field(initial_value: &str, validator: ValidatorFn) -> FieldState {
    // TODO: Initialize field state with touched = false and validate initial_value
    FieldState {
        value: initial_value.to_string(),
        touched: false,
        error: None,
    }
}

pub fn update_field(field: &FieldState, new_value: &str, validator: ValidatorFn) -> FieldState {
    // TODO: Return new state with updated value and re-validated error while preserving touched
    field.clone()
}

pub fn touch_field(field: &FieldState) -> FieldState {
    // TODO: Mark field as touched
    field.clone()
}

pub fn get_visible_error(field: &FieldState) -> Option<String> {
    // TODO: Return error only when touched is true
    None
}

---TESTS---
Input: fn req(v: &str) -> Option<String> { if v.is_empty() { Some("Required".to_string()) } else { None } }; let f = create_field("", req); get_visible_error(&f)
Expected: None
Description: Untouched invalid field hides error message

Input: fn req(v: &str) -> Option<String> { if v.is_empty() { Some("Required".to_string()) } else { None } }; let f = create_field("", req); get_visible_error(&touch_field(&f))
Expected: Some("Required".to_string())
Description: Touched invalid field reveals error message

Input: fn min_len(v: &str) -> Option<String> { if v.len() < 3 { Some("Too short".to_string()) } else { None } }; let f = touch_field(&create_field("", min_len)); get_visible_error(&update_field(&f, "Valid", min_len))
Expected: None
Description: Updating touched field with valid input clears error

---REFERENCE---
use crate::types::{FieldState, ValidatorFn};

pub fn create_field(initial_value: &str, validator: ValidatorFn) -> FieldState {
    FieldState {
        value: initial_value.to_string(),
        touched: false,
        error: validator(initial_value),
    }
}

pub fn update_field(field: &FieldState, new_value: &str, validator: ValidatorFn) -> FieldState {
    FieldState {
        value: new_value.to_string(),
        touched: field.touched,
        error: validator(new_value),
    }
}

pub fn touch_field(field: &FieldState) -> FieldState {
    FieldState {
        value: field.value.clone(),
        touched: true,
        error: field.error.clone(),
    }
}

pub fn get_visible_error(field: &FieldState) -> Option<String> {
    if field.touched {
        field.error.clone()
    } else {
        None
    }
}
`,
  },

  // ==========================================
  // LEVEL 6 (2 Challenges) - Multi-Task & Multi-File
  // ==========================================
  {
    id: 'rust-l6-rbac-route-guard',
    label: 'Track 1 (Level 6) - RBAC Policy Guard & Route Interceptor (Rust)',
    track: 1,
    level: 6,
    type: 'Security Hardening',
    language: 'Rust',
    raw: `---METADATA---
track: 1
level: 6
type: Security Hardening
topic: Auth, JWT & Sessions
title: RBAC Hierarchical Policy Resolver and Route Guard
editableLanguage: rust
editableFiles: src/policy.rs, src/route_guard.rs

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file Role-Based Access Control (RBAC) engine in Rust that resolves inherited role permissions in policy.rs and enforces route authorization decisions with denial codes in route_guard.rs.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Route access returns unauthenticated for all requests without resolving permissions.
- Expected: Resolves transitive permissions from role inheritance (Admin -> Editor -> Viewer), checks required permissions for route actions, and permits resource owners when allow_owner is configured.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Hierarchical RBAC and resource ownership policies (Search: "hierarchical rbac permissions pattern")
- Syntax: Multi-file Rust modules, HashSet, and match expressions (Search: "rust hashset collect permissions match")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Track visited roles when resolving inheritance to avoid circular recursion.
- Tip: Role hierarchy: Viewer grants Read; Editor grants Write and inherits Viewer; Admin grants Delete, Publish, and inherits Editor.
- Tip: If policy.allow_owner is true, compare user.id with resource.owner_id before denying access.

WHERE TO WORK:
- Edit: src/policy.rs (Target functions: resolve_user_permissions, has_permission)
- Edit: src/route_guard.rs (Target function: evaluate_route_access)
- Reference: src/types.rs (Role, Permission, UserContext, ResourceContext, RoutePolicy, AccessDecision)

HOW TO APPROACH THIS:
1. In src/policy.rs, implement resolve_user_permissions to traverse user roles and inherited roles, inserting all permissions into a HashSet.
2. In src/policy.rs, implement has_permission to check if the required permission is contained in the set.
3. In src/route_guard.rs, check if user is None; if so, return allowed: false with reason: Unauthenticated.
4. If policy.allow_owner is true and resource.owner_id matches user.id, grant access.
5. If policy has a required_permission, resolve permissions and check; if missing, return InsufficientPermissions.

EDGE CASES TO WATCH:
- Unauthenticated user (None): returns allowed = false, reason = Some(AccessReason::Unauthenticated).
- Resource owner override: user lacks permission but is resource owner -> allowed = true.

---FILE: src/types.rs (readonly)---
#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub enum Role {
    Admin,
    Editor,
    Viewer,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub enum Permission {
    Read,
    Write,
    Delete,
    Publish,
}

#[derive(Debug, Clone)]
pub struct UserContext {
    pub id: String,
    pub roles: Vec<Role>,
}

#[derive(Debug, Clone)]
pub struct ResourceContext {
    pub owner_id: String,
}

#[derive(Debug, Clone, Default)]
pub struct RoutePolicy {
    pub required_permission: Option<Permission>,
    pub allow_owner: bool,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum AccessReason {
    Unauthenticated,
    InsufficientPermissions,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct AccessDecision {
    pub allowed: bool,
    pub reason: Option<AccessReason>,
}

---FILE: src/policy.rs---
use std::collections::HashSet;
use crate::types::{Permission, Role};

pub fn resolve_user_permissions(roles: &[Role]) -> HashSet<Permission> {
    // TODO: Traverse roles and role inheritance to gather all distinct permissions
    HashSet::new()
}

pub fn has_permission(user_permissions: &HashSet<Permission>, required: Permission) -> bool {
    // TODO: Check if required permission is present in set
    false
}

---FILE: src/route_guard.rs---
use crate::policy::{has_permission, resolve_user_permissions};
use crate::types::{AccessDecision, AccessReason, ResourceContext, RoutePolicy, UserContext};

pub fn evaluate_route_access(
    user: Option<&UserContext>,
    resource: Option<&ResourceContext>,
    policy: &RoutePolicy,
) -> AccessDecision {
    // TODO: 1. Check if user is present
    // 2. Check resource ownership bypass if policy.allow_owner is true
    // 3. Check resolved permissions against policy.required_permission
    AccessDecision {
        allowed: false,
        reason: Some(AccessReason::Unauthenticated),
    }
}

---TESTS---
Input: evaluate_route_access(Some(&UserContext { id: "u1".to_string(), roles: vec![Role::Admin] }), None, &RoutePolicy { required_permission: Some(Permission::Read), allow_owner: false })
Expected: AccessDecision { allowed: true, reason: None }
Description: Admin inherits viewer read permission and is granted access

Input: evaluate_route_access(Some(&UserContext { id: "u2".to_string(), roles: vec![Role::Viewer] }), None, &RoutePolicy { required_permission: Some(Permission::Write), allow_owner: false })
Expected: AccessDecision { allowed: false, reason: Some(AccessReason::InsufficientPermissions) }
Description: Viewer lacks write permission and is denied

Input: evaluate_route_access(Some(&UserContext { id: "u3".to_string(), roles: vec![Role::Viewer] }), Some(&ResourceContext { owner_id: "u3".to_string() }), &RoutePolicy { required_permission: Some(Permission::Write), allow_owner: true })
Expected: AccessDecision { allowed: true, reason: None }
Description: Resource owner bypasses required permission when allow_owner is enabled

Input: evaluate_route_access(None, None, &RoutePolicy { required_permission: Some(Permission::Read), allow_owner: false })
Expected: AccessDecision { allowed: false, reason: Some(AccessReason::Unauthenticated) }
Description: Unauthenticated user is denied with unauthenticated reason

---REFERENCE---
// src/policy.rs
use std::collections::HashSet;
use crate::types::{Permission, Role};

pub fn resolve_user_permissions(roles: &[Role]) -> HashSet<Permission> {
    let mut permissions = HashSet::new();
    let mut visited = HashSet::new();

    fn collect(role: Role, perms: &mut HashSet<Permission>, visited: &mut HashSet<Role>) {
        if !visited.insert(role) {
            return;
        }

        match role {
            Role::Viewer => {
                perms.insert(Permission::Read);
            }
            Role::Editor => {
                perms.insert(Permission::Write);
                collect(Role::Viewer, perms, visited);
            }
            Role::Admin => {
                perms.insert(Permission::Delete);
                perms.insert(Permission::Publish);
                collect(Role::Editor, perms, visited);
            }
        }
    }

    for &role in roles {
        collect(role, &mut permissions, &mut visited);
    }

    permissions
}

pub fn has_permission(user_permissions: &HashSet<Permission>, required: Permission) -> bool {
    user_permissions.contains(&required)
}

// src/route_guard.rs
use crate::policy::{has_permission, resolve_user_permissions};
use crate::types::{AccessDecision, AccessReason, ResourceContext, RoutePolicy, UserContext};

pub fn evaluate_route_access(
    user: Option<&UserContext>,
    resource: Option<&ResourceContext>,
    policy: &RoutePolicy,
) -> AccessDecision {
    let user = match user {
        Some(u) => u,
        None => {
            return AccessDecision {
                allowed: false,
                reason: Some(AccessReason::Unauthenticated),
            };
        }
    };

    if policy.allow_owner {
        if let Some(res) = resource {
            if res.owner_id == user.id {
                return AccessDecision {
                    allowed: true,
                    reason: None,
                };
            }
        }
    }

    if let Some(req_perm) = policy.required_permission {
        let perms = resolve_user_permissions(&user.roles);
        if !has_permission(&perms, req_perm) {
            return AccessDecision {
                allowed: false,
                reason: Some(AccessReason::InsufficientPermissions),
            };
        }
    }

    AccessDecision {
        allowed: true,
        reason: None,
    }
}
`,
  },
  {
    id: 'rust-l6-optimistic-lock-store',
    label: 'Track 2 (Level 6) - Optimistic Locking Document Store (Rust)',
    track: 2,
    level: 6,
    type: 'Build Feature',
    language: 'Rust',
    raw: `---METADATA---
track: 2
level: 6
type: Build Feature
topic: State & Async Race Conditions
title: Optimistic Locking Store with Conflict Resolution
editableLanguage: rust
editableFiles: src/versioned_store.rs, src/mutation_coordinator.rs

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file optimistic concurrency store in Rust where document updates check version tags and conflict handlers are triggered when concurrent mutations conflict.

CURRENT VS EXPECTED BEHAVIOR:
- Current: update_with_version always fails with NotFound without checking or updating store documents.
- Expected: Verifies expected_version matches document.version; increments version by 1 and merges new_data on match; returns Conflict with current_version on mismatch; triggers on_conflict callback.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Optimistic Concurrency Control (OCC) and version numbers (Search: "optimistic concurrency control version field")
- Syntax: Rust HashMap entry/get_mut, FnOnce closures, and enum return types (Search: "rust hashmap mutable update closure")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Always increment version by 1 on every successful mutation.
- Tip: In mutation_coordinator.rs, invoke on_conflict callback with the latest document state when a conflict occurs.

WHERE TO WORK:
- Edit: src/versioned_store.rs (Target methods: insert, get, update_with_version)
- Edit: src/mutation_coordinator.rs (Target function: execute_optimistic_mutation)
- Reference: src/models.rs (VersionedDoc, MutationFailure, MutationOutcome)

HOW TO APPROACH THIS:
1. In src/versioned_store.rs, check if document exists. If not, return MutationOutcome::Failure(MutationFailure::NotFound).
2. Check if existing.version == expected_version. If mismatched, return MutationOutcome::Failure(MutationFailure::Conflict { current_version: existing.version }).
3. Bump existing.version by 1, merge new_data key-values, and return MutationOutcome::Success with updated doc.
4. In src/mutation_coordinator.rs, run update_with_version. If outcome is Conflict and on_conflict is provided, retrieve document and invoke callback.

EDGE CASES TO WATCH:
- Document not found: returns Failure(MutationFailure::NotFound).
- Version mismatch: returns Failure(MutationFailure::Conflict { current_version }).

---FILE: src/models.rs (readonly)---
use std::collections::HashMap;

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct VersionedDoc {
    pub id: String,
    pub version: i64,
    pub data: HashMap<String, String>,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum MutationFailure {
    Conflict { current_version: i64 },
    NotFound,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum MutationOutcome {
    Success { doc: VersionedDoc },
    Failure(MutationFailure),
}

---FILE: src/versioned_store.rs---
use std::collections::HashMap;
use crate::models::{MutationFailure, MutationOutcome, VersionedDoc};

pub struct VersionedStore {
    docs: HashMap<String, VersionedDoc>,
}

impl VersionedStore {
    pub fn new() -> Self {
        Self {
            docs: HashMap::new(),
        }
    }

    pub fn insert(&mut self, doc: VersionedDoc) {
        self.docs.insert(doc.id.clone(), doc);
    }

    pub fn get(&self, id: &str) -> Option<VersionedDoc> {
        self.docs.get(id).cloned()
    }

    pub fn update_with_version(
        &mut self,
        id: &str,
        expected_version: i64,
        new_data: HashMap<String, String>,
    ) -> MutationOutcome {
        // TODO: Verify expected_version matches current version, increment version, and save
        MutationOutcome::Failure(MutationFailure::NotFound)
    }
}

---FILE: src/mutation_coordinator.rs---
use std::collections::HashMap;
use crate::models::{MutationOutcome, VersionedDoc};
use crate::versioned_store::VersionedStore;

pub fn execute_optimistic_mutation<F>(
    store: &mut VersionedStore,
    id: &str,
    expected_version: i64,
    new_data: HashMap<String, String>,
    on_conflict: Option<F>,
) -> MutationOutcome
where
    F: FnOnce(&VersionedDoc),
{
    // TODO: Execute update, call on_conflict callback if conflict occurs, return outcome
    store.update_with_version(id, expected_version, new_data)
}

---TESTS---
Input: let mut s = VersionedStore::new(); let mut d = HashMap::new(); d.insert("name".to_string(), "A".to_string()); s.insert(VersionedDoc { id: "doc1".to_string(), version: 1, data: d }); let mut up = HashMap::new(); up.insert("name".to_string(), "B".to_string()); s.update_with_version("doc1", 1, up)
Expected: MutationOutcome::Success { doc: VersionedDoc { id: "doc1".to_string(), version: 2, data: [("name".to_string(), "B".to_string())].into_iter().collect() } }
Description: Matching version successfully updates document and increments version to 2

Input: let mut s = VersionedStore::new(); let mut d = HashMap::new(); d.insert("name".to_string(), "A".to_string()); s.insert(VersionedDoc { id: "doc1".to_string(), version: 2, data: d }); let mut up = HashMap::new(); up.insert("name".to_string(), "C".to_string()); s.update_with_version("doc1", 1, up)
Expected: MutationOutcome::Failure(MutationFailure::Conflict { current_version: 2 })
Description: Stale version 1 on version 2 document is rejected with conflict reason

Input: let mut s = VersionedStore::new(); let mut up = HashMap::new(); up.insert("name".to_string(), "X".to_string()); s.update_with_version("missing", 1, up)
Expected: MutationOutcome::Failure(MutationFailure::NotFound)
Description: Non-existent document ID returns not_found

---REFERENCE---
// src/versioned_store.rs
use std::collections::HashMap;
use crate::models::{MutationFailure, MutationOutcome, VersionedDoc};

pub struct VersionedStore {
    docs: HashMap<String, VersionedDoc>,
}

impl VersionedStore {
    pub fn new() -> Self {
        Self {
            docs: HashMap::new(),
        }
    }

    pub fn insert(&mut self, doc: VersionedDoc) {
        self.docs.insert(doc.id.clone(), doc);
    }

    pub fn get(&self, id: &str) -> Option<VersionedDoc> {
        self.docs.get(id).cloned()
    }

    pub fn update_with_version(
        &mut self,
        id: &str,
        expected_version: i64,
        new_data: HashMap<String, String>,
    ) -> MutationOutcome {
        let existing = match self.docs.get_mut(id) {
            Some(doc) => doc,
            None => return MutationOutcome::Failure(MutationFailure::NotFound),
        };

        if existing.version != expected_version {
            return MutationOutcome::Failure(MutationFailure::Conflict {
                current_version: existing.version,
            });
        }

        existing.version += 1;
        for (k, v) in new_data {
            existing.data.insert(k, v);
        }

        MutationOutcome::Success {
            doc: existing.clone(),
        }
    }
}

// src/mutation_coordinator.rs
use std::collections::HashMap;
use crate::models::{MutationFailure, MutationOutcome, VersionedDoc};
use crate::versioned_store::VersionedStore;

pub fn execute_optimistic_mutation<F>(
    store: &mut VersionedStore,
    id: &str,
    expected_version: i64,
    new_data: HashMap<String, String>,
    on_conflict: Option<F>,
) -> MutationOutcome
where
    F: FnOnce(&VersionedDoc),
{
    let outcome = store.update_with_version(id, expected_version, new_data);

    if let MutationOutcome::Failure(MutationFailure::Conflict { .. }) = &outcome {
        if let Some(cb) = on_conflict {
            if let Some(current) = store.get(id) {
                cb(&current);
            }
        }
    }

    outcome
}
`,
  },

  // ==========================================
  // LEVEL 10 (2 Challenges) - Scale & Concurrency
  // ==========================================
  {
    id: 'rust-l10-idempotent-webhook-dispatcher',
    label: 'Track 5 (Level 10) - Idempotent Webhook Event Dispatcher (Rust)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'Rust',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Idempotent Webhook Dispatcher with Lease Locks and Deduplication
editableLanguage: rust
editableFiles: src/idempotency_registry.rs, src/event_pipeline.rs

---TASK---
ACTION:
BUILD

GOAL:
Build a distributed webhook delivery engine across idempotency_registry.rs and event_pipeline.rs in Rust that prevents duplicate executions, handles concurrency leases, and records delivery statuses.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Incoming webhook calls fail to acquire leases and return locked state without running handlers.
- Expected: Deduplicates events by event id, uses lease locks with expiration to guard in-flight processing, returns cached results on duplicate delivery, and executes handler safely.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Idempotency keys, distributed leasing, and replay prevention (Search: "webhook idempotency key pattern distributed lock")
- Syntax: Multi-file Rust modules, Result types, and FnOnce closures (Search: "rust lock lease manager pattern")

PRACTICAL TIPS & WATCHOUTS:
- Tip: If a lock lease is expired (now_ms >= record.expires_at_ms) and status is Processing, allow re-acquisition.
- Tip: When handler execution fails with Err, release the lease so future retries can run immediately.

WHERE TO WORK:
- Edit: src/idempotency_registry.rs (Target methods: acquire_lease, mark_completed, release_lease, get_record)
- Edit: src/event_pipeline.rs (Target function: process_webhook_event)
- Reference: src/types.rs (EventStatus, WebhookEvent, DispatchStatus, DispatchResult)

HOW TO APPROACH THIS:
1. In src/idempotency_registry.rs, check if event is already Completed. If so, return false. If Processing and unexpired, return false. Otherwise, record Processing status with expires_at_ms = now_ms + lease_duration_ms and return true.
2. In src/event_pipeline.rs, check if event is Completed. If so, return DispatchResult with Duplicate status and cached response.
3. Attempt to acquire lease (duration 5000ms). If failed, return Locked status.
4. Execute handler. On Ok(res), mark event Completed with response and return Processed status. On Err(err), release lease and return Err(err).

EDGE CASES TO WATCH:
- Expired in-flight lease: allows re-acquisition and processing.
- Duplicate completed event: returns cached result without re-executing handler.
- Concurrent duplicate: returns Locked status.

---FILE: src/types.rs (readonly)---
use std::collections::HashMap;

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum EventStatus {
    Pending,
    Processing,
    Completed,
    Failed,
}

#[derive(Debug, Clone)]
pub struct WebhookEvent {
    pub id: String,
    pub event_type: String,
    pub payload: HashMap<String, String>,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum DispatchStatus {
    Processed,
    Duplicate,
    Locked,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct DispatchResult {
    pub status: DispatchStatus,
    pub event_id: String,
    pub response: Option<String>,
}

---FILE: src/idempotency_registry.rs---
use std::collections::HashMap;
use crate::types::EventStatus;

#[derive(Clone, Debug)]
pub struct LeaseRecord {
    pub status: EventStatus,
    pub expires_at_ms: i64,
    pub result: Option<String>,
}

pub struct IdempotencyRegistry {
    records: HashMap<String, LeaseRecord>,
}

impl IdempotencyRegistry {
    pub fn new() -> Self {
        Self {
            records: HashMap::new(),
        }
    }

    pub fn acquire_lease(&mut self, event_id: &str, lease_duration_ms: i64, now_ms: i64) -> bool {
        // TODO: Return true if lease acquired; false if already processing or completed
        false
    }

    pub fn mark_completed(&mut self, event_id: &str, result: Option<String>) {
        // TODO: Set status to Completed and store result
    }

    pub fn release_lease(&mut self, event_id: &str) {
        // TODO: Delete or reset lease on failure
    }

    pub fn get_record(&self, event_id: &str) -> Option<&LeaseRecord> {
        self.records.get(event_id)
    }
}

---FILE: src/event_pipeline.rs---
use crate::idempotency_registry::IdempotencyRegistry;
use crate::types::{DispatchResult, DispatchStatus, WebhookEvent};

pub fn process_webhook_event<F>(
    registry: &mut IdempotencyRegistry,
    event: &WebhookEvent,
    now_ms: i64,
    handler: F,
) -> Result<DispatchResult, String>
where
    F: FnOnce(&WebhookEvent) -> Result<String, String>,
{
    // TODO: 1. Check existing record for completion
    // 2. Try acquire lease (lease_duration_ms = 5000)
    // 3. Execute handler, mark completed, or release on error
    Ok(DispatchResult {
        status: DispatchStatus::Locked,
        event_id: event.id.clone(),
        response: None,
    })
}

---TESTS---
Input: let mut reg = IdempotencyRegistry::new(); let evt = WebhookEvent { id: "evt_1".to_string(), event_type: "payment".to_string(), payload: HashMap::new() }; process_webhook_event(&mut reg, &evt, 1000, |_| Ok("paid".to_string()))
Expected: Ok(DispatchResult { status: DispatchStatus::Processed, event_id: "evt_1".to_string(), response: Some("paid".to_string()) })
Description: First event delivery executes handler and records completion

Input: let mut reg = IdempotencyRegistry::new(); let evt = WebhookEvent { id: "evt_1".to_string(), event_type: "payment".to_string(), payload: HashMap::new() }; process_webhook_event(&mut reg, &evt, 1000, |_| Ok("paid".to_string())).unwrap(); process_webhook_event(&mut reg, &evt, 1100, |_| Ok("refunded".to_string()))
Expected: Ok(DispatchResult { status: DispatchStatus::Duplicate, event_id: "evt_1".to_string(), response: Some("paid".to_string()) })
Description: Duplicate event returns cached response without re-executing handler

Input: let mut reg = IdempotencyRegistry::new(); reg.acquire_lease("evt_2", 5000, 1000); let evt = WebhookEvent { id: "evt_2".to_string(), event_type: "payment".to_string(), payload: HashMap::new() }; process_webhook_event(&mut reg, &evt, 2000, |_| Ok("ok".to_string()))
Expected: Ok(DispatchResult { status: DispatchStatus::Locked, event_id: "evt_2".to_string(), response: None })
Description: Concurrent request during active lease returns Locked status

---REFERENCE---
// src/idempotency_registry.rs
use std::collections::HashMap;
use crate::types::EventStatus;

#[derive(Clone, Debug)]
pub struct LeaseRecord {
    pub status: EventStatus,
    pub expires_at_ms: i64,
    pub result: Option<String>,
}

pub struct IdempotencyRegistry {
    records: HashMap<String, LeaseRecord>,
}

impl IdempotencyRegistry {
    pub fn new() -> Self {
        Self {
            records: HashMap::new(),
        }
    }

    pub fn acquire_lease(&mut self, event_id: &str, lease_duration_ms: i64, now_ms: i64) -> bool {
        if let Some(existing) = self.records.get(event_id) {
            if existing.status == EventStatus::Completed {
                return false;
            }
            if existing.status == EventStatus::Processing && now_ms < existing.expires_at_ms {
                return false;
            }
        }

        self.records.insert(
            event_id.to_string(),
            LeaseRecord {
                status: EventStatus::Processing,
                expires_at_ms: now_ms + lease_duration_ms,
                result: None,
            },
        );
        true
    }

    pub fn mark_completed(&mut self, event_id: &str, result: Option<String>) {
        self.records.insert(
            event_id.to_string(),
            LeaseRecord {
                status: EventStatus::Completed,
                expires_at_ms: i64::MAX,
                result,
            },
        );
    }

    pub fn release_lease(&mut self, event_id: &str) {
        if let Some(existing) = self.records.get(event_id) {
            if existing.status != EventStatus::Completed {
                self.records.remove(event_id);
            }
        }
    }

    pub fn get_record(&self, event_id: &str) -> Option<&LeaseRecord> {
        self.records.get(event_id)
    }
}

// src/event_pipeline.rs
use crate::idempotency_registry::IdempotencyRegistry;
use crate::types::{DispatchResult, DispatchStatus, EventStatus, WebhookEvent};

pub fn process_webhook_event<F>(
    registry: &mut IdempotencyRegistry,
    event: &WebhookEvent,
    now_ms: i64,
    handler: F,
) -> Result<DispatchResult, String>
where
    F: FnOnce(&WebhookEvent) -> Result<String, String>,
{
    if let Some(existing) = registry.get_record(&event.id) {
        if existing.status == EventStatus::Completed {
            return Ok(DispatchResult {
                status: DispatchStatus::Duplicate,
                event_id: event.id.clone(),
                response: existing.result.clone(),
            });
        }
    }

    let acquired = registry.acquire_lease(&event.id, 5000, now_ms);
    if !acquired {
        return Ok(DispatchResult {
            status: DispatchStatus::Locked,
            event_id: event.id.clone(),
            response: None,
        });
    }

    match handler(event) {
        Ok(res) => {
            registry.mark_completed(&event.id, Some(res.clone()));
            Ok(DispatchResult {
                status: DispatchStatus::Processed,
                event_id: event.id.clone(),
                response: Some(res),
            })
        }
        Err(err) => {
            registry.release_lease(&event.id);
            Err(err)
        }
    }
}
`,
  },
  {
    id: 'rust-l10-distributed-sliding-window-limiter',
    label: 'Track 5 (Level 10) - Sliding Window Counter with Drift Tolerance (Rust)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'Rust',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Sliding-Window Rate Limiter with Sub-Second Slicing and Drift Tolerance
editableLanguage: rust
editableFiles: src/sub_window_counter.rs, src/traffic_gate.rs

---TASK---
ACTION:
BUILD

GOAL:
Implement a high-throughput sliding-window rate limiter in Rust divided into granular sub-windows that tracks hit counters, evicts expired slices, and enforces request limits.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Always permits traffic with current_count = 0 without tracking hits or checking thresholds.
- Expected: Slices window into multiple sub-windows (e.g., key = timestamp_ms / sub_window_ms), aggregates hits within (now_ms - window_ms, now_ms], and rejects requests once total hits reach max_requests.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Sliding window counter rate limiting algorithm (Search: "sliding window counter rate limiting algorithm")
- Syntax: Rust integer division for bucket slicing and HashMap retain for eviction (Search: "rust hashmap retain bucket counter")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Sub-window bucket key is timestamp_ms / sub_window_ms.
- Tip: In prune_expired, remove buckets whose key is strictly less than (now_ms - window_ms) / sub_window_ms.
- Tip: When current_count < max_requests, record the hit and return allowed: true with current_count + 1.

WHERE TO WORK:
- Edit: src/sub_window_counter.rs (Target methods: record_hit, get_window_count, prune_expired)
- Edit: src/traffic_gate.rs (Target function: check_traffic_limit)
- Reference: src/clock.rs (GateConfig, GateDecision)

HOW TO APPROACH THIS:
1. In src/sub_window_counter.rs, map sub-window keys (timestamp_ms / sub_window_ms) to count in a HashMap.
2. In record_hit, increment the bucket count for timestamp_ms / sub_window_ms.
3. In prune_expired, retain only keys >= (now_ms - window_ms) / sub_window_ms.
4. In get_window_count, prune first, then sum all counts for keys in range [(now_ms - window_ms) / sub_window_ms, now_ms / sub_window_ms].
5. In src/traffic_gate.rs, check if current count >= max_requests. If so, return allowed: false; otherwise record hit and return allowed: true with incremented count.

EDGE CASES TO WATCH:
- Window boundary: only hits within the active sliding window window_ms contribute to count.
- Expired hits: past hits are pruned and do not block subsequent incoming traffic.

---FILE: src/clock.rs (readonly)---
#[derive(Debug, Clone, Copy)]
pub struct GateConfig {
    pub window_ms: i64,
    pub sub_window_ms: i64,
    pub max_requests: i64,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct GateDecision {
    pub allowed: bool,
    pub current_count: i64,
    pub reset_ms: i64,
}

---FILE: src/sub_window_counter.rs---
use std::collections::HashMap;

pub struct SubWindowCounter {
    buckets: HashMap<i64, i64>,
}

impl SubWindowCounter {
    pub fn new() -> Self {
        Self {
            buckets: HashMap::new(),
        }
    }

    pub fn record_hit(&mut self, timestamp_ms: i64, sub_window_ms: i64) {
        // TODO: Calculate sub-window bucket key and increment count
    }

    pub fn get_window_count(&mut self, now_ms: i64, window_ms: i64, sub_window_ms: i64) -> i64 {
        // TODO: Sum counts of all buckets falling within [now_ms - window_ms, now_ms]
        0
    }

    pub fn prune_expired(&mut self, now_ms: i64, window_ms: i64, sub_window_ms: i64) {
        // TODO: Remove buckets older than now_ms - window_ms
    }
}

---FILE: src/traffic_gate.rs---
use crate::clock::{GateConfig, GateDecision};
use crate::sub_window_counter::SubWindowCounter;

pub fn check_traffic_limit(
    counter: &mut SubWindowCounter,
    config: &GateConfig,
    now_ms: i64,
) -> GateDecision {
    // TODO: 1. Prune expired buckets
    // 2. Query current window count
    // 3. If under limit, record hit and allow; otherwise reject
    GateDecision {
        allowed: true,
        current_count: 0,
        reset_ms: 0,
    }
}

---TESTS---
Input: let mut c = SubWindowCounter::new(); check_traffic_limit(&mut c, &GateConfig { window_ms: 10000, sub_window_ms: 1000, max_requests: 5 }, 1000)
Expected: GateDecision { allowed: true, current_count: 1, reset_ms: 10000 }
Description: First request within window is permitted and incremented

Input: let mut c = SubWindowCounter::new(); let cfg = GateConfig { window_ms: 10000, sub_window_ms: 1000, max_requests: 5 }; for _ in 0..5 { check_traffic_limit(&mut c, &cfg, 1000); } check_traffic_limit(&mut c, &cfg, 1000)
Expected: GateDecision { allowed: false, current_count: 5, reset_ms: 10000 }
Description: Request exceeding 5 requests within sliding window is rejected

Input: let mut c = SubWindowCounter::new(); let cfg = GateConfig { window_ms: 10000, sub_window_ms: 1000, max_requests: 5 }; for _ in 0..5 { check_traffic_limit(&mut c, &cfg, 1000); } check_traffic_limit(&mut c, &cfg, 12000)
Expected: GateDecision { allowed: true, current_count: 1, reset_ms: 10000 }
Description: Requests in past window expire, permitting new requests

---REFERENCE---
// src/sub_window_counter.rs
use std::collections::HashMap;

pub struct SubWindowCounter {
    buckets: HashMap<i64, i64>,
}

impl SubWindowCounter {
    pub fn new() -> Self {
        Self {
            buckets: HashMap::new(),
        }
    }

    pub fn record_hit(&mut self, timestamp_ms: i64, sub_window_ms: i64) {
        let key = timestamp_ms / sub_window_ms;
        *self.buckets.entry(key).or_insert(0) += 1;
    }

    pub fn get_window_count(&mut self, now_ms: i64, window_ms: i64, sub_window_ms: i64) -> i64 {
        self.prune_expired(now_ms, window_ms, sub_window_ms);
        let min_time = now_ms - window_ms;
        let min_key = min_time / sub_window_ms;
        let max_key = now_ms / sub_window_ms;

        let mut total = 0;
        for key in min_key..=max_key {
            if let Some(&count) = self.buckets.get(&key) {
                total += count;
            }
        }
        total
    }

    pub fn prune_expired(&mut self, now_ms: i64, window_ms: i64, sub_window_ms: i64) {
        let min_time = now_ms - window_ms;
        let min_key = min_time / sub_window_ms;
        self.buckets.retain(|&k, _| k >= min_key);
    }
}

// src/traffic_gate.rs
use crate::clock::{GateConfig, GateDecision};
use crate::sub_window_counter::SubWindowCounter;

pub fn check_traffic_limit(
    counter: &mut SubWindowCounter,
    config: &GateConfig,
    now_ms: i64,
) -> GateDecision {
    counter.prune_expired(now_ms, config.window_ms, config.sub_window_ms);
    let current_count = counter.get_window_count(now_ms, config.window_ms, config.sub_window_ms);

    if current_count >= config.max_requests {
        GateDecision {
            allowed: false,
            current_count,
            reset_ms: config.window_ms,
        }
    } else {
        counter.record_hit(now_ms, config.sub_window_ms);
        GateDecision {
            allowed: true,
            current_count: current_count + 1,
            reset_ms: config.window_ms,
        }
    }
}
`,
  },
];
