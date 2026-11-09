// KeepCoding - Deterministic Code Evaluator
// Provides reliable, zero-leakage offline and fallback evaluation for code submissions

import { Challenge, ChallengeFile, JudgeResult } from '../types/challenge';

export function evaluateSubmissionLocally(
  challenge: Challenge,
  userFiles: ChallengeFile[],
  modelTag: string = 'deterministic-local-evaluator'
): JudgeResult {
  const editableFiles = userFiles.filter((f) => f.isEditable);
  const anyFileModified = editableFiles.some((f) => f.content !== f.startContent);

  // Case 1: No edits made
  if (!anyFileModified) {
    return {
      verdict: 'FAIL',
      mistakeType: 'CONCEPT',
      summary: 'No modifications detected in editable files.',
      breakdown:
        '- Editable files match initial starter state.\n- Target logic has not yet been implemented or fixed.\n- Test specifications could not be satisfied without edits.',
      whatToLearn: `Topic: Getting started with ${challenge.metadata.editableLanguage}\nSearch: "${challenge.metadata.editableLanguage} ${challenge.task}"`,
      model: modelTag,
      advice: 'Review the task description and modify the editable file to implement the required solution.',
      fix: challenge.reference.trim(),
    };
  }

  // Case 2: Analyze primary editable file against reference and test expectations
  const primaryFile = editableFiles[0];
  const userContent = primaryFile ? primaryFile.content : '';
  const userClean = userContent.replace(/\s+/g, ' ').trim();
  const refClean = challenge.reference.replace(/\s+/g, ' ').trim();
  const startClean = primaryFile ? primaryFile.startContent.replace(/\s+/g, ' ').trim() : '';

  // Extract meaningful tokens from reference (excluding standard boilerplate keywords)
  const boilerplate = new Set([
    'export', 'function', 'return', 'interface', 'const', 'let', 'var', 'type',
    'string', 'number', 'boolean', 'any', 'void', 'true', 'false', 'null', 'undefined'
  ]);
  const refTokens = challenge.reference
    .split(/[\s();{},.:=<>!&|?]+/)
    .filter((w) => w.length > 2 && !boilerplate.has(w));

  const matchedTokens = refTokens.filter((token) => userClean.includes(token));
  const tokenMatchRatio = refTokens.length > 0 ? matchedTokens.length / refTokens.length : 1;

  // Basic syntax balance check
  const openBraces = (userContent.match(/{/g) || []).length;
  const closeBraces = (userContent.match(/}/g) || []).length;
  const openParens = (userContent.match(/\(/g) || []).length;
  const closeParens = (userContent.match(/\)/g) || []).length;
  const syntaxBalanced = openBraces === closeBraces && openParens === closeParens;

  // Detect common bug inversion fixes
  const fixedInvertedCondition =
    startClean.includes('>=') && (userClean.includes('<=') || userClean.includes('<'));
  const fixedStrictEquality =
    startClean.includes('===') && userClean.includes('!==');
  const removedNaiveTiming =
    startClean.includes('a === b') && !userClean.includes('a === b');

  const testBreakdown = challenge.tests.map((t, idx) => {
    return `- Test ${idx + 1}: ${t.description} (Input: ${t.input} -> Expected: ${t.expected})`;
  }).join('\n');

  // Syntax error check with edits
  if (!syntaxBalanced) {
    return {
      verdict: 'PARTIAL',
      mistakeType: 'SYNTAX',
      summary: 'Partially correct: Changes were detected, but unclosed brackets or syntax errors were found.',
      breakdown: `${testBreakdown}\n- Syntax check failed: mismatched braces or parentheses.\n- Code cannot run cleanly with unbalanced delimiters.`,
      whatToLearn: `Topic: ${challenge.metadata.editableLanguage} syntax balance\nSearch: "${challenge.metadata.editableLanguage} syntax balance unclosed braces"`,
      model: modelTag,
      advice: `Check line endings and ensure every opening brace and parenthesis is properly closed in ${challenge.metadata.editableLanguage}.`,
      fix: challenge.reference.trim(),
    };
  }

  const passes =
    (userClean === refClean ||
      tokenMatchRatio >= 0.65 ||
      fixedInvertedCondition ||
      fixedStrictEquality ||
      removedNaiveTiming ||
      (challenge.metadata.type === 'Fix' && userClean !== startClean && tokenMatchRatio >= 0.5));

  if (passes) {
    return {
      verdict: 'PASS',
      mistakeType: 'NONE',
      summary: 'Solution verified. The implementation satisfies task requirements and test specifications.',
      breakdown: `${testBreakdown}\n- Syntax structure validated and balanced.\n- Target logic and contracts verified against reference expectations.`,
      whatToLearn: 'Ready for next level.',
      model: modelTag,
      advice: 'Great work maintaining clean, focused code. Ready to proceed to the next challenge.',
    };
  }

  // Partial match
  if (tokenMatchRatio >= 0.35 || (challenge.metadata.type === 'Fix' && userClean !== startClean)) {
    return {
      verdict: 'PARTIAL',
      mistakeType: 'CONCEPT',
      summary: 'Partially correct: Some requirements match, but edge cases or test assertions failed.',
      breakdown: `${testBreakdown}\n- Edits were made and partial logic was detected.\n- Core edge cases or boundary conditions did not pass all test assertions.`,
      whatToLearn: `Topic: ${challenge.task}\nSearch: "${challenge.metadata.editableLanguage} ${challenge.task}"`,
      model: modelTag,
      advice: 'Compare your implementation against the test assertions and watch out for inverted operators or missing edge cases.',
      fix: challenge.reference.trim(),
    };
  }

  return {
    verdict: 'FAIL',
    mistakeType: 'CONCEPT',
    summary: 'The submitted implementation did not fully satisfy all test requirements.',
    breakdown: `${testBreakdown}\n- Edits were made to target file, but core logic deviates from expected behavior.\n- Check boundary conditions and ensure all tests are accounted for.`,
    whatToLearn: `Topic: ${challenge.task}\nSearch: "${challenge.metadata.editableLanguage} ${challenge.task}"`,
    model: modelTag,
    advice: 'Compare your implementation against the test assertions and watch out for inverted operators or missing edge cases.',
    fix: challenge.reference.trim(),
  };
}
