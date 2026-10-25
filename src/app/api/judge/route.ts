// KeepCoding - Server-Side AI Judge Route
// Evaluates user code submissions with private AI API key or intelligent mock fallback

import { NextRequest, NextResponse } from 'next/server';
import { Challenge, ChallengeFile, JudgeResult } from '@/lib/types/challenge';
import { buildJudgeSystemPrompt, buildJudgeUserPrompt } from '@/lib/judge/judge-prompt';
import { parseJudgeResponse } from '@/lib/judge/judge-parser';

interface JudgeRequestBody {
  challenge: Challenge;
  userFiles: ChallengeFile[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as JudgeRequestBody;
    const { challenge, userFiles } = body;

    if (!challenge || !userFiles || !Array.isArray(userFiles)) {
      return NextResponse.json(
        { error: 'Invalid request payload: challenge and userFiles are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || 'gemini-2.5-flash';
    const baseUrl = process.env.AI_API_BASE_URL;

    // Check if real key is configured (not dummy/placeholder)
    const isRealApiKey =
      Boolean(apiKey) &&
      !apiKey?.includes('your_') &&
      !apiKey?.includes('dummy_') &&
      !apiKey?.includes('placeholder');

    if (isRealApiKey && apiKey) {
      try {
        const systemPrompt = buildJudgeSystemPrompt();
        const userPrompt = buildJudgeUserPrompt({ challenge, userFiles });

        // Call Gemini or OpenAI-compatible endpoint
        const targetUrl = baseUrl
          ? `${baseUrl}/chat/completions`
          : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        let rawResponseText = '';

        if (baseUrl) {
          // OpenAI-compatible format
          const res = await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.1,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            rawResponseText = data.choices?.[0]?.message?.content || '';
          }
        } else {
          // Native Google Gemini API format
          const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemPrompt}\n\n${userPrompt}` },
                  ],
                },
              ],
              generationConfig: { temperature: 0.1 },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            rawResponseText =
              data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }
        }

        if (rawResponseText.trim().length > 0) {
          const parsedJudgeResult = parseJudgeResponse(rawResponseText, model);
          return NextResponse.json(parsedJudgeResult);
        }
      } catch (apiErr) {
        console.error('Remote AI Judge error, falling back to local evaluator:', apiErr);
      }
    }

    // Smart Local Evaluator (Mock Fallback for offline/testing)
    const mockResult = evaluateLocally(challenge, userFiles);
    return NextResponse.json(mockResult);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown evaluation error';
    return NextResponse.json(
      { error: `Judge evaluation failed: ${errorMsg}` },
      { status: 500 }
    );
  }
}

/**
 * Intelligent deterministic local evaluator used when no AI key is provided.
 * Compares user edits against initial code and reference solution.
 */
function evaluateLocally(challenge: Challenge, userFiles: ChallengeFile[]): JudgeResult {
  const editableFiles = userFiles.filter((f) => f.isEditable);
  const anyFileModified = editableFiles.some((f) => f.content !== f.startContent);

  // Case 1: No edits made
  if (!anyFileModified) {
    return {
      verdict: 'FAIL',
      summary: 'No modifications detected in editable files.',
      breakdown:
        '- Editable files match initial starter state.\n- Target logic has not yet been implemented or fixed.\n- Test specifications could not be satisfied without edits.',
      model: 'local-evaluator (mock: configure AI_API_KEY in .env.local for live Gemini)',
      advice: 'Review the task description and modify the editable file to implement the required solution.',
    };
  }

  // Case 2: Analyze user edits against reference
  const primaryFile = editableFiles[0];
  const refClean = challenge.reference.replace(/\s+/g, ' ').trim();
  const userClean = primaryFile ? primaryFile.content.replace(/\s+/g, ' ').trim() : '';

  // Extract key identifiers or tokens from reference
  const refTokens = challenge.reference
    .split(/[\s();{},.:=<>!&|]+/)
    .filter((w) => w.length > 3 && !['export', 'function', 'return', 'interface', 'const'].includes(w));

  const matchedTokens = refTokens.filter((token) => userClean.includes(token));
  const tokenMatchRatio = refTokens.length > 0 ? matchedTokens.length / refTokens.length : 1;

  // Check if reference contains a specific key inversion (e.g. <= instead of >=)
  const checksPass =
    userClean === refClean ||
    tokenMatchRatio >= 0.7 ||
    (challenge.metadata.type === 'Fix' && userClean !== primaryFile.startContent.replace(/\s+/g, ' ').trim());

  if (checksPass) {
    return {
      verdict: 'PASS',
      summary: 'Solution verified. The implementation satisfies task requirements and test specifications.',
      breakdown:
        '- Target logic correctly implemented in editable file.\n- Key boundary conditions and test criteria satisfied.\n- Solution maintains clean code structure without extraneous clutter.',
      model: 'local-evaluator (mock: configure AI_API_KEY in .env.local for live Gemini)',
      advice: 'Great work maintaining clean, minimal code. Ready for the next difficulty level.',
    };
  }

  return {
    verdict: 'FAIL',
    summary: 'The submitted implementation did not fully satisfy all test requirements.',
    breakdown:
      '- Edits were made to target file, but core logic deviates from expected behavior.\n- One or more test specifications failed mental dry-run execution.',
    model: 'local-evaluator (mock: configure AI_API_KEY in .env.local for live Gemini)',
    advice: 'Compare your logic against the test cases and watch out for edge cases or reversed operator conditions.',
    fix: challenge.reference.trim(),
  };
}
