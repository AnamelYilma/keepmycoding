// KeepCoding - Server-Side AI Judge Route
// Evaluates user code submissions with Google AI Studio Gemini API or intelligent deterministic fallback

import { NextRequest, NextResponse } from 'next/server';
import { Challenge, ChallengeFile, JudgeResult } from '@/lib/types/challenge';
import { buildJudgeSystemPrompt, buildJudgeUserPrompt } from '@/lib/judge/judge-prompt';
import { parseJudgeResponse } from '@/lib/judge/judge-parser';
import { evaluateSubmissionLocally } from '@/lib/judge/local-evaluator';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { normalizeSources } from '@/lib/challenges/library';

interface JudgeRequestBody {
  challenge: Challenge;
  challengeId?: string;
  userFiles: ChallengeFile[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as JudgeRequestBody;
    let { challenge } = body;
    const { challengeId, userFiles } = body;
    let libraryAttempt: { id: string; userId: string; admin: ReturnType<typeof createSupabaseAdminClient>; solution: { reference_solution: string; author_explanation: string; source_urls: unknown } } | null = null;

    if (challengeId) {
      if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'Challenge storage is not configured.' }, { status: 503 });
      }
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: 'Challenge library judging is not configured.' }, { status: 503 });
      }
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Sign in to submit a community challenge.' }, { status: 401 });

      const { data: record } = await supabase
        .from('challenges')
        .select('owner_id,challenge')
        .eq('id', challengeId)
        .maybeSingle();
      if (!record) return NextResponse.json({ error: 'Challenge not found.' }, { status: 404 });

      const { data: attempt } = await supabase
        .from('challenge_attempts')
        .select('challenge_id')
        .eq('challenge_id', challengeId)
        .eq('solver_id', user.id)
        .maybeSingle();
      if (!attempt) return NextResponse.json({ error: 'Start this challenge before submitting it.' }, { status: 403 });

      const admin = createSupabaseAdminClient();
      const { data: solution, error: solutionError } = await admin
        .from('challenge_solutions')
        .select('reference_solution,author_explanation,source_urls')
        .eq('challenge_id', challengeId)
        .maybeSingle();
      if (solutionError || !solution) return NextResponse.json({ error: 'Challenge solution is unavailable.' }, { status: 503 });

      challenge = { ...(record.challenge as Omit<Challenge, 'reference'>), reference: solution.reference_solution };
      libraryAttempt = { id: challengeId, userId: user.id, admin, solution };
    }

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
      return await completeLibraryAttempt(mockResult, libraryAttempt);
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
            return await completeLibraryAttempt(parsedJudgeResult, libraryAttempt);
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
    return await completeLibraryAttempt(fallbackResult, libraryAttempt);
  } catch (err) {
    console.error('Unexpected error in Judge route. Falling back to local evaluation.', err);
    return NextResponse.json(
      { error: 'Judge evaluation failed due to an unexpected internal error.' },
      { status: 500 }
    );
  }
}

async function completeLibraryAttempt(
  result: JudgeResult,
  attempt: { id: string; userId: string; admin: ReturnType<typeof createSupabaseAdminClient>; solution: { reference_solution: string; author_explanation: string; source_urls: unknown } } | null
) {
  if (!attempt || result.verdict !== 'PASS') return NextResponse.json(result);

  const { error } = await attempt.admin
    .from('challenge_attempts')
    .update({ completed_at: new Date().toISOString() })
    .eq('challenge_id', attempt.id)
    .eq('solver_id', attempt.userId);
  if (error) return NextResponse.json({ error: 'Your solution passed, but completion could not be recorded. Please try again.' }, { status: 503 });

  const sources = normalizeSources(attempt.solution.source_urls) ?? [];
  return NextResponse.json({
    ...result,
    authorLearning: {
      explanation: attempt.solution.author_explanation,
      referenceSolution: attempt.solution.reference_solution,
      sources,
    },
  });
}

/**
 * Deterministic local evaluator wrapper.
 */
function evaluateLocally(challenge: Challenge, userFiles: ChallengeFile[]): JudgeResult {
  return evaluateSubmissionLocally(challenge, userFiles);
}
