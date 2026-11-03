// KeepCoding - Tagged Challenge Parser
// Parses raw tagged challenge text into structured Challenge objects

import {
  Challenge,
  ChallengeFile,
  ChallengeMetadata,
  ChallengeTest,
} from '../types/challenge';

export interface RawSection {
  tag: string;
  param?: string;
  content: string;
}

export interface ParseResult {
  challenge: Challenge;
  missingTags: string[];
  rawSections: RawSection[];
}

/**
 * Normalizes newlines to \n.
 */
function normalizeNewlines(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Strips outer markdown code fences if present.
 */
export function stripOuterFences(text: string): string {
  let trimmed = text.trim();

  // Strip wrapping outer code fences (e.g. ```markdown ... ``` or ```text ... ``` or ``` ... ```)
  const outerMatch = trimmed.match(/^(`{3,})[^\n]*\n([\s\S]*)\n\1\s*$/);
  if (outerMatch) {
    trimmed = outerMatch[2].trim();
  }

  // Handle conversational preamble/postscript around a markdown block containing KeepCoding tags
  const embeddedMatch = trimmed.match(/(?:^|\n)(`{3,})[^\n]*\n([\s\S]*?---+\s*METADATA[\s\S]*?)\n\1(?:\n|$)/i);
  if (embeddedMatch) {
    trimmed = embeddedMatch[2].trim();
  }

  // Also clean up unclosed leading code fence if user pasted without closing fence
  const unclosedMatch = trimmed.match(/^(`{3,})[^\n]*\n([\s\S]*)$/);
  if (unclosedMatch && /---+\s*METADATA/i.test(unclosedMatch[2])) {
    trimmed = unclosedMatch[2].trim();
  }

  // Also clean up any lingering closing code fence at the end
  trimmed = trimmed.replace(/\n`{3,}\s*$/, '').trim();

  return trimmed;
}

/**
 * Cleans section content: strips leading and trailing empty lines while preserving indentation.
 */
function cleanContent(content: string): string {
  const noLeading = content.replace(/^\n+/, '');
  return noLeading.replace(/\s+$/, '');
}

/**
 * Cleans code file or reference content by stripping outer markdown backtick fences
 * or preamble language markers (e.g. "typescript\n```typescript\n...```" or "```typescript\n...```").
 */
export function cleanCodeContent(rawContent: string): string {
  let content = rawContent.trim();

  // Strip leading language line before code fence or content (e.g. "typescript\n```typescript...")
  content = content.replace(/^(?:typescript|javascript|python|go|html|css|json|sql|ts|js|py)\s*\r?\n+/i, '');

  // Strip wrapping outer code fences (e.g. ```typescript ... ``` or ```ts ... ``` or ``` ... ```)
  const fenceMatch = content.match(/^(`{3,})[a-zA-Z0-9_-]*\r?\n([\s\S]*)\r?\n\1\s*$/);
  if (fenceMatch) {
    content = fenceMatch[2];
  } else {
    // If still has leading fence
    const leadingFence = content.match(/^(`{3,})[a-zA-Z0-9_-]*\r?\n([\s\S]*)$/);
    if (leadingFence && !leadingFence[2].includes('```')) {
      content = leadingFence[2];
    }
  }

  // Strip any lingering closing code fence at the end
  content = content.replace(/\r?\n`{3,}\s*$/, '');

  return content.trim();
}

/**
 * Normalizes tag names to canonical values, supporting common AI variations.
 */
export function normalizeTagName(rawTag: string): string {
  const clean = rawTag.toUpperCase().replace(/[-_\s]+/g, '_').trim();

  if (['METADATA', 'META', 'INFO', 'CONFIG'].includes(clean)) return 'METADATA';
  if (['TASK', 'INSTRUCTIONS', 'INSTRUCTION', 'DESCRIPTION', 'TASK_DESCRIPTION', 'GOAL', 'OBJECTIVE', 'CHALLENGE'].includes(clean)) return 'TASK';
  if (['TESTS', 'TEST', 'TEST_CASES', 'TESTCASES', 'TEST_CASE'].includes(clean)) return 'TESTS';
  if (['REFERENCE', 'SOLUTION', 'REFERENCE_SOLUTION', 'REFERENCE_ANSWER', 'ANSWER', 'KEY'].includes(clean)) return 'REFERENCE';
  if (['ANSWER_FILE', 'ANSWERFILE', 'TEXT_ANSWER', 'ANSWER_MD'].includes(clean)) return 'ANSWER_FILE';
  if (clean.startsWith('FILE') || clean.startsWith('CODE') || clean.startsWith('SOURCE')) return 'FILE';

  return clean;
}

/**
 * Extracts raw tagged sections from the input text.
 */
export function extractSections(rawText: string): RawSection[] {
  const normalized = normalizeNewlines(rawText);
  const cleanText = stripOuterFences(normalized);

  // Matches tags such as:
  // --- METADATA ---
  // ---TEST CASES---
  // --- REFERENCE SOLUTION ---
  // ### ---METADATA---
  // **---TASK---**
  // --- FILE: path/to/file.ts ---
  // ---FILE:path/to/file.ts---
  const tagRegex = /(?:^|\n)\s*(?:[#*`~>\s]*)(?:---+|(?:-\s*){2,}-)\s*([A-Za-z0-9_\s-]+?)(?:\s*:\s*([^\n\r]*?))?\s*(?:---+|(?:-\s*){2,}-)(?:[*`~>\s]*)(?:\n|$)/gi;

  const matches: Array<{ tag: string; param?: string; start: number; end: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(cleanText)) !== null) {
    const canonicalTag = normalizeTagName(match[1]);
    matches.push({
      tag: canonicalTag,
      param: match[2]?.trim().replace(/^`+|`+$/g, ''),
      start: match.index,
      end: tagRegex.lastIndex,
    });
  }

  const sections: RawSection[] = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : cleanText.length;
    let content = cleanContent(cleanText.substring(current.end, nextStart));

    // If this is the last section, remove any trailing markdown backtick fence
    if (i === matches.length - 1) {
      content = content.replace(/\n`{3,}\s*$/, '').trimEnd();
    }

    sections.push({
      tag: current.tag,
      param: current.param,
      content,
    });
  }

  return sections;
}

