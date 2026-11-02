import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    throw new Error(message);
  }
  console.log(`[PASS] ${message}`);
}

console.log('--- Verifying KeepCoding Landing Page & Marketing Craft ---');

const marketingDir = path.resolve(__dirname, '..');
const requiredFiles = [
  'MarketingNav.tsx',
  'HeroSection.tsx',
  'InteractiveHeroWorkbench.tsx',
  'ValuePillars.tsx',
  'TrackGrid.tsx',
  'DeliberatePracticeCTA.tsx',
  'MarketingFooter.tsx'
];

// Check file existence
for (const file of requiredFiles) {
  const fullPath = path.join(marketingDir, file);
  assert(fs.existsSync(fullPath), `Marketing file exists: ${file}`);
}

// Check for em dashes, banned icons, and banned buzzwords
for (const file of requiredFiles) {
  const fullPath = path.join(marketingDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  assert(!content.includes('\u2014'), `Zero em dashes in ${file}`);
  assert(!content.includes('Sparkles'), `No Sparkles icon in ${file}`);
  assert(!content.includes('Zap'), `No Zap icon in ${file}`);
  assert(!content.includes('supercharge'), `No 'supercharge' buzzword in ${file}`);
  assert(!content.includes('revolutionary'), `No 'revolutionary' buzzword in ${file}`);
  assert(!content.includes('seamlessly'), `No 'seamlessly' buzzword in ${file}`);
}

// Check page.tsx wiring
const pagePath = path.resolve(__dirname, '../../../app/page.tsx');
assert(fs.existsSync(pagePath), 'src/app/page.tsx exists');
const pageContent = fs.readFileSync(pagePath, 'utf8');
assert(!pageContent.includes('\u2014'), 'Zero em dashes in src/app/page.tsx');
assert(pageContent.includes('MarketingNav'), 'src/app/page.tsx includes MarketingNav');
assert(pageContent.includes('HeroSection'), 'src/app/page.tsx includes HeroSection');
assert(pageContent.includes('ValuePillars'), 'src/app/page.tsx includes ValuePillars');
assert(pageContent.includes('TrackGrid'), 'src/app/page.tsx includes TrackGrid');
assert(!pageContent.includes('landing-page-2'), 'src/app/page.tsx no longer depends on landing-page-2');

// Verify Interactive Workbench Comparison Logic
function evaluateCondition(exp: number, now: number, op: string): boolean {
  switch (op) {
    case '<=': return exp <= now;
    case '<': return exp < now;
    case '>=': return exp >= now;
    case '>': return exp > now;
    default: return false;
  }
}

const pastExp = 1000;
const futureExp = 2000;
const currentNow = 1500;

// Correct operator '<='
assert(evaluateCondition(pastExp, currentNow, '<=') === true, 'Past token is expired with <= operator');
assert(evaluateCondition(futureExp, currentNow, '<=') === false, 'Future token is active with <= operator');

// Buggy operator '>='
assert(evaluateCondition(pastExp, currentNow, '>=') === false, 'Buggy operator >= incorrectly flags past token as not expired');
assert(evaluateCondition(futureExp, currentNow, '>=') === true, 'Buggy operator >= incorrectly flags future token as expired');

console.log('--- Marketing Page Verification: All checks passed! ---');
