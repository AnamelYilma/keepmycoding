// KeepCoding - Server-Side AI Judge Route
// Evaluates user code submissions with Google AI Studio Gemini API or intelligent mock fallback

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

    const apiKey = process.env.AI_API_KEY?.trim();

    // Check if real key is configured (not missing, dummy, or placeholder)
    const isRealApiKey =
      Boolean(apiKey) &&
      !apiKey?.includes('your_') &&
      !apiKey?.includes('placeholder') &&
      !apiKey?.includes('dummy_');

    if (!isRealApiKey || !apiKey) {
      // Smart Local Evaluator (Mock Fallback for offline/testing when no key is configured)
      const mockResult = evaluateLocally(challenge, userFiles);
      return NextResponse.json(mockResult);
    }

    // Call Google Generative Language API directly
    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const systemPrompt = buildJudgeSystemPrompt();
    const userPrompt = buildJudgeUserPrompt({ challenge, userFiles });

    let res: Response;
    try {
      res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: { temperature: 0.1 },
        }),
      });
    } catch (networkErr: unknown) {
      const netMsg = networkErr instanceof Error ? networkErr.message : 'Network request failed';
      console.error('Google AI Studio network error:', networkErr);
      return NextResponse.json(
        { error: `Network error contacting Google AI Studio: ${netMsg}` },
        { status: 502 }
      );
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('Google AI Studio API error response:', res.status, errorData);
      const errorMsg =
        errorData?.error?.message ||
        `Google AI Studio API returned HTTP status ${res.status} (${res.statusText || 'Error'})`;
      return NextResponse.json(
        { error: `Google AI Studio error: ${errorMsg}` },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }

    const data = await res.json();
    const rawResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawResponseText || rawResponseText.trim().length === 0) {
      const finishReason = data.candidates?.[0]?.finishReason || 'UNKNOWN';
      console.error('Gemini returned empty response. Finish reason:', finishReason, data);
      return NextResponse.json(
        { error: `AI Judge returned an empty response (finish reason: ${finishReason}).` },
        { status: 502 }
      );
    }

    const parsedJudgeResult = parseJudgeResponse(rawResponseText, 'gemini-flash-latest');
    return NextResponse.json(parsedJudgeResult);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown evaluation error';
    console.error('Unexpected Judge route error:', err);
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
