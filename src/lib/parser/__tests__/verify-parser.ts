// KeepCoding - Test Verification Suite for Challenge Parser and Validator

import {
  parseChallenge,
  extractSections,
  parseMetadata,
  parseTests,
} from '../challenge-parser';
import {
  validateChallenge,
  validateRawChallenge,
  createFixPrompt,
} from '../challenge-validator';
import { Challenge } from '../../types/challenge';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    if (detail) console.error(`       Detail: ${detail}`);
  }
}

console.log('--- Starting Challenge Parser and Validator Tests ---\n');

// Test 1: Standard valid challenge
const sampleValid = `---METADATA---
track: 1
level: 2
type: Fix
editableLanguage: typescript
editableFiles: src/auth.ts

---TASK---
Fix the token verification bug where expired tokens are accepted.

---FILE: src/auth.ts---
export function isTokenValid(expiresAt: number): boolean {
  // Buggy implementation
  return true;
}

---FILE: src/config.ts (readonly)---
export const TOKEN_LIFETIME = 3600;

---TESTS---
Input: 1000
Expected: false
Description: Expired token rejected

Input: 9999999999
Expected: true
Description: Future token accepted

---REFERENCE---
export function isTokenValid(expiresAt: number): boolean {
  return Date.now() < expiresAt * 1000;
}
`;

const parsed = parseChallenge(sampleValid);
assert(parsed.metadata.track === 1, 'Parses track number correctly');
assert(parsed.metadata.level === 2, 'Parses level number correctly');
assert(parsed.metadata.type === 'Fix', 'Parses challenge type correctly');
assert(parsed.metadata.editableLanguage === 'typescript', 'Parses editableLanguage correctly');
assert(parsed.files.length === 2, 'Parses both files');
assert(parsed.files[0].path === 'src/auth.ts', 'First file path correct');
assert(parsed.files[0].isEditable === true, 'First file is editable');
assert(parsed.files[1].path === 'src/config.ts', 'Second file path correct');
assert(parsed.files[1].isEditable === false, 'Second file is readonly');
assert(parsed.tests.length === 2, 'Parses both tests');
assert(parsed.tests[0].input === '1000', 'First test input correct');
assert(parsed.tests[0].expected === 'false', 'First test expected correct');

const validResult = validateRawChallenge(sampleValid);
assert(validResult.valid === true, 'Sample challenge passes validation');
assert(validResult.errors.length === 0, 'No validation errors on valid challenge');

// Test 2: Windows CR-LF newlines and indentation preservation
const sampleCrlf = "---METADATA---\r\ntrack: 2\r\nlevel: 1\r\ntype: Write\r\neditableLanguage: python\r\neditableFiles: solution.py\r\n\r\n---TASK---\r\nWrite an indented function.\r\n\r\n---FILE: solution.py---\r\ndef process(data):\r\n    if not data:\r\n        return None\r\n    return [x * 2 for x in data]\r\n\r\n---TESTS---\r\nInput: [1, 2]\r\nExpected: [2, 4]\r\n\r\n---REFERENCE---\r\ndef process(data):\r\n    return [x * 2 for x in data] if data else None\r\n";

const crlfParsed = parseChallenge(sampleCrlf);
assert(crlfParsed.metadata.track === 2, 'Handles CRLF in metadata');
assert(crlfParsed.files[0].content.includes('    if not data:'), 'Preserves indentation under CRLF');

// Test 3: Validation Error: Missing required tags
const sampleMissingTags = `---TASK---
Just a task without metadata, tests, or reference.
`;
const missingResult = validateRawChallenge(sampleMissingTags);
assert(missingResult.valid === false, 'Detects missing required tags');
assert(missingResult.errors.some(e => e.includes('---METADATA---')), 'Identifies missing METADATA tag');
assert(missingResult.errors.some(e => e.includes('---REFERENCE---')), 'Identifies missing REFERENCE tag');
assert(!!missingResult.fixPrompt, 'Generates fix prompt for missing tags');

