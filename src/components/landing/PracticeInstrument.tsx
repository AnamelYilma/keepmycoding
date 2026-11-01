'use client';

import { CheckCircle2, Code2, FileCode2, LockKeyhole, ShieldCheck } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { InstrumentStageId } from './instrument-stages';

interface PracticeInstrumentProps {
  activeStage: InstrumentStageId;
  progress: number;
}

const STAGE_ORDER: InstrumentStageId[] = ['read', 'think', 'write', 'verify'];

export function PracticeInstrument({ activeStage, progress }: PracticeInstrumentProps) {
  const activeIndex = STAGE_ORDER.indexOf(activeStage);
  const showVerdict = activeStage === 'verify';
  const instrumentStyle = {
    '--instrument-x': `${Math.round(progress * 2.5)}rem`,
    '--instrument-y': `${Math.round(progress * -1.5)}rem`,
  } as CSSProperties;

  return (
    <div className="instrument-shell" style={instrumentStyle} aria-label="Interactive KeepCoding practice instrument">
      <div className="instrument-shell__chrome">
        <div className="instrument-shell__identity">
          <span className="instrument-shell__led" aria-hidden="true" />
          <span>KEEP / PRACTICE INSTRUMENT</span>
        </div>
        <span className="instrument-shell__counter">0{activeIndex + 1} / 04</span>
      </div>

      <div className="instrument-shell__rail" aria-label="Practice stages">
        {STAGE_ORDER.map((stage, index) => (
          <div
            key={stage}
            className={`instrument-stage-mark ${index === activeIndex ? 'instrument-stage-mark--active' : ''}`}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            <span>0{index + 1}</span>
            <i aria-hidden="true" />
            <span>{stage}</span>
          </div>
        ))}
      </div>

      <div className="instrument-planes">
        <section className="instrument-plane instrument-plane--brief" aria-labelledby="instrument-brief-title">
          <div className="instrument-plane__header">
            <span>01 / task contract</span>
            <FileCode2 size={15} aria-hidden="true" />
          </div>
          <h2 id="instrument-brief-title">Reject expired tokens.</h2>
          <p>Fix the timestamp comparison without changing the public function contract.</p>
          <div className="instrument-contract">
            <span>CONTRACT</span>
            <code>exp &lt;= now -&gt; expired</code>
          </div>
        </section>

        <section className="instrument-plane instrument-plane--code" aria-labelledby="instrument-code-title">
          <div className="instrument-plane__header">
            <span id="instrument-code-title">02 / src/token-validator.ts</span>
            <span className="instrument-file-state">editable</span>
          </div>
          <div className="instrument-code">
            <span className="instrument-code__number">08</span>
            <code>
              <span className="instrument-code__keyword">return</span>{' '}
              token.exp <span className="instrument-code__bug">&gt;=</span> currentTimestampSec;
            </code>
          </div>
          <div className="instrument-code__note">
            <span className="instrument-code__pin" aria-hidden="true" />
            <span>{activeStage === 'read' ? 'A real line from the built-in challenge.' : 'The boundary is asking for your attention.'}</span>
          </div>
        </section>

        <section className="instrument-plane instrument-plane--context" aria-labelledby="instrument-context-title">
          <div className="instrument-plane__header">
            <span id="instrument-context-title">03 / context</span>
            <LockKeyhole size={14} aria-hidden="true" />
          </div>
          <div className="instrument-context__file">
            <LockKeyhole size={14} aria-hidden="true" />
            <span>src/config.ts</span>
            <small>read only</small>
          </div>
          <div className="instrument-context__test">
            <span>boundary test</span>
            <code>exp === now</code>
            <strong className={activeStage === 'think' ? 'instrument-context__test--hot' : ''}>must fail</strong>
          </div>
        </section>

        <section className={`instrument-plane instrument-plane--verdict ${showVerdict ? 'instrument-plane--verdict-visible' : ''}`} aria-labelledby="instrument-verdict-title">
          <div className="instrument-plane__header">
            <span id="instrument-verdict-title">04 / private judge</span>
            <ShieldCheck size={15} aria-hidden="true" />
          </div>
          <div className="instrument-verdict__result">
            {showVerdict ? (
              <CheckCircle2 size={28} aria-hidden="true" />
            ) : (
              <Code2 size={25} aria-hidden="true" />
            )}
            <strong>{showVerdict ? 'PASS' : 'WAITING'}</strong>
          </div>
          <p>{showVerdict ? 'The contract holds. Keep the boundary in your mental model.' : 'The verdict arrives after the decision.'}</p>
        </section>
      </div>

      <div className="instrument-shell__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}
