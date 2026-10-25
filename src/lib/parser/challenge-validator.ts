// KeepCoding - Tagged Challenge Validator
// Enforces plan constraints and generates actionable fix prompts for AI chat

import { Challenge, ValidationResult } from '../types/challenge';
import {
  detectLanguageFromPath,
  extractSections,
  parseChallenge,
} from './challenge-parser';

export interface ValidatorOptions {
  maxFiles?: number;
  maxLinesPerFile?: number;
  maxReferenceLines?: number;
}

const DEFAULT_OPTIONS: Required<ValidatorOptions> = {
  maxFiles: 10,
  maxLinesPerFile: 1000,
  maxReferenceLines: 300,
};

/**
 * Builds an actionable fix prompt for the user to copy back into chat AI.
 */
export function createFixPrompt(errors: string[]): string {
  const bulletList = errors.map(e => `- ${e}`).join('\n');

  return `The generated challenge failed validation with the following errors:
${bulletList}

Please regenerate the challenge adhering strictly to the KeepCoding format:

---METADATA---
track: [1 to 4]
level: [1 to 12]
type: [Write | Build | Fix | Find bug | Explain | Predict output | Edge cases]
editableLanguage: [single language name, e.g. typescript, python, or go]
editableFiles: [comma-separated paths of editable files]

---TASK---
[Crisp, clear task description and requirements]

---FILE: path/to/file.ext---
[Code file under 1000 lines. Maximum 10 code files total.]

---TESTS---
Input: [test input]
Expected: [expected result]
Description: [test description]

---REFERENCE---
[Concise solution or diff under 300 lines: do NOT repeat full multi-file projects]

Validation Requirements:
1. Include all required tags: ---METADATA---, ---TASK---, ---FILE: path---, ---TESTS---, ---REFERENCE---.
2. Maximum 10 code files.
3. Every file must be 1000 lines or fewer.
4. Exactly one editable programming language.
5. Reference answer must be under 300 lines.`;
}

/**
 * Validates a parsed Challenge object against system rules.
 */
export function validateChallenge(
  challenge: Challenge,
  options: ValidatorOptions = {}
): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: string[] = [];

  // Check required fields
  if (!challenge.task || challenge.task.trim().length === 0) {
    errors.push('Missing or empty task description in ---TASK---.');
  }

  if (!challenge.reference || challenge.reference.trim().length === 0) {
    errors.push('Missing or empty reference solution in ---REFERENCE---.');
  }

  if (challenge.files.length === 0) {
    errors.push('Missing code files: at least one ---FILE: path--- or ---ANSWER_FILE--- is required.');
  }

  // 1. More than maxFiles code files -> error
  const codeFiles = challenge.files.filter(f => !f.isAnswerFile);
  if (codeFiles.length > opts.maxFiles) {
    errors.push(
      `Too many code files: Challenge contains ${codeFiles.length} files. Maximum allowed is ${opts.maxFiles} files.`
    );
  }

  // 2. Any file > maxLinesPerFile lines -> error (specifies which file)
  for (const file of challenge.files) {
    const lineCount = file.content.split('\n').length;
    if (lineCount > opts.maxLinesPerFile) {
      errors.push(
        `File "${file.path}" exceeds the ${opts.maxLinesPerFile}-line limit (${lineCount} lines).`
      );
    }
  }

  // 3. More than 1 editable language -> error
  const editableCodeFiles = challenge.files.filter(f => f.isEditable && !f.isAnswerFile);
  const detectedLanguages = new Set<string>();

  for (const file of editableCodeFiles) {
    const lang = detectLanguageFromPath(file.path);
    if (lang !== 'text') {
      detectedLanguages.add(lang);
    }
  }

  // Check metadata language declaration
  const metaLang = challenge.metadata.editableLanguage || '';
  const metaLangParts = metaLang
    .split(/[,/|&]|(?:\band\b)/i)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  if (metaLangParts.length > 1) {
    errors.push(
      `Multiple editable languages specified in metadata: "${metaLang}". Exactly 1 editable language is permitted.`
    );
  }

  if (detectedLanguages.size > 1) {
    const langList = Array.from(detectedLanguages).join(', ');
    errors.push(
      `Multiple editable languages detected across files (${langList}). A challenge must have exactly 1 editable language.`
    );
  }

  // 4. REFERENCE answer looks like full duplicate files (> maxReferenceLines lines) -> error
  const refTrimmed = challenge.reference.trim();
  const refLineCount = refTrimmed.length > 0 ? refTrimmed.split('\n').length : 0;

  if (refLineCount > opts.maxReferenceLines) {
    errors.push(
      `Reference answer is too long (${refLineCount} lines). Maximum allowed is ${opts.maxReferenceLines} lines. Use a focused solution or targeted diff.`
    );
  }

  if (/---+\s*FILE/i.test(challenge.reference)) {
    errors.push(
      `Reference answer appears to duplicate entire files. Reference must only contain the focused solution or diff under ${opts.maxReferenceLines} lines.`
    );
  }

  const valid = errors.length === 0;
  return {
    valid,
    errors,
    fixPrompt: valid ? undefined : createFixPrompt(errors),
  };
}

/**
 * Validates raw text directly, verifying presence of required tags before parsing.
 */
export function validateRawChallenge(
  rawText: string,
  options: ValidatorOptions = {}
): ValidationResult & { challenge?: Challenge } {
  const sections = extractSections(rawText);
  const presentTags = new Set(sections.map(s => s.tag));
  const tagErrors: string[] = [];

  // Check for required tags in raw text
  if (!presentTags.has('METADATA')) {
    tagErrors.push('Missing required tag: ---METADATA---');
  }
  if (!presentTags.has('TASK')) {
    tagErrors.push('Missing required tag: ---TASK---');
  }
  if (!presentTags.has('FILE') && !presentTags.has('ANSWER_FILE')) {
    tagErrors.push('Missing required tag: at least one ---FILE: <path>--- or ---ANSWER_FILE--- section is required.');
  }
  if (!presentTags.has('TESTS')) {
    tagErrors.push('Missing required tag: ---TESTS---');
  }
  if (!presentTags.has('REFERENCE')) {
    tagErrors.push('Missing required tag: ---REFERENCE---');
  }

  const challenge = parseChallenge(rawText);
  const structuralResult = validateChallenge(challenge, options);

  const allErrors = [...tagErrors, ...structuralResult.errors];
  const valid = allErrors.length === 0;

  return {
    valid,
    errors: allErrors,
    fixPrompt: valid ? undefined : createFixPrompt(allErrors),
    challenge,
  };
}
