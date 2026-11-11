import { SampleChallengeOption } from '../types';

export const PHP_CHALLENGES: SampleChallengeOption[] = [
  // ==========================================
  // LEVEL 1 (2 Challenges) - Foundations
  // ==========================================
  {
    id: 'php-l1-input-sanitizer',
    label: 'Track 1 (Level 1) - Input Sanitizer & Slugifier (PHP)',
    track: 1,
    level: 1,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 1
level: 1
type: Build Feature
topic: Backend API & Middleware
title: Input Sanitizer and URL Slugifier
editableLanguage: php
editableFiles: src/solution.php

---TASK---
ACTION:
BUILD

GOAL:
Build a slugifier function that normalizes a string into a clean, URL-safe slug by lowercasing, trimming, removing non-alphanumeric characters, and replacing whitespace with single hyphens.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The slugify function returns the raw string unchanged, leaving whitespace, uppercase letters, and special characters.
- Expected: Returns a lowercase string with spaces and underscores replaced by single hyphens, stripped of punctuation, and trimmed.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: URL slug normalization and regex sanitization (Search: "url slugify regex php")
- Syntax: mb_strtolower, trim, and preg_replace in PHP (Search: "php preg_replace slugify")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Multiple consecutive spaces should collapse into a single hyphen, not multiple hyphens.
- Tip: Remove leading and trailing hyphens from the final slug.

WHERE TO WORK:
- Edit: src/solution.php (Target function: slugify)

HOW TO APPROACH THIS:
1. Trim leading and trailing whitespace from the input and convert to lowercase using mb_strtolower.
2. Replace any non-alphanumeric characters (except spaces, hyphens, and underscores) with empty strings using preg_replace.
3. Replace one or more consecutive spaces or underscores with a single hyphen.
4. Trim any hyphens from the beginning or end of the result.

EDGE CASES TO WATCH:
- Multiple spaces: "Hello   World" -> "hello-world"
- Leading/trailing symbols: "---Keep Coding---" -> "keep-coding"
- Special characters: "What's New in 2026!?" -> "whats-new-in-2026"

---FILE: src/solution.php---
<?php

declare(strict_types=1);

function slugify(string $text): string
{
    // TODO: Lowercase, sanitize, collapse spaces to hyphens, and strip boundary hyphens.
    return $text;
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
<?php

declare(strict_types=1);

function slugify(string $text): string
{
    $text = mb_strtolower(trim($text), 'UTF-8');
    $text = preg_replace('/[^a-z0-9\\s_-]/', '', $text) ?? '';
    $text = preg_replace('/[\\s_]+/', '-', $text) ?? '';
    return trim($text, '-');
}
`,
  },
  {
    id: 'php-l1-expiry-guard',
    label: 'Track 1 (Level 1) - Token Expiry Timestamp Guard (PHP)',
    track: 1,
    level: 1,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 1
level: 1
type: Build Feature
topic: Auth, JWT & Sessions
title: Token Expiration Timestamp Guard
editableLanguage: php
editableFiles: src/solution.php

---TASK---
ACTION:
BUILD

GOAL:
Implement a defensive token expiration guard in PHP that validates Unix epoch timestamps, rejects non-positive or corrupt values, and respects an optional clock-skew tolerance.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The function stub always returns false, allowing expired or corrupt tokens to pass authorization checks.
- Expected: Returns true if tokenExpSec is invalid (<= 0) or has arrived/passed relative to currentTimestampSec minus clockSkewSec. Returns false only when tokenExpSec is strictly in the future.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Unix epoch timestamps, token expiration, and clock-skew tolerance (Search: "jwt epoch timestamp clock skew php")
- Syntax: PHP strict types, default function parameters, and integer comparisons (Search: "php 8 typed function default arguments")

PRACTICAL TIPS & WATCHOUTS:
- Tip: If tokenExpSec is 0 or negative, treat it as expired (return true).
- Tip: Default clockSkewSec to 0 when omitted.

WHERE TO WORK:
- Edit: src/solution.php (Target function: isTokenExpired)

HOW TO APPROACH THIS:
1. Verify that tokenExpSec is a positive integer greater than zero.
2. Calculate the effective cutoff timestamp by subtracting clockSkewSec from currentTimestampSec.
3. Return true if tokenExpSec is at or before the cutoff timestamp, otherwise false.

EDGE CASES TO WATCH:
- Exact boundary: tokenExpSec === currentTimestampSec returns true.
- Clock skew tolerance: a token that expired 10s ago is still accepted if clockSkewSec is 30.
- Corrupt timestamp: tokenExpSec <= 0 returns true.

---FILE: src/solution.php---
<?php

declare(strict_types=1);

function isTokenExpired(int $tokenExpSec, int $currentTimestampSec, int $clockSkewSec = 0): bool
{
    // TODO: Validate timestamps, apply clockSkewSec tolerance, and return expiration status
    return false;
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
<?php

declare(strict_types=1);

function isTokenExpired(int $tokenExpSec, int $currentTimestampSec, int $clockSkewSec = 0): bool
{
    if ($tokenExpSec <= 0) {
        return true;
    }
    $effectiveNow = $currentTimestampSec - max(0, $clockSkewSec);
    return $tokenExpSec <= $effectiveNow;
}
`,
  },

  // ==========================================
  // LEVEL 3 (3 Challenges) - Handlers & State
  // ==========================================
  {
    id: 'php-l3-bearer-auth',
    label: 'Track 1 (Level 3) - Authorization Header Parser (PHP)',
    track: 1,
    level: 3,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 1
level: 3
type: Build Feature
topic: Auth, JWT & Sessions
title: HTTP Authorization Bearer Token Parser
editableLanguage: php
editableFiles: src/solution.php

---TASK---
ACTION:
BUILD

GOAL:
Extract and validate the raw token from an HTTP Authorization header string, verifying the Bearer scheme and returning a typed associative array.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Returns null or unparsed headers without validating the Bearer scheme.
- Expected: Returns ['valid' => true, 'token' => string] when header starts with "Bearer " and has a non-empty token; otherwise returns ['valid' => false, 'error' => string].

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: HTTP Bearer Authentication scheme RFC 6750 (Search: "http authorization header bearer format rfc 6750")
- Syntax: PHP string functions stripos and substr (Search: "php parse bearer token header")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Match the scheme case-insensitively or check standard "Bearer " prefix.
- Tip: Whitespace around the token must be trimmed. If no token remains after trimming, return missing_token error.

WHERE TO WORK:
- Edit: src/solution.php (Target function: parseBearerToken)
- Reference: src/types.php (AuthHeaderError constants and result shape)

HOW TO APPROACH THIS:
1. Check if the header is null or empty after trimming. Return ['valid' => false, 'error' => 'missing_header'].
2. Check if the header starts with "bearer " (case-insensitive). If not, return ['valid' => false, 'error' => 'invalid_scheme'].
3. Extract the token substring (offset 7) and trim it. If empty, return ['valid' => false, 'error' => 'missing_token'].
4. Return ['valid' => true, 'token' => $token].

EDGE CASES TO WATCH:
- Empty or null header: "" or null -> missing_header
- Missing scheme: "token123" -> invalid_scheme
- Bearer with only spaces: "Bearer    " -> missing_token

---FILE: src/types.php (readonly)---
<?php

declare(strict_types=1);

/**
 * Expected AuthHeaderResult associative array shape:
 * When valid:   ['valid' => true, 'token' => string]
 * When invalid: ['valid' => false, 'error' => 'missing_header' | 'invalid_scheme' | 'missing_token']
 */
final class AuthHeaderError
{
    public const MISSING_HEADER = 'missing_header';
    public const INVALID_SCHEME = 'invalid_scheme';
    public const MISSING_TOKEN = 'missing_token';
}

---FILE: src/solution.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

/**
 * @return array{valid: bool, token?: string, error?: string}
 */
function parseBearerToken(?string $headerValue): array
{
    // TODO: Parse and validate Bearer scheme
    return ['valid' => false, 'error' => AuthHeaderError::MISSING_HEADER];
}

---TESTS---
Input: parseBearerToken("Bearer eyJhbGciOiJIUzI1NiJ9")
Expected: ['valid' => true, 'token' => 'eyJhbGciOiJIUzI1NiJ9']
Description: Valid Bearer header returns parsed token

Input: parseBearerToken("Basic dXNlcjpwYXNz")
Expected: ['valid' => false, 'error' => 'invalid_scheme']
Description: Non-Bearer scheme returns invalid_scheme error

Input: parseBearerToken("Bearer    ")
Expected: ['valid' => false, 'error' => 'missing_token']
Description: Bearer header with empty token returns missing_token error

---REFERENCE---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

function parseBearerToken(?string $headerValue): array
{
    if ($headerValue === null) {
        return ['valid' => false, 'error' => AuthHeaderError::MISSING_HEADER];
    }

    $trimmed = trim($headerValue);
    if ($trimmed === '') {
        return ['valid' => false, 'error' => AuthHeaderError::MISSING_HEADER];
    }

    if (stripos($trimmed, 'bearer ') !== 0) {
        return ['valid' => false, 'error' => AuthHeaderError::INVALID_SCHEME];
    }

    $token = trim(substr($trimmed, 7));
    if ($token === '') {
        return ['valid' => false, 'error' => AuthHeaderError::MISSING_TOKEN];
    }

    return ['valid' => true, 'token' => $token];
}
`,
  },
  {
    id: 'php-l3-ttl-cache',
    label: 'Track 2 (Level 3) - In-Memory TTL Cache (PHP)',
    track: 2,
    level: 3,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 2
level: 3
type: Build Feature
topic: Backend API & Middleware
title: In-Memory TTL Cache with Expiration
editableLanguage: php
editableFiles: src/solution.php

---TASK---
ACTION:
BUILD

GOAL:
Implement a lightweight in-memory cache supporting set, get, and size operations with millisecond time-to-live (TTL) expiration.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The cache retains keys forever without checking TTL expiration.
- Expected: get(key, nowMs) returns the value if not expired, or null if expired or missing. Expired entries are evicted when accessed.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: TTL caching and lazy eviction strategy (Search: "in memory ttl cache eviction php")
- Syntax: PHP class properties, associative arrays, and unset (Search: "php in-memory cache class")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Calculate expiresAtMs as nowMs + ttlMs.
- Tip: In get(key, nowMs), if nowMs >= entry->expiresAtMs, unset the entry from the store and return null.

WHERE TO WORK:
- Edit: src/solution.php (Target methods: set, get, size in MemoryCache)

HOW TO APPROACH THIS:
1. Store values with their calculated expiration timestamp (nowMs + ttlMs).
2. In get(), check if the key exists and if nowMs >= expiresAtMs.
3. If expired, clean up the key from internal storage and return null.
4. In size(), count non-expired items while purging expired keys.

EDGE CASES TO WATCH:
- Exact boundary: nowMs === expiresAtMs is considered expired.
- Non-existent key: returns null without error.

---FILE: src/solution.php---
<?php

declare(strict_types=1);

final class CacheEntry
{
    public function __construct(
        public readonly mixed $value,
        public readonly int $expiresAtMs
    ) {}
}

class MemoryCache
{
    /** @var array<string, CacheEntry> */
    private array $store = [];

    public function set(string $key, mixed $value, int $ttlMs, int $nowMs): void
    {
        // TODO: Store value with calculated expiration timestamp
    }

    public function get(string $key, int $nowMs): mixed
    {
        // TODO: Return value if unexpired, or null if expired/missing
        return null;
    }

    public function size(int $nowMs): int
    {
        // TODO: Return count of currently valid (non-expired) entries
        return 0;
    }
}

---TESTS---
Input: $c = new MemoryCache(); $c->set("user:1", "Alice", 1000, 100); $c->get("user:1", 500)
Expected: "Alice"
Description: Retrieving key before TTL expiration returns stored value

Input: $c = new MemoryCache(); $c->set("user:1", "Alice", 1000, 100); $c->get("user:1", 1200)
Expected: null
Description: Retrieving key after TTL expiration returns null

Input: $c = new MemoryCache(); $c->set("a", 1, 500, 0); $c->set("b", 2, 2000, 0); $c->size(1000)
Expected: 1
Description: Size returns count of non-expired entries

---REFERENCE---
<?php

declare(strict_types=1);

final class CacheEntry
{
    public function __construct(
        public readonly mixed $value,
        public readonly int $expiresAtMs
    ) {}
}

class MemoryCache
{
    /** @var array<string, CacheEntry> */
    private array $store = [];

    public function set(string $key, mixed $value, int $ttlMs, int $nowMs): void
    {
        $this->store[$key] = new CacheEntry($value, $nowMs + $ttlMs);
    }

    public function get(string $key, int $nowMs): mixed
    {
        if (!isset($this->store[$key])) {
            return null;
        }

        $entry = $this->store[$key];
        if ($nowMs >= $entry->expiresAtMs) {
            unset($this->store[$key]);
            return null;
        }

        return $entry->value;
    }

    public function size(int $nowMs): int
    {
        $count = 0;
        foreach ($this->store as $key => $entry) {
            if ($nowMs < $entry->expiresAtMs) {
                $count++;
            } else {
                unset($this->store[$key]);
            }
        }
        return $count;
    }
}
`,
  },
  {
    id: 'php-l3-pagination-bounds',
    label: 'Track 3 (Level 3) - API Pagination Parameters Parser (PHP)',
    track: 3,
    level: 3,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 3
level: 3
type: Build Feature
topic: Database & SQL Schemas
title: API Pagination Query Parser with Boundary Clamping
editableLanguage: php
editableFiles: src/solution.php

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
- Syntax: PHP min, max, and is_numeric functions (Search: "php clamp integer range")

PRACTICAL TIPS & WATCHOUTS:
- Tip: When page is 1, offset is 0.
- Tip: If input is non-numeric or less than 1, fall back to default page 1 and default limit 20.

WHERE TO WORK:
- Edit: src/solution.php (Target function: parsePagination)

HOW TO APPROACH THIS:
1. Parse page and limit to integers. If non-numeric or invalid, use defaults (page: 1, limit: 20).
2. Clamp page so it is at least 1.
3. Clamp limit so it is between 1 and 100.
4. Calculate offset as (page - 1) * limit.

EDGE CASES TO WATCH:
- Zero or negative page: page = -1 -> clamps to page = 1, offset = 0.
- Extreme limit: limit = 500 -> clamps to limit = 100.
- Non-numeric inputs: "invalid" -> falls back to default 1.

---FILE: src/solution.php---
<?php

declare(strict_types=1);

/**
 * @return array{page: int, limit: int, offset: int}
 */
function parsePagination(mixed $rawPage = null, mixed $rawLimit = null): array
{
    // TODO: Clamp page (>= 1, default 1) and limit ([1, 100], default 20), calculate SQL offset
    return ['page' => 1, 'limit' => 20, 'offset' => 0];
}

---TESTS---
Input: parsePagination(2, 25)
Expected: ['page' => 2, 'limit' => 25, 'offset' => 25]
Description: Page 2 with limit 25 produces offset 25

Input: parsePagination(-1, 500)
Expected: ['page' => 1, 'limit' => 100, 'offset' => 0]
Description: Negative page clamps to 1 and limit over 100 clamps to 100

Input: parsePagination("invalid", null)
Expected: ['page' => 1, 'limit' => 20, 'offset' => 0]
Description: Invalid inputs fall back to default page 1 and limit 20

---REFERENCE---
<?php

declare(strict_types=1);

/**
 * @return array{page: int, limit: int, offset: int}
 */
function parsePagination(mixed $rawPage = null, mixed $rawLimit = null): array
{
    $page = is_numeric($rawPage) ? (int) $rawPage : 1;
    $limit = is_numeric($rawLimit) ? (int) $rawLimit : 20;

    $safePage = $page >= 1 ? $page : 1;
    $safeLimit = max(1, min(100, $limit));
    $offset = ($safePage - 1) * $safeLimit;

    return [
        'page' => $safePage,
        'limit' => $safeLimit,
        'offset' => $offset,
    ];
}
`,
  },

  // ==========================================
  // LEVEL 4 (3 Challenges) - State & Security
  // ==========================================
  {
    id: 'php-l4-timing-safe-compare',
    label: 'Track 4 (Level 4) - Constant-Time String Compare (PHP)',
    track: 4,
    level: 4,
    type: 'Security Hardening',
    language: 'PHP',
    raw: `---METADATA---
track: 4
level: 4
type: Security Hardening
topic: Data Security & Hardening
title: Constant-Time String Comparison Against Timing Attacks
editableLanguage: php
editableFiles: src/solution.php

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
- Syntax: PHP bitwise XOR (^) and ord function (Search: "php constant time string comparison ord xor")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Length differences should still execute comparisons rather than early exiting immediately.
- Tip: Accumulate differences in an integer: mismatch |= codeA ^ codeB.

WHERE TO WORK:
- Edit: src/solution.php (Target functions: timingSafeEqual, verifyToken)

HOW TO APPROACH THIS:
1. Compare character byte values across both strings using ord() and XOR (^).
2. Accumulate all differences into a bitwise integer result.
3. Ensure both equal length and zero mismatch difference are required to return true.

EDGE CASES TO WATCH:
- Different lengths: must return false without exposing where the lengths diverge.
- Empty strings: comparing "" and "" returns true.

---FILE: src/solution.php---
<?php

declare(strict_types=1);

function timingSafeEqual(string $a, string $b): bool
{
    // TODO: Implement constant-time string comparison using bitwise XOR accumulation
    return $a === $b;
}

function verifyToken(string $expectedToken, string $providedToken): bool
{
    return timingSafeEqual($expectedToken, $providedToken);
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
<?php

declare(strict_types=1);

function timingSafeEqual(string $a, string $b): bool
{
    $lenA = strlen($a);
    $lenB = strlen($b);

    $mismatch = $lenA === $lenB ? 0 : 1;
    $compareLen = max($lenA, $lenB);

    for ($i = 0; $i < $compareLen; $i++) {
        $codeA = $i < $lenA ? ord($a[$i]) : 0;
        $codeB = $i < $lenB ? ord($b[$i]) : 0;
        $mismatch |= $codeA ^ $codeB;
    }

    return $mismatch === 0;
}

function verifyToken(string $expectedToken, string $providedToken): bool
{
    return timingSafeEqual($expectedToken, $providedToken);
}
`,
  },
  {
    id: 'php-l4-token-bucket',
    label: 'Track 5 (Level 4) - Token Bucket Rate Limiter (PHP)',
    track: 5,
    level: 4,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 5
level: 4
type: Build Feature
topic: Distributed Systems & Workers
title: Token Bucket Rate Limiter with Time Refill
editableLanguage: php
editableFiles: src/solution.php

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
- Syntax: PHP class properties and min clamping (Search: "token bucket rate limiter php")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Remember to update lastRefillSec whenever refilling.
- Tip: Clamp tokens so it never exceeds maxCapacity.

WHERE TO WORK:
- Edit: src/solution.php (Target class: TokenBucket, method: consume)
- Reference: src/types.php (RateLimitResultShape constants)

HOW TO APPROACH THIS:
1. On each operation, calculate elapsed time since last refill.
2. Add elapsed * refillRatePerSec to tokens, capped at maxCapacity.
3. Check if tokens >= tokensRequested. If so, decrement tokens and return ['allowed' => true, 'remainingTokens' => floor(tokens)].
4. Otherwise, return ['allowed' => false, 'remainingTokens' => floor(tokens)].

EDGE CASES TO WATCH:
- Burst traffic: Cannot consume more than maxCapacity in a single burst.
- Time moving backward: If nowSec < lastRefillSec, do not decrement tokens.

---FILE: src/types.php (readonly)---
<?php

declare(strict_types=1);

/**
 * Expected RateLimitResult array shape:
 * ['allowed' => bool, 'remainingTokens' => int]
 */
interface RateLimitResultShape
{
    public const ALLOWED_KEY = 'allowed';
    public const REMAINING_TOKENS_KEY = 'remainingTokens';
}

---FILE: src/solution.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

class TokenBucket
{
    private float $tokens;
    private int $lastRefillSec;

    public function __construct(
        public readonly float $maxCapacity,
        public readonly float $refillRatePerSec,
        int $initialTimeSec
    ) {
        $this->tokens = $maxCapacity;
        $this->lastRefillSec = $initialTimeSec;
    }

    /**
     * @return array{allowed: bool, remainingTokens: int}
     */
    public function consume(float $tokensRequested, int $nowSec): array
    {
        // TODO: Refill based on elapsed time, check capacity, and deduct tokens
        return ['allowed' => true, 'remainingTokens' => (int) $this->tokens];
    }
}

---TESTS---
Input: $b = new TokenBucket(10.0, 2.0, 0); $b->consume(5.0, 0)
Expected: ['allowed' => true, 'remainingTokens' => 5]
Description: Consuming tokens within capacity succeeds and decrements count

Input: $b = new TokenBucket(10.0, 2.0, 0); $b->consume(8.0, 0); $b->consume(5.0, 0)
Expected: ['allowed' => false, 'remainingTokens' => 2]
Description: Consuming more tokens than remaining capacity is rejected

Input: $b = new TokenBucket(10.0, 2.0, 0); $b->consume(10.0, 0); $b->consume(3.0, 2)
Expected: ['allowed' => true, 'remainingTokens' => 1]
Description: Tokens refill over elapsed time (4 refilled after 2 seconds)

---REFERENCE---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

class TokenBucket
{
    private float $tokens;
    private int $lastRefillSec;

    public function __construct(
        public readonly float $maxCapacity,
        public readonly float $refillRatePerSec,
        int $initialTimeSec
    ) {
        $this->tokens = $maxCapacity;
        $this->lastRefillSec = $initialTimeSec;
    }

    private function refill(int $nowSec): void
    {
        if ($nowSec <= $this->lastRefillSec) {
            return;
        }
        $elapsed = $nowSec - $this->lastRefillSec;
        $added = $elapsed * $this->refillRatePerSec;
        $this->tokens = min($this->maxCapacity, $this->tokens + $added);
        $this->lastRefillSec = $nowSec;
    }

    /**
     * @return array{allowed: bool, remainingTokens: int}
     */
    public function consume(float $tokensRequested, int $nowSec): array
    {
        $this->refill($nowSec);

        if ($this->tokens >= $tokensRequested) {
            $this->tokens -= $tokensRequested;
            return [
                'allowed' => true,
                'remainingTokens' => (int) floor($this->tokens),
            ];
        }

        return [
            'allowed' => false,
            'remainingTokens' => (int) floor($this->tokens),
        ];
    }
}
`,
  },
  {
    id: 'php-l4-field-validator-touched',
    label: 'Track 5 (Level 4) - HTTP Form Request Validator (PHP)',
    track: 5,
    level: 4,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 5
level: 4
type: Build Feature
topic: Backend API & Middleware
title: HTTP Server Form Request Validator
editableLanguage: php
editableFiles: src/solution.php

---TASK---
ACTION:
BUILD

GOAL:
Build a server-side request payload validator in PHP that checks required fields, minimum string lengths, email formatting, and returns a structured validation outcome.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The starter stub returns valid without inspecting incoming request fields.
- Expected: validateUserPayload validates username (required, min 3 chars) and email (required, valid email filter); returns ValidationResult with isValid = false and field error mapping if any rule fails.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Server-side request validation and domain invariant protection (Search: "php server side request validation pattern")
- Syntax: PHP 8.2 readonly classes, filter_var, and associative arrays (Search: "php filter_var FILTER_VALIDATE_EMAIL")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Always trim string values before checking length.
- Tip: If username is empty, error code should be "username_required". If under 3 chars, "username_too_short".
- Tip: If email is invalid, error code should be "email_invalid".

WHERE TO WORK:
- Edit: src/solution.php (Target function: validateUserPayload)
- Reference: src/types.php (ValidationResult readonly class)

HOW TO APPROACH THIS:
1. Initialize an empty associative array for errors.
2. Check the username field: ensure non-empty and length >= 3.
3. Check the email field: ensure non-empty and valid via filter_var.
4. Return a new ValidationResult instance with isValid flag and errors map.

EDGE CASES TO WATCH:
- Missing username: returns "username_required".
- Short username: "al" returns "username_too_short".
- Invalid email: "not-an-email" returns "email_invalid".
- Clean submission: returns isValid: true with empty errors map.

---FILE: src/types.php (readonly)---
<?php

declare(strict_types=1);

final readonly class ValidationResult
{
    /**
     * @param array<string, string> $errors
     */
    public function __construct(
        public bool $isValid,
        public array $errors
    ) {}
}

---FILE: src/solution.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

function validateUserPayload(array $payload): ValidationResult
{
    // TODO: Validate username and email rules, and return ValidationResult
    return new ValidationResult(true, []);
}

---TESTS---
Input: validateUserPayload(["username" => "alice", "email" => "alice@example.com"])
Expected: new ValidationResult(true, [])
Description: Valid user payload passes all validation rules

Input: validateUserPayload(["username" => "", "email" => "alice@example.com"])
Expected: new ValidationResult(false, ["username" => "username_required"])
Description: Empty username returns username_required error

Input: validateUserPayload(["username" => "al", "email" => "invalid-mail"])
Expected: new ValidationResult(false, ["username" => "username_too_short", "email" => "email_invalid"])
Description: Short username and malformed email return both field errors

---REFERENCE---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

function validateUserPayload(array $payload): ValidationResult
{
    $errors = [];

    $username = trim((string)($payload['username'] ?? ''));
    if ($username === '') {
        $errors['username'] = 'username_required';
    } elseif (strlen($username) < 3) {
        $errors['username'] = 'username_too_short';
    }

    $email = trim((string)($payload['email'] ?? ''));
    if ($email === '') {
        $errors['email'] = 'email_required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'email_invalid';
    }

    return new ValidationResult(empty($errors), $errors);
}
`,
  },

  // ==========================================
  // LEVEL 6 (2 Challenges) - Multi-Task & Multi-File
  // ==========================================
  {
    id: 'php-l6-rbac-route-guard',
    label: 'Track 1 (Level 6) - RBAC Policy Guard & Route Interceptor (PHP)',
    track: 1,
    level: 6,
    type: 'Security Hardening',
    language: 'PHP',
    raw: `---METADATA---
track: 1
level: 6
type: Security Hardening
topic: Auth, JWT & Sessions
title: RBAC Hierarchical Policy Resolver and Route Guard
editableLanguage: php
editableFiles: src/policy.php, src/route_guard.php

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file Role-Based Access Control (RBAC) engine that resolves inherited role permissions in policy.php and enforces route authorization decisions with custom denial codes in route_guard.php.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Route access is unguarded or checks only direct role strings without considering permission hierarchy or resource ownership.
- Expected: Resolves transitive permissions from role inheritance trees, checks required permissions for route actions, and permits resource owners when configured.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Hierarchical RBAC and resource ownership policies (Search: "hierarchical rbac permissions architecture")
- Syntax: Multi-file PHP require_once, recursion, and array deduplication (Search: "php role hierarchy permission resolver")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Avoid infinite loops when resolving role inheritance by tracking visited roles.
- Tip: If a policy has allowOwner: true, check if user->id === resource->ownerId before denying access.

WHERE TO WORK:
- Edit: src/policy.php (Target functions: resolveUserPermissions, hasPermission)
- Edit: src/route_guard.php (Target function: evaluateRouteAccess)
- Reference: src/types.php (Companion UserContext, ResourceContext, RoutePolicy, AccessReason)

HOW TO APPROACH THIS:
1. In src/policy.php, implement resolveUserPermissions to traverse assigned roles and inherited sub-roles, collecting all permissions into a list of unique strings.
2. In src/policy.php, implement hasPermission to verify if the resolved permissions contain the required permission.
3. In src/route_guard.php, implement evaluateRouteAccess to check the RoutePolicy against user permissions and resource ownership.
4. Return a structured AccessDecision: ['allowed' => true] or ['allowed' => false, 'reason' => 'insufficient_permissions' | 'unauthenticated'].

EDGE CASES TO WATCH:
- Unauthenticated user: returns ['allowed' => false, 'reason' => 'unauthenticated'].
- Resource owner override: user lacks permission but is resource owner -> ['allowed' => true].

---FILE: src/types.php (readonly)---
<?php

declare(strict_types=1);

final readonly class UserContext
{
    /**
     * @param string[] $roles e.g. ['admin', 'editor', 'viewer']
     */
    public function __construct(
        public string $id,
        public array $roles
    ) {}
}

final readonly class ResourceContext
{
    public function __construct(
        public string $ownerId
    ) {}
}

final readonly class RoutePolicy
{
    public function __construct(
        public ?string $requiredPermission = null,
        public bool $allowOwner = false
    ) {}
}

final class AccessReason
{
    public const UNAUTHENTICATED = 'unauthenticated';
    public const INSUFFICIENT_PERMISSIONS = 'insufficient_permissions';
}

---FILE: src/policy.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

const ROLE_HIERARCHY = [
    'viewer' => ['permissions' => ['read'], 'inherits' => []],
    'editor' => ['permissions' => ['write'], 'inherits' => ['viewer']],
    'admin' => ['permissions' => ['delete', 'publish'], 'inherits' => ['editor']],
];

/**
 * @param string[] $roles
 * @return string[]
 */
function resolveUserPermissions(array $roles): array
{
    // TODO: Traverse roles and role inheritance to gather all distinct permissions
    return [];
}

/**
 * @param string[] $userPermissions
 */
function hasPermission(array $userPermissions, string $required): bool
{
    // TODO: Check if required permission is present in permissions list
    return false;
}

---FILE: src/route_guard.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';
require_once __DIR__ . '/policy.php';

/**
 * @return array{allowed: bool, reason?: string}
 */
function evaluateRouteAccess(
    ?UserContext $user,
    ?ResourceContext $resource,
    RoutePolicy $policy
): array {
    // TODO: 1. Check if user is present
    // 2. Check resource ownership bypass if policy->allowOwner is true
    // 3. Check resolved permissions against policy->requiredPermission
    return ['allowed' => false, 'reason' => AccessReason::UNAUTHENTICATED];
}

---TESTS---
Input: evaluateRouteAccess(new UserContext("u1", ["admin"]), null, new RoutePolicy("read"))
Expected: ['allowed' => true]
Description: Admin inherits viewer read permission and is granted access

Input: evaluateRouteAccess(new UserContext("u2", ["viewer"]), null, new RoutePolicy("write"))
Expected: ['allowed' => false, 'reason' => 'insufficient_permissions']
Description: Viewer lacks write permission and is denied

Input: evaluateRouteAccess(new UserContext("u3", ["viewer"]), new ResourceContext("u3"), new RoutePolicy("write", true))
Expected: ['allowed' => true]
Description: Resource owner bypasses required permission when allowOwner is enabled

Input: evaluateRouteAccess(null, null, new RoutePolicy("read"))
Expected: ['allowed' => false, 'reason' => 'unauthenticated']
Description: Unauthenticated user is denied with unauthenticated reason

---REFERENCE---
<?php

declare(strict_types=1);

// src/policy.php
require_once __DIR__ . '/types.php';

const ROLE_HIERARCHY = [
    'viewer' => ['permissions' => ['read'], 'inherits' => []],
    'editor' => ['permissions' => ['write'], 'inherits' => ['viewer']],
    'admin' => ['permissions' => ['delete', 'publish'], 'inherits' => ['editor']],
];

function resolveUserPermissions(array $roles): array
{
    $permissions = [];
    $visited = [];

    $collect = function (string $role) use (&$collect, &$permissions, &$visited): void {
        if (isset($visited[$role])) {
            return;
        }
        $visited[$role] = true;

        $config = ROLE_HIERARCHY[$role] ?? null;
        if ($config === null) {
            return;
        }

        foreach ($config['permissions'] as $p) {
            $permissions[$p] = true;
        }

        foreach ($config['inherits'] as $parent) {
            $collect($parent);
        }
    };

    foreach ($roles as $role) {
        $collect($role);
    }

    return array_keys($permissions);
}

function hasPermission(array $userPermissions, string $required): bool
{
    return in_array($required, $userPermissions, true);
}

// src/route_guard.php
function evaluateRouteAccess(
    ?UserContext $user,
    ?ResourceContext $resource,
    RoutePolicy $policy
): array {
    if ($user === null) {
        return ['allowed' => false, 'reason' => AccessReason::UNAUTHENTICATED];
    }

    if ($policy->allowOwner && $resource !== null && $resource->ownerId === $user->id) {
        return ['allowed' => true];
    }

    if ($policy->requiredPermission !== null) {
        $permissions = resolveUserPermissions($user->roles);
        if (!hasPermission($permissions, $policy->requiredPermission)) {
            return ['allowed' => false, 'reason' => AccessReason::INSUFFICIENT_PERMISSIONS];
        }
    }

    return ['allowed' => true];
}
`,
  },
  {
    id: 'php-l6-optimistic-lock-store',
    label: 'Track 2 (Level 6) - Optimistic Locking Document Store (PHP)',
    track: 2,
    level: 6,
    type: 'Build Feature',
    language: 'PHP',
    raw: `---METADATA---
track: 2
level: 6
type: Build Feature
topic: State & Async Race Conditions
title: Optimistic Locking Store with Conflict Resolution
editableLanguage: php
editableFiles: src/versioned_store.php, src/mutation_coordinator.php

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file optimistic concurrency store where updates check document version tags and automatic rollback is triggered when concurrent mutations conflict.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Last write wins, silently overwriting concurrent updates and losing data.
- Expected: Verifies expectedVersion === current->version before applying updates and increments version; rejects and triggers callback on conflict.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Optimistic Concurrency Control (OCC) and version vectors (Search: "optimistic concurrency control version field")
- Syntax: PHP classes, array merges, and callback execution (Search: "php optimistic locking coordinator")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Always increment version by 1 on every successful mutation.
- Tip: In mutation_coordinator.php, if update encounters conflict, invoke onConflict callback with the latest document.

WHERE TO WORK:
- Edit: src/versioned_store.php (Target methods: get, updateWithVersion, insert)
- Edit: src/mutation_coordinator.php (Target function: executeOptimisticMutation)
- Reference: src/models.php (VersionedDoc and MutationFailureReason)

HOW TO APPROACH THIS:
1. In src/versioned_store.php, check if the existing document's version matches expectedVersion.
2. If matched, apply new data, bump version, and persist.
3. If mismatched, return ['success' => false, 'reason' => 'conflict', 'currentVersion' => existing->version].
4. If missing, return ['success' => false, 'reason' => 'not_found'].
5. In src/mutation_coordinator.php, execute the update and invoke onConflict callback when conflict occurs.

EDGE CASES TO WATCH:
- Document not found: returns ['success' => false, 'reason' => 'not_found'].
- Version mismatch: returns ['success' => false, 'reason' => 'conflict', 'currentVersion' => currentVersion].

---FILE: src/models.php (readonly)---
<?php

declare(strict_types=1);

final class VersionedDoc
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(
        public string $id,
        public int $version,
        public array $data
    ) {}
}

final class MutationFailureReason
{
    public const CONFLICT = 'conflict';
    public const NOT_FOUND = 'not_found';
}

---FILE: src/versioned_store.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/models.php';

class VersionedStore
{
    /** @var array<string, VersionedDoc> */
    private array $docs = [];

    public function insert(VersionedDoc $doc): void
    {
        $this->docs[$doc->id] = new VersionedDoc($doc->id, $doc->version, $doc->data);
    }

    public function get(string $id): ?VersionedDoc
    {
        if (!isset($this->docs[$id])) {
            return null;
        }
        $doc = $this->docs[$id];
        return new VersionedDoc($doc->id, $doc->version, $doc->data);
    }

    /**
     * @param array<string, mixed> $newData
     * @return array{success: bool, doc?: VersionedDoc, reason?: string, currentVersion?: int}
     */
    public function updateWithVersion(string $id, int $expectedVersion, array $newData): array
    {
        // TODO: Verify expectedVersion matches current version, increment version, and save
        return ['success' => false, 'reason' => MutationFailureReason::NOT_FOUND];
    }
}

---FILE: src/mutation_coordinator.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/models.php';
require_once __DIR__ . '/versioned_store.php';

/**
 * @param array<string, mixed> $newData
 * @param ?callable(VersionedDoc): void $onConflict
 * @return array{success: bool, doc?: VersionedDoc, reason?: string, currentVersion?: int}
 */
function executeOptimisticMutation(
    VersionedStore $store,
    string $id,
    int $expectedVersion,
    array $newData,
    ?callable $onConflict = null
): array {
    // TODO: Execute update, call onConflict callback if conflict occurs, return outcome
    return $store->updateWithVersion($id, $expectedVersion, $newData);
}

---TESTS---
Input: $s = new VersionedStore(); $s->insert(new VersionedDoc("doc1", 1, ["name" => "A"])); $s->updateWithVersion("doc1", 1, ["name" => "B"])
Expected: ['success' => true, 'doc' => new VersionedDoc("doc1", 2, ["name" => "B"])]
Description: Matching version successfully updates document and increments version to 2

Input: $s = new VersionedStore(); $s->insert(new VersionedDoc("doc1", 2, ["name" => "A"])); $s->updateWithVersion("doc1", 1, ["name" => "C"])
Expected: ['success' => false, 'reason' => 'conflict', 'currentVersion' => 2]
Description: Stale version 1 on version 2 document is rejected with conflict reason

Input: $s = new VersionedStore(); $s->updateWithVersion("missing", 1, ["name" => "X"])
Expected: ['success' => false, 'reason' => 'not_found']
Description: Non-existent document ID returns not_found

---REFERENCE---
<?php

declare(strict_types=1);

// src/versioned_store.php
require_once __DIR__ . '/models.php';

class VersionedStore
{
    /** @var array<string, VersionedDoc> */
    private array $docs = [];

    public function insert(VersionedDoc $doc): void
    {
        $this->docs[$doc->id] = new VersionedDoc($doc->id, $doc->version, $doc->data);
    }

    public function get(string $id): ?VersionedDoc
    {
        if (!isset($this->docs[$id])) {
            return null;
        }
        $doc = $this->docs[$id];
        return new VersionedDoc($doc->id, $doc->version, $doc->data);
    }

    public function updateWithVersion(string $id, int $expectedVersion, array $newData): array
    {
        $existing = $this->get($id);
        if ($existing === null) {
            return ['success' => false, 'reason' => MutationFailureReason::NOT_FOUND];
        }

        if ($existing->version !== $expectedVersion) {
            return [
                'success' => false,
                'reason' => MutationFailureReason::CONFLICT,
                'currentVersion' => $existing->version,
            ];
        }

        $updated = new VersionedDoc(
            $id,
            $existing->version + 1,
            array_merge($existing->data, $newData)
        );

        $this->docs[$id] = $updated;
        return ['success' => true, 'doc' => $updated];
    }
}

// src/mutation_coordinator.php
function executeOptimisticMutation(
    VersionedStore $store,
    string $id,
    int $expectedVersion,
    array $newData,
    ?callable $onConflict = null
): array {
    $result = $store->updateWithVersion($id, $expectedVersion, $newData);

    if ($result['success'] === false && $result['reason'] === MutationFailureReason::CONFLICT && $onConflict !== null) {
        $latest = $store->get($id);
        if ($latest !== null) {
            $onConflict($latest);
        }
    }

    return $result;
}
`,
  },

  // ==========================================
  // LEVEL 10 (2 Challenges) - Scale & Concurrency
  // ==========================================
  {
    id: 'php-l10-idempotent-webhook-dispatcher',
    label: 'Track 5 (Level 10) - Idempotent Webhook Event Dispatcher (PHP)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'PHP',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Idempotent Webhook Dispatcher with Lease Locks and Deduplication
editableLanguage: php
editableFiles: src/idempotency_registry.php, src/event_pipeline.php

---TASK---
ACTION:
BUILD

GOAL:
Build a distributed webhook delivery engine across idempotency_registry.php and event_pipeline.php that prevents duplicate executions, handles concurrency leases, and records delivery statuses.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Incoming webhook retries execute handlers multiple times, creating duplicate database writes or double billing.
- Expected: Deduplicates events by eventId, uses lease locks with expiration to guard in-flight processing, and returns cached results on duplicate delivery.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Idempotency keys, distributed leasing, and replay attacks (Search: "stripe webhook idempotency key pattern")
- Syntax: Multi-file architecture and PHP lease management (Search: "php idempotency lock lease pattern")

PRACTICAL TIPS & WATCHOUTS:
- Tip: If a lock lease is expired (nowMs >= lease->expiresAtMs), consider the lease abandoned and allow re-acquisition.
- Tip: When execution fails, release the lock so subsequent retries can proceed immediately.

WHERE TO WORK:
- Edit: src/idempotency_registry.php (Target methods: acquireLease, markCompleted, releaseLease, getRecord)
- Edit: src/event_pipeline.php (Target function: processWebhookEvent)
- Reference: src/types.php (WebhookEvent, EventStatus, DispatchStatus, LeaseRecord)

HOW TO APPROACH THIS:
1. In src/idempotency_registry.php, check if the event is already marked COMPLETED. If so, return false in acquireLease.
2. Check if a current active lease exists (PROCESSING and nowMs < expiresAtMs). If active, return false.
3. If unleased or expired, acquire lease with nowMs + leaseDurationMs.
4. In src/event_pipeline.php, if record is COMPLETED, return cached response with status DUPLICATE.
5. If acquireLease fails, return status LOCKED.
6. On handler success, mark COMPLETED with response. On error, release lease and rethrow.

EDGE CASES TO WATCH:
- Expired in-flight lease: allows recovery and re-processing.
- Concurrent duplicate: immediate rejection with status LOCKED without invoking the handler twice.

---FILE: src/types.php (readonly)---
<?php

declare(strict_types=1);

final class EventStatus
{
    public const PENDING = 'PENDING';
    public const PROCESSING = 'PROCESSING';
    public const COMPLETED = 'COMPLETED';
    public const FAILED = 'FAILED';
}

final class DispatchStatus
{
    public const PROCESSED = 'PROCESSED';
    public const DUPLICATE = 'DUPLICATE';
    public const LOCKED = 'LOCKED';
}

final readonly class WebhookEvent
{
    /**
     * @param array<string, mixed> $payload
     */
    public function __construct(
        public string $id,
        public string $eventType,
        public array $payload
    ) {}
}

final class LeaseRecord
{
    public function __construct(
        public string $status,
        public int $expiresAtMs,
        public mixed $result = null
    ) {}
}

---FILE: src/idempotency_registry.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';

class IdempotencyRegistry
{
    /** @var array<string, LeaseRecord> */
    private array $records = [];

    public function acquireLease(string $eventId, int $leaseDurationMs, int $nowMs): bool
    {
        // TODO: Return true if lease acquired; false if already processing or completed
        return false;
    }

    public function markCompleted(string $eventId, mixed $result): void
    {
        // TODO: Set status to COMPLETED and store result
    }

    public function releaseLease(string $eventId): void
    {
        // TODO: Delete or reset lease on failure
    }

    public function getRecord(string $eventId): ?LeaseRecord
    {
        return $this->records[$eventId] ?? null;
    }
}

---FILE: src/event_pipeline.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/types.php';
require_once __DIR__ . '/idempotency_registry.php';

/**
 * @param callable(WebhookEvent): mixed $handler
 * @return array{status: string, eventId: string, response?: mixed}
 */
function processWebhookEvent(
    IdempotencyRegistry $registry,
    WebhookEvent $event,
    int $nowMs,
    callable $handler
): array {
    // TODO: 1. Check existing record for completion
    // 2. Try acquire lease
    // 3. Execute handler, mark completed, or release on error
    return ['status' => DispatchStatus::LOCKED, 'eventId' => $event->id];
}

---TESTS---
Input: $reg = new IdempotencyRegistry(); processWebhookEvent($reg, new WebhookEvent("evt_1", "payment", []), 1000, fn($e) => ["paid" => true])
Expected: ['status' => 'PROCESSED', 'eventId' => 'evt_1', 'response' => ['paid' => true]]
Description: First event delivery executes handler and records completion

Input: $reg = new IdempotencyRegistry(); processWebhookEvent($reg, new WebhookEvent("evt_1", "payment", []), 1000, fn($e) => ["paid" => true]); processWebhookEvent($reg, new WebhookEvent("evt_1", "payment", []), 1100, fn($e) => ["paid" => false])
Expected: ['status' => 'DUPLICATE', 'eventId' => 'evt_1', 'response' => ['paid' => true]]
Description: Duplicate event returns cached response without re-executing handler

Input: $reg = new IdempotencyRegistry(); $reg->acquireLease("evt_2", 5000, 1000); processWebhookEvent($reg, new WebhookEvent("evt_2", "payment", []), 2000, fn($e) => [])
Expected: ['status' => 'LOCKED', 'eventId' => 'evt_2']
Description: Concurrent request during active lease returns LOCKED status

---REFERENCE---
<?php

declare(strict_types=1);

// src/idempotency_registry.php
require_once __DIR__ . '/types.php';

class IdempotencyRegistry
{
    /** @var array<string, LeaseRecord> */
    private array $records = [];

    public function acquireLease(string $eventId, int $leaseDurationMs, int $nowMs): bool
    {
        $existing = $this->records[$eventId] ?? null;

        if ($existing !== null) {
            if ($existing->status === EventStatus::COMPLETED) {
                return false;
            }
            if ($existing->status === EventStatus::PROCESSING && $nowMs < $existing->expiresAtMs) {
                return false;
            }
        }

        $this->records[$eventId] = new LeaseRecord(
            status: EventStatus::PROCESSING,
            expiresAtMs: $nowMs + $leaseDurationMs
        );
        return true;
    }

    public function markCompleted(string $eventId, mixed $result): void
    {
        $this->records[$eventId] = new LeaseRecord(
            status: EventStatus::COMPLETED,
            expiresAtMs: PHP_INT_MAX,
            result: $result
        );
    }

    public function releaseLease(string $eventId): void
    {
        if (isset($this->records[$eventId]) && $this->records[$eventId]->status !== EventStatus::COMPLETED) {
            unset($this->records[$eventId]);
        }
    }

    public function getRecord(string $eventId): ?LeaseRecord
    {
        return $this->records[$eventId] ?? null;
    }
}

// src/event_pipeline.php
function processWebhookEvent(
    IdempotencyRegistry $registry,
    WebhookEvent $event,
    int $nowMs,
    callable $handler
): array {
    $existing = $registry->getRecord($event->id);
    if ($existing !== null && $existing->status === EventStatus::COMPLETED) {
        return [
            'status' => DispatchStatus::DUPLICATE,
            'eventId' => $event->id,
            'response' => $existing->result,
        ];
    }

    $acquired = $registry->acquireLease($event->id, 5000, $nowMs);
    if (!$acquired) {
        return ['status' => DispatchStatus::LOCKED, 'eventId' => $event->id];
    }

    try {
        $res = $handler($event);
        $registry->markCompleted($event->id, $res);
        return [
            'status' => DispatchStatus::PROCESSED,
            'eventId' => $event->id,
            'response' => $res,
        ];
    } catch (\\Throwable $err) {
        $registry->releaseLease($event->id);
        throw $err;
    }
}
`,
  },
  {
    id: 'php-l10-distributed-sliding-window-limiter',
    label: 'Track 5 (Level 10) - Sliding Window Counter with Drift Tolerance (PHP)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'PHP',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Sliding-Window Rate Limiter with Sub-Second Slicing and Drift Tolerance
editableLanguage: php
editableFiles: src/sub_window_counter.php, src/traffic_gate.php

---TASK---
ACTION:
BUILD

GOAL:
Implement a sliding-window rate limiter divided into granular sub-windows that tracks hit counters, evicts expired slices, and compensates for clock drift.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses fixed window counters that allow 2x burst traffic across window boundaries.
- Expected: Slices window into multiple sub-windows (e.g. 10 slices of 1s in a 10s window), dynamically summing hits within [nowMs - windowMs, nowMs] and rejecting traffic exceeding maxRequests.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Sliding window counter algorithm vs fixed window (Search: "sliding window counter rate limiting algorithm")
- Syntax: PHP associative array pruning and math floor (Search: "sliding window rate limiter php")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Sub-window key can be (int) floor(timestampMs / subWindowMs).
- Tip: Unset sub-windows whose key < minKey where minTime = nowMs - windowMs.

WHERE TO WORK:
- Edit: src/sub_window_counter.php (Target methods: recordHit, getWindowCount, pruneExpired)
- Edit: src/traffic_gate.php (Target function: checkTrafficLimit)
- Reference: src/clock.php (GateConfig readonly class)

HOW TO APPROACH THIS:
1. In src/sub_window_counter.php, map sub-window keys to integer hit counts.
2. In recordHit, increment the count for current sub-window key.
3. In pruneExpired, remove bucket keys older than (nowMs - windowMs).
4. In getWindowCount, aggregate counts from all active sub-windows within the sliding window.
5. In src/traffic_gate.php, check if total count exceeds maxRequests. If under limit, record hit and allow; otherwise reject.

EDGE CASES TO WATCH:
- Clock drift: Small negative timestamp variations within 100ms tolerance must be handled safely.
- Boundary transitions: Smoothly transitions traffic without doubling rate at boundary.

---FILE: src/clock.php (readonly)---
<?php

declare(strict_types=1);

final readonly class GateConfig
{
    public function __construct(
        public int $windowMs,
        public int $subWindowMs,
        public int $maxRequests
    ) {}
}

---FILE: src/sub_window_counter.php---
<?php

declare(strict_types=1);

class SubWindowCounter
{
    /** @var array<int, int> */
    private array $buckets = [];

    public function recordHit(int $timestampMs, int $subWindowMs): void
    {
        // TODO: Calculate sub-window bucket key and increment count
    }

    public function getWindowCount(int $nowMs, int $windowMs, int $subWindowMs): int
    {
        // TODO: Sum counts of all buckets falling within [nowMs - windowMs, nowMs]
        return 0;
    }

    public function pruneExpired(int $nowMs, int $windowMs, int $subWindowMs): void
    {
        // TODO: Remove buckets older than nowMs - windowMs
    }
}

---FILE: src/traffic_gate.php---
<?php

declare(strict_types=1);

require_once __DIR__ . '/clock.php';
require_once __DIR__ . '/sub_window_counter.php';

/**
 * @return array{allowed: bool, currentCount: int, resetMs: int}
 */
function checkTrafficLimit(
    SubWindowCounter $counter,
    GateConfig $config,
    int $nowMs
): array {
    // TODO: 1. Prune expired buckets
    // 2. Query current window count
    // 3. If under limit, record hit and allow; otherwise reject
    return ['allowed' => true, 'currentCount' => 0, 'resetMs' => 0];
}

---TESTS---
Input: $c = new SubWindowCounter(); checkTrafficLimit($c, new GateConfig(10000, 1000, 5), 1000)
Expected: ['allowed' => true, 'currentCount' => 1, 'resetMs' => 10000]
Description: First request within window is permitted and incremented

Input: $c = new SubWindowCounter(); for ($i = 0; $i < 5; $i++) checkTrafficLimit($c, new GateConfig(10000, 1000, 5), 1000); checkTrafficLimit($c, new GateConfig(10000, 1000, 5), 1000)
Expected: ['allowed' => false, 'currentCount' => 5, 'resetMs' => 10000]
Description: Request exceeding 5 requests within sliding window is rejected

Input: $c = new SubWindowCounter(); for ($i = 0; $i < 5; $i++) checkTrafficLimit($c, new GateConfig(10000, 1000, 5), 1000); checkTrafficLimit($c, new GateConfig(10000, 1000, 5), 12000)
Expected: ['allowed' => true, 'currentCount' => 1, 'resetMs' => 10000]
Description: Requests in past window expire, permitting new requests

---REFERENCE---
<?php

declare(strict_types=1);

// src/sub_window_counter.php
class SubWindowCounter
{
    /** @var array<int, int> */
    private array $buckets = [];

    public function recordHit(int $timestampMs, int $subWindowMs): void
    {
        $key = (int) floor($timestampMs / $subWindowMs);
        $this->buckets[$key] = ($this->buckets[$key] ?? 0) + 1;
    }

    public function getWindowCount(int $nowMs, int $windowMs, int $subWindowMs): int
    {
        $this->pruneExpired($nowMs, $windowMs, $subWindowMs);
        $total = 0;
        $minTime = $nowMs - $windowMs;
        $minKey = (int) floor($minTime / $subWindowMs);
        $maxKey = (int) floor($nowMs / $subWindowMs);

        for ($k = $minKey; $k <= $maxKey; $k++) {
            $total += $this->buckets[$k] ?? 0;
        }

        return $total;
    }

    public function pruneExpired(int $nowMs, int $windowMs, int $subWindowMs): void
    {
        $minTime = $nowMs - $windowMs;
        $minKey = (int) floor($minTime / $subWindowMs);

        foreach (array_keys($this->buckets) as $key) {
            if ($key < $minKey) {
                unset($this->buckets[$key]);
            }
        }
    }
}

// src/traffic_gate.php
require_once __DIR__ . '/clock.php';
require_once __DIR__ . '/sub_window_counter.php';

function checkTrafficLimit(
    SubWindowCounter $counter,
    GateConfig $config,
    int $nowMs
): array {
    $counter->pruneExpired($nowMs, $config->windowMs, $config->subWindowMs);
    $currentCount = $counter->getWindowCount($nowMs, $config->windowMs, $config->subWindowMs);

    if ($currentCount >= $config->maxRequests) {
        return [
            'allowed' => false,
            'currentCount' => $currentCount,
            'resetMs' => $config->windowMs,
        ];
    }

    $counter->recordHit($nowMs, $config->subWindowMs);
    return [
        'allowed' => true,
        'currentCount' => $currentCount + 1,
        'resetMs' => $config->windowMs,
    ];
}
`,
  },
];
