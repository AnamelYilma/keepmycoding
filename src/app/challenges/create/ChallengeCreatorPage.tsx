'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Copy, Save } from 'lucide-react';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import { generateChallengeAuthorPrompt } from '@/lib/prompts/master-prompt';

const fieldClass = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-400';
const labelClass = 'mb-1.5 block text-xs font-medium text-zinc-300';

export default function ChallengeCreatorPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'idea' | 'suggest'>('idea');
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [level, setLevel] = useState(4);
  const [promptCopied, setPromptCopied] = useState(false);
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [topic, setTopic] = useState('');
  const [reason, setReason] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [explanation, setExplanation] = useState('');
  const [sourcesText, setSourcesText] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const validation = useMemo(() => rawText.trim() ? validateRawChallenge(rawText) : null, [rawText]);
  const prompt = useMemo(() => generateChallengeAuthorPrompt({ mode, language, level, context }), [mode, language, level, context]);

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

  async function saveChallenge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaved(false);
    if (!validation?.valid) {
      setError('Paste a valid tagged challenge, including its tests and reference solution.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          title,
          summary,
          topic,
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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"><ArrowLeft size={15} aria-hidden="true" /> Challenge Library</Link>
        <header className="mt-5 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Create a challenge</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Bring a real problem or ask the AI to suggest one. Review the task, tests, and solution before sharing it.</p>
        </header>

        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="font-semibold">1. Choose where to start</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setMode('idea')} aria-pressed={mode === 'idea'} className={`rounded-lg border p-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${mode === 'idea' ? 'border-[#88BDA4] bg-zinc-950' : 'border-zinc-700 bg-zinc-950/60 hover:border-zinc-500'}`}>
              <span className="block text-sm font-medium">I have an idea or code</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-400">Start from a bug, technique, project situation, or selected code.</span>
            </button>
            <button type="button" onClick={() => setMode('suggest')} aria-pressed={mode === 'suggest'} className={`rounded-lg border p-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${mode === 'suggest' ? 'border-[#88BDA4] bg-zinc-950' : 'border-zinc-700 bg-zinc-950/60 hover:border-zinc-500'}`}>
              <span className="block text-sm font-medium">Suggest a topic for me</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-400">The AI proposes a topic, then asks what you want to practice.</span>
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]">
            <label><span className={labelClass}>Starting context (optional)</span><textarea className={`${fieldClass} min-h-24`} value={context} onChange={(event) => setContext(event.target.value)} placeholder="What happened, what technique matters, or which code should the AI consider?" /></label>
            <div className="grid gap-4 content-start">
              <label><span className={labelClass}>Target language</span><select className={fieldClass} value={language} onChange={(event) => setLanguage(event.target.value)}>{['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'SQL', 'HTML/CSS'].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span className={labelClass}>Target level</span><select className={fieldClass} value={level} onChange={(event) => setLevel(Number(event.target.value))}>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>Level {index + 1}</option>)}</select></label>
            </div>
          </div>
          <button type="button" onClick={() => void copyPrompt()} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#88BDA4] px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300">
            {promptCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {promptCopied ? 'Prompt copied' : 'Copy interview prompt'}
          </button>
          <p className="mt-2 text-xs text-zinc-500">Send it to your AI chat. It will ask questions, confirm the task with you, and then produce the tagged challenge to paste below.</p>
        </section>

        <form onSubmit={saveChallenge} className="mt-5 space-y-5">
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-semibold">2. Describe the challenge</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label><span className={labelClass}>Title</span><input className={fieldClass} required minLength={3} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Reject expired login tokens" /></label>
              <label><span className={labelClass}>Topic</span><input className={fieldClass} required maxLength={80} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Authentication" /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Short summary</span><textarea className={`${fieldClass} min-h-20`} required minLength={10} maxLength={500} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="A concise description that helps someone decide whether to try it." /></label>
              <label><span className={labelClass}>Why this problem matters</span><textarea className={`${fieldClass} min-h-24`} maxLength={2000} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="What real situation or technique inspired it?" /></label>
              <label><span className={labelClass}>What should solvers learn?</span><textarea className={`${fieldClass} min-h-24`} maxLength={500} value={learningGoal} onChange={(event) => setLearningGoal(event.target.value)} placeholder="The key idea or skill to practice." /></label>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-semibold">3. Add the challenge and author notes</h2>
            <label className="mt-4 block"><span className={labelClass}>Tagged challenge from the AI</span><textarea className={`${fieldClass} min-h-72 font-mono text-xs leading-5`} required value={rawText} onChange={(event) => setRawText(event.target.value)} placeholder="Paste the complete ---METADATA---, ---TASK---, ---FILE---, ---TESTS---, and ---REFERENCE--- response here." /></label>
            {validation && <div className={`mt-3 rounded-lg border p-3 text-xs ${validation.valid ? 'border-emerald-500/30 text-emerald-300' : 'border-amber-500/30 text-amber-200'}`} role="status">{validation.valid ? `Challenge format is valid. ${validation.challenge?.files.filter((file) => !file.isAnswerFile).length ?? 0} files included.` : validation.errors.slice(0, 5).join(' ')}</div>}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className={labelClass}>Author explanation shown after solving</span><textarea className={`${fieldClass} min-h-24`} maxLength={8000} value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Explain the approach, key decisions, and what the solver should take away." /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Optional source links, one per line</span><textarea className={`${fieldClass} min-h-20 font-mono text-xs`} value={sourcesText} onChange={(event) => setSourcesText(event.target.value)} placeholder="Repository files or article URLs. Use Label | https://example.com if you want a custom label." /></label>
            </div>
          </section>

          <section className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <label className="min-w-56"><span className={labelClass}>Who can find this challenge?</span><select className={fieldClass} value={visibility} onChange={(event) => setVisibility(event.target.value as 'private' | 'public')}><option value="private">Private: only me</option><option value="public">Public: challenge library</option></select></label>
            <button type="submit" disabled={saving || !validation?.valid} className="inline-flex items-center gap-2 rounded-lg bg-[#88BDA4] px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-[#9cd1b8] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300">
              <Save size={16} aria-hidden="true" /> {saving ? 'Saving...' : visibility === 'public' ? 'Review and publish' : 'Save private challenge'}
            </button>
          </section>
        </form>
        {error && <p className="mt-4 rounded-lg border border-rose-500/30 px-4 py-3 text-sm text-rose-300" role="alert">{error} <Link href="/login" className="underline">Sign in</Link></p>}
        {saved && <p className="mt-4 text-sm text-emerald-300" role="status">Challenge saved.</p>}
      </div>
    </main>
  );
}
