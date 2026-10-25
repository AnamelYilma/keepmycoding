// KeepCoding - Judge Response Parser
// Parses tagged output from the AI judge into a structured JudgeResult object

import { JudgeResult, Verdict } from '../types/challenge';

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

  // Parse verdict
  const rawVerdict = (sections['VERDICT'] || '').trim().toUpperCase();
  const verdict: Verdict = rawVerdict.includes('PASS') ? 'PASS' : 'FAIL';

  // Parse summary
  const summary = sections['SUMMARY'] || (verdict === 'PASS' ? 'Challenge passed all validation criteria.' : 'Challenge failed verification.');

  // Parse breakdown
  const breakdown = sections['BREAKDOWN'] || 'No detailed breakdown provided.';

  // Parse model dry-run trace
  const modelTrace = sections['MODEL'] || 'Mental dry-run completed.';

  // Parse advice
  const advice = sections['ADVICE'] || 'Continue practicing active coding intuition.';

  // Parse fix
  const fix = sections['FIX'] ? sections['FIX'].trim() : undefined;

  return {
    verdict,
    summary,
    breakdown,
    model: `${modelName} - ${modelTrace.slice(0, 120)}`,
    advice,
    fix: fix && fix.length > 0 ? fix : undefined,
  };
}
