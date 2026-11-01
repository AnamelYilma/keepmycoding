'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight, Code2, MousePointer2 } from 'lucide-react';
import { INSTRUMENT_STAGES } from './instrument-stages';
import { PracticeInstrument } from './PracticeInstrument';
import { useInstrumentTimeline } from './useInstrumentTimeline';
import './PracticeInstrument.css';

export function PracticeInstrumentLanding() {
  const { activeStage, progress, prefersReducedMotion } = useInstrumentTimeline('practice-instrument');
  const activeStageData = INSTRUMENT_STAGES.find((stage) => stage.id === activeStage) ?? INSTRUMENT_STAGES[0];

  return (
    <main className="instrument-page" id="top">
      <header className="instrument-header">
        <Link className="instrument-brand" href="/" aria-label="KeepCoding home">
          <span className="instrument-brand__mark"><Code2 size={16} aria-hidden="true" /></span>
          <span>KeepCoding</span>
        </Link>
        <nav className="instrument-nav" aria-label="Landing page navigation">
          <a href="#practice-instrument">The instrument</a>
          <Link href="/studio">Enter studio <ArrowRight size={14} aria-hidden="true" /></Link>
        </nav>
      </header>

      <section className="instrument-intro" aria-labelledby="instrument-title">
        <div className="instrument-intro__copy">
          <p className="instrument-label">LANDING PAGE 1 / DELIBERATE PRACTICE</p>
          <h1 id="instrument-title">The code is not the practice.</h1>
          <p className="instrument-intro__lead">
            The practice is the decision you make before the code looks obvious.
            KeepCoding gives that decision a place to sharpen.
          </p>
          <div className="instrument-intro__meta">
            <span><MousePointer2 size={14} aria-hidden="true" /> Scroll to operate</span>
            <span>04 stages / 01 useful habit</span>
          </div>
        </div>
        <div className="instrument-intro__signal" aria-hidden="true">
          <span className="instrument-intro__signal-line" />
          <span className="instrument-intro__signal-dot" />
          <span className="instrument-intro__signal-copy">retrieve / reason / retain</span>
        </div>
      </section>

      <section id="practice-instrument" className="instrument-stage-section" aria-labelledby="instrument-stage-title">
        <div className="instrument-stage-section__sticky">
          <div className="instrument-stage-section__heading">
            <div>
              <p className="instrument-label">THE PRACTICE INSTRUMENT</p>
              <h2 id="instrument-stage-title">{activeStageData.title}</h2>
            </div>
            <p>{activeStageData.detail}</p>
          </div>
          <PracticeInstrument activeStage={activeStage} progress={progress} />
          <div className="instrument-stage-section__footer">
            <span>{prefersReducedMotion ? 'Static sequence enabled' : `Scroll position ${Math.round(progress * 100)}%`}</span>
            <span>{activeStageData.label}</span>
          </div>
        </div>
      </section>

      <section className="instrument-resolution" aria-labelledby="resolution-title">
        <div className="instrument-resolution__mark">/ 04</div>
        <div>
          <p className="instrument-label">WHEN THE LOOP CLOSES</p>
          <h2 id="resolution-title">You leave with more than a passing line.</h2>
          <p>
            You leave knowing why the line passes, where it could break, and what to look for next time.
            That is the part an answer generator cannot practice for you.
          </p>
        </div>
        <Link className="instrument-cta" href="/studio">
          Enter the practice studio
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <footer className="instrument-footer">
        <span>KeepCoding / deliberate hands-on practice</span>
        <a href="#top"><ArrowDown size={14} className="instrument-footer__up" aria-hidden="true" /> Back to top</a>
      </footer>
    </main>
  );
}
