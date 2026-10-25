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
 * Strips outer markdown code fences if present.
 */
function stripOuterFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:markdown|text)?\r?\n([\s\S]*?)\r?\n```$/i);
  if (fenceMatch) {
    return fenceMatch[1];
  }
  return text;
}

/**
 * Normalizes newlines to \n.
 */
function normalizeNewlines(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Cleans section content: strips leading and trailing empty lines while preserving indentation.
 */
function cleanContent(content: string): string {
  const noLeading = content.replace(/^\n+/, '');
  return noLeading.replace(/\s+$/, '');
}

/**
 * Extracts raw tagged sections from the input text.
 */
export function extractSections(rawText: string): RawSection[] {
  const cleanText = normalizeNewlines(stripOuterFences(rawText));
  const tagRegex = /(?:^|\n)\s*---+\s*([A-Za-z0-9_]+)(?::\s*([^\n\r-]+?))?\s*---+\s*(?:\n|$)/g;

  const matches: Array<{ tag: string; param?: string; start: number; end: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(cleanText)) !== null) {
    matches.push({
      tag: match[1].toUpperCase(),
      param: match[2]?.trim(),
      start: match.index,
      end: tagRegex.lastIndex,
    });
  }

  const sections: RawSection[] = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : cleanText.length;
    const content = cleanContent(cleanText.substring(current.end, nextStart));

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
      const parsed = JSON.parse(trimmed);
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
      if (parsed.editableLanguage) metadata.editableLanguage = String(parsed.editableLanguage).trim().toLowerCase();

      if (Array.isArray(parsed.editableFiles)) {
        metadata.editableFiles = parsed.editableFiles.map((f: unknown) => String(f).trim());
      } else if (typeof parsed.editableFiles === 'string') {
        metadata.editableFiles = parsed.editableFiles.split(',').map((f: string) => f.trim()).filter(Boolean);
      }
      return metadata;
    } catch {
      // Fallback to line-by-line parsing
    }
  }

  // Line-by-line key-value parsing
  const lines = trimmed.split('\n');
  for (const line of lines) {
    const kvMatch = line.match(/^\s*([A-Za-z0-9_]+)\s*[:=]\s*(.*)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1].toLowerCase();
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
    } else if (key === 'editablefiles' || key === 'editable_files' || key === 'files') {
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
    const inputMatch = line.match(/^\s*(?:-\s*)?input\s*[:=]\s*(.*)$/i);
    const expectedMatch = line.match(/^\s*(?:-\s*)?expected\s*[:=]\s*(.*)$/i);
    const descMatch = line.match(/^\s*(?:-\s*)?description\s*[:=]\s*(.*)$/i);

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

    files.push({
      path: cleanPath,
      content: sec.content,
      startContent: sec.content,
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

  const tests = testsSection ? parseTests(testsSection.content) : [];
  const task = taskSection ? taskSection.content : '';
  const reference = referenceSection ? referenceSection.content : '';

  return {
    metadata,
    task,
    files,
    tests,
    reference,
    answerFile,
  };
}
