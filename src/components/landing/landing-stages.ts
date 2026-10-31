export type LandingStageId = 'read' | 'think' | 'write' | 'verify';

export interface LandingStage {
  id: LandingStageId;
  label: Uppercase<LandingStageId>;
  title: string;
  description: string;
  marker: string;
}

export const LANDING_STAGES: readonly LandingStage[] = [
  {
    id: 'read',
    label: 'READ',
    title: 'Start with the contract.',
    description: 'Read the task, constraints, and tests before touching the editor.',
    marker: 'task.md',
  },
  {
    id: 'think',
    label: 'THINK',
    title: 'Keep the edge cases visible.',
    description: 'Build a mental model of the behavior instead of outsourcing the first move.',
    marker: 'notes.txt',
  },
  {
    id: 'write',
    label: 'WRITE',
    title: 'Make the change by hand.',
    description: 'Work in an isolated multi-file editor where every line is yours.',
    marker: 'solution.ts',
  },
  {
    id: 'verify',
    label: 'VERIFY',
    title: 'Learn from the verdict.',
    description: 'Submit to a private judge and get a clear breakdown of what held up.',
    marker: 'verdict.log',
  },
] as const;

export function getStageForProgress(progress: number): LandingStageId {
  const boundedProgress = Math.max(0, Math.min(1, progress));
  const stageIndex = Math.min(
    LANDING_STAGES.length - 1,
    Math.floor(boundedProgress * LANDING_STAGES.length),
  );
  return LANDING_STAGES[stageIndex].id;
}
