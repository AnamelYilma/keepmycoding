// KeepCoding - Test Verification Suite for AI Judge Utilities

import { buildJudgeSystemPrompt, buildJudgeUserPrompt } from '../judge-prompt';
import { parseJudgeResponse } from '../judge-parser';
import { Challenge, ChallengeFile } from '../../types/challenge';

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
assert(passResult.summary.includes('inverted the comparison'), 'Parses summary correctly');
assert(passResult.breakdown.includes('Expired timestamps return true'), 'Parses breakdown correctly');
assert(passResult.advice.includes('timestamp precision'), 'Parses advice correctly');
assert(passResult.fix === undefined, 'No fix on PASS verdict');

// 4. Response Parsing (FAIL with fix)
const sampleFailResponse = `---VERDICT---
FAIL

---SUMMARY---
The implementation still accepts expired tokens under certain conditions.

---BREAKDOWN---
- Condition does not handle equal timestamp properly
- Fails test 1

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
assert(failResult.fix !== undefined, 'Parses FIX section on FAIL verdict');
assert(failResult.fix?.includes('exp <= now') ?? false, 'Fix content matches expected code snippet');

console.log(`\n--- Judge Test Summary: ${passed}/${total} tests passed ---`);

if (passed !== total) {
  process.exit(1);
}
