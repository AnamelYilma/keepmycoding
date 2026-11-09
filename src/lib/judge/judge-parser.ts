// KeepCoding - Judge Response Parser
// Parses tagged output from the AI judge into a structured JudgeResult object

import { JudgeResult, Verdict, MistakeType } from '../types/challenge';

export function parseJudgeResponse(rawText: string, modelName: string = 'gemini-2.5-flash'): JudgeResult {
  const clean = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const tagRegex = /(?:^|\n)\s*---+\s*([A-Z_]+)\s*---+\s*(?:\n|$)/g;

  const matches: Array<{ tag: string; start: number; end: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(clean)) !== null) {
    matches.push({
      tag: match[1].toUpperCase(),
      start: match.index,
      end: tagRegex.lastIndex,
    });
  }

  const sections: Record<string, string> = {};
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : clean.length;
    const content = clean.substring(cur.end, nextStart).trim();
    sections[cur.tag] = content;
  }

  // Parse verdict (3-tier: PASS, PARTIAL, FAIL)
  const rawVerdict = (sections['VERDICT'] || '').trim().toUpperCase();
  let verdict: Verdict = 'FAIL';
  if (rawVerdict.includes('PARTIAL')) {
    verdict = 'PARTIAL';
  } else if (rawVerdict.includes('PASS')) {
    verdict = 'PASS';
  }

  // Parse mistake type (CONCEPT vs SYNTAX)
  const rawMistake = (sections['MISTAKE_TYPE'] || '').trim().toUpperCase();
  let mistakeType: MistakeType | undefined;
  if (rawMistake.includes('SYNTAX')) {
    mistakeType = 'SYNTAX';
  } else if (rawMistake.includes('CONCEPT')) {
    mistakeType = 'CONCEPT';
  } else if (rawMistake.includes('NONE')) {
    mistakeType = 'NONE';
  }

  // Parse summary
  const defaultSummary =
    verdict === 'PASS'
      ? 'Challenge passed all validation criteria.'
      : verdict === 'PARTIAL'
      ? 'Partially correct: Some requirements met, but others need attention.'
      : 'Challenge failed verification.';
  const summary = sections['SUMMARY'] || defaultSummary;

  // Parse breakdown
  const breakdown = sections['BREAKDOWN'] || 'No detailed breakdown provided.';

  // Parse what to learn / study guidance
  const whatToLearn = sections['WHAT_TO_LEARN'] ? sections['WHAT_TO_LEARN'].trim() : undefined;

  // Parse model dry-run trace
  const modelTrace = sections['MODEL'] || 'Mental dry-run completed.';

  // Parse advice
  const advice = sections['ADVICE'] || 'Continue practicing active coding intuition.';

  // Parse fix
  const fix = sections['FIX'] ? sections['FIX'].trim() : undefined;

  return {
    verdict,
    mistakeType,
    summary,
    breakdown,
    whatToLearn,
    model: `${modelName} - ${modelTrace.slice(0, 120)}`,
    advice,
    fix: fix && fix.length > 0 ? fix : undefined,
  };
}
