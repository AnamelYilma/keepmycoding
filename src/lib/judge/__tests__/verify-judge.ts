// KeepCoding - Test Verification Suite for AI Judge Utilities

import { buildJudgeSystemPrompt, buildJudgeUserPrompt } from '../judge-prompt';
import { parseJudgeResponse } from '../judge-parser';
import { Challenge } from '../../types/challenge';

let passed = 0;
let total = 0;

function assert(condition: boolean, name: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${name}`);
  } else {
    console.error(`[FAIL] ${name}`);
  }
}

console.log('--- Starting Judge Prompt and Parser Tests ---\n');

// 1. System Prompt
const sysPrompt = buildJudgeSystemPrompt();
assert(sysPrompt.includes('Non-dogmatic grading'), 'System prompt includes non-dogmatic grading instruction');
assert(sysPrompt.includes('---VERDICT---'), 'System prompt includes VERDICT tag');
assert(sysPrompt.includes('---MODEL---'), 'System prompt includes MODEL tag');

// 2. User Prompt
const mockChallenge: Challenge = {
  metadata: {
    track: 1,
    level: 2,
    type: 'Fix',
    editableLanguage: 'typescript',
    editableFiles: ['src/token.ts'],
  },
  task: 'Fix expired token check',
  files: [
    {
      path: 'src/token.ts',
      content: 'export function isExpired(exp: number) { return exp < Date.now(); }',
      startContent: 'export function isExpired(exp: number) { return exp > Date.now(); }',
      isEditable: true,
    },
  ],
  tests: [{ input: '100', expected: 'true', description: 'Past token expired' }],
  reference: 'export function isExpired(exp: number) { return exp < Date.now(); }',
};

const userPrompt = buildJudgeUserPrompt({
  challenge: mockChallenge,
  userFiles: mockChallenge.files,
});

assert(userPrompt.includes('TASK:'), 'User prompt contains TASK section');
assert(userPrompt.includes('SUBMITTED FILES:'), 'User prompt contains submitted files');
assert(userPrompt.includes('AUTHORITATIVE REFERENCE SOLUTION'), 'User prompt contains reference solution');

// 3. Response Parsing (PASS)
const samplePassResponse = `---VERDICT---
PASS

---MISTAKE_TYPE---
NONE

---SUMMARY---
Correctly inverted the comparison operator to properly detect expired tokens.

---BREAKDOWN---
- Expired timestamps return true
- Active future timestamps return false
- Edge case where token expires at current second handled cleanly

---MODEL---
Tracing test with exp: 100 and now: 200: 100 < 200 evaluates to true, matching expected result.

---ADVICE---
Remember that timestamp precision (seconds vs milliseconds) is a frequent source of auth bugs.
`;

const passResult = parseJudgeResponse(samplePassResponse, 'gemini-2.5-flash');
assert(passResult.verdict === 'PASS', 'Parses PASS verdict correctly');
assert(passResult.mistakeType === 'NONE', 'Parses NONE mistake type on PASS');
assert(passResult.summary.includes('inverted the comparison'), 'Parses summary correctly');
assert(passResult.breakdown.includes('Expired timestamps return true'), 'Parses breakdown correctly');
assert(passResult.advice.includes('timestamp precision'), 'Parses advice correctly');
assert(passResult.fix === undefined, 'No fix on PASS verdict');

// 4. Response Parsing (FAIL with fix)
const sampleFailResponse = `---VERDICT---
FAIL

---MISTAKE_TYPE---
CONCEPT

---SUMMARY---
The implementation still accepts expired tokens under certain conditions.

---BREAKDOWN---
- Condition does not handle equal timestamp properly
- Fails test 1

---WHAT_TO_LEARN---
- Topic: JWT expiration comparison and unix timestamp math
- Search: "JWT exp comparison unix timestamp boundary checks"

---MODEL---
When exp is exactly now, comparison failed.

---ADVICE---
Use inclusive comparison <= when checking expiration.

---FIX---
export function isExpired(exp: number, now: number): boolean {
  return exp <= now;
}
`;

const failResult = parseJudgeResponse(sampleFailResponse, 'gemini-2.5-flash');
assert(failResult.verdict === 'FAIL', 'Parses FAIL verdict correctly');
assert(failResult.mistakeType === 'CONCEPT', 'Parses CONCEPT mistake type correctly');
assert(failResult.whatToLearn?.includes('JWT expiration') ?? false, 'Parses WHAT_TO_LEARN correctly on FAIL');
assert(failResult.fix !== undefined, 'Parses FIX section on FAIL verdict');
assert(failResult.fix?.includes('exp <= now') ?? false, 'Fix content matches expected code snippet');

// 5. Response Parsing (PARTIAL with SYNTAX mistake)
const samplePartialResponse = `---VERDICT---
PARTIAL

---MISTAKE_TYPE---
SYNTAX

---SUMMARY---
You got 2 out of 3 requirements working. Validation logic is sound, but Go receiver syntax is missing.

---BREAKDOWN---
- Worked: Email format checking and blank field detection pass.
- Missed: Fiber handler cannot call Register because the method receiver is missing.

---WHAT_TO_LEARN---
- Topic: Go struct methods and receiver syntax.
- Search: "Go pointer receiver vs value receiver struct methods"

---MODEL---
Tracing test: Register function exists as standalone function instead of method on Service struct.

---ADVICE---
In Go, declare receiver before function name: func (s *Service) Register(...)
`;

const partialResult = parseJudgeResponse(samplePartialResponse, 'gemini-2.5-flash');
assert(partialResult.verdict === 'PARTIAL', 'Parses PARTIAL verdict correctly');
assert(partialResult.mistakeType === 'SYNTAX', 'Parses SYNTAX mistake type correctly');
assert(partialResult.summary.includes('2 out of 3'), 'Parses partial summary correctly');
assert(partialResult.whatToLearn?.includes('Go struct methods') ?? false, 'Parses WHAT_TO_LEARN correctly on PARTIAL');

console.log(`\n--- Judge Test Summary: ${passed}/${total} tests passed ---`);

if (passed !== total) {
  process.exit(1);
}
