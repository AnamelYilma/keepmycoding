import { NextRequest, NextResponse } from 'next/server';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { normalizeSources } from '@/lib/challenges/library';

const publicColumns = 'id,owner_id,owner_name,title,summary,topic,language,track,level,challenge_type,visibility,reason,learning_goal,created_at';

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ challenges: [], configured: false });

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('challenges')
      .select(publicColumns)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) return NextResponse.json({ error: 'Could not load challenges.' }, { status: 503 });
    const { data: { user } } = await supabase.auth.getUser();
    let myAttempts: { challenge_id: string; started_at: string; completed_at: string | null }[] = [];
    if (user) {
      const { data: attempts } = await supabase
        .from('challenge_attempts')
        .select('challenge_id,started_at,completed_at')
        .eq('solver_id', user.id)
        .limit(200);
      myAttempts = attempts ?? [];
    }
    return NextResponse.json({ challenges: data ?? [], myAttempts, configured: true });
  } catch {
    return NextResponse.json({ error: 'Could not load challenges.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Challenge storage is not configured.' }, { status: 503 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Sign in to save a challenge.' }, { status: 401 });

    const payload = await request.json();
    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    const summary = typeof payload.summary === 'string' ? payload.summary.trim() : '';
    const topic = typeof payload.topic === 'string' ? payload.topic.trim() : '';
    const reason = typeof payload.reason === 'string' ? payload.reason.trim() : '';
    const learningGoal = typeof payload.learningGoal === 'string' ? payload.learningGoal.trim() : '';
    const explanation = typeof payload.explanation === 'string' ? payload.explanation.trim() : '';
    const visibility = payload.visibility === 'public' ? 'public' : payload.visibility === 'private' ? 'private' : null;
    const sources = normalizeSources(payload.sources);
    const rawText = typeof payload.rawText === 'string' ? payload.rawText : '';

    if (rawText.length === 0 || rawText.length > 300_000) {
      return NextResponse.json({ error: 'Paste a challenge under 300,000 characters.' }, { status: 400 });
    }
    if (title.length < 3 || title.length > 120) {
      return NextResponse.json({ error: 'Challenge title must be 3 to 120 characters.' }, { status: 400 });
    }
    if (summary.length < 10 || summary.length > 500) {
      return NextResponse.json({ error: 'Summary must be 10 to 500 characters.' }, { status: 400 });
    }
    if (!topic || topic.length > 80 || reason.length > 2000 || learningGoal.length > 500 || explanation.length > 8000) {
      return NextResponse.json({ error: 'Some challenge details are missing or too long.' }, { status: 400 });
    }
    if (!visibility || !sources) {
      return NextResponse.json({ error: 'Choose a visibility and provide valid HTTP or HTTPS source links.' }, { status: 400 });
    }

    const validation = validateRawChallenge(rawText);
    if (!validation.valid || !validation.challenge) {
      return NextResponse.json({ error: 'The challenge format needs correction.', validationErrors: validation.errors }, { status: 400 });
    }

    const challenge = validation.challenge;
    const editableFiles = challenge.files.filter((file) => file.isEditable && !file.isAnswerFile);
    const codeFiles = challenge.files.filter((file) => !file.isAnswerFile);
    const editableLanguage = challenge.metadata.editableLanguage?.trim();
    if (!Number.isInteger(challenge.metadata.track) || challenge.metadata.track < 1 || challenge.metadata.track > 10 ||
        !Number.isInteger(challenge.metadata.level) || challenge.metadata.level < 1 || challenge.metadata.level > 12 ||
        !challenge.reference.trim() || !editableLanguage || codeFiles.length > 10 ||
        codeFiles.some((file) => file.content.split('\n').length > 1000)) {
      return NextResponse.json({ error: 'The challenge is missing a reference, language, or exceeds file limits.' }, { status: 400 });
    }
    if (editableFiles.length === 0) {
      return NextResponse.json({ error: 'Include at least one editable code file.' }, { status: 400 });
    }

    const { reference, ...solverChallenge } = challenge;
    const fullName = typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name.trim().slice(0, 80)
      : '';
    const { data: saved, error: saveError } = await supabase
      .from('challenges')
      .insert({
        owner_id: user.id,
        owner_name: fullName || 'KeepCoding developer',
        title,
        summary,
        topic,
        language: editableLanguage,
        track: challenge.metadata.track,
        level: challenge.metadata.level,
        challenge_type: challenge.metadata.type,
        visibility,
        challenge: solverChallenge,
        reason,
        learning_goal: learningGoal,
      })
      .select('id')
      .single();

    if (saveError || !saved) {
      return NextResponse.json({ error: 'Could not save this challenge.' }, { status: 503 });
    }

    const { error: solutionError } = await supabase.from('challenge_solutions').insert({
      challenge_id: saved.id,
      reference_solution: reference,
      author_explanation: explanation,
      source_urls: sources,
    });

    if (solutionError) {
      await supabase.from('challenges').delete().eq('id', saved.id).eq('owner_id', user.id);
      return NextResponse.json({ error: 'Could not save the author solution. Try again.' }, { status: 503 });
    }

    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not save this challenge.' }, { status: 500 });
  }
}
