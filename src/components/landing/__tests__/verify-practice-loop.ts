import { getStageForProgress, LANDING_STAGES } from '../landing-stages';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
  console.log(`[PASS] ${message}`);
}

assert(
  LANDING_STAGES.map((stage) => stage.id).join(',') === 'read,think,write,verify',
  'Practice Loop exposes the four stages in order',
);
assert(getStageForProgress(-1) === 'read', 'Clamps progress below zero to READ');
assert(getStageForProgress(0.26) === 'think', 'Maps the second quarter to THINK');
assert(getStageForProgress(0.51) === 'write', 'Maps the third quarter to WRITE');
assert(getStageForProgress(2) === 'verify', 'Clamps progress above one to VERIFY');
