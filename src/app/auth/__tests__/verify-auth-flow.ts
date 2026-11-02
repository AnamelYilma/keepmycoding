import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    throw new Error(message);
  }
  console.log(`[PASS] ${message}`);
}

console.log('--- Verifying KeepCoding Auth Flow & Obsidian/Mint Design System (Stage 3) ---');

const projectRoot = path.resolve(__dirname, '../../../..');

const authFiles = [
  'src/app/auth/AuthFrame.tsx',
  'src/app/auth/AuthForm.tsx',
  'src/app/auth/auth.css',
  'src/app/auth/link-error/page.tsx',
  'src/app/auth/actions.ts',
  'src/app/login/page.tsx',
  'src/app/signup/page.tsx',
  'src/app/forgot-password/page.tsx',
  'src/app/reset-password/page.tsx',
];

// 1. File existence
for (const fileRel of authFiles) {
  const fullPath = path.join(projectRoot, fileRel);
  assert(fs.existsSync(fullPath), `Auth file exists: ${fileRel}`);
}

// 2. Strict rules: zero em dashes, no banned icons, no banned buzzwords
const bannedWords = ['supercharge', 'revolutionary', 'seamlessly'];
const bannedIcons = ['Sparkles', 'Zap', 'Wand2'];

for (const fileRel of authFiles) {
  const fullPath = path.join(projectRoot, fileRel);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Zero em dashes
  assert(!content.includes('\u2014'), `Zero em dashes in ${fileRel}`);

  // No banned icons
  for (const icon of bannedIcons) {
    assert(!content.includes(icon), `No ${icon} icon in ${fileRel}`);
  }

  // No banned buzzwords
  for (const word of bannedWords) {
    assert(!content.toLowerCase().includes(word), `No '${word}' buzzword in ${fileRel}`);
  }
}

// 3. Verify removal of old brutalist wireframe case-file math
const frameContent = fs.readFileSync(path.join(projectRoot, 'src/app/auth/AuthFrame.tsx'), 'utf8');
const oldBrutalistRemnants = [
  'CREATE ACCOUNT / 001',
  'SAMPLE 001',
  'SAMPLE CHALLENGE',
  'exp < now',
  '1,000',
  '1,500',
  'auth-case-study',
  'auth-specimen',
];
for (const remnant of oldBrutalistRemnants) {
  assert(!frameContent.includes(remnant), `No old brutalist remnant '${remnant}' in AuthFrame.tsx`);
}

// 4. Verify human-first presentation in AuthFrame
assert(frameContent.includes('muscle memory'), 'AuthFrame features muscle memory messaging');
assert(frameContent.includes('Practice what you'), 'AuthFrame features deliberate practice messaging');
assert(frameContent.includes('ENGINEERING TRACKS') || frameContent.includes('Tailored Curriculum'), 'AuthFrame features curriculum track display');
assert(frameContent.includes('auth-route-nav'), 'AuthFrame contains segmented pill route navigation');

// 5. Verify CSS design system tokens and rounded radii
const cssContent = fs.readFileSync(path.join(projectRoot, 'src/app/auth/auth.css'), 'utf8');
assert(cssContent.includes('#090a0f') || cssContent.includes('--auth-canvas'), 'auth.css specifies deep obsidian canvas');
assert(cssContent.includes('#88bda4') || cssContent.includes('--auth-mint'), 'auth.css specifies brand mint color');
assert(cssContent.includes('--auth-radius-2xl'), 'auth.css specifies rounded-2xl containers');
assert(cssContent.includes('--auth-radius-xl'), 'auth.css specifies rounded-xl cards');
assert(cssContent.includes('--auth-radius-md'), 'auth.css specifies rounded-md/lg inputs');
assert(cssContent.includes('--auth-radius-full'), 'auth.css specifies rounded-full pill buttons');
assert(cssContent.includes('box-shadow'), 'auth.css includes tactile button/focus glow effects');

// 6. Verify AuthForm input contracts with actions.ts
const formContent = fs.readFileSync(path.join(projectRoot, 'src/app/auth/AuthForm.tsx'), 'utf8');
const requiredInputs = ['name="email"', 'name="password"', 'name="confirmPassword"', 'name="fullName"', 'name="role"', 'name="level"', 'name="gender"'];
for (const input of requiredInputs) {
  assert(formContent.includes(input), `AuthForm preserves required input contract: ${input}`);
}
assert(formContent.includes('auth-submit'), 'AuthForm includes primary submit button');
assert(formContent.includes('auth-password-toggle'), 'AuthForm includes password visibility toggle');
assert(formContent.includes('AlertCircle'), 'AuthForm uses utilitarian AlertCircle icon for errors');
assert(formContent.includes('CheckCircle2'), 'AuthForm uses utilitarian CheckCircle2 icon for success');

// 7. Verify zero secret leakage
for (const clientFile of ['src/app/auth/AuthFrame.tsx', 'src/app/auth/AuthForm.tsx', 'src/app/auth/link-error/page.tsx']) {
  const content = fs.readFileSync(path.join(projectRoot, clientFile), 'utf8');
  assert(!content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY'), `No secret service role key in ${clientFile}`);
  assert(!content.includes('AI_API_KEY'), `No AI API key in ${clientFile}`);
}

console.log('--- Auth Flow & Obsidian/Mint Design System: All checks passed! ---');