/**
 * Parses the METADATA section content.
 */
export function parseMetadata(content: string): ChallengeMetadata {
  const metadata: ChallengeMetadata = {
    track: 1,
    level: 1,
    type: 'Write',
    editableLanguage: '',
    editableFiles: [],
  };

  const trimmed = content.trim();

  // Try JSON parsing first
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const rawObj = JSON.parse(trimmed);
      const parsed: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rawObj)) {
        parsed[k.toLowerCase().replace(/[-_\s]/g, '')] = v;
      }

      if (typeof parsed.track === 'number') {
        metadata.track = parsed.track;
      } else if (typeof parsed.track === 'string') {
        const num = parsed.track.match(/\d+/);
        metadata.track = num ? parseInt(num[0], 10) : 1;
      }

      if (typeof parsed.level === 'number') {
        metadata.level = parsed.level;
      } else if (typeof parsed.level === 'string') {
        const num = parsed.level.match(/\d+/);
        metadata.level = num ? parseInt(num[0], 10) : 1;
      }

      if (parsed.type) metadata.type = String(parsed.type).trim();
      if (parsed.editablelanguage) metadata.editableLanguage = String(parsed.editablelanguage).trim().toLowerCase();
      else if (parsed.language) metadata.editableLanguage = String(parsed.language).trim().toLowerCase();

      const filesVal = parsed.editablefiles ?? parsed.files;
      if (Array.isArray(filesVal)) {
        metadata.editableFiles = filesVal.map((f: unknown) => String(f).trim().replace(/^['"]|['"]$/g, ''));
      } else if (typeof filesVal === 'string') {
        const cleanVal = filesVal.replace(/^\[|\]$/g, '');
        metadata.editableFiles = cleanVal.split(',').map((f: string) => f.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      }
      return metadata;
    } catch {
      // Fallback to line-by-line parsing
    }
  }

  // Line-by-line key-value parsing
  const lines = trimmed.split('\n');
  for (const line of lines) {
    const kvMatch = line.match(/^\s*(?:[-*]\s*)?([A-Za-z0-9_\-\s]+?)\s*[:=]\s*(.*)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1].toLowerCase().replace(/[-_\s]/g, '');
    const val = kvMatch[2].trim();

    if (key === 'track') {
      const num = val.match(/\d+/);
      metadata.track = num ? parseInt(num[0], 10) : 1;
    } else if (key === 'level') {
      const num = val.match(/\d+/);
      metadata.level = num ? parseInt(num[0], 10) : 1;
    } else if (key === 'type') {
      metadata.type = val;
    } else if (key === 'editablelanguage' || key === 'language') {
      metadata.editableLanguage = val.toLowerCase();
    } else if (key === 'editablefiles' || key === 'files') {
      const cleanVal = val.replace(/^\[|\]$/g, '');
      metadata.editableFiles = cleanVal.split(',').map(f => f.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
  }

  return metadata;
}

/**
 * Parses the TESTS section content into structured test cases.
 */
export function parseTests(content: string): ChallengeTest[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  // Try JSON array parsing first
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item: { input?: unknown; expected?: unknown; description?: unknown }) => ({
          input: item.input !== undefined ? String(item.input) : '',
          expected: item.expected !== undefined ? String(item.expected) : '',
          description: item.description !== undefined ? String(item.description) : undefined,
        }));
      }
    } catch {
      // Fallback
    }
  }

  const tests: ChallengeTest[] = [];
  const lines = normalizeNewlines(trimmed).split('\n');

  let currentInput: string | null = null;
  let currentExpected: string | null = null;
  let currentDesc: string | undefined = undefined;

  function flushTest() {
    if (currentInput !== null || currentExpected !== null) {
      tests.push({
        input: currentInput ?? '',
        expected: currentExpected ?? '',
        description: currentDesc,
      });
      currentInput = null;
      currentExpected = null;
      currentDesc = undefined;
    }
  }

  for (const line of lines) {
    const inputMatch = line.match(/^\s*(?:[-*]\s*)?input\s*[:=]\s*(.*)$/i);
    const expectedMatch = line.match(/^\s*(?:[-*]\s*)?expected\s*[:=]\s*(.*)$/i);
    const descMatch = line.match(/^\s*(?:[-*]\s*)?description\s*[:=]\s*(.*)$/i);

    if (inputMatch) {
      if (currentInput !== null && currentExpected !== null) {
        flushTest();
      }
      currentInput = inputMatch[1].trim();
    } else if (expectedMatch) {
      currentExpected = expectedMatch[1].trim();
    } else if (descMatch) {
      currentDesc = descMatch[1].trim();
    }
  }

  flushTest();

  // If no structured Input/Expected pairs found, store as single descriptive test item
  if (tests.length === 0) {
    tests.push({
      input: '',
      expected: trimmed,
      description: 'Verification criteria',
    });
  }

  return tests;
}

