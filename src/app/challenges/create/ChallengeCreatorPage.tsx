'use client';

import { useMemo, useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Copy, Save, ChevronDown, Clock, Lock, Globe, ArrowRight } from 'lucide-react';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { generateChallengeAuthorPrompt } from '@/lib/prompts/master-prompt';
import AppNav from '@/components/navigation/AppNav';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';

const fieldClass = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-400 transition-colors';
const labelClass = 'mb-1.5 block text-xs font-medium text-zinc-300';

const DOMAIN_OPTIONS: SelectOption<string>[] = [
  { value: 'Auth, JWT & Sessions', label: 'Auth, JWT & Sessions' },
  { value: 'Backend API & Middleware', label: 'Backend API & Middleware' },
  { value: 'Database & SQL Schemas', label: 'Database & SQL Schemas' },
  { value: 'Frontend UI & Forms', label: 'Frontend UI & Forms' },
  { value: 'State & Async Race Conditions', label: 'State & Async Race Conditions' },
  { value: 'Distributed Systems & Workers', label: 'Distributed Systems & Workers' },
  { value: 'Data Security & Hardening', label: 'Data Security & Hardening' },
];

const CHALLENGE_TYPE_OPTIONS: SelectOption<string>[] = [
  { value: 'Fix Bug', label: 'Fix Bug', description: 'Debug production issue' },
  { value: 'Build Feature', label: 'Build Feature', description: 'Implement missing contract' },
  { value: 'Refactor & Clean Code', label: 'Refactor', description: 'Clean & optimize architecture' },
  { value: 'Security Hardening', label: 'Security Hardening', description: 'Patch vulnerability' },
];

const LANGUAGE_OPTIONS: SelectOption<string>[] = [
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
];

const LEVEL_OPTIONS: SelectOption<number>[] = Array.from({ length: 12 }, (_, index) => {
  const lvl = index + 1;
  const desc = lvl <= 3 ? 'Foundations & Handlers' : lvl <= 7 ? 'State & Security Invariants' : lvl <= 10 ? 'Transactions & Edge Cases' : 'Scale & Concurrency';
  return {
    value: lvl,
    label: `Level ${lvl} (${desc})`,
  };
});

const VISIBILITY_OPTIONS: SelectOption<'temporary' | 'private' | 'public'>[] = [
  {
    value: 'temporary',
    label: 'Temporary (one-time practice: auto-discards after attempt)',
    description: 'Practiced once and not saved to public library',
  },
  {
    value: 'private',
    label: 'Private (invite-only / only you and shared solvers)',
    description: 'Saved to your personal challenges dashboard',
  },
  {
    value: 'public',
    label: 'Public (community library: visible to everyone)',
    description: 'Published to the global KeepCoding challenge catalog',
  },
];

