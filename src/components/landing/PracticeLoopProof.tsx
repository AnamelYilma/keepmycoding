import { ArrowDownToLine, Code2, ShieldCheck } from 'lucide-react';

const PROOF_POINTS = [
  {
    icon: ArrowDownToLine,
    title: 'Bring your own challenge',
    description: 'Generate a structured prompt in the tool you already use, then bring the contract here.',
  },
  {
    icon: Code2,
    title: 'Write in a focused workspace',
    description: 'Read the task, inspect locked context, and solve across files without the noise of a full app.',
  },
  {
    icon: ShieldCheck,
    title: 'Get a private verdict',
    description: 'Submit for a clear PASS or FAIL breakdown without exposing your provider credentials.',
  },
] as const;

export function PracticeLoopProof() {
  return (
    <section className="practice-proof" aria-labelledby="practice-proof-title">
      <div className="practice-proof__heading">
        <p className="practice-kicker">The instrument</p>
        <h2 id="practice-proof-title">A smaller loop makes better instincts.</h2>
        <p>
          KeepCoding removes the ceremony around practice so the useful part stays visible:
          the moment you decide what the code should do, then prove it.
        </p>
      </div>

      <div className="practice-proof__list">
        {PROOF_POINTS.map(({ icon: Icon, title, description }, index) => (
          <article key={title} className="practice-proof__item">
            <div className="practice-proof__number">0{index + 1}</div>
            <Icon className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
