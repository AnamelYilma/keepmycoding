export type InstrumentStageId = 'read' | 'think' | 'write' | 'verify';

export interface InstrumentStage {
  id: InstrumentStageId;
  label: Uppercase<InstrumentStageId>;
  title: string;
  detail: string;
}

export const INSTRUMENT_STAGES: readonly InstrumentStage[] = [
  {
    id: 'read',
    label: 'READ',
    title: 'Start with the contract.',
    detail: 'The task is visible before the editor asks for a solution.',
  },
  {
    id: 'think',
    label: 'THINK',
    title: 'Pressure the boundary.',
    detail: 'The equal timestamp is where a quiet assumption becomes a bug.',
  },
  {
    id: 'write',
    label: 'WRITE',
    title: 'Keep the decision yours.',
    detail: 'Change one line in the isolated file. No generated answer gets to skip the reasoning.',
  },
  {
    id: 'verify',
    label: 'VERIFY',
    title: 'See what holds up.',
    detail: 'A private judge returns the verdict and the next useful correction.',
  },
] as const;

export function getInstrumentStage(progress: number): InstrumentStageId {
  const bounded = Math.max(0, Math.min(1, progress));
  const index = Math.min(INSTRUMENT_STAGES.length - 1, Math.floor(bounded * INSTRUMENT_STAGES.length));
  return INSTRUMENT_STAGES[index].id;
}