export default function ChallengeCreatorPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'idea' | 'suggest'>('suggest');
  const [context, setContext] = useState('');
  const [domain, setDomain] = useState('Auth, JWT & Sessions');
  const [challengeType, setChallengeType] = useState('Fix Bug');
  const [language, setLanguage] = useState('TypeScript');
  const [level, setLevel] = useState(3);
  const [promptCopied, setPromptCopied] = useState(false);
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [topic, setTopic] = useState('');
  const [reason, setReason] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [explanation, setExplanation] = useState('');
  const [sourcesText, setSourcesText] = useState('');
  const [visibility, setVisibility] = useState<'temporary' | 'private' | 'public'>('temporary');
  const [showOptionalReflections, setShowOptionalReflections] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const validation = useMemo(() => rawText.trim() ? validateRawChallenge(rawText) : null, [rawText]);
  const prompt = useMemo(
    () => generateChallengeAuthorPrompt({ mode, language, level, domain, challengeType, context }),
    [mode, language, level, domain, challengeType, context]
  );

  // Auto-prefill Title, Topic & Summary from pasted valid challenge
  useEffect(() => {
    if (validation?.valid && validation.challenge) {
      const meta = validation.challenge.metadata;
      const taskFirstLine = validation.challenge.task
        .split('\n')[0]
        .replace(/^#+\s*/, '')
        .replace(/^TASK:\s*/i, '')
        .replace(/^[A-Z_]+:\s*/, '')
        .trim();

      if (!title) {
        const extractedTitle = meta.title || taskFirstLine;
        if (extractedTitle) {
          setTitle(extractedTitle.slice(0, 100));
        }
      }
      if (!topic) {
        const extractedTopic = meta.topic || domain || (meta.editableLanguage && meta.type ? `${meta.editableLanguage} ${meta.type}` : '');
        if (extractedTopic) {
          setTopic(extractedTopic.slice(0, 80));
        }
      }
      if (!summary) {
        const extractedSummary = meta.summary || `Practice ${meta.type || 'web engineering'} in ${meta.editableLanguage || language} with production tests.`;
        if (extractedSummary) {
          setSummary(extractedSummary.slice(0, 300));
        }
      }
    }
  }, [validation, title, topic, summary, domain, language]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 1800);
    } catch {
      setError('Clipboard access failed. Select and copy the prompt from your AI chat setup.');
    }
  }

  function parseSources() {
    return sourcesText.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const [label, ...rest] = line.split('|');
      const value = rest.length ? rest.join('|').trim() : label.trim();
      return { label: rest.length ? label.trim() : value, url: value };
    });
  }

  async function saveChallenge(event?: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();
    setError('');
    setSaved(false);
    if (!validation?.valid || !validation.challenge) {
      setError('Paste a valid tagged challenge first before proceeding.');
      return;
    }

    if (visibility === 'temporary') {
      // Instant deliberate practice directly in studio workspace
      sessionStorage.setItem('active_workspace_challenge', JSON.stringify({ ...validation.challenge, reference: '' }));
      sessionStorage.setItem('pending_challenge', JSON.stringify({ ...validation.challenge, reference: '' }));
      sessionStorage.removeItem('active_workspace_id');
      sessionStorage.removeItem('pending_challenge_id');
      router.push('/studio');
      return;
    }

    setSaving(true);
    try {
      const taskFirstLine = validation.challenge.task
        .split('\n')[0]
        .replace(/^#+\s*/, '')
        .replace(/^TASK:\s*/i, '')
        .replace(/^[A-Z_]+:\s*/, '')
        .trim();
      const finalTitle = title.trim() || validation.challenge.metadata.title || taskFirstLine || `${validation.challenge.metadata.editableLanguage} Practice Challenge`;
      const finalTopic = topic.trim() || validation.challenge.metadata.topic || domain || 'Web Engineering';
      const finalSummary = summary.trim() || validation.challenge.metadata.summary || `Practice ${finalTopic} in ${validation.challenge.metadata.editableLanguage}.`;

      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          title: finalTitle,
          summary: finalSummary,
          topic: finalTopic,
          reason,
          learningGoal,
          explanation,
          sources: parseSources(),
          visibility,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not save this challenge.');
      setSaved(true);
      router.push(`/challenges/${body.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save this challenge.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
            <ArrowLeft size={15} aria-hidden="true" /> Challenge Library
          </Link>
          <header className="mt-5 border-b border-zinc-800 pb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Create a challenge</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Generate a realistic web development problem using our prompt generator, or paste your existing challenge below.
            </p>
          </header>

          {/* Section 1: Prompt Generator */}
          <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-100">1. Generate interview prompt</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Select your preferences, copy the prompt, and paste it into your AI (ChatGPT, Claude, or Gemini).
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {/* Custom Segmented Pill Toggle for Generation Mode */}
              <div>
                <span className={labelClass}>Generation mode</span>
                <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setMode('suggest')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'suggest'
                        ? 'bg-[#88BDA4] text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Suggest a realistic web problem
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('idea')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'idea'
                        ? 'bg-[#88BDA4] text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    I have a specific bug or topic in mind
                  </button>
                </div>
              </div>

              {/* Specific Idea Input */}
              {mode === 'idea' && (
                <div>
                  <span className={labelClass}>What happened or what concept do you want to practice?</span>
                  <input
                    className={fieldClass}
                    value={context}
                    onChange={(event) => setContext(event.target.value)}
                    placeholder="e.g. JWT token expiry verification with 5-minute clock skew tolerance"
                  />
                </div>
              )}

              {/* Grid of Custom Select Dropdowns */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className={labelClass}>Web development domain</span>
                  <CustomSelect
                    value={domain}
                    onChange={setDomain}
                    options={DOMAIN_OPTIONS}
                    aria-label="Web development domain"
                  />
                </div>

                <div>
                  <span className={labelClass}>Challenge type</span>
                  <CustomSelect
                    value={challengeType}
                    onChange={setChallengeType}
                    options={CHALLENGE_TYPE_OPTIONS}
                    aria-label="Challenge type"
                  />
                </div>

                <div>
                  <span className={labelClass}>Target language</span>
                  <CustomSelect
                    value={language}
                    onChange={setLanguage}
                    options={LANGUAGE_OPTIONS}
                    aria-label="Target language"
                  />
                </div>

                <div>
                  <span className={labelClass}>Target difficulty level</span>
                  <CustomSelect
                    value={level}
                    onChange={setLevel}
                    options={LEVEL_OPTIONS}
                    aria-label="Target difficulty level"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => void copyPrompt()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#88BDA4] px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                >
                  {promptCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {promptCopied ? 'Prompt copied to clipboard' : 'Copy structured prompt'}
                </button>
                <p className="mt-2 text-xs text-zinc-500">
                  Paste this into ChatGPT, Claude, or Gemini. The AI will immediately return the production challenge in the exact KeepCoding format.
                </p>
              </div>
            </div>
          </section>

          <form onSubmit={saveChallenge} className="mt-5 space-y-5">
            {/* Section 2: Paste Tagged Challenge (Moved right after prompt) */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h2 className="font-semibold text-zinc-100">2. Paste the tagged challenge from AI</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Paste the full response containing the tagged blocks: ---METADATA---, ---TASK---, ---FILE---, ---TESTS---, and ---REFERENCE---.
              </p>

              <label className="mt-4 block">
                <span className="sr-only">Tagged challenge text</span>
                <textarea
                  className={`${fieldClass} min-h-64 font-mono text-xs leading-5`}
                  required
                  value={rawText}
                  onChange={(event) => setRawText(event.target.value)}
                  placeholder="Paste the complete ---METADATA---, ---TASK---, ---FILE---, ---TESTS---, and ---REFERENCE--- response here."
                />
              </label>

              {validation && (
                <div
                  className={`mt-3 rounded-lg border p-3 text-xs ${
                    validation.valid
                      ? 'border-emerald-500/30 text-emerald-300 bg-emerald-950/20'
                      : 'border-amber-500/30 text-amber-200 bg-amber-950/20'
                  }`}
                  role="status"
                >
                  {validation.valid
                    ? `Challenge format is valid. ${validation.challenge?.files.filter((file) => !file.isAnswerFile).length ?? 0} files included.`
                    : validation.errors.slice(0, 5).join(' ')}
                </div>
              )}
            </section>

            {/* Section 3: Practice & Visibility Mode */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="font-semibold text-zinc-100">3. Choose practice mode & start</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Temporary practice requires zero form fields. Save privately or publish to share with the community.
                  </p>
                </div>
              </div>

              {/* 3-Tab Segmented Practice Selector */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setVisibility('temporary')}
                  className={`flex flex-col items-start p-3 rounded-lg text-left transition-all cursor-pointer ${
                    visibility === 'temporary'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                    <Clock className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                    Temporary Practice
                  </span>
                  <span className="text-[11px] text-zinc-400 mt-1">
                    One-time studio session. Auto-discards, no forms or account saving required.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex flex-col items-start p-3 rounded-lg text-left transition-all cursor-pointer ${
                    visibility === 'private'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                    <Lock className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                    Private Challenge
                  </span>
                  <span className="text-[11px] text-zinc-400 mt-1">
                    Saved to your personal dashboard. Title and topic are auto-extracted.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex flex-col items-start p-3 rounded-lg text-left transition-all cursor-pointer ${
                    visibility === 'public'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                    <Globe className="w-3.5 h-3.5 text-[#88BDA4]" aria-hidden="true" />
                    Community Library
                  </span>
                  <span className="text-[11px] text-zinc-400 mt-1">
                    Publish publicly for developers worldwide to discover and solve.
                  </span>
                </button>
              </div>

              {/* Mode-specific content */}
              {visibility === 'temporary' && (
                <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-200">Ready for instant deliberate practice</h3>
                      <p className="mt-1 text-xs text-zinc-400 max-w-xl">
                        Zero setup. As soon as you paste the challenge above, click below to open your isolated 3-column studio workspace with live tests and intelligent feedback.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void saveChallenge()}
                      disabled={!validation?.valid}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#88BDA4] px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                    >
                      <ArrowRight size={16} aria-hidden="true" />
                      Start Temporary Practice
                    </button>
                  </div>
                </div>
              )}

              {visibility === 'private' && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                    <p className="text-xs text-zinc-400">
                      Title and topic are automatically extracted from your challenge. You can keep the defaults or customize them below.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <span className={labelClass}>Challenge Title</span>
                        <input
                          className={fieldClass}
                          maxLength={120}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Auto-extracted title..."
                        />
                      </div>
                      <div>
                        <span className={labelClass}>Topic</span>
                        <input
                          className={fieldClass}
                          maxLength={80}
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="Auto-extracted topic..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible optional reflections for private */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowOptionalReflections(!showOptionalReflections)}
                      className="inline-flex items-center gap-2 text-xs font-medium text-[#88BDA4] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] rounded p-1"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          showOptionalReflections ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>
                        {showOptionalReflections
                          ? 'Hide optional reflections'
                          : '+ Add optional reflections (Why it matters, learning goals, notes)'}
                      </span>
                    </button>

                    {showOptionalReflections && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 pt-2 animate-in fade-in-50 duration-200">
                        <div>
                          <span className={labelClass}>Why this problem matters (Optional)</span>
                          <textarea
                            className={`${fieldClass} min-h-20`}
                            maxLength={2000}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="What real situation inspired it?"
                          />
                        </div>
                        <div>
                          <span className={labelClass}>What should solvers learn? (Optional)</span>
                          <textarea
                            className={`${fieldClass} min-h-20`}
                            maxLength={500}
                            value={learningGoal}
                            onChange={(e) => setLearningGoal(e.target.value)}
                            placeholder="The core skill or invariant to practice."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={saving || !validation?.valid}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#88BDA4] px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                    >
                      <Save size={16} aria-hidden="true" />
                      {saving ? 'Saving...' : 'Save Private Challenge'}
                    </button>
                  </div>
                </div>
              )}

              {visibility === 'public' && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                    <p className="text-xs text-zinc-400">
                      Community challenges are indexed and visible to all developers. Please review title, topic, and summary.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <span className={labelClass}>Title *</span>
                        <input
                          className={fieldClass}
                          required
                          minLength={3}
                          maxLength={120}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Reject expired login tokens"
                        />
                      </div>
                      <div>
                        <span className={labelClass}>Topic *</span>
                        <input
                          className={fieldClass}
                          required
                          maxLength={80}
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="e.g. Authentication"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <span className={labelClass}>Short summary *</span>
                        <textarea
                          className={`${fieldClass} min-h-20`}
                          required
                          minLength={10}
                          maxLength={500}
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          placeholder="A concise description that helps solvers understand what they will practice."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible optional reflections for public */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowOptionalReflections(!showOptionalReflections)}
                      className="inline-flex items-center gap-2 text-xs font-medium text-[#88BDA4] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] rounded p-1"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          showOptionalReflections ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>
                        {showOptionalReflections
                          ? 'Hide optional author reflections'
                          : '+ Add optional reflections (Why it matters, learning goals, explanation, sources)'}
                      </span>
                    </button>

                    {showOptionalReflections && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 pt-2 animate-in fade-in-50 duration-200">
                        <div>
                          <span className={labelClass}>Why this problem matters (Optional)</span>
                          <textarea
                            className={`${fieldClass} min-h-20`}
                            maxLength={2000}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="What real situation inspired it?"
                          />
                        </div>
                        <div>
                          <span className={labelClass}>What should solvers learn? (Optional)</span>
                          <textarea
                            className={`${fieldClass} min-h-20`}
                            maxLength={500}
                            value={learningGoal}
                            onChange={(e) => setLearningGoal(e.target.value)}
                            placeholder="The core skill or invariant to practice."
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <span className={labelClass}>Author explanation shown after solving (Optional)</span>
                          <textarea
                            className={`${fieldClass} min-h-20`}
                            maxLength={8000}
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            placeholder="Explain key architecture decisions and trade-offs."
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <span className={labelClass}>Optional source links, one per line</span>
                          <textarea
                            className={`${fieldClass} min-h-16 font-mono text-xs`}
                            value={sourcesText}
                            onChange={(e) => setSourcesText(e.target.value)}
                            placeholder="Repository files or article URLs. Use Label | https://example.com"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={saving || !validation?.valid}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#88BDA4] px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                    >
                      <Save size={16} aria-hidden="true" />
                      {saving ? 'Publishing...' : 'Publish to Community Library'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </form>

          {error && (
            <p className="mt-4 rounded-lg border border-rose-500/30 px-4 py-3 text-sm text-rose-300" role="alert">
              {error} <Link href="/login" className="underline">Sign in</Link>
            </p>
          )}
          {saved && <p className="mt-4 text-sm text-emerald-300" role="status">Challenge saved successfully.</p>}
        </div>
      </main>
    </div>
  );
}
