// KeepCoding - Full End-to-End Workflow Manual & Automated Test Suite

import { SAMPLE_CHALLENGES } from '../lib/sample-challenges';
import { validateRawChallenge } from '../lib/parser/challenge-validator';
import { generateMasterPrompt } from '../lib/prompts/master-prompt';
import { buildJudgeSystemPrompt, buildJudgeUserPrompt } from '../lib/judge/judge-prompt';
import { parseJudgeResponse } from '../lib/judge/judge-parser';
import { ChallengeFile } from '../lib/types/challenge';

function runTestSuite() {
  console.log('=== Step 1: Testing Master Prompt Generation ===');
  const sampleHistory = [
    {
      id: 'h1',
      track: 1,
      level: 1,
      type: 'Write',
      taskTitle: 'Pure token extractor',
      verdict: 'PASS' as const,
      timestamp: Date.now(),
      language: 'TypeScript',
    },
  ];

  const prompt = generateMasterPrompt({
    track: 1,
    level: 2,
    type: 'Fix',
    language: 'TypeScript',
    history: sampleHistory,
  });

  if (!prompt.includes('---METADATA---')) throw new Error('Master prompt missing METADATA tag');
  if (!prompt.includes('Track 1')) throw new Error('Master prompt missing selected Track');
  if (!prompt.includes('Pure token extractor')) throw new Error('Master prompt missing history record');
  if (prompt.includes('—')) throw new Error('Master prompt contains forbidden em dash character');
  console.log('[PASS] Master Prompt Generation verified with history integration.');

  console.log('\n=== Step 2: Testing Challenge Ingestion & Parsing on All Samples ===');
  for (const sample of SAMPLE_CHALLENGES) {
    const val = validateRawChallenge(sample.raw);
    if (!val.valid) {
      throw new Error(`Sample challenge "${sample.label}" failed validation: ${val.errors.join(', ')}`);
    }
    if (!val.challenge) {
      throw new Error(`Sample challenge "${sample.label}" did not return a challenge object`);
    }

    const { challenge } = val;
    console.log(`[PASS] Sample: "${sample.label}"`);
    console.log(`       - Track: ${challenge.metadata.track}, Level: ${challenge.metadata.level}, Language: ${challenge.metadata.editableLanguage}`);
    console.log(`       - Files: ${challenge.files.length} (${challenge.files.map(f => `${f.path}${f.isEditable ? ' [editable]' : ' [readonly]'}`).join(', ')})`);
    console.log(`       - Tests: ${challenge.tests.length}`);

    // Verify at least one file is editable
    const hasEditable = challenge.files.some(f => f.isEditable);
    if (!hasEditable) throw new Error(`Challenge "${sample.label}" has no editable files!`);
  }

  console.log('\n=== Step 3: Testing Workspace State Transitions ===');
  const primarySample = SAMPLE_CHALLENGES[0];
  const primaryVal = validateRawChallenge(primarySample.raw);
  const challenge = primaryVal.challenge!;

  const files: ChallengeFile[] = challenge.files.map(f => ({
    ...f,
    startContent: f.content,
  }));

  const editableFile = files.find(f => f.isEditable)!;
  console.log(`Targeting editable file: "${editableFile.path}"`);

  // Simulate user making a code modification
  const originalCode = editableFile.content;
  const modifiedCode = originalCode.replace('>=', '<=');
  editableFile.content = modifiedCode;

  const isDirty = files.some(f => f.content !== f.startContent);
  if (!isDirty) throw new Error('Workspace failed to detect modified file dirty state');
  console.log('[PASS] Workspace detects dirty state on user modification.');

  // Simulate file reset
  editableFile.content = editableFile.startContent;
  const isCleanAfterReset = !files.some(f => f.content !== f.startContent);
  if (!isCleanAfterReset) throw new Error('Workspace failed to restore clean state after reset');
  console.log('[PASS] Workspace restores clean state on reset.');

  console.log('\n=== Step 4: Testing Judge Mental Dry-Run Prompts & Tagged Parsing ===');
  const userFiles: ChallengeFile[] = challenge.files.map(f => ({
    ...f,
    content: f.isEditable ? f.content.replace('>=', '<=') : f.content,
  }));

  const systemPrompt = buildJudgeSystemPrompt();
  const userPrompt = buildJudgeUserPrompt({ challenge, userFiles });

  if (!systemPrompt.includes('---VERDICT---')) throw new Error('Judge system prompt missing VERDICT tag');
  if (!userPrompt.includes(challenge.task)) throw new Error('Judge user prompt missing task description');
  if (systemPrompt.includes('—') || userPrompt.includes('—')) throw new Error('Judge prompt contains em dash');
  console.log('[PASS] Judge system and user prompts generated cleanly.');

  // Test parsing simulated judge response
  const simulatedJudgeResponse = `---VERDICT---
PASS
---SUMMARY---
The timing-safe comparison logic was correctly inverted to fix early returns.
---BREAKDOWN---
- Correctly updated length comparison check.
- Timing safe accumulator loop runs to completion for equal lengths.
- All 3 test cases pass mental dry run.
---MODEL---
When checking security credentials, always ensure length mismatches do not cause timing discrepancies.
---ADVICE---
Consider using built-in crypto.timingSafeEqual in production environments.
---FIX---
export function secureVerify(a: string, b: string): boolean { return a.length === b.length; }`;

  const parsed = parseJudgeResponse(simulatedJudgeResponse, 'gemini-flash-latest');
  if (parsed.verdict !== 'PASS') throw new Error(`Expected PASS verdict, got ${parsed.verdict}`);
  if (!parsed.summary.includes('timing-safe')) throw new Error('Summary not parsed');
  if (!parsed.breakdown.includes('Timing safe')) throw new Error('Breakdown not parsed');
  if (!parsed.advice.includes('crypto.timingSafeEqual')) throw new Error('Advice not parsed');
  if (!parsed.fix?.includes('secureVerify')) throw new Error('Fix not parsed');
  console.log('[PASS] Judge response parser cleanly extracts structured verdict, summary, breakdown, advice, and optional fix.');

  console.log('\n=== Step 5: Testing Forbidden Em Dash Audit ===');
  const checkText = [
    prompt,
    systemPrompt,
    userPrompt,
    simulatedJudgeResponse,
  ].join('\n');

  if (checkText.includes('—')) {
    throw new Error('Audit found forbidden em dash character in workflow data!');
  }
  console.log('[PASS] 0 em dashes found across all generated outputs.');

  console.log('\n========================================');
  console.log('ALL WORKFLOW VERIFICATION CHECKS PASSED!');
  console.log('========================================');
}

runTestSuite();
