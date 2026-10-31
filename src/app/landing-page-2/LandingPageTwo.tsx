'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Code2, LockKeyhole } from 'lucide-react';
import { SAMPLE_CHALLENGES } from '@/lib/sample-challenges';
import { validateRawChallenge } from '@/lib/parser/challenge-validator';
import './landing-page-two.css';

const sample = SAMPLE_CHALLENGES[0];
const parsedSample = validateRawChallenge(sample.raw);
const challenge = parsedSample.valid ? parsedSample.challenge : undefined;
const editableFile = challenge?.files.find((file) => file.isEditable);
const readOnlyFile = challenge?.files.find((file) => !file.isEditable);

const stages = [
  {
    id: 'challenge',
    title: 'A problem worth thinking through.',
    description:
      'Choose a track and level. Bring a structured challenge from an AI you already use, or start with a built-in sample.',
  },
  {
    id: 'write',
    title: 'Make the change yourself.',
    description:
      'Read the contract, inspect the files, and write your solution in the isolated editor. Companion files stay locked.',
  },
  {
    id: 'review',
    title: 'See where your reasoning lands.',
    description:
      'Submit your code for a verdict, a test breakdown, and actionable advice from the private judge.',
  },
] as const;

export default function LandingPageTwo() {
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopLayout = window.matchMedia('(min-width: 900px)');

    if (reducedMotion.matches || !desktopLayout.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (current) {
          setActiveStage(Number((current.target as HTMLElement).dataset.stageIndex));
        }
      },
      { rootMargin: '-30% 0px -38% 0px', threshold: [0, 0.15, 0.4, 0.7] },
    );

    stageRefs.current.forEach((stage) => {
      if (stage) observer.observe(stage);
    });

    return () => observer.disconnect();
  }, []);

  const goToStage = (index: number) => {
    setActiveStage(index);
    stageRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <main id="top" className="lp2-page">
      <header className="lp2-header">
        <Link className="lp2-brand" href="/" aria-label="KeepCoding home">
          <span className="lp2-brandMark" aria-hidden="true"><Code2 size={17} strokeWidth={1.8} /></span>
          <span>KeepCoding</span>
        </Link>
        <nav className="lp2-nav" aria-label="Page navigation">
          <a href="#practice-loop">The practice loop</a>
          <a href="#principle">Why write by hand</a>
        </nav>
        <Link className="lp2-headerAction" href="/">
          Open practice <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>

      <section className="lp2-hero" aria-labelledby="hero-title">
        <div className="lp2-heroCopy">
          <h1 id="hero-title">Keep your coding <span>intuition sharp.</span></h1>
          <p>
            A place to think through the problem, write the code yourself, and find out what holds up.
          </p>
          <div className="lp2-heroActions">
            <Link className="lp2-primaryAction" href="/">
              Start a practice session <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a className="lp2-textAction" href="#practice-loop">
              Follow the loop <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
          <p className="lp2-openSourceNote">Open source. Built for deliberate practice.</p>
        </div>

        <div className="lp2-heroCode" aria-label="Example from the built-in token expiration challenge">
          <div className="lp2-codeWindowBar">
            <span className="lp2-fileName">{editableFile?.path ?? 'src/token-validator.ts'}</span>
            <span className="lp2-codeLanguage">TypeScript</span>
          </div>
          <div className="lp2-heroCodeBody">
            <span className="lp2-lineNumber">08</span>
            <code><span className="lp2-codeKeyword">return</span> token.exp <span className="lp2-codeBug">&gt;=</span> currentTimestampSec;</code>
          </div>
          <div className="lp2-codeCaption">
            <span className="lp2-codeMarker" />
            <span>The challenge is to catch the reversed comparison.</span>
          </div>
          <div className="lp2-heroCodeFoot">
            <span>Track {sample.track} / Level {sample.level}</span>
            <span>Built-in sample</span>
          </div>
        </div>
        <a href="#practice-loop" className="lp2-scrollCue" aria-label="Scroll to see the practice loop">
          <span>Scroll to follow the work</span><ArrowDown size={16} aria-hidden="true" />
        </a>
      </section>

      <section id="practice-loop" className="lp2-loopSection" aria-labelledby="loop-title">
        <div className="lp2-sectionHeading">
          <h2 id="loop-title">Less watching. More working.</h2>
          <p>One focused loop, from a clear contract to useful feedback.</p>
        </div>

        <div className="lp2-loopLayout">
          <div className="lp2-story">
            {stages.map((stage, index) => (
              <article
                className="lp2-storyStep"
                id={`stage-${stage.id}`}
                key={stage.id}
                data-stage-index={index}
                data-active={activeStage === index}
                ref={(element) => { stageRefs.current[index] = element; }}
                aria-labelledby={`stage-title-${stage.id}`}
              >
                <span className="lp2-storyLabel">{stage.id === 'write' ? 'Your workspace' : stage.id === 'review' ? 'Your result' : 'Your challenge'}</span>
                <h3 id={`stage-title-${stage.id}`}>{stage.title}</h3>
                <p>{stage.description}</p>
                <button
                  type="button"
                  className="lp2-focusAction"
                  onClick={() => goToStage(index)}
                  aria-pressed={activeStage === index}
                >
                  Focus this part <ArrowRight size={14} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>

          <div className="lp2-sceneColumn">
            <div className="lp2-sceneSticky">
              <div className="lp2-sceneHeader">
                <div className="lp2-sceneTitle">
                  <span className="lp2-sceneMark"><Code2 size={15} aria-hidden="true" /></span>
                  <span>Practice workspace</span>
                </div>
                <span className="lp2-sceneMeta">Track {sample.track} <i /> Level {sample.level}</span>
              </div>

              <div className="lp2-sceneGrid" data-stage={activeStage}>
                <section className="lp2-panel lp2-challengePanel" aria-labelledby="demo-challenge-title">
                  <div className="lp2-panelTopline">Challenge</div>
                  <h3 id="demo-challenge-title">JWT expiration fix</h3>
                  <p>{challenge?.task ?? 'Fix the reversed timestamp comparison so expired tokens are rejected.'}</p>
                  <div className="lp2-contract">
                    <span>Contract</span>
                    <code>exp at or before now → expired</code>
                  </div>
                  <div className="lp2-readOnlyFile"><LockKeyhole size={13} aria-hidden="true" /><span>{readOnlyFile?.path ?? 'Read-only companion file'}</span><span>read only</span></div>
                </section>

                <section className="lp2-panel lp2-editorPanel" aria-labelledby="demo-editor-title">
                  <div className="lp2-panelTopline">Write by hand</div>
                  <div className="lp2-editorTab" id="demo-editor-title">
                    <span className="lp2-fileDot" />{editableFile?.path ?? 'src/token-validator.ts'}
                  </div>
                  <pre className="lp2-editorCode" aria-label="The sample function containing the bug"><code>
                    <span className="lp2-editorLine"><i>1</i><b>export function</b> isTokenExpired(</span>
                    <span className="lp2-editorLine"><i>2</i>  token: TokenPayload,</span>
                    <span className="lp2-editorLine"><i>3</i>  currentTimestampSec: number</span>
                    <span className="lp2-editorLine"><i>4</i>): boolean {'{'}</span>
                    <span className="lp2-editorLine lp2-activeCodeLine"><i>5</i>  return token.exp <em>&gt;=</em> currentTimestampSec;</span>
                    <span className="lp2-editorLine"><i>6</i>{'}'}</span>
                  </code></pre>
                  <div className="lp2-editorHint">You make the change. KeepCoding never replaces your code.</div>
                </section>

                <section className="lp2-panel lp2-judgePanel" aria-labelledby="demo-judge-title">
                  <div className="lp2-panelTopline">Private judge</div>
                  <h3 id="demo-judge-title">Feedback follows your submission.</h3>
                  <p>Check your implementation against the challenge tests and get a clear explanation.</p>
                  <div className="lp2-judgeRows">
                    <div><span>Verdict</span><b>After submit</b></div>
                    <div><span>Breakdown</span><b>Test by test</b></div>
                    <div><span>Advice</span><b>Actionable</b></div>
                  </div>
                  <div className="lp2-judgeFoot">No result is shown until code is submitted.</div>
                </section>
              </div>

              <div className="lp2-sceneRail" aria-label={`Focused stage: ${stages[activeStage].id}`}>
                {stages.map((stage, index) => (
                  <button
                    key={stage.id}
                    type="button"
                    className="lp2-railStep"
                    data-active={activeStage === index}
                    onClick={() => goToStage(index)}
                    aria-label={`Show ${stage.id} stage`}
                    aria-pressed={activeStage === index}
                  >
                    <span />{stage.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="principle" className="lp2-principle" aria-labelledby="principle-title">
        <div className="lp2-principleMark" aria-hidden="true">{'{ }'}</div>
        <div>
          <h2 id="principle-title">Understanding grows when you do the work.</h2>
          <p>KeepCoding gives you the task, the space to solve it, and a judge to review the result. The solution stays yours.</p>
        </div>
        <Link className="lp2-primaryAction" href="/">
          Open practice <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <footer className="lp2-footer">
        <Link className="lp2-brand" href="/" aria-label="KeepCoding home">
          <span className="lp2-brandMark" aria-hidden="true"><Code2 size={16} strokeWidth={1.8} /></span>
          <span>KeepCoding</span>
        </Link>
        <p>Deliberate, hands-on coding practice.</p>
        <a href="#top" className="lp2-backToTop">Back to top <ArrowDown size={14} aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
