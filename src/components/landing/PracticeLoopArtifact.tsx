'use client';

import { Braces, CheckCircle2, FileCode2, LockKeyhole, Terminal } from 'lucide-react';
import { LandingStage, LandingStageId } from './landing-stages';

interface PracticeLoopArtifactProps {
  stage: LandingStage;
  activeStage: LandingStageId;
  progress: number;
}

const STAGE_DETAILS: Record<LandingStageId, string[]> = {
  read: ['task: token validator', 'tests: 04 cases', 'constraints: explicit'],
  think: ['case: expired token', 'case: equal timestamp', 'risk: silent pass'],
  write: ['function validateToken', 'return isValid', 'file: src/token.ts'],
  verify: ['verdict: PASS', 'tests: 04 / 04', 'advice: keep the boundary'],
};

export function PracticeLoopArtifact({
  stage,
  activeStage,
  progress,
}: PracticeLoopArtifactProps) {
  const isVerified = activeStage === 'verify';

  return (
    <div className="practice-artifact" aria-label={`${stage.label} practice artifact`}>
      <div className="practice-artifact__topline">
        <div className="flex items-center gap-2">
          <span className="practice-artifact__signal" aria-hidden="true" />
          <span>keepcoding / practice-loop</span>
        </div>
        <span className="font-mono text-zinc-500">0{Math.max(1, Math.ceil(progress * 4))} / 04</span>
      </div>

      <div className="practice-artifact__body">
        <div className="practice-artifact__rail" aria-hidden="true">
          <span>01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
          <span>05</span>
          <span>06</span>
          <span>07</span>
          <span>08</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <FileCode2 className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="font-mono text-xs text-zinc-300">{stage.marker}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {isVerified ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              ) : (
                <LockKeyhole className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              )}
              {isVerified ? 'checked' : 'private'}
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs leading-6">
            {STAGE_DETAILS[activeStage].map((detail, index) => (
              <div
                key={detail}
                className={`practice-artifact__line ${index === 0 ? 'practice-artifact__line--active' : ''}`}
              >
                <span className="text-zinc-600">{index === 0 ? '>' : ' '}</span>
                <span className={index === 0 ? 'text-zinc-100' : 'text-zinc-500'}>{detail}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-end justify-between gap-4 border-t border-zinc-800 pt-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              {stage.label.toLowerCase()} mode
            </div>
            <Braces className="h-5 w-5 text-zinc-700" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
