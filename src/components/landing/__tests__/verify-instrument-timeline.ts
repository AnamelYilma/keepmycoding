import { getInstrumentStage, INSTRUMENT_STAGES } from '../instrument-stages';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
  console.log(`[PASS] ${message}`);
}

assert(INSTRUMENT_STAGES.map((stage) => stage.id).join(',') === 'read,think,write,verify', 'Instrument stages are ordered');
assert(getInstrumentStage(-1) === 'read', 'Progress clamps to READ');
assert(getInstrumentStage(0.26) === 'think', 'Second quarter maps to THINK');
assert(getInstrumentStage(0.51) === 'write', 'Third quarter maps to WRITE');
assert(getInstrumentStage(2) === 'verify', 'Progress clamps to VERIFY');
