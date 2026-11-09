import { SampleChallengeOption } from '../types';

export const GOLANG_CHALLENGES: SampleChallengeOption[] = [
  // ==========================================
  // LEVEL 1 (2 Challenges) - Foundations
  // ==========================================
  {
    id: 'go-l1-input-sanitizer',
    label: 'Track 1 (Level 1) - Input Sanitizer & Slugifier (Go)',
    track: 1,
    level: 1,
    type: 'Build Feature',
    language: 'Go',
    raw: `---METADATA---
track: 1
level: 1
type: Build Feature
topic: Backend API & Middleware
title: Input Sanitizer and URL Slugifier
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
BUILD

GOAL:
Build a Slugify function that normalizes an input string into a clean, URL-safe slug by lowercasing, trimming, removing non-alphanumeric characters, and replacing whitespace or underscores with single hyphens.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The Slugify function returns the raw string unchanged, leaving whitespace, uppercase letters, and special characters.
- Expected: Returns a lowercase string with spaces and underscores replaced by single hyphens, stripped of punctuation, and trimmed of boundary hyphens.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: URL slug normalization and regex sanitization (Search: "url slugify regex go")
- Syntax: Go strings package, regexp package, and ReplaceAllString (Search: "golang regexp replace string")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Multiple consecutive spaces or underscores should collapse into a single hyphen.
- Tip: Remove leading and trailing hyphens from the final slug.

WHERE TO WORK:
- Edit: solution.go (Target function: Slugify)

HOW TO APPROACH THIS:
1. Trim leading and trailing whitespace from the input and convert to lowercase.
2. Remove any characters that are not lowercase alphanumeric, spaces, hyphens, or underscores.
3. Replace one or more consecutive spaces or underscores with a single hyphen.
4. Trim any leading or trailing hyphens from the result.

EDGE CASES TO WATCH:
- Multiple spaces: "Hello   World" -> "hello-world"
- Leading/trailing symbols: "---Keep Coding---" -> "keep-coding"
- Special characters: "What's New in 2026!?" -> "whats-new-in-2026"

---FILE: solution.go---
package main

// Slugify normalizes an input string into a lowercase URL-safe slug.
func Slugify(text string) string {
	// TODO: Lowercase, sanitize, collapse spaces/underscores to hyphens, and strip boundary hyphens.
	return text
}

---TESTS---
Input: Slugify("Hello World")
Expected: "hello-world"
Description: Simple two-word title must become lowercase hyphenated slug

Input: Slugify("What's New in 2026!?")
Expected: "whats-new-in-2026"
Description: Special punctuation and exclamation marks must be removed

Input: Slugify("   Clean   Code   ")
Expected: "clean-code"
Description: Multiple consecutive spaces and boundary spaces must collapse into clean slug

---REFERENCE---
package main

import (
	"regexp"
	"strings"
)

var (
	slugNonAlphanumeric = regexp.MustCompile("[^a-z0-9\\s_-]")
	slugWhitespace      = regexp.MustCompile("[\\s_]+")
	slugBoundaryHyphens = regexp.MustCompile("^-+|-+$")
)

func Slugify(text string) string {
	s := strings.ToLower(strings.TrimSpace(text))
	s = slugNonAlphanumeric.ReplaceAllString(s, "")
	s = slugWhitespace.ReplaceAllString(s, "-")
	s = slugBoundaryHyphens.ReplaceAllString(s, "")
	return s
}
`,
  },
  {
    id: 'go-l1-expiry-guard',
    label: 'Track 1 (Level 1) - Token Expiry Timestamp Guard (Go)',
    track: 1,
    level: 1,
    type: 'Fix Bug',
    language: 'Go',
    raw: `---METADATA---
track: 1
level: 1
type: Fix Bug
topic: Auth, JWT & Sessions
title: Token Expiration Timestamp Guard
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
FIX BUG

GOAL:
Fix the expiration check so tokens whose expiration time has arrived or passed are marked as expired.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The comparator uses >= instead of <=, marking valid tokens as expired and expired tokens as valid.
- Expected: Returns true if tokenExpSec is less than or equal to currentTimestampSec, and false if tokenExpSec is in the future.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Unix epoch timestamps comparison in Go (Search: "unix epoch timestamp int64 comparison go")
- Syntax: Go boolean relational operators <= vs > (Search: "golang comparison operators")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Remember that earlier timestamps are smaller numbers. If tokenExpSec is 100 and currentTimestampSec is 200, the token expired in the past.
- Tip: A token expiring at the exact current second (tokenExpSec == currentTimestampSec) is expired.

WHERE TO WORK:
- Edit: solution.go (Target function: IsTokenExpired)

HOW TO APPROACH THIS:
1. Inspect the comparison between tokenExpSec and currentTimestampSec.
2. Verify that when tokenExpSec is less than or equal to currentTimestampSec, the token is expired.
3. Fix the relational operator.

EDGE CASES TO WATCH:
- Exact boundary: When tokenExpSec == currentTimestampSec, returns true.
- Future token: When tokenExpSec > currentTimestampSec, returns false.

---FILE: solution.go---
package main

// IsTokenExpired checks whether a token's expiration timestamp has passed or arrived.
func IsTokenExpired(tokenExpSec, currentTimestampSec int64) bool {
	// BUG: The comparison is currently reversed
	return tokenExpSec >= currentTimestampSec
}

---TESTS---
Input: IsTokenExpired(1700000000, 1700000100)
Expected: true
Description: Expired token with timestamp in the past must return true

Input: IsTokenExpired(1700000500, 1700000100)
Expected: false
Description: Valid token with expiration in the future must return false

Input: IsTokenExpired(1700000100, 1700000100)
Expected: true
Description: Token expiring at exact current second must return true

---REFERENCE---
package main

func IsTokenExpired(tokenExpSec, currentTimestampSec int64) bool {
	return tokenExpSec <= currentTimestampSec
}
`,
  },

  // ==========================================
  // LEVEL 3 (3 Challenges) - Handlers & State
  // ==========================================
  {
    id: 'go-l3-bearer-auth',
    label: 'Track 1 (Level 3) - Authorization Header Parser (Go)',
    track: 1,
    level: 3,
    type: 'Build Feature',
    language: 'Go',
    raw: `---METADATA---
track: 1
level: 3
type: Build Feature
topic: Auth, JWT & Sessions
title: HTTP Authorization Bearer Token Parser
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
BUILD

GOAL:
Extract and validate the raw token from an HTTP Authorization header string, verifying the "Bearer " scheme and returning a typed AuthHeaderResult struct.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Returns an invalid result or unparsed header without validating the Bearer scheme.
- Expected: Returns AuthHeaderResult{Valid: true, Token: token} when header starts with "Bearer " (case-insensitive) and has a non-empty token; otherwise returns AuthHeaderResult{Valid: false, Error: errorReason}.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: HTTP Bearer Authentication scheme RFC 6750 (Search: "http authorization header bearer format rfc 6750")
- Syntax: Go strings.HasPrefix, strings.TrimSpace, and struct initialization (Search: "golang string prefix trim space")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Match the scheme prefix "bearer " case-insensitively using strings.ToLower.
- Tip: Whitespace around the token must be trimmed. If no token remains after trimming, return error "missing_token".

WHERE TO WORK:
- Edit: solution.go (Target function: ParseBearerToken)
- Reference: types.go (readonly AuthHeaderResult struct)

HOW TO APPROACH THIS:
1. Trim whitespace from headerValue. If empty, return AuthHeaderResult{Valid: false, Error: "missing_header"}.
2. Check if the trimmed string starts with "bearer " (case-insensitive). If not, return AuthHeaderResult{Valid: false, Error: "invalid_scheme"}.
3. Extract the token slice after the prefix and trim it. If empty, return AuthHeaderResult{Valid: false, Error: "missing_token"}.
4. Return AuthHeaderResult{Valid: true, Token: token}.

EDGE CASES TO WATCH:
- Empty header: "" -> missing_header
- Missing scheme: "token123" -> invalid_scheme
- Bearer with only spaces: "Bearer    " -> missing_token

---FILE: types.go (readonly)---
package main

type AuthHeaderResult struct {
	Valid bool
	Token string
	Error string
}

---FILE: solution.go---
package main

// ParseBearerToken validates an Authorization header and extracts the bearer token.
func ParseBearerToken(headerValue string) AuthHeaderResult {
	// TODO: Parse and validate Bearer scheme
	return AuthHeaderResult{Valid: false, Error: "missing_header"}
}

---TESTS---
Input: ParseBearerToken("Bearer eyJhbGciOiJIUzI1NiJ9")
Expected: AuthHeaderResult{Valid: true, Token: "eyJhbGciOiJIUzI1NiJ9"}
Description: Valid Bearer header returns parsed token

Input: ParseBearerToken("Basic dXNlcjpwYXNz")
Expected: AuthHeaderResult{Valid: false, Error: "invalid_scheme"}
Description: Non-Bearer scheme returns invalid_scheme error

Input: ParseBearerToken("Bearer    ")
Expected: AuthHeaderResult{Valid: false, Error: "missing_token"}
Description: Bearer header with empty token returns missing_token error

---REFERENCE---
package main

import "strings"

func ParseBearerToken(headerValue string) AuthHeaderResult {
	trimmed := strings.TrimSpace(headerValue)
	if trimmed == "" {
		return AuthHeaderResult{Valid: false, Error: "missing_header"}
	}

	lower := strings.ToLower(trimmed)
	if !strings.HasPrefix(lower, "bearer ") {
		return AuthHeaderResult{Valid: false, Error: "invalid_scheme"}
	}

	token := strings.TrimSpace(trimmed[7:])
	if token == "" {
		return AuthHeaderResult{Valid: false, Error: "missing_token"}
	}

	return AuthHeaderResult{Valid: true, Token: token}
}
`,
  },
  {
    id: 'go-l3-ttl-cache',
    label: 'Track 2 (Level 3) - In-Memory TTL Cache (Go)',
    track: 2,
    level: 3,
    type: 'Build Feature',
    language: 'Go',
    raw: `---METADATA---
track: 2
level: 3
type: Build Feature
topic: Backend API & Middleware
title: In-Memory TTL Cache with Expiration
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
BUILD

GOAL:
Implement a lightweight in-memory cache struct MemoryCache supporting Set, Get, and Size operations with millisecond time-to-live (TTL) expiration.

CURRENT VS EXPECTED BEHAVIOR:
- Current: The cache retains keys forever without checking TTL expiration.
- Expected: Get(key, nowMs) returns the value and true if unexpired, or empty string and false if expired. Expired entries are deleted when accessed.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: TTL caching and lazy eviction strategy (Search: "in memory ttl cache eviction golang")
- Syntax: Go struct methods with pointer receivers and map manipulation (Search: "golang map struct methods time")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Calculate expiresAt as nowMs + ttlMs.
- Tip: In Get(key, nowMs), if nowMs >= entry.expiresAt, delete the entry from the map and return "", false.

WHERE TO WORK:
- Edit: solution.go (Target methods: Set, Get, Size)

HOW TO APPROACH THIS:
1. Store values with their calculated expiration timestamp (nowMs + ttlMs).
2. In Get(), check if the key exists and if nowMs >= expiresAt.
3. If expired, delete the key from the map and return "", false.
4. In Size(), count only non-expired items while evicting expired ones.

EDGE CASES TO WATCH:
- Exact boundary: nowMs == entry.expiresAt is considered expired.
- Non-existent key: returns "", false without error.

---FILE: solution.go---
package main

type cacheEntry struct {
	value     string
	expiresAt int64
}

type MemoryCache struct {
	store map[string]cacheEntry
}

func NewMemoryCache() *MemoryCache {
	return &MemoryCache{
		store: make(map[string]cacheEntry),
	}
}

func (c *MemoryCache) Set(key, value string, ttlMs, nowMs int64) {
	// TODO: store value with expiration
}

func (c *MemoryCache) Get(key string, nowMs int64) (string, bool) {
	// TODO: return value if unexpired, or empty string and false if expired
	return "", false
}

func (c *MemoryCache) Size(nowMs int64) int {
	// TODO: return count of currently valid entries
	return 0
}

---TESTS---
Input: c := NewMemoryCache(); c.Set("user:1", "Alice", 1000, 100); val, ok := c.Get("user:1", 500)
Expected: "Alice", true
Description: Retrieving key before TTL expiration returns stored value

Input: c := NewMemoryCache(); c.Set("user:1", "Alice", 1000, 100); val, ok := c.Get("user:1", 1200)
Expected: "", false
Description: Retrieving key after TTL expiration returns empty string and false

Input: c := NewMemoryCache(); c.Set("a", "1", 500, 0); c.Set("b", "2", 2000, 0); c.Size(1000)
Expected: 1
Description: Size returns count of non-expired entries

---REFERENCE---
package main

type cacheEntry struct {
	value     string
	expiresAt int64
}

type MemoryCache struct {
	store map[string]cacheEntry
}

func NewMemoryCache() *MemoryCache {
	return &MemoryCache{
		store: make(map[string]cacheEntry),
	}
}

func (c *MemoryCache) Set(key, value string, ttlMs, nowMs int64) {
	if c.store == nil {
		c.store = make(map[string]cacheEntry)
	}
	c.store[key] = cacheEntry{
		value:     value,
		expiresAt: nowMs + ttlMs,
	}
}

func (c *MemoryCache) Get(key string, nowMs int64) (string, bool) {
	if c.store == nil {
		return "", false
	}
	entry, exists := c.store[key]
	if !exists {
		return "", false
	}
	if nowMs >= entry.expiresAt {
		delete(c.store, key)
		return "", false
	}
	return entry.value, true
}

func (c *MemoryCache) Size(nowMs int64) int {
	if c.store == nil {
		return 0
	}
	count := 0
	for k, entry := range c.store {
		if nowMs < entry.expiresAt {
			count++
		} else {
			delete(c.store, k)
		}
	}
	return count
}
`,
  },
  {
    id: 'go-l3-pagination-bounds',
    label: 'Track 3 (Level 3) - API Pagination Parameters Parser (Go)',
    track: 3,
    level: 3,
    type: 'Build Feature',
    language: 'Go',
    raw: `---METADATA---
track: 3
level: 3
type: Build Feature
topic: Database & SQL Schemas
title: API Pagination Query Parser with Boundary Clamping
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
BUILD

GOAL:
Parse and clamp pagination parameters (page and limit) into safe database SQL query offset and limit values in a PaginationParams struct.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Raw inputs are unvalidated, permitting negative pages or excessive limits that can overload the database.
- Expected: Clamps page to >= 1 (default 1) and limit to range [1, 100] (default 20 when non-positive), calculating offset = (page - 1) * limit.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: SQL OFFSET and LIMIT pagination formulas (Search: "sql offset limit pagination formula")
- Syntax: Go integer bounds checking and arithmetic (Search: "golang clamp integer min max")

PRACTICAL TIPS & WATCHOUTS:
- Tip: When page is 1, offset is 0.
- Tip: If page is less than 1, clamp to default page 1. If limit is less than or equal to 0, use default limit 20. If limit exceeds 100, clamp to 100.

WHERE TO WORK:
- Edit: solution.go (Target function: ParsePagination)

HOW TO APPROACH THIS:
1. Verify page: if page < 1, set page to 1.
2. Verify limit: if limit <= 0, set limit to 20; if limit > 100, clamp to 100.
3. Compute offset as (page - 1) * limit.
4. Return PaginationParams struct.

EDGE CASES TO WATCH:
- Zero or negative page: page = -1 -> clamps to page = 1, offset = 0.
- Extreme limit: limit = 500 -> clamps to limit = 100.
- Zero limit: limit = 0 -> defaults to limit = 20.

---FILE: solution.go---
package main

type PaginationParams struct {
	Page   int
	Limit  int
	Offset int
}

// ParsePagination clamps page and limit to safe boundaries and computes SQL offset.
func ParsePagination(page, limit int) PaginationParams {
	// TODO: Clamp page and limit, and compute SQL offset
	return PaginationParams{Page: 1, Limit: 20, Offset: 0}
}

---TESTS---
Input: ParsePagination(2, 25)
Expected: PaginationParams{Page: 2, Limit: 25, Offset: 25}
Description: Page 2 with limit 25 produces offset 25

Input: ParsePagination(-1, 500)
Expected: PaginationParams{Page: 1, Limit: 100, Offset: 0}
Description: Negative page clamps to 1 and limit over 100 clamps to 100

Input: ParsePagination(0, 0)
Expected: PaginationParams{Page: 1, Limit: 20, Offset: 0}
Description: Non-positive inputs fall back to default page 1 and limit 20

---REFERENCE---
package main

type PaginationParams struct {
	Page   int
	Limit  int
	Offset int
}

func ParsePagination(page, limit int) PaginationParams {
	safePage := page
	if safePage < 1 {
		safePage = 1
	}

	safeLimit := limit
	if safeLimit <= 0 {
		safeLimit = 20
	} else if safeLimit > 100 {
		safeLimit = 100
	}

	offset := (safePage - 1) * safeLimit

	return PaginationParams{
		Page:   safePage,
		Limit:  safeLimit,
		Offset: offset,
	}
}
`,
  },

  // ==========================================
  // LEVEL 4 (3 Challenges) - State & Security
  // ==========================================
  {
    id: 'go-l4-timing-safe-compare',
    label: 'Track 4 (Level 4) - Constant-Time String Compare (Go)',
    track: 4,
    level: 4,
    type: 'Security Hardening',
    language: 'Go',
    raw: `---METADATA---
track: 4
level: 4
type: Security Hardening
topic: Data Security & Hardening
title: Constant-Time String Comparison Against Timing Attacks
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
BUILD

GOAL:
Implement a constant-time string comparison function TimingSafeEqual that compares two secret tokens without leaking timing information about matching prefixes.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses standard == which short-circuits on the first mismatched byte, allowing attackers to measure execution time.
- Expected: Inspects every byte using XOR bitwise accumulation, ensuring consistent execution duration regardless of match position.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Side-channel timing attacks and constant-time algorithms (Search: "timing attack string comparison crypto go")
- Syntax: Bitwise XOR (^) and OR (|) operators on bytes in Go (Search: "golang constant time byte compare bitwise")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Length differences should still execute comparisons over the max length rather than early exiting immediately.
- Tip: Accumulate differences in a byte: mismatch |= byteA ^ byteB.

WHERE TO WORK:
- Edit: solution.go (Target functions: TimingSafeEqual, VerifyToken)

HOW TO APPROACH THIS:
1. Determine lengths of both byte sequences.
2. Initialize mismatch indicator to 1 if lengths differ, or 0 if equal.
3. Loop through max length, fetching byte at index (or 0 if index exceeds slice length).
4. XOR the bytes and OR the result into mismatch.
5. Return mismatch == 0.

EDGE CASES TO WATCH:
- Different lengths: must return false without exposing where the lengths diverge.
- Empty strings: comparing "" and "" returns true.

---FILE: solution.go---
package main

// TimingSafeEqual compares two strings in constant time using bitwise accumulation.
func TimingSafeEqual(a, b string) bool {
	// TODO: Implement constant-time string comparison using XOR bitwise accumulation
	return a == b
}

func VerifyToken(expectedToken, providedToken string) bool {
	return TimingSafeEqual(expectedToken, providedToken)
}

---TESTS---
Input: TimingSafeEqual("secret-token-123", "secret-token-123")
Expected: true
Description: Identical strings return true

Input: TimingSafeEqual("secret-token-123", "secret-token-999")
Expected: false
Description: Strings differing at end return false

Input: TimingSafeEqual("secret", "secret-longer")
Expected: false
Description: Strings of different lengths return false

---REFERENCE---
package main

func TimingSafeEqual(a, b string) bool {
	bytesA := []byte(a)
	bytesB := []byte(b)
	lenA := len(bytesA)
	lenB := len(bytesB)

	var mismatch byte
	if lenA != lenB {
		mismatch = 1
	}

	compareLen := lenA
	if lenB > compareLen {
		compareLen = lenB
	}

	for i := 0; i < compareLen; i++ {
		var byteA, byteB byte
		if i < lenA {
			byteA = bytesA[i]
		}
		if i < lenB {
			byteB = bytesB[i]
		}
		mismatch |= byteA ^ byteB
	}

	return mismatch == 0
}

func VerifyToken(expectedToken, providedToken string) bool {
	return TimingSafeEqual(expectedToken, providedToken)
}
`,
  },
  {
    id: 'go-l4-token-bucket',
    label: 'Track 5 (Level 4) - Token Bucket Rate Limiter (Go)',
    track: 5,
    level: 4,
    type: 'Build Feature',
    language: 'Go',
    raw: `---METADATA---
track: 5
level: 4
type: Build Feature
topic: Distributed Systems & Workers
title: Token Bucket Rate Limiter with Time Refill
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
BUILD

GOAL:
Implement a TokenBucket struct that tracks request capacity and refills tokens over elapsed time based on a fill rate.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Capacity is static or consumes tokens without refilling over time.
- Expected: Calculates tokens added based on elapsed seconds (elapsedSec * refillRatePerSec), caps at MaxCapacity, and permits requests only when Tokens >= tokensRequested.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Token Bucket algorithm for API rate limiting (Search: "token bucket algorithm explained go")
- Syntax: Go struct pointer receivers and math.Min for capacity clamping (Search: "token bucket rate limiter golang")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Remember to update LastRefillSec whenever refilling.
- Tip: Clamp Tokens so it never exceeds MaxCapacity.

WHERE TO WORK:
- Edit: solution.go (Target method: Consume)
- Reference: types.go (readonly RateLimitResult struct)

HOW TO APPROACH THIS:
1. On each Consume call, calculate elapsed seconds since LastRefillSec.
2. If elapsed > 0, add elapsed * RefillRatePerSec to Tokens, capped at MaxCapacity, and update LastRefillSec.
3. Check if Tokens >= tokensRequested. If so, decrement Tokens and return RateLimitResult{Allowed: true, RemainingTokens: math.Floor(Tokens)}.
4. Otherwise, return RateLimitResult{Allowed: false, RemainingTokens: math.Floor(Tokens)}.

EDGE CASES TO WATCH:
- Burst traffic: Cannot consume more than MaxCapacity in a single burst.
- Time moving backward: If nowSec <= LastRefillSec, do not deduct or add refill tokens.

---FILE: types.go (readonly)---
package main

type RateLimitResult struct {
	Allowed         bool
	RemainingTokens float64
}

---FILE: solution.go---
package main

type TokenBucket struct {
	MaxCapacity      float64
	RefillRatePerSec float64
	Tokens           float64
	LastRefillSec    int64
}

func NewTokenBucket(maxCapacity, refillRatePerSec float64, initialTimeSec int64) *TokenBucket {
	return &TokenBucket{
		MaxCapacity:      maxCapacity,
		RefillRatePerSec: refillRatePerSec,
		Tokens:           maxCapacity,
		LastRefillSec:    initialTimeSec,
	}
}

func (tb *TokenBucket) Consume(tokensRequested float64, nowSec int64) RateLimitResult {
	// TODO: Refill based on elapsed time, check capacity, and deduct tokens
	return RateLimitResult{Allowed: true, RemainingTokens: tb.Tokens}
}

---TESTS---
Input: b := NewTokenBucket(10, 2, 0); b.Consume(5, 0)
Expected: RateLimitResult{Allowed: true, RemainingTokens: 5}
Description: Consuming tokens within capacity succeeds and decrements count

Input: b := NewTokenBucket(10, 2, 0); b.Consume(8, 0); b.Consume(5, 0)
Expected: RateLimitResult{Allowed: false, RemainingTokens: 2}
Description: Consuming more tokens than remaining capacity is rejected

Input: b := NewTokenBucket(10, 2, 0); b.Consume(10, 0); b.Consume(3, 2)
Expected: RateLimitResult{Allowed: true, RemainingTokens: 1}
Description: Tokens refill over elapsed time (4 refilled after 2 seconds)

---REFERENCE---
package main

import "math"

type TokenBucket struct {
	MaxCapacity      float64
	RefillRatePerSec float64
	Tokens           float64
	LastRefillSec    int64
}

func NewTokenBucket(maxCapacity, refillRatePerSec float64, initialTimeSec int64) *TokenBucket {
	return &TokenBucket{
		MaxCapacity:      maxCapacity,
		RefillRatePerSec: refillRatePerSec,
		Tokens:           maxCapacity,
		LastRefillSec:    initialTimeSec,
	}
}

func (tb *TokenBucket) refill(nowSec int64) {
	if nowSec <= tb.LastRefillSec {
		return
	}
	elapsed := float64(nowSec - tb.LastRefillSec)
	added := elapsed * tb.RefillRatePerSec
	tb.Tokens = math.Min(tb.MaxCapacity, tb.Tokens+added)
	tb.LastRefillSec = nowSec
}

func (tb *TokenBucket) Consume(tokensRequested float64, nowSec int64) RateLimitResult {
	tb.refill(nowSec)

	if tb.Tokens >= tokensRequested {
		tb.Tokens -= tokensRequested
		return RateLimitResult{
			Allowed:         true,
			RemainingTokens: math.Floor(tb.Tokens),
		}
	}

	return RateLimitResult{
		Allowed:         false,
		RemainingTokens: math.Floor(tb.Tokens),
	}
}
`,
  },
  {
    id: 'go-l4-field-validator-touched',
    label: 'Track 2 (Level 4) - Form Field Touched State Machine (Go)',
    track: 2,
    level: 4,
    type: 'Build Feature',
    language: 'Go',
    raw: `---METADATA---
track: 2
level: 4
type: Build Feature
topic: Frontend UI & Forms
title: Form Field Touched State and Error Visibility Manager
editableLanguage: go
editableFiles: solution.go

---TASK---
ACTION:
BUILD

GOAL:
Build an immutable form field state manager that tracks value, touched status, and shows validation errors only after a field has been touched.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Errors are displayed prematurely before the user interacts with the input.
- Expected: UpdateField updates value and evaluates error, but GetVisibleError returns nil until TouchField is called.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Form touched states and error visibility UX (Search: "form validation touched state pattern")
- Syntax: Go value receivers, immutable struct copies, and string pointers (Search: "golang pointer to string optional error")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Never mutate the original FieldState in-place; always return a new struct with updated fields.
- Tip: When value is corrected, error should become nil immediately.

WHERE TO WORK:
- Edit: solution.go (Target functions: CreateField, UpdateField, TouchField, GetVisibleError)
- Reference: types.go (readonly FieldState struct and ValidatorFn)

HOW TO APPROACH THIS:
1. Implement CreateField to return FieldState{Value: initialValue, Touched: false, Error: validator(initialValue)}.
2. In UpdateField, re-validate the new value and return updated state while preserving Touched status.
3. In TouchField, return a new state with Touched: true.
4. In GetVisibleError, return state.Error only if state.Touched is true; otherwise nil.

EDGE CASES TO WATCH:
- Untouched field with bad value: GetVisibleError returns nil.
- Touched field with valid value: GetVisibleError returns nil.

---FILE: types.go (readonly)---
package main

type FieldState struct {
	Value   string
	Touched bool
	Error   *string
}

type ValidatorFn func(value string) *string

---FILE: solution.go---
package main

func CreateField(initialValue string, validator ValidatorFn) FieldState {
	// TODO: initialize field state
	return FieldState{Value: initialValue, Touched: false, Error: nil}
}

func UpdateField(field FieldState, newValue string, validator ValidatorFn) FieldState {
	// TODO: return new state with updated value and re-validated error
	return field
}

func TouchField(field FieldState) FieldState {
	// TODO: mark field as touched
	return field
}

func GetVisibleError(field FieldState) *string {
	// TODO: return error pointer only when touched is true
	return nil
}

---TESTS---
Input: reqValidator := func(v string) *string { if v == "" { err := "Required"; return &err }; return nil }; f := CreateField("", reqValidator); GetVisibleError(f)
Expected: nil
Description: Untouched invalid field hides error message

Input: reqValidator := func(v string) *string { if v == "" { err := "Required"; return &err }; return nil }; f := CreateField("", reqValidator); GetVisibleError(TouchField(f))
Expected: "Required"
Description: Touched invalid field reveals error message

Input: lenValidator := func(v string) *string { if len(v) < 3 { err := "Too short"; return &err }; return nil }; f := TouchField(CreateField("", lenValidator)); GetVisibleError(UpdateField(f, "Valid", lenValidator))
Expected: nil
Description: Updating touched field with valid input clears error

---REFERENCE---
package main

func CreateField(initialValue string, validator ValidatorFn) FieldState {
	return FieldState{
		Value:   initialValue,
		Touched: false,
		Error:   validator(initialValue),
	}
}

func UpdateField(field FieldState, newValue string, validator ValidatorFn) FieldState {
	return FieldState{
		Value:   newValue,
		Touched: field.Touched,
		Error:   validator(newValue),
	}
}

func TouchField(field FieldState) FieldState {
	return FieldState{
		Value:   field.Value,
		Touched: true,
		Error:   field.Error,
	}
}

func GetVisibleError(field FieldState) *string {
	if field.Touched {
		return field.Error
	}
	return nil
}
`,
  },

  // ==========================================
  // LEVEL 6 (2 Challenges) - Multi-Task & Multi-File
  // ==========================================
  {
    id: 'go-l6-rbac-route-guard',
    label: 'Track 1 (Level 6) - RBAC Policy Guard & Route Interceptor (Go)',
    track: 1,
    level: 6,
    type: 'Security Hardening',
    language: 'Go',
    raw: `---METADATA---
track: 1
level: 6
type: Security Hardening
topic: Auth, JWT & Sessions
title: RBAC Hierarchical Policy Resolver and Route Guard
editableLanguage: go
editableFiles: policy.go, route_guard.go

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file Role-Based Access Control (RBAC) engine that resolves inherited role permissions in policy.go and enforces route authorization decisions with custom denial codes in route_guard.go.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Route access is unguarded or checks only direct role strings without considering permission hierarchy or resource ownership.
- Expected: Resolves transitive permissions from role inheritance trees, checks required permissions for route actions, and permits resource owners when configured.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Hierarchical RBAC and resource ownership policies (Search: "hierarchical rbac permissions architecture")
- Syntax: Go map as set, slice iteration, and recursion with cycle detection (Search: "golang map set role hierarchy recursion")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Avoid infinite loops when resolving role inheritance by tracking visited roles in a map.
- Tip: If a policy has AllowOwner: true, check if user.ID == resource.OwnerID before denying access.

WHERE TO WORK:
- Edit: policy.go (Target functions: ResolveUserPermissions, HasPermission)
- Edit: route_guard.go (Target function: EvaluateRouteAccess)
- Reference: types.go (readonly companion roles, permissions, and request contexts)

HOW TO APPROACH THIS:
1. In policy.go, implement ResolveUserPermissions to traverse assigned roles and inherited sub-roles, collecting all permissions into a map set.
2. In policy.go, implement HasPermission to verify if the resolved permissions contain the required permission.
3. In route_guard.go, implement EvaluateRouteAccess to check the RoutePolicy against user permissions and resource ownership.
4. Return a structured AccessDecision: AccessDecision{Allowed: true} or AccessDecision{Allowed: false, Reason: "unauthenticated" | "insufficient_permissions"}.

EDGE CASES TO WATCH:
- Unauthenticated user (nil user): returns Allowed: false with Reason: "unauthenticated".
- Resource owner override: user lacks permission but is resource owner -> Allowed: true.

---FILE: types.go (readonly)---
package main

type Role string
type Permission string

const (
	RoleAdmin  Role = "admin"
	RoleEditor Role = "editor"
	RoleViewer Role = "viewer"

	PermissionRead    Permission = "read"
	PermissionWrite   Permission = "write"
	PermissionDelete  Permission = "delete"
	PermissionPublish Permission = "publish"
)

type UserContext struct {
	ID    string
	Roles []Role
}

type ResourceContext struct {
	OwnerID string
}

type RoutePolicy struct {
	RequiredPermission Permission
	AllowOwner         bool
}

type AccessDecision struct {
	Allowed bool
	Reason  string
}

---FILE: policy.go---
package main

type RoleConfig struct {
	Permissions []Permission
	Inherits    []Role
}

var RoleHierarchy = map[Role]RoleConfig{
	RoleViewer: {
		Permissions: []Permission{PermissionRead},
	},
	RoleEditor: {
		Permissions: []Permission{PermissionWrite},
		Inherits:    []Role{RoleViewer},
	},
	RoleAdmin: {
		Permissions: []Permission{PermissionDelete, PermissionPublish},
		Inherits:    []Role{RoleEditor},
	},
}

// ResolveUserPermissions resolves all direct and inherited permissions for a slice of roles.
func ResolveUserPermissions(roles []Role) map[Permission]bool {
	// TODO: Traverse roles and role inheritance to gather all distinct permissions
	return make(map[Permission]bool)
}

// HasPermission checks if a required permission exists in the resolved permission set.
func HasPermission(userPermissions map[Permission]bool, required Permission) bool {
	// TODO: Check if required permission is present in map
	return false
}

---FILE: route_guard.go---
package main

// EvaluateRouteAccess checks if a user is permitted to access a route under policy.
func EvaluateRouteAccess(
	user *UserContext,
	resource *ResourceContext,
	policy RoutePolicy,
) AccessDecision {
	// TODO: 1. Check if user is present (nil user -> unauthenticated)
	// 2. Check resource ownership bypass if policy.AllowOwner is true
	// 3. Check resolved permissions against policy.RequiredPermission
	return AccessDecision{Allowed: false, Reason: "unauthenticated"}
}

---TESTS---
Input: EvaluateRouteAccess(&UserContext{ID: "u1", Roles: []Role{RoleAdmin}}, nil, RoutePolicy{RequiredPermission: PermissionRead})
Expected: AccessDecision{Allowed: true}
Description: Admin inherits viewer read permission and is granted access

Input: EvaluateRouteAccess(&UserContext{ID: "u2", Roles: []Role{RoleViewer}}, nil, RoutePolicy{RequiredPermission: PermissionWrite})
Expected: AccessDecision{Allowed: false, Reason: "insufficient_permissions"}
Description: Viewer lacks write permission and is denied

Input: EvaluateRouteAccess(&UserContext{ID: "u3", Roles: []Role{RoleViewer}}, &ResourceContext{OwnerID: "u3"}, RoutePolicy{RequiredPermission: PermissionWrite, AllowOwner: true})
Expected: AccessDecision{Allowed: true}
Description: Resource owner bypasses required permission when AllowOwner is enabled

Input: EvaluateRouteAccess(nil, nil, RoutePolicy{RequiredPermission: PermissionRead})
Expected: AccessDecision{Allowed: false, Reason: "unauthenticated"}
Description: Unauthenticated user is denied with unauthenticated reason

---REFERENCE---
// policy.go
package main

func ResolveUserPermissions(roles []Role) map[Permission]bool {
	permissions := make(map[Permission]bool)
	visitedRoles := make(map[Role]bool)

	var collect func(r Role)
	collect = func(r Role) {
		if visitedRoles[r] {
			return
		}
		visitedRoles[r] = true

		cfg, ok := RoleHierarchy[r]
		if !ok {
			return
		}

		for _, p := range cfg.Permissions {
			permissions[p] = true
		}
		for _, parent := range cfg.Inherits {
			collect(parent)
		}
	}

	for _, r := range roles {
		collect(r)
	}

	return permissions
}

func HasPermission(userPermissions map[Permission]bool, required Permission) bool {
	return userPermissions[required]
}

// route_guard.go
package main

func EvaluateRouteAccess(
	user *UserContext,
	resource *ResourceContext,
	policy RoutePolicy,
) AccessDecision {
	if user == nil {
		return AccessDecision{Allowed: false, Reason: "unauthenticated"}
	}

	if policy.AllowOwner && resource != nil && resource.OwnerID == user.ID {
		return AccessDecision{Allowed: true}
	}

	if policy.RequiredPermission != "" {
		permissions := ResolveUserPermissions(user.Roles)
		if !HasPermission(permissions, policy.RequiredPermission) {
			return AccessDecision{Allowed: false, Reason: "insufficient_permissions"}
		}
	}

	return AccessDecision{Allowed: true}
}
`,
  },
  {
    id: 'go-l6-optimistic-lock-store',
    label: 'Track 2 (Level 6) - Optimistic Locking Document Store (Go)',
    track: 2,
    level: 6,
    type: 'Build Feature',
    language: 'Go',
    raw: `---METADATA---
track: 2
level: 6
type: Build Feature
topic: State & Async Race Conditions
title: Optimistic Locking Store with Conflict Resolution
editableLanguage: go
editableFiles: versioned_store.go, mutation_coordinator.go

---TASK---
ACTION:
BUILD

GOAL:
Build a multi-file optimistic concurrency store where updates check document version tags and automatic rollback is triggered when concurrent mutations conflict.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Last write wins, silently overwriting concurrent updates and losing data.
- Expected: Verifies expectedVersion == current.Version before applying updates and increments version; rejects and triggers conflict callback on version mismatch.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Optimistic Concurrency Control (OCC) and version vectors (Search: "optimistic concurrency control version field go")
- Syntax: Go map storage, struct pointer methods, and callback functions (Search: "golang optimistic lock store map")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Always increment Version by 1 on every successful mutation.
- Tip: In mutation_coordinator.go, if store.UpdateWithVersion returns conflict and onConflict callback is non-nil, invoke onConflict with the current document state.

WHERE TO WORK:
- Edit: versioned_store.go (Target methods: Insert, Get, UpdateWithVersion)
- Edit: mutation_coordinator.go (Target function: ExecuteOptimisticMutation)
- Reference: models.go (readonly VersionedDoc and MutationOutcome structs)

HOW TO APPROACH THIS:
1. In versioned_store.go, check if the document exists. If missing, return MutationOutcome{Success: false, Reason: "not_found"}.
2. Check if existing.Version == expectedVersion. If mismatched, return MutationOutcome{Success: false, Reason: "conflict", CurrentVersion: existing.Version}.
3. Merge newData into existing document data, bump Version by 1, save, and return MutationOutcome{Success: true, Doc: &updated}.
4. In mutation_coordinator.go, invoke store.UpdateWithVersion. If conflict occurs and onConflict is provided, fetch latest document and invoke onConflict.

EDGE CASES TO WATCH:
- Document not found: returns Success: false with Reason: "not_found".
- Version mismatch: returns Success: false with Reason: "conflict" and CurrentVersion set.

---FILE: models.go (readonly)---
package main

type VersionedDoc struct {
	ID      string
	Version int
	Data    map[string]interface{}
}

type MutationOutcome struct {
	Success        bool
	Reason         string
	CurrentVersion int
	Doc            *VersionedDoc
}

---FILE: versioned_store.go---
package main

type VersionedStore struct {
	docs map[string]VersionedDoc
}

func NewVersionedStore() *VersionedStore {
	return &VersionedStore{
		docs: make(map[string]VersionedDoc),
	}
}

func (s *VersionedStore) Insert(doc VersionedDoc) {
	if s.docs == nil {
		s.docs = make(map[string]VersionedDoc)
	}
	s.docs[doc.ID] = doc
}

func (s *VersionedStore) Get(id string) (*VersionedDoc, bool) {
	if s.docs == nil {
		return nil, false
	}
	doc, exists := s.docs[id]
	if !exists {
		return nil, false
	}
	return &doc, true
}

func (s *VersionedStore) UpdateWithVersion(id string, expectedVersion int, newData map[string]interface{}) MutationOutcome {
	// TODO: Verify expectedVersion matches current version, increment version, and save
	return MutationOutcome{Success: false, Reason: "not_found"}
}

---FILE: mutation_coordinator.go---
package main

func ExecuteOptimisticMutation(
	store *VersionedStore,
	id string,
	expectedVersion int,
	newData map[string]interface{},
	onConflict func(currentDoc VersionedDoc),
) MutationOutcome {
	// TODO: Execute update, call onConflict callback if conflict occurs, return outcome
	return store.UpdateWithVersion(id, expectedVersion, newData)
}

---TESTS---
Input: s := NewVersionedStore(); s.Insert(VersionedDoc{ID: "doc1", Version: 1, Data: map[string]interface{}{"name": "A"}}); s.UpdateWithVersion("doc1", 1, map[string]interface{}{"name": "B"})
Expected: MutationOutcome{Success: true, Doc: &VersionedDoc{ID: "doc1", Version: 2, Data: map[string]interface{}{"name": "B"}}}
Description: Matching version successfully updates document and increments version to 2

Input: s := NewVersionedStore(); s.Insert(VersionedDoc{ID: "doc1", Version: 2, Data: map[string]interface{}{"name": "A"}}); s.UpdateWithVersion("doc1", 1, map[string]interface{}{"name": "C"})
Expected: MutationOutcome{Success: false, Reason: "conflict", CurrentVersion: 2}
Description: Stale version 1 on version 2 document is rejected with conflict reason

Input: s := NewVersionedStore(); s.UpdateWithVersion("missing", 1, map[string]interface{}{"name": "X"})
Expected: MutationOutcome{Success: false, Reason: "not_found"}
Description: Non-existent document ID returns not_found

---REFERENCE---
// versioned_store.go
package main

func (s *VersionedStore) UpdateWithVersion(id string, expectedVersion int, newData map[string]interface{}) MutationOutcome {
	if s.docs == nil {
		return MutationOutcome{Success: false, Reason: "not_found"}
	}
	existing, exists := s.docs[id]
	if !exists {
		return MutationOutcome{Success: false, Reason: "not_found"}
	}

	if existing.Version != expectedVersion {
		return MutationOutcome{
			Success:        false,
			Reason:         "conflict",
			CurrentVersion: existing.Version,
		}
	}

	mergedData := make(map[string]interface{})
	for k, v := range existing.Data {
		mergedData[k] = v
	}
	for k, v := range newData {
		mergedData[k] = v
	}

	updated := VersionedDoc{
		ID:      id,
		Version: existing.Version + 1,
		Data:    mergedData,
	}

	s.docs[id] = updated
	return MutationOutcome{
		Success: true,
		Doc:     &updated,
	}
}

// mutation_coordinator.go
package main

func ExecuteOptimisticMutation(
	store *VersionedStore,
	id string,
	expectedVersion int,
	newData map[string]interface{},
	onConflict func(currentDoc VersionedDoc),
) MutationOutcome {
	outcome := store.UpdateWithVersion(id, expectedVersion, newData)

	if !outcome.Success && outcome.Reason == "conflict" && onConflict != nil {
		if latest, exists := store.Get(id); exists && latest != nil {
			onConflict(*latest)
		}
	}

	return outcome
}
`,
  },

  // ==========================================
  // LEVEL 10 (2 Challenges) - Scale & Concurrency
  // ==========================================
  {
    id: 'go-l10-idempotent-webhook-dispatcher',
    label: 'Track 5 (Level 10) - Idempotent Webhook Event Dispatcher (Go)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'Go',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Idempotent Webhook Dispatcher with Lease Locks and Deduplication
editableLanguage: go
editableFiles: idempotency_registry.go, event_pipeline.go

---TASK---
ACTION:
BUILD

GOAL:
Build a distributed webhook delivery engine across idempotency_registry.go and event_pipeline.go that prevents duplicate executions, handles concurrency leases, and records delivery statuses.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Incoming webhook retries execute handlers multiple times, creating duplicate database writes or double billing.
- Expected: Deduplicates events by event ID, uses lease locks with expiration to guard in-flight processing, and returns cached results on duplicate delivery.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Idempotency keys, distributed leasing, and replay attacks (Search: "stripe webhook idempotency key pattern go")
- Syntax: Go map state machine, lease expiration checks, and callback handlers (Search: "golang idempotency lease store")

PRACTICAL TIPS & WATCHOUTS:
- Tip: If a lock lease is expired (nowMs >= lease.ExpiresAtMs), consider the lease abandoned and allow re-acquisition.
- Tip: When execution fails, release the lease so subsequent retries can proceed immediately.

WHERE TO WORK:
- Edit: idempotency_registry.go (Target methods: AcquireLease, MarkCompleted, ReleaseLease, GetRecord)
- Edit: event_pipeline.go (Target function: ProcessWebhookEvent)
- Reference: types.go (readonly WebhookEvent, DispatchResult, LeaseRecord structs)

HOW TO APPROACH THIS:
1. In idempotency_registry.go, check if the event is already marked COMPLETED. If so, refuse lease acquisition.
2. Check if an active lease exists (PROCESSING and nowMs < ExpiresAtMs). If active, refuse lease.
3. If unleased or expired, set status to PROCESSING with ExpiresAtMs = nowMs + leaseDurationMs.
4. In event_pipeline.go, return DUPLICATE if already completed, LOCKED if lease cannot be acquired, and execute handler on success.

EDGE CASES TO WATCH:
- Expired in-flight lease: allows recovery and re-processing.
- Concurrent duplicate: immediate rejection with LOCKED without invoking the handler twice.

---FILE: types.go (readonly)---
package main

type EventStatus string

const (
	StatusPending    EventStatus = "PENDING"
	StatusProcessing EventStatus = "PROCESSING"
	StatusCompleted  EventStatus = "COMPLETED"
	StatusFailed     EventStatus = "FAILED"
)

type WebhookEvent struct {
	ID        string
	EventType string
	Payload   map[string]interface{}
}

type DispatchResult struct {
	Status   string
	EventID  string
	Response interface{}
}

type LeaseRecord struct {
	Status      EventStatus
	ExpiresAtMs int64
	Result      interface{}
}

---FILE: idempotency_registry.go---
package main

type IdempotencyRegistry struct {
	records map[string]LeaseRecord
}

func NewIdempotencyRegistry() *IdempotencyRegistry {
	return &IdempotencyRegistry{
		records: make(map[string]LeaseRecord),
	}
}

func (r *IdempotencyRegistry) AcquireLease(eventID string, leaseDurationMs, nowMs int64) bool {
	// TODO: Return true if lease acquired; false if already processing or completed
	return false
}

func (r *IdempotencyRegistry) MarkCompleted(eventID string, result interface{}) {
	// TODO: Set status to COMPLETED and store result
}

func (r *IdempotencyRegistry) ReleaseLease(eventID string) {
	// TODO: Delete or reset lease on failure
}

func (r *IdempotencyRegistry) GetRecord(eventID string) (LeaseRecord, bool) {
	if r.records == nil {
		return LeaseRecord{}, false
	}
	rec, ok := r.records[eventID]
	return rec, ok
}

---FILE: event_pipeline.go---
package main

type EventHandler func(event WebhookEvent) (interface{}, error)

func ProcessWebhookEvent(
	registry *IdempotencyRegistry,
	event WebhookEvent,
	nowMs int64,
	handler EventHandler,
) (DispatchResult, error) {
	// TODO: 1. Check existing record for completion
	// 2. Try acquire lease
	// 3. Execute handler, mark completed, or release on error
	return DispatchResult{Status: "LOCKED", EventID: event.ID}, nil
}

---TESTS---
Input: reg := NewIdempotencyRegistry(); res, _ := ProcessWebhookEvent(reg, WebhookEvent{ID: "evt_1", EventType: "payment", Payload: nil}, 1000, func(e WebhookEvent) (interface{}, error) { return map[string]bool{"paid": true}, nil })
Expected: DispatchResult{Status: "PROCESSED", EventID: "evt_1", Response: map[string]bool{"paid": true}}
Description: First event delivery executes handler and records completion

Input: reg := NewIdempotencyRegistry(); ProcessWebhookEvent(reg, WebhookEvent{ID: "evt_1", EventType: "payment", Payload: nil}, 1000, func(e WebhookEvent) (interface{}, error) { return map[string]bool{"paid": true}, nil }); res, _ := ProcessWebhookEvent(reg, WebhookEvent{ID: "evt_1", EventType: "payment", Payload: nil}, 1100, func(e WebhookEvent) (interface{}, error) { return map[string]bool{"paid": false}, nil })
Expected: DispatchResult{Status: "DUPLICATE", EventID: "evt_1", Response: map[string]bool{"paid": true}}
Description: Duplicate event returns cached response without re-executing handler

Input: reg := NewIdempotencyRegistry(); reg.AcquireLease("evt_2", 5000, 1000); res, _ := ProcessWebhookEvent(reg, WebhookEvent{ID: "evt_2", EventType: "payment", Payload: nil}, 2000, func(e WebhookEvent) (interface{}, error) { return nil, nil })
Expected: DispatchResult{Status: "LOCKED", EventID: "evt_2"}
Description: Concurrent request during active lease returns LOCKED status

---REFERENCE---
// idempotency_registry.go
package main

func (r *IdempotencyRegistry) AcquireLease(eventID string, leaseDurationMs, nowMs int64) bool {
	if r.records == nil {
		r.records = make(map[string]LeaseRecord)
	}
	existing, exists := r.records[eventID]
	if exists {
		if existing.Status == StatusCompleted {
			return false
		}
		if existing.Status == StatusProcessing && nowMs < existing.ExpiresAtMs {
			return false
		}
	}

	r.records[eventID] = LeaseRecord{
		Status:      StatusProcessing,
		ExpiresAtMs: nowMs + leaseDurationMs,
	}
	return true
}

func (r *IdempotencyRegistry) MarkCompleted(eventID string, result interface{}) {
	if r.records == nil {
		r.records = make(map[string]LeaseRecord)
	}
	r.records[eventID] = LeaseRecord{
		Status:      StatusCompleted,
		ExpiresAtMs: 0,
		Result:      result,
	}
}

func (r *IdempotencyRegistry) ReleaseLease(eventID string) {
	if r.records == nil {
		return
	}
	existing, exists := r.records[eventID]
	if exists && existing.Status != StatusCompleted {
		delete(r.records, eventID)
	}
}

// event_pipeline.go
package main

func ProcessWebhookEvent(
	registry *IdempotencyRegistry,
	event WebhookEvent,
	nowMs int64,
	handler EventHandler,
) (DispatchResult, error) {
	existing, exists := registry.GetRecord(event.ID)
	if exists && existing.Status == StatusCompleted {
		return DispatchResult{
			Status:   "DUPLICATE",
			EventID:  event.ID,
			Response: existing.Result,
		}, nil
	}

	acquired := registry.AcquireLease(event.ID, 5000, nowMs)
	if !acquired {
		return DispatchResult{
			Status:  "LOCKED",
			EventID: event.ID,
		}, nil
	}

	res, err := handler(event)
	if err != nil {
		registry.ReleaseLease(event.ID)
		return DispatchResult{}, err
	}

	registry.MarkCompleted(event.ID, res)
	return DispatchResult{
		Status:   "PROCESSED",
		EventID:  event.ID,
		Response: res,
	}, nil
}
`,
  },
  {
    id: 'go-l10-distributed-sliding-window-limiter',
    label: 'Track 5 (Level 10) - Sliding Window Counter with Drift Tolerance (Go)',
    track: 5,
    level: 10,
    type: 'Security Hardening',
    language: 'Go',
    raw: `---METADATA---
track: 5
level: 10
type: Security Hardening
topic: Distributed Systems & Workers
title: Sliding-Window Rate Limiter with Sub-Second Slicing and Drift Tolerance
editableLanguage: go
editableFiles: sub_window_counter.go, traffic_gate.go

---TASK---
ACTION:
BUILD

GOAL:
Implement a high-throughput sliding-window rate limiter divided into granular sub-windows that tracks hit counters, evicts expired slices, and compensates for clock drift.

CURRENT VS EXPECTED BEHAVIOR:
- Current: Uses fixed window counters that allow 2x burst traffic across window boundaries.
- Expected: Slices window into multiple sub-windows (e.g. 10 slices of 1000ms in a 10000ms window), dynamically summing hits within [nowMs - windowMs, nowMs] and rejecting traffic exceeding MaxRequests.

IF STUCK: LEARN THESE TOPICS & SYNTAX:
- Concept: Sliding window counter algorithm vs fixed window (Search: "sliding window counter rate limiting algorithm")
- Syntax: Sub-window bucket division, map eviction, and range aggregation (Search: "golang sliding window rate limiter")

PRACTICAL TIPS & WATCHOUTS:
- Tip: Sub-window key can be timestampMs / subWindowMs.
- Tip: Delete sub-windows whose key < (nowMs - windowMs) / subWindowMs to prevent memory leak.

WHERE TO WORK:
- Edit: sub_window_counter.go (Target methods: RecordHit, GetWindowCount, PruneExpired)
- Edit: traffic_gate.go (Target function: CheckTrafficLimit)
- Reference: clock.go (readonly GateConfig and GateDecision structs)

HOW TO APPROACH THIS:
1. In sub_window_counter.go, map sub-window keys to integer hit counts.
2. In RecordHit, increment the count for current sub-window (timestampMs / subWindowMs).
3. In PruneExpired, delete bucket keys strictly less than (nowMs - windowMs) / subWindowMs.
4. In GetWindowCount, aggregate counts from minKey to maxKey.
5. In traffic_gate.go, check if current count >= config.MaxRequests. If so, return GateDecision{Allowed: false}; otherwise increment and return GateDecision{Allowed: true}.

EDGE CASES TO WATCH:
- Clock drift: Small negative timestamp variations handled safely within sub-windows.
- Boundary transitions: Smoothly transitions traffic without doubling rate at boundary.

---FILE: clock.go (readonly)---
package main

type GateConfig struct {
	WindowMs    int64
	SubWindowMs int64
	MaxRequests int
}

type GateDecision struct {
	Allowed      bool
	CurrentCount int
	ResetMs      int64
}

---FILE: sub_window_counter.go---
package main

type SubWindowCounter struct {
	buckets map[int64]int
}

func NewSubWindowCounter() *SubWindowCounter {
	return &SubWindowCounter{
		buckets: make(map[int64]int),
	}
}

func (c *SubWindowCounter) RecordHit(timestampMs, subWindowMs int64) {
	// TODO: Calculate sub-window bucket key and increment count
}

func (c *SubWindowCounter) GetWindowCount(nowMs, windowMs, subWindowMs int64) int {
	// TODO: Sum counts of all buckets falling within [nowMs - windowMs, nowMs]
	return 0
}

func (c *SubWindowCounter) PruneExpired(nowMs, windowMs, subWindowMs int64) {
	// TODO: Remove buckets older than nowMs - windowMs
}

---FILE: traffic_gate.go---
package main

func CheckTrafficLimit(
	counter *SubWindowCounter,
	config GateConfig,
	nowMs int64,
) GateDecision {
	// TODO: 1. Prune expired buckets
	// 2. Query current window count
	// 3. If under limit, record hit and allow; otherwise reject
	return GateDecision{Allowed: true, CurrentCount: 0, ResetMs: 0}
}

---TESTS---
Input: c := NewSubWindowCounter(); CheckTrafficLimit(c, GateConfig{WindowMs: 10000, SubWindowMs: 1000, MaxRequests: 5}, 1000)
Expected: GateDecision{Allowed: true, CurrentCount: 1, ResetMs: 10000}
Description: First request within window is permitted and incremented

Input: c := NewSubWindowCounter(); for i := 0; i < 5; i++ { CheckTrafficLimit(c, GateConfig{WindowMs: 10000, SubWindowMs: 1000, MaxRequests: 5}, 1000) }; CheckTrafficLimit(c, GateConfig{WindowMs: 10000, SubWindowMs: 1000, MaxRequests: 5}, 1000)
Expected: GateDecision{Allowed: false, CurrentCount: 5, ResetMs: 10000}
Description: Request exceeding 5 requests within sliding window is rejected

Input: c := NewSubWindowCounter(); for i := 0; i < 5; i++ { CheckTrafficLimit(c, GateConfig{WindowMs: 10000, SubWindowMs: 1000, MaxRequests: 5}, 1000) }; CheckTrafficLimit(c, GateConfig{WindowMs: 10000, SubWindowMs: 1000, MaxRequests: 5}, 12000)
Expected: GateDecision{Allowed: true, CurrentCount: 1, ResetMs: 10000}
Description: Requests in past window expire, permitting new requests

---REFERENCE---
// sub_window_counter.go
package main

func (c *SubWindowCounter) RecordHit(timestampMs, subWindowMs int64) {
	if c.buckets == nil {
		c.buckets = make(map[int64]int)
	}
	key := timestampMs / subWindowMs
	c.buckets[key] = c.buckets[key] + 1
}

func (c *SubWindowCounter) PruneExpired(nowMs, windowMs, subWindowMs int64) {
	if c.buckets == nil {
		return
	}
	minTime := nowMs - windowMs
	minKey := minTime / subWindowMs
	for key := range c.buckets {
		if key < minKey {
			delete(c.buckets, key)
		}
	}
}

func (c *SubWindowCounter) GetWindowCount(nowMs, windowMs, subWindowMs int64) int {
	c.PruneExpired(nowMs, windowMs, subWindowMs)
	if c.buckets == nil {
		return 0
	}
	minTime := nowMs - windowMs
	minKey := minTime / subWindowMs
	maxKey := nowMs / subWindowMs

	total := 0
	for k := minKey; k <= maxKey; k++ {
		total += c.buckets[k]
	}
	return total
}

// traffic_gate.go
package main

func CheckTrafficLimit(
	counter *SubWindowCounter,
	config GateConfig,
	nowMs int64,
) GateDecision {
	counter.PruneExpired(nowMs, config.WindowMs, config.SubWindowMs)
	currentCount := counter.GetWindowCount(nowMs, config.WindowMs, config.SubWindowMs)

	if currentCount >= config.MaxRequests {
		return GateDecision{
			Allowed:      false,
			CurrentCount: currentCount,
			ResetMs:      config.WindowMs,
		}
	}

	counter.RecordHit(nowMs, config.SubWindowMs)
	return GateDecision{
		Allowed:      true,
		CurrentCount: currentCount + 1,
		ResetMs:      config.WindowMs,
	}
}
`,
  },
];
