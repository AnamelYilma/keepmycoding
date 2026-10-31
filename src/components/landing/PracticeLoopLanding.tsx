'use client';

import { BookOpen, Code2, History, ShieldCheck } from 'lucide-react';
import { LANDING_STAGES } from './landing-stages';
import { PracticeLoopArtifact } from './PracticeLoopArtifact';
import { PracticeLoopProof } from './PracticeLoopProof';
import { PracticeLoopStages } from './PracticeLoopStages';
import { usePracticeLoop } from './usePracticeLoop';

interface PracticeLoopLandingProps {
  onStartSample: () => void;
  onOpenHowItWorks: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export function PracticeLoopLanding({
  onStartSample,
  onOpenHowItWorks,
  onOpenHistory,
  historyCount,
}: PracticeLoopLandingProps) {
  const { activeStage, progress, prefersReducedMotion } = usePracticeLoop();
  const activeStageData = LANDING_STAGES.find((stage) => stage.id === activeStage) ?? LANDING_STAGES[0];

  return (
    <div className="practice-page">
      <header className="practice-header">
        <a className="practice-brand" href="#top" aria-label="KeepCoding home">
          <span className="practice-brand__mark">
            <Code2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>KeepCoding</span>
        </a>

        <nav className="practice-nav" aria-label="Main navigation">
          <a href="#loop">The loop</a>
          <button type="button" onClick={onOpenHowItWorks}>
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            How it works
          </button>
          <button type="button" onClick={onOpenHistory}>
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && <span className="practice-nav__count">{historyCount}</span>}
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="practice-hero" aria-labelledby="practice-hero-title">
          <div className="practice-hero__copy">
            <p className="practice-kicker">Deliberate practice for working code</p>
            <h1 id="practice-hero-title">
              Keep your coding intuition <em>sharp.</em>
            </h1>
            <p className="practice-hero__lede">
              Read the contract. Think through the edge cases. Write the solution yourself.
              KeepCoding gives that loop a focused place to happen.
            </p>
            <div className="practice-hero__actions">
              <button type="button" className="practice-button practice-button--primary" onClick={onStartSample}>
                Start a sample challenge
                <span aria-hidden="true">-&gt;</span>
              </button>
              <a className="practice-button practice-button--quiet" href="#loop">
                See the practice loop
              </a>
            </div>
            <div className="practice-hero__note">
              <ShieldCheck className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span>No registration. No provider keys in the browser.</span>
            </div>
          </div>

          <div className="practice-hero__aside" aria-label="Practice loop preview">
            <div className="practice-hero__aside-label">
              <span>an active coding loop</span>
              <span className="font-mono text-zinc-600">keep / 001</span>
            </div>
            <div className="practice-hero__rule" />
            <p>
              The fastest way to lose a skill is to stop retrieving it. The fastest way to keep
              one is to make the next decision yourself.
            </p>
            <div className="practice-hero__aside-footer">
              <span>Scroll to enter</span>
              <span className="practice-scroll-mark" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="loop" className="practice-loop-scroll" aria-labelledby="practice-loop-title">
          <div className="practice-loop-scroll__inner">
            <div className="practice-loop-scroll__intro">
              <p className="practice-kicker">The practice loop</p>
              <h2 id="practice-loop-title">Four moves. One useful habit.</h2>
            </div>
            <div className="practice-loop-scroll__grid">
              <PracticeLoopStages
                activeStage={activeStage}
                prefersReducedMotion={prefersReducedMotion}
              />
              <PracticeLoopArtifact
                stage={activeStageData}
                activeStage={activeStage}
                progress={progress}
              />
            </div>
          </div>
        </section>

        <PracticeLoopProof />

        <section className="practice-final-cta" aria-labelledby="practice-final-title">
          <div>
            <p className="practice-kicker">Make the next rep count</p>
            <h2 id="practice-final-title">Your next challenge is already waiting.</h2>
          </div>
          <button type="button" className="practice-button practice-button--primary" onClick={onStartSample}>
            Open the sample workspace
            <span aria-hidden="true">-&gt;</span>
          </button>
        </section>
      </main>

      <footer className="practice-footer">
        <span>KeepCoding: deliberate hands-on practice for developers.</span>
        <span className="font-mono">build your instinct</span>
      </footer>
    </div>
  );
}
