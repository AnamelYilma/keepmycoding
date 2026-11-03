// KeepCoding - Judge Prompt Construction
// Formats developer edits and challenge context for server-side mental dry-run evaluation

import { Challenge, ChallengeFile } from '../types/challenge';

export interface JudgePromptInput {
  challenge: Challenge;
  userFiles: ChallengeFile[];
}

export function buildJudgeSystemPrompt(): string {
  return `You are the KeepCoding Private AI Judge.
Your mission is to perform a rigorous mental dry-run evaluation of the developer's submitted code.

GRADING PRINCIPLES:
1. Non-dogmatic grading: Do NOT require the developer's code to be character-for-character identical to the reference solution. If their logic is sound, handles edge cases, and satisfies all requirements, award a PASS.
2. Rigorous mental execution: Trace each test case step-by-step through the developer's code.
3. Crystal-clear feedback: Plainly state what succeeded and what failed in simple, direct language. Never write dense or confusing critique. State exactly what inputs broke the submission and how to satisfy the requirements.
4. Output must strictly follow the tagged structure below. Do not output anything before ---VERDICT---.

TAGGED OUTPUT FORMAT:
---VERDICT---
[Must be exactly PASS or FAIL]

---SUMMARY---
[1 to 2 sentences summarizing the verdict clearly]

---BREAKDOWN---
[Bullet points detailing:
- What worked correctly
- What failed, broke, or missed edge cases]

---MODEL---
[Mental dry-run trace: step-by-step reasoning through test inputs and edge cases]

---ADVICE---
[Actionable engineering advice to sharpen intuition for this type of problem]

---FIX---
[Optional: If FAIL, provide a concise corrected snippet or diff. If PASS, leave empty or omit.]`;
}

export function buildJudgeUserPrompt(input: JudgePromptInput): string {
  const { challenge, userFiles } = input;

  const filesContext = userFiles
    .map((f) => {
      const status = f.isEditable ? 'EDITABLE (User Submission)' : 'READ-ONLY (Context)';
      return `File: ${f.path} [${status}]\n\`\`\`\n${f.content}\n\`\`\``;
    })
    .join('\n\n');

  const testsContext = challenge.tests
    .map((t, idx) => `Test ${idx + 1}:\nInput: ${t.input}\nExpected: ${t.expected}\nDescription: ${t.description || 'N/A'}`)
    .join('\n\n');

  return `EVALUATION REQUEST:

TASK:
${challenge.task}

SUBMITTED FILES:
${filesContext}

SPECIFIED TESTS:
${testsContext}

AUTHORITATIVE REFERENCE SOLUTION (FOR BENCHMARKING ONLY):
\`\`\`
${challenge.reference}
\`\`\`

Evaluate the submitted code by executing a mental dry-run against the task and test cases.
Output your evaluation using the required tagged format starting with ---VERDICT---.`;
}
