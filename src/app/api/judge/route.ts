// KeepCoding - Server-Side AI Judge Route
// Evaluates user code submissions with Google AI Studio Gemini API or intelligent deterministic fallback

import { NextRequest, NextResponse } from 'next/server';
import { Challenge, ChallengeFile, JudgeResult } from '@/lib/types/challenge';
import { buildJudgeSystemPrompt, buildJudgeUserPrompt } from '@/lib/judge/judge-prompt';
import { parseJudgeResponse } from '@/lib/judge/judge-parser';
import { evaluateSubmissionLocally } from '@/lib/judge/local-evaluator';

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

    // Defensive validation: protect against oversized payloads and DoS
    if (userFiles.length > 20) {
      return NextResponse.json(
        { error: 'Payload exceeds maximum allowed files (limit: 20).' },
        { status: 400 }
      );
    }

    const totalPayloadChars =
      userFiles.reduce((acc, f) => acc + (f?.content?.length || 0), 0) +
      (challenge.task?.length || 0);

    if (totalPayloadChars > 200_000) {
      return NextResponse.json(
        { error: 'Payload size exceeds allowable threshold.' },
        { status: 413 }
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
      const mockResult = evaluateSubmissionLocally(
        challenge,
        userFiles,
        'local-evaluator (mock: configure AI_API_KEY in .env.local for live Gemini)'
      );
      return NextResponse.json(mockResult);
    }

    // Call Google Generative Language API with valid production models
    const preferredModel = process.env.AI_MODEL?.trim() || 'gemini-1.5-flash';
    const modelsToTry = Array.from(new Set([preferredModel, 'gemini-1.5-flash', 'gemini-2.0-flash']));
    const systemPrompt = buildJudgeSystemPrompt();
    const userPrompt = buildJudgeUserPrompt({ challenge, userFiles });

    for (const model of modelsToTry) {
      const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
              },
            ],
            generationConfig: { temperature: 0.1 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawResponseText && rawResponseText.trim().length > 0) {
            const parsedJudgeResult = parseJudgeResponse(rawResponseText, model);
            return NextResponse.json(parsedJudgeResult);
          }
        } else {
          console.warn(`Model ${model} returned status ${res.status}.`);
        }
      } catch (networkErr) {
        console.warn(`Network error contacting model ${model}:`, networkErr);
      }
    }

    // If external AI calls could not be completed, directly fallback to deterministic evaluator
    console.warn('External AI evaluation unavailable. Activating deterministic local evaluator.');
    const fallbackResult = evaluateSubmissionLocally(
      challenge,
      userFiles,
      'deterministic-engine (fallback: live AI service temporarily unavailable)'
    );
    return NextResponse.json(fallbackResult);
  } catch (err) {
    console.error('Unexpected error in Judge route. Falling back to local evaluation.', err);
    return NextResponse.json(
      { error: 'Judge evaluation failed due to an unexpected internal error.' },
      { status: 500 }
    );
  }
}

/**
 * Deterministic local evaluator wrapper.
 */
function evaluateLocally(challenge: Challenge, userFiles: ChallengeFile[]): JudgeResult {
  return evaluateSubmissionLocally(challenge, userFiles);
}