/**
 * Detects programming language from a file path extension.
 */
export function detectLanguageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'py':
      return 'python';
    case 'go':
      return 'go';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
      return 'css';
    case 'json':
      return 'json';
    case 'sql':
      return 'sql';
    default:
      return 'text';
  }
}

/**
 * Normalizes file paths for matching (e.g., strips leading ./ or /).
 */
function normalizePath(p: string): string {
  return p.replace(/^[./\\]+/, '').trim();
}

/**
 * Parses raw tagged text into a structured Challenge.
 */
export function parseChallenge(rawText: string): Challenge {
  const sections = extractSections(rawText);

  let metadataSection: RawSection | undefined;
  let taskSection: RawSection | undefined;
  let testsSection: RawSection | undefined;
  let referenceSection: RawSection | undefined;
  let answerFileSection: RawSection | undefined;
  const fileSections: RawSection[] = [];

  for (const sec of sections) {
    switch (sec.tag) {
      case 'METADATA':
        metadataSection = sec;
        break;
      case 'TASK':
        taskSection = sec;
        break;
      case 'TESTS':
        testsSection = sec;
        break;
      case 'REFERENCE':
        referenceSection = sec;
        break;
      case 'ANSWER_FILE':
        answerFileSection = sec;
        break;
      case 'FILE':
        fileSections.push(sec);
        break;
    }
  }

  const metadata = metadataSection ? parseMetadata(metadataSection.content) : {
    track: 1,
    level: 1,
    type: 'Write',
    editableLanguage: '',
    editableFiles: [],
  };

  const files: ChallengeFile[] = [];
  const normalizedEditable = metadata.editableFiles.map(normalizePath);

  for (let idx = 0; idx < fileSections.length; idx++) {
    const sec = fileSections[idx];
    const rawPath = sec.param || `file_${idx + 1}.txt`;
    const cleanPath = rawPath.replace(/\s*\((?:editable|readonly)\)\s*$/i, '').trim();
    const isExplicitlyMarkedEditable = /\(editable\)/i.test(rawPath);
    const isExplicitlyMarkedReadonly = /\(readonly\)/i.test(rawPath);

    let isEditable = false;
    if (isExplicitlyMarkedReadonly) {
      isEditable = false;
    } else if (isExplicitlyMarkedEditable) {
      isEditable = true;
    } else if (normalizedEditable.length > 0) {
      isEditable = normalizedEditable.includes(normalizePath(cleanPath));
    } else {
      // If no editableFiles specified and there is only 1 file, default to editable
      isEditable = fileSections.length === 1;
    }

    let fileContent = sec.content;
    const ext = cleanPath.split('.').pop()?.toLowerCase();
    if (ext !== 'md' && ext !== 'markdown') {
      fileContent = cleanCodeContent(fileContent);
    }

    files.push({
      path: cleanPath,
      content: fileContent,
      startContent: fileContent,
      isEditable,
      isAnswerFile: false,
    });
  }

  let answerFile: ChallengeFile | undefined = undefined;
  if (answerFileSection) {
    const answerPath = answerFileSection.param || 'answer.md';
    answerFile = {
      path: answerPath,
      content: answerFileSection.content,
      startContent: answerFileSection.content,
      isEditable: true,
      isAnswerFile: true,
    };
    files.push(answerFile);
  }

  // Ensure at least one file is editable so user can always write code
  if (files.length > 0 && !files.some(f => f.isEditable)) {
    const firstCode = files.find(f => !f.isAnswerFile) || files[0];
    firstCode.isEditable = true;
  }

  // If editableLanguage wasn't specified in metadata, infer it from editable files
  if (!metadata.editableLanguage) {
    const editableCodeFile = files.find(f => f.isEditable && !f.isAnswerFile);
    if (editableCodeFile) {
      metadata.editableLanguage = detectLanguageFromPath(editableCodeFile.path);
    }
  }

  // If editableFiles wasn't populated, populate from editable files
  if (metadata.editableFiles.length === 0) {
    metadata.editableFiles = files.filter(f => f.isEditable).map(f => f.path);
  }

  // If no files were tagged but text was provided, auto-wrap as a single editable code file
  if (files.length === 0 && rawText.trim().length > 0) {
    const rawClean = cleanCodeContent(stripOuterFences(rawText.trim()));
    const defaultFile = 'solution.ts';
    files.push({
      path: defaultFile,
      content: rawClean,
      startContent: rawClean,
      isEditable: true,
      isAnswerFile: false,
    });
    if (!metadata.editableLanguage) {
      metadata.editableLanguage = 'typescript';
    }
    metadata.editableFiles = [defaultFile];
  }

  const tests = testsSection && testsSection.content.trim()
    ? parseTests(testsSection.content)
    : [{ input: '', expected: 'Complete the task requirements', description: 'Verification criteria' }];

  const task = taskSection && taskSection.content.trim()
    ? taskSection.content.trim()
    : 'Implement and complete the practice challenge in the editable files.';

  let reference = referenceSection && referenceSection.content.trim()
    ? cleanCodeContent(referenceSection.content.trim())
    : 'Verify logic against test criteria.';

  return {
    metadata,
    task,
    files,
    tests,
    reference,
    answerFile,
  };
}
