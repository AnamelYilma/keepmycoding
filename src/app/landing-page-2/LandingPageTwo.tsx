'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Code2, LockKeyhole, RotateCcw } from 'lucide-react';
import './landing-page-two.css';

const checks = [
  { exp: 1000, now: 1500, expected: true, label: 'Already expired' },
  { exp: 2000, now: 1500, expected: false, label: 'Still active' },
];

export default function LandingPageTwo() {
  const sceneRef = useRef<HTMLElement>(null);
  const [operator, setOperator] = useState('>=');
  const [sceneReady, setSceneReady] = useState(false);
  const results = checks.map(({ exp, now }) => operator === '>=' ? exp >= now : exp <= now);
  const matches = results.filter((result, index) => result === checks[index].expected).length;

  useEffect(() => {
    setSceneReady(true);
    const scene = sceneRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 760px)');
    if (!scene || reduceMotion.matches || compact.matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = scene.getBoundingClientRect();
        const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
        scene.style.setProperty('--run-progress', String(Math.max(0, Math.min(1, -bounds.top / travel))));
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return (
    <main className="lp2-page" id="top">
      <header className="lp2-header">
        <Link className="lp2-brand" href="/" aria-label="KeepCoding home"><span className="lp2-brandMark"><Code2 size={17} /></span><span>KeepCoding</span></Link>
        <span className="lp2-variant">Landing 02 <i /> Counterexample Engine</span>
        <nav className="lp2-nav" aria-label="On this page"><a href="#practice">How it works</a><a href="#tracks">Practice tracks</a><Link href="/login">Sign in</Link></nav>
        <div className="lp2-headerActions"><Link className="lp2-headerSignIn" href="/login">Sign in</Link><Link className="lp2-headerAction" href="/studio">Open practice <ArrowRight size={15} /></Link></div>
      </header>

      <section className="lp2-hero" aria-labelledby="lp2-title">
        <div className="lp2-heroCopy">
          <p className="lp2-heroLabel"><span /> HANDS-ON CODING PRACTICE / LANDING 02</p>
          <h1 id="lp2-title"><span>Ask an AI</span><span>for a challenge.</span><span className="lp2-headlineAccent">Solve it yourself.</span></h1>
          <p className="lp2-heroLead">KeepCoding gives you a clear task and a place to work it out. Write the solution by hand, then see how it handled the tests.</p>
          <div className="lp2-heroActions"><Link className="lp2-cta" href="/studio">Open practice <ArrowRight size={17} /></Link><a className="lp2-start" href="#practice">See how it works <ArrowDown size={15} /></a></div>
        </div>
        <div className="lp2-heroArtifact" aria-label="A token expiration check showing past, now, and future timestamps">
          <div className="lp2-artifactTop"><span>CASE FILE / 001</span><span>JWT EXPIRATION</span></div>
          <div className="lp2-clockFace">
            <div className="lp2-clockLine" />
            <div className="lp2-tick lp2-tickPast"><span>1,000</span><i /><b>EXPIRED</b></div>
            <div className="lp2-tick lp2-tickNow"><span>1,500</span><i /><b>NOW</b></div>
            <div className="lp2-tick lp2-tickFuture"><span>2,000</span><i /><b>ACTIVE</b></div>
            <div className="lp2-clockReadout"><small>THE CONDITION SAYS</small><code>exp <em>&gt;=</em> now</code><span>Which side of “now” is still valid?</span></div>
          </div>
          <div className="lp2-artifactBottom"><span>Track 1 / Level 2</span><span>THE BUG IS IN THE COMPARISON <ArrowDown size={13} /></span></div>
          <div className="lp2-specimenGhost" aria-hidden="true">01</div>
        </div>
        <a href="#practice" className="lp2-scrollHint">See the practice <ArrowDown size={14} /></a>
      </section>

      <section id="practice" className="lp2-fieldNotes" aria-labelledby="lp2-field-title">
        <div className="lp2-sectionTop"><span>THE PRACTICE LOOP <i /> BUILT AROUND YOUR ATTEMPT</span><span>UNDERSTAND / IMPLEMENT / REVIEW</span></div>
        <div className="lp2-fieldIntro"><h2 id="lp2-field-title">Reading a fix<br /><span>isn’t making one.</span></h2><p>The practice is in the attempt: unpack the task, inspect its files, decide what to change, and write the solution yourself. KeepCoding keeps the instructions and test cases beside your code.</p></div>
        <div className="lp2-workSequence" aria-label="The KeepCoding practice sequence">
          <article><span className="lp2-sequenceNo">01</span><div><h3>Understand the task.</h3><p>Read the acceptance criteria, inspect editable and reference files, and work out what the tests require.</p></div><span className="lp2-sequenceSymbol">READ</span></article>
          <article><span className="lp2-sequenceNo">02</span><div><h3>Write the implementation.</h3><p>Use the browser editor to make the change. KeepCoding does not fill in or replace your solution.</p></div><span className="lp2-sequenceSymbol">WRITE</span></article>
          <article><span className="lp2-sequenceNo">03</span><div><h3>Learn from the result.</h3><p>Submit your code to see a verdict, test breakdown, and advice from the judge.</p></div><span className="lp2-sequenceSymbol">REVIEW</span></article>
        </div>
      </section>

      <section className="lp2-caseSection" aria-labelledby="lp2-case-title">
        <div className="lp2-caseIntro"><p>START WITH THE BUILT-IN SAMPLE</p><h2 id="lp2-case-title">Let the tests define “expired.”</h2><p>The JWT challenge gives you two concrete cases. An expiration time in the past must count as expired. A time in the future must remain active. Your job is to make the implementation match both.</p></div>
        <div className="lp2-timeStudy">
          <div className="lp2-timeCaption"><span>THE TESTS SET THE CONTRACT</span><span>UNIX SECONDS</span></div>
          <div className="lp2-timeLine"><div className="lp2-timeTrack"/><div className="lp2-timePoint lp2-timePointPast"><b>exp: 1000</b><i/><span>Token expired</span><strong>Expected: true</strong></div><div className="lp2-timePoint lp2-timePointNow"><b>now: 1500</b><i/><span>Current time</span><strong>Reference point</strong></div><div className="lp2-timePoint lp2-timePointFuture"><b>exp: 2000</b><i/><span>Token active</span><strong>Expected: false</strong></div></div>
          <div className="lp2-timeFoot"><span>Read the examples before you rewrite the rule.</span><code>isTokenExpired(token, now)</code></div>
        </div>
      </section>

      <section className="lp2-run" id="experiment" ref={sceneRef} aria-labelledby="lp2-run-title" data-ready={sceneReady}>
        <div className="lp2-runSticky">
          <div className="lp2-runIntro">
            <div><p className="lp2-chapter">TRY IT YOURSELF</p><h2 id="lp2-run-title">Can you fix the rule<br />without seeing the answer?</h2></div>
            <p>Use the two test cases to check your reasoning. The preview runs in this page. Your solution is still yours to write.</p>
          </div>
          <div className="lp2-experiment">
            <div className="lp2-codeField">
              <div className="lp2-fieldHead"><span>isTokenExpired</span><span>EDIT THE OPERATOR</span></div>
              <div className="lp2-expression"><span>token.exp</span><button type="button" className="lp2-operator" onClick={() => setOperator((current) => current === '>=' ? '<=' : '>=')} aria-label={`Change comparison operator, currently ${operator}`}>{operator}</button><span>now</span></div>
              <p>Choose the condition that matches the function’s contract.</p>
              <div className="lp2-feedback" aria-live="polite"><span className={matches === 2 ? 'lp2-good' : 'lp2-bad'}>{matches === 2 ? 'Both cases match.' : `${matches} of 2 cases match.`}</span><span>{matches === 2 ? 'The rule holds.' : 'The rule breaks.'}</span></div>
            </div>
            <div className="lp2-cases" aria-label="Sample challenge test cases">
              <div className="lp2-casesHead"><span>CHALLENGE CASES</span><span>EXPECTED</span><span>THIS RULE</span></div>
              {checks.map((check, index) => <div className="lp2-case" key={check.label}><div className="lp2-caseName"><span>{check.label}</span><code>exp {check.exp} / now {check.now}</code></div><strong>{String(check.expected)}</strong><strong className={results[index] === check.expected ? 'lp2-good' : 'lp2-bad'}>{String(results[index])}<span className="lp2-caseStatus">{results[index] === check.expected ? 'MATCH' : 'MISMATCH'}</span></strong></div>)}
              <p className="lp2-localNote">Local preview of the documented sample cases. Nothing is submitted to the judge.</p>
            </div>
          </div>
          <div className="lp2-runRail" aria-hidden="true"><span/><span/><span/><i/></div>
        </div>
      </section>

      <section className="lp2-workspaceSection" aria-labelledby="lp2-workspace-title">
        <div className="lp2-workspaceHeading"><p className="lp2-chapter">THE WORKSPACE</p><h2 id="lp2-workspace-title">The task stays beside<br /><span>the code you write.</span></h2><p>Read instructions, switch between challenge files, write in the editor, and submit when you are ready. Reference files stay read-only. No solution is inserted for you.</p></div>
        <div className="lp2-workbench" aria-label="Illustration of the KeepCoding workspace">
          <div className="lp2-workbenchBar"><span className="lp2-workbenchBrand"><Code2 size={15}/> KeepCoding <i/> Workspace</span><span>TRACK 1 / LEVEL 2</span><Link href="/studio">OPEN PRACTICE <ArrowRight size={13}/></Link></div>
          <div className="lp2-workbenchGrid">
            <section className="lp2-pane lp2-taskPane"><div className="lp2-paneTop"><span>CHALLENGE</span><span>01</span></div><h3>JWT expiration fix</h3><p>Fix the timestamp comparison so expired tokens are rejected.</p><div className="lp2-paneRule"/><b>What to check</b><code>exp: 1000, now: 1500<br/>Expected: true</code><code>exp: 2000, now: 1500<br/>Expected: false</code><div className="lp2-locked"><LockKeyhole size={13}/> src/types.ts <span>READ ONLY</span></div></section>
            <section className="lp2-pane lp2-editorPane"><div className="lp2-paneTop"><span>EDITOR / YOUR CODE</span><span>TypeScript</span></div><div className="lp2-editorTab"><i/> src/token-validator.ts <span>●</span></div><pre><code><span><i>1</i><b>export function</b> isTokenExpired(</span><span><i>2</i>  token: TokenPayload,</span><span><i>3</i>  currentTimestampSec: number</span><span><i>4</i>): boolean {'{'}</span><span className="lp2-codeFocus"><i>5</i>  return token.exp <em>{operator}</em> currentTimestampSec;</span><span><i>6</i>{'}'}</span></code></pre><div className="lp2-editorBottom"><span>Write the fix by hand.</span><span>Nothing gets replaced for you.</span></div></section>
            <section className="lp2-pane lp2-resultPane"><div className="lp2-paneTop"><span>JUDGE FEEDBACK</span><span>AFTER SUBMIT</span></div><div className="lp2-emptyJudge"><div className="lp2-judgeGlyph"><Code2 size={17}/></div><h3>Your work goes here.</h3><p>Submit your implementation to see its verdict, test breakdown, and actionable advice.</p><div className="lp2-judgeSkeleton"><i/><i/><i/></div></div><div className="lp2-submitMock"><span>Submit solution</span><ArrowRight size={13}/></div></section>
          </div>
          <div className="lp2-workbenchFoot"><span>THE EDITOR WAITS FOR YOU.</span><span>CODE IS NEVER WRITTEN ON YOUR BEHALF.</span></div>
        </div>
      </section>

      <section className="lp2-setupSection" id="tracks" aria-labelledby="lp2-setup-title">
        <div className="lp2-setupCopy"><p className="lp2-chapter">A PRACTICE PLAN YOU CAN SHAPE</p><h2 id="lp2-setup-title">Choose what you<br />want to work on.</h2><p>Pick a track and level, then choose the kind of exercise and language you want to work in. KeepCoding creates a prompt for an AI you choose. Paste the structured challenge back here, or open the built-in sample.</p><p className="lp2-optionsNote">Choose from 7 challenge types, including Write, Fix, Explain, and Edge cases. Practice in TypeScript, JavaScript, Python, Go, or HTML/CSS. Difficulty runs from level 1 to 12.</p><Link className="lp2-textLink" href="/studio">Choose a practice challenge <ArrowRight size={15}/></Link></div>
        <div className="lp2-promptArtifact"><div className="lp2-promptTop"><span>FOUR PRACTICE TRACKS</span><span>01 TO 04</span></div>
          <div className="lp2-trackList">
            <div><span>01</span><b>Identity &amp; access</b><small>Tokens, sessions, permissions</small></div>
            <div><span>02</span><b>Interactive UI &amp; state</b><small>Events, state, async updates</small></div>
            <div><span>03</span><b>APIs &amp; persistence</b><small>Endpoints, data, transactions</small></div>
            <div><span>04</span><b>Data security</b><small>Validation, injection, integrity</small></div>
          </div>
          <div className="lp2-levelRange"><b>12 difficulty levels</b><span>From pure functions to production edge cases</span></div>
          <div className="lp2-promptFoot"><span>7 challenge types · 5 languages · your choice of AI</span><ArrowRight size={15}/></div>
        </div>
      </section>

      <section className="lp2-feedbackSection" aria-labelledby="lp2-feedback-title">
        <div className="lp2-feedbackCopy"><p className="lp2-chapter">AFTER YOU SUBMIT</p><h2 id="lp2-feedback-title">Find out what passed.<br />Find out what needs work.</h2><p>Your submitted files go to KeepCoding’s server-side judge for evaluation against the challenge. Review the verdict, test-by-test breakdown, and advice, then decide what to revise.</p><div className="lp2-feedbackList"><span><i/> Verdict</span><span><i/> Test breakdown</span><span><i/> Actionable advice</span></div></div>
        <div className="lp2-resultArtifact"><div className="lp2-resultTop"><span>SUBMISSION REVIEW</span><span>YOUR CODE / YOUR RESULT</span></div><div className="lp2-resultBody"><div className="lp2-resultState"><span className="lp2-resultMark"><RotateCcw size={16}/></span><div><b>Review what happened.</b><span>The verdict appears after you submit.</span></div></div><div className="lp2-resultLine"><span>01</span><i/><b>Verdict</b><span>Judge evaluation</span></div><div className="lp2-resultLine"><span>02</span><i/><b>Breakdown</b><span>Tests, one by one</span></div><div className="lp2-resultLine"><span>03</span><i/><b>Advice</b><span>Where to look next</span></div></div><div className="lp2-resultFoot">NO PREWRITTEN ANSWER. JUST FEEDBACK ON YOUR SUBMISSION.</div></div>
      </section>

      <section className="lp2-close" aria-labelledby="lp2-close-title"><div className="lp2-closeMark" aria-hidden="true">{'{ }'}</div><div><p className="lp2-chapter">OPEN SOURCE / NO ACCOUNT REQUIRED</p><h2 id="lp2-close-title">Do one useful rep today.</h2><p>Choose the JWT sample challenge or bring one of your own. Read the tests, write your solution, and review the result.</p><div className="lp2-closeDetails"><span>Practice history is stored in this browser.</span><span>No account needed.</span></div></div><Link className="lp2-cta" href="/studio">Open practice <ArrowRight size={17}/></Link></section>
      <footer className="lp2-footer"><Link className="lp2-brand" href="/"><span className="lp2-brandMark"><Code2 size={16}/></span><span>KeepCoding</span></Link><span>Deliberate, hands-on coding practice.</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