// Test 4: Validation Error: More than 5 code files
const tooManyFiles = `---METADATA---
track: 3
level: 1
type: Build
editableLanguage: typescript
editableFiles: f1.ts

---TASK---
Too many files challenge.

---FILE: f1.ts---
const a = 1;
---FILE: f2.ts---
const b = 2;
---FILE: f3.ts---
const c = 3;
---FILE: f4.ts---
const d = 4;
---FILE: f5.ts---
const e = 5;
---FILE: f6.ts---
const f = 6;

---TESTS---
Input: test
Expected: test

---REFERENCE---
const done = true;
`;
const tooManyResult = validateRawChallenge(tooManyFiles);
assert(tooManyResult.valid === false, 'Rejects challenge with > 5 code files');
assert(tooManyResult.errors.some(e => e.includes('Too many code files')), 'Reports too many files error');

// Test 5: Validation Error: File > 200 lines
const longLines = Array.from({ length: 205 }, (_, i) => `// line ${i + 1}`).join('\n');
const longFileChallenge = `---METADATA---
track: 1
level: 1
type: Fix
editableLanguage: typescript
editableFiles: long.ts

---TASK---
Long file test.

---FILE: long.ts---
${longLines}

---TESTS---
Input: test
Expected: test

---REFERENCE---
const ref = 1;
`;
const longFileResult = validateRawChallenge(longFileChallenge);
assert(longFileResult.valid === false, 'Rejects file > 200 lines');
assert(longFileResult.errors.some(e => e.includes('long.ts') && e.includes('200-line limit')), 'Specifies offending file name in line limit error');

// Test 6: Validation Error: More than 1 editable language
const multiLangChallenge = `---METADATA---
track: 1
level: 1
type: Fix
editableLanguage: typescript, python
editableFiles: script.ts, worker.py

---TASK---
Multi language challenge.

---FILE: script.ts (editable)---
const a = 1;

---FILE: worker.py (editable)---
b = 2

---TESTS---
Input: 1
Expected: 1

---REFERENCE---
const ref = 1;
`;
const multiLangResult = validateRawChallenge(multiLangChallenge);
assert(multiLangResult.valid === false, 'Rejects multiple editable languages');
assert(multiLangResult.errors.some(e => e.includes('Multiple editable languages')), 'Identifies multiple editable languages error');

// Test 7: Validation Error: Reference > 45 lines
const longRefLines = Array.from({ length: 50 }, (_, i) => `console.log(${i});`).join('\n');
const longRefChallenge = `---METADATA---
track: 1
level: 1
type: Write
editableLanguage: javascript
editableFiles: app.js

---TASK---
Long reference test.

---FILE: app.js---
console.log('start');

---TESTS---
Input: 1
Expected: 1

---REFERENCE---
${longRefLines}
`;
const longRefResult = validateRawChallenge(longRefChallenge);
assert(longRefResult.valid === false, 'Rejects reference > 45 lines');
assert(longRefResult.errors.some(e => e.includes('Reference answer is too long')), 'Identifies reference length error');

// Test 8: Text-only answer file challenge (e.g. Explain / Find bug)
const textAnswerChallenge = `---METADATA---
track: 4
level: 3
type: Explain
editableLanguage: text
editableFiles: answer.md

---TASK---
Explain why timing attacks occur in naive string comparisons.

---ANSWER_FILE: answer.md---
# Write explanation below:

---TESTS---
Input: explanation
Expected: constant-time comparison explanation

---REFERENCE---
Naive equality operator === leaks execution time based on matching prefix length.
`;
const textAnswerParsed = parseChallenge(textAnswerChallenge);
assert(textAnswerParsed.answerFile !== undefined, 'Parses answerFile');
assert(textAnswerParsed.answerFile?.path === 'answer.md', 'Answer file path correct');
assert(textAnswerParsed.answerFile?.isEditable === true, 'Answer file is editable');
const textAnswerValidated = validateRawChallenge(textAnswerChallenge);
assert(textAnswerValidated.valid === true, 'Text answer challenge passes validation');

console.log(`\n--- Verification Summary: ${passedTests}/${totalTests} tests passed ---`);

if (passedTests !== totalTests) {
  process.exit(1);
}
