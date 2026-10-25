// KeepCoding - Test Verification Suite for Challenge Parser and Validator

import {
  parseChallenge,
  extractSections,
  parseMetadata,
  parseTests,
  stripOuterFences,
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

// Test 4: Validation Error: More than 10 code files
const elevenFiles = Array.from({ length: 11 }, (_, i) => `---FILE: f${i + 1}.ts---\nconst v${i + 1} = ${i + 1};`).join('\n');
const tooManyFiles = `---METADATA---
track: 3
level: 1
type: Build
editableLanguage: typescript
editableFiles: f1.ts

---TASK---
Too many files challenge.

${elevenFiles}

---TESTS---
Input: test
Expected: test

---REFERENCE---
const done = true;
`;
const tooManyResult = validateRawChallenge(tooManyFiles);
assert(tooManyResult.valid === false, 'Rejects challenge with > 10 code files');
assert(tooManyResult.errors.some(e => e.includes('Too many code files')), 'Reports too many files error');

// Up to 10 files must PASS
const tenFiles = Array.from({ length: 10 }, (_, i) => `---FILE: file${i + 1}.ts---\nconst n${i + 1} = ${i + 1};`).join('\n');
const tenFilesChallenge = `---METADATA---
track: 3
level: 1
type: Build
editableLanguage: typescript
editableFiles: file1.ts

---TASK---
Ten files challenge.

${tenFiles}

---TESTS---
Input: test
Expected: test

---REFERENCE---
const done = true;
`;
const tenFilesResult = validateRawChallenge(tenFilesChallenge);
assert(tenFilesResult.valid === true, 'Accepts challenge with exactly 10 code files');

// Test 5: Files with 500 and 700 lines PASS validation cleanly
const lines500 = Array.from({ length: 500 }, (_, i) => `  const item_${i + 1} = ${i + 1};`).join('\n');
const lines700 = Array.from({ length: 700 }, (_, i) => `    const record_${i + 1} = ${i + 1};`).join('\n');

const largeFilesChallenge = `---METADATA---
track: 1
level: 5
type: Fix
editableLanguage: typescript
editableFiles: file500.ts

---TASK---
Work with large codebase files of 500 and 700 lines.

---FILE: file500.ts---
export function process500(): number {
${lines500}
  return 500;
}

---FILE: file700.ts (readonly)---
export function config700(): number {
${lines700}
  return 700;
}

---TESTS---
Input: test
Expected: 500

---REFERENCE---
export function process500(): number {
  return 500;
}
`;

const largeFilesResult = validateRawChallenge(largeFilesChallenge);
assert(largeFilesResult.valid === true, 'Files with 500 and 700 lines PASS validation');
assert(largeFilesResult.errors.length === 0, 'No validation errors on 500 and 700 line files');
assert(!!largeFilesResult.challenge?.files[0].content.includes('  const item_500 = 500;'), 'Exact indentation preserved in 500-line file');
assert(!!largeFilesResult.challenge?.files[1].content.includes('    const record_700 = 700;'), 'Exact indentation preserved in 700-line file');

// Test 6: Line limit test: Rejection ONLY occurs when exceeding 1000 lines
const lines1005 = Array.from({ length: 1005 }, (_, i) => `// line ${i + 1}`).join('\n');
const exceedingFileChallenge = `---METADATA---
track: 1
level: 1
type: Fix
editableLanguage: typescript
editableFiles: huge.ts

---TASK---
Exceeding 1000 lines test.

---FILE: huge.ts---
${lines1005}

---TESTS---
Input: test
Expected: test

---REFERENCE---
const ref = 1;
`;
const exceedingResult = validateRawChallenge(exceedingFileChallenge);
assert(exceedingResult.valid === false, 'Rejects file > 1000 lines');
assert(exceedingResult.errors.some(e => e.includes('huge.ts') && e.includes('1000-line limit')), 'Specifies offending file name and 1000-line limit');

// Test 7: Validation Error: More than 1 editable language
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

// Test 8: Reference answers up to 300 lines PASS, > 300 lines REJECTED
const ref250Lines = Array.from({ length: 250 }, (_, i) => `// ref line ${i + 1}`).join('\n');
const ref250Challenge = `---METADATA---
track: 1
level: 1
type: Write
editableLanguage: javascript
editableFiles: app.js

---TASK---
250 lines reference test.

---FILE: app.js---
console.log('start');

---TESTS---
Input: 1
Expected: 1

---REFERENCE---
${ref250Lines}
`;
const ref250Result = validateRawChallenge(ref250Challenge);
assert(ref250Result.valid === true, 'Reference answer of 250 lines PASSES validation');

const ref305Lines = Array.from({ length: 305 }, (_, i) => `console.log(${i});`).join('\n');
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
${ref305Lines}
`;
const longRefResult = validateRawChallenge(longRefChallenge);
assert(longRefResult.valid === false, 'Rejects reference > 300 lines');
assert(longRefResult.errors.some(e => e.includes('Reference answer is too long')), 'Identifies reference length error');

// Test 9: Text-only answer file challenge (e.g. Explain / Find bug)
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

// Test 10: Outer markdown code fences resilient stripping
const wrappedMarkdownFence = `\`\`\`markdown
---METADATA---
track: 2
level: 3
type: Write
editableLanguage: typescript
editableFiles: src/solve.ts

---TASK---
Fenced challenge task.

---FILE: src/solve.ts---
export function solve(): number {
  return 42;
}

---TESTS---
Input: none
Expected: 42

---REFERENCE---
export function solve(): number {
  return 42;
}
\`\`\``;

const wrappedResult = validateRawChallenge(wrappedMarkdownFence);
assert(wrappedResult.valid === true, 'Strips outer markdown code fences automatically');
assert(wrappedResult.challenge?.metadata.track === 2, 'Parses metadata from fenced input');

// Test 11: Conversational preamble before markdown fence and postscript after fence
const conversationalPreamble = `Here is the challenge you requested:

\`\`\`markdown
---METADATA---
track: 1
level: 4
type: Fix
editableLanguage: typescript
editableFiles: src/token.ts

---TASK---
Preamble test task.

---FILE: src/token.ts---
export const token = 'abc';

---TESTS---
Input: 1
Expected: 1

---REFERENCE---
export const token = 'abc';
\`\`\`

Let me know if you need any further modifications!`;

const preambleResult = validateRawChallenge(conversationalPreamble);
assert(preambleResult.valid === true, 'Handles conversational preamble and postscript cleanly');
assert(preambleResult.challenge?.files[0].path === 'src/token.ts', 'Parses file path despite preamble');

// Test 12: Tag variations (spaces inside hyphens, compact tags, hyphens in filenames)
const variedTagsChallenge = `- - - METADATA - - -
track: 3
level: 2
type: Build
editableLanguage: typescript
editableFiles: src/user-auth-service.ts

--- TASK ---
Varied tags task.

--- FILE: src/user-auth-service.ts ---
export function auth() {
  return true;
}

---FILE:src/compact-config.ts---
export const config = {};

- - - TESTS - - -
Input: go
Expected: true

--- REFERENCE ---
export function auth() {
  return true;
}
`;

const variedResult = validateRawChallenge(variedTagsChallenge);
assert(variedResult.valid === true, 'Tolerates tag variations and spaces in hyphens');
assert(variedResult.challenge?.files.length === 2, 'Parses both files with varied tag formats');
assert(variedResult.challenge?.files[0].path === 'src/user-auth-service.ts', 'Tolerates hyphens in file paths');
assert(variedResult.challenge?.files[1].path === 'src/compact-config.ts', 'Tolerates compact tag without spaces');

// Test 13: Case variations in metadata keys
const caseVariedMetadata = `---METADATA---
- Track: 2
- LEVEL: 6
- Type: Build
- Editable-Language: typescript
- Editable Files: src/service.ts

---TASK---
Case variation test.

---FILE: src/service.ts---
export const ready = true;

---TESTS---
* Input: 1
* Expected: 1

---REFERENCE---
export const ready = true;
`;

const caseVariedResult = validateRawChallenge(caseVariedMetadata);
assert(caseVariedResult.valid === true, 'Tolerates case variations and bullets in metadata keys');
assert(caseVariedResult.challenge?.metadata.track === 2, 'Parses Track with uppercase');
assert(caseVariedResult.challenge?.metadata.level === 6, 'Parses LEVEL in uppercase');
assert(caseVariedResult.challenge?.metadata.editableLanguage === 'typescript', 'Parses Editable-Language with hyphens and capitals');
assert(caseVariedResult.challenge?.metadata.editableFiles[0] === 'src/service.ts', 'Parses Editable Files with space');
assert(caseVariedResult.challenge?.tests.length === 1, 'Parses asterisk bulleted tests');

console.log(`\n--- Verification Summary: ${passedTests}/${totalTests} tests passed ---`);

if (passedTests !== totalTests) {
  process.exit(1);
}
