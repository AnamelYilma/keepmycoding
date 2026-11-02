import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    throw new Error(message);
  }
  console.log(`[PASS] ${message}`);
}

console.log('=== Stage 4: Web Quality, Accessibility & Performance Audit ===');

const projectRoot = path.resolve(__dirname, '../..');

// Helper: Calculate WCAG 2.2 Relative Luminance and Contrast Ratio
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const rgb = [
    parseInt(cleanHex.substring(0, 2), 16) / 255,
    parseInt(cleanHex.substring(2, 4), 16) / 255,
    parseInt(cleanHex.substring(4, 6), 16) / 255,
  ];
  const a = rgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// --------------------------------------------------------------------------
// 1. Accessibility (WCAG 2.2 AA Contrast Conformance)
// --------------------------------------------------------------------------
console.log('\n--- 1. WCAG 2.2 AA Contrast Compliance Verification ---');

const bgCanvas = '#090A0F';
const bgSurface = '#11131A';

const paletteTokens: Record<string, string> = {
  white: '#ffffff',
  zinc100: '#f4f4f5',
  zinc200: '#e4e4e7',
  zinc300: '#d4d4d8',
  zinc400: '#a1a1aa',
  brandMint: '#88bda4',
  brandMintHover: '#9cd1b8',
  emerald400: '#34d399',
  rose400: '#fb7185',
  amber400: '#fbbf24',
};

// Assert every token meets or exceeds 4.5:1 against canvas and surface
for (const [name, hex] of Object.entries(paletteTokens)) {
  const ratioCanvas = getContrastRatio(hex, bgCanvas);
  const ratioSurface = getContrastRatio(hex, bgSurface);

  assert(
    ratioCanvas >= 4.5,
    `Contrast for ${name} (${hex}) against Canvas (${bgCanvas}) is ${ratioCanvas.toFixed(2)}:1 (>= 4.5:1)`
  );
  assert(
    ratioSurface >= 4.5,
    `Contrast for ${name} (${hex}) against Surface (${bgSurface}) is ${ratioSurface.toFixed(2)}:1 (>= 4.5:1)`
  );
}

// Check auth.css muted text contrast token
const authCssPath = path.join(projectRoot, 'src/app/auth/auth.css');
const authCss = fs.readFileSync(authCssPath, 'utf8');
assert(
  authCss.includes('--auth-text-muted: #a1a1aa'),
  'auth.css sets --auth-text-muted to high-contrast #a1a1aa (7.7:1 contrast)'
);

// --------------------------------------------------------------------------
// 2. Keyboard Focus Rings & Reduced Motion
// --------------------------------------------------------------------------
console.log('\n--- 2. Keyboard Navigation Focus Rings & Vestibular Protection ---');

const globalsCssPath = path.join(projectRoot, 'src/app/globals.css');
const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

// Global focus-visible outline
assert(
  globalsCss.includes(':focus-visible') && globalsCss.includes('var(--brand-primary)'),
  'globals.css defines accessible :focus-visible ring with brand mint'
);

// Reduced-motion media queries in globals.css and auth.css
assert(
  globalsCss.includes('@media (prefers-reduced-motion: reduce)'),
  'globals.css implements @media (prefers-reduced-motion: reduce)'
);
assert(
  globalsCss.includes('animation-duration: 0.01ms !important'),
  'globals.css dampens animations for vestibular discomfort under reduced motion'
);
assert(
  authCss.includes('@media (prefers-reduced-motion: reduce)'),
  'auth.css implements @media (prefers-reduced-motion: reduce)'
);

// Focus-visible rings on interactive UI elements
const interactiveFiles = [
  'src/components/marketing/MarketingNav.tsx',
  'src/components/marketing/HeroSection.tsx',
  'src/components/marketing/InteractiveHeroWorkbench.tsx',
  'src/components/home/MasterPromptCard.tsx',
  'src/components/home/PasteChallengeBox.tsx',
  'src/components/workspace/WorkspaceHeader.tsx',
  'src/components/workspace/WorkspaceLayout.tsx',
  'src/components/workspace/FileList.tsx',
  'src/components/result/ResultModal.tsx',
];

for (const relPath of interactiveFiles) {
  const content = fs.readFileSync(path.join(projectRoot, relPath), 'utf8');
  assert(
    content.includes('focus-visible:'),
    `Focus-visible rings present in ${relPath}`
  );
}

// --------------------------------------------------------------------------
// 3. Semantic Landmarks & Accessible Structure
// --------------------------------------------------------------------------
console.log('\n--- 3. Semantic Landmarks & ARIA Attribute Verification ---');

// Landing page landmarks
const landingPage = fs.readFileSync(path.join(projectRoot, 'src/app/page.tsx'), 'utf8');
assert(landingPage.includes('<main'), 'Landing page renders semantic <main> landmark');

const marketingNav = fs.readFileSync(path.join(projectRoot, 'src/components/marketing/MarketingNav.tsx'), 'utf8');
assert(marketingNav.includes('<header'), 'MarketingNav renders semantic <header> landmark');
assert(marketingNav.includes('<nav'), 'MarketingNav renders semantic <nav> landmark');

const marketingFooter = fs.readFileSync(path.join(projectRoot, 'src/components/marketing/MarketingFooter.tsx'), 'utf8');
assert(marketingFooter.includes('<footer'), 'MarketingFooter renders semantic <footer> landmark');

// Studio / Workspace landmarks
const studioPage = fs.readFileSync(path.join(projectRoot, 'src/app/studio/StudioPage.tsx'), 'utf8');
assert(studioPage.includes('<main'), 'StudioPage setup renders semantic <main> landmark');

const workspaceLayout = fs.readFileSync(path.join(projectRoot, 'src/components/workspace/WorkspaceLayout.tsx'), 'utf8');
assert(workspaceLayout.includes('<main'), 'WorkspaceLayout renders semantic <main> landmark');
assert(workspaceLayout.includes('<aside'), 'WorkspaceLayout renders semantic <aside> landmarks for sidebars');

const workspaceHeader = fs.readFileSync(path.join(projectRoot, 'src/components/workspace/WorkspaceHeader.tsx'), 'utf8');
assert(workspaceHeader.includes('<h1'), 'WorkspaceHeader provides screen-reader accessible <h1> landmark');

// Auth frame landmarks
const authFrame = fs.readFileSync(path.join(projectRoot, 'src/app/auth/AuthFrame.tsx'), 'utf8');
assert(authFrame.includes('<main className="auth-page"'), 'AuthFrame renders semantic <main> landmark');
assert(authFrame.includes('<header className="auth-header"'), 'AuthFrame renders semantic <header> landmark');
assert(authFrame.includes('<nav className="auth-route-nav"'), 'AuthFrame renders semantic <nav> landmark');
assert(authFrame.includes('<aside'), 'AuthFrame renders semantic <aside> for story context');
assert(authFrame.includes('<section'), 'AuthFrame renders semantic <section> for auth form panel');

// Aria live announcements
const heroWorkbench = fs.readFileSync(path.join(projectRoot, 'src/components/marketing/InteractiveHeroWorkbench.tsx'), 'utf8');
assert(heroWorkbench.includes('aria-live="polite"'), 'InteractiveHeroWorkbench has aria-live="polite" for verdict announcement');

const resultModal = fs.readFileSync(path.join(projectRoot, 'src/components/result/ResultModal.tsx'), 'utf8');
assert(resultModal.includes('aria-live="polite"'), 'ResultModal has aria-live="polite" for evaluation announcement');
assert(resultModal.includes('role="dialog"'), 'ResultModal has role="dialog"');
assert(resultModal.includes('aria-modal="true"'), 'ResultModal has aria-modal="true"');

// Decorative icons aria-hidden check
for (const relPath of interactiveFiles) {
  const content = fs.readFileSync(path.join(projectRoot, relPath), 'utf8');
  assert(
    content.includes('aria-hidden="true"'),
    `Decorative icons marked with aria-hidden="true" in ${relPath}`
  );
}

// --------------------------------------------------------------------------
// 4. Responsive Layout & Mobile Usability (320px-375px Protection)
// --------------------------------------------------------------------------
console.log('\n--- 4. Responsive Layout & Mobile Breakpoint Verification ---');

// Check mobile tab switcher in WorkspaceLayout
assert(
  workspaceLayout.includes("setMobileTab('editor')") &&
    workspaceLayout.includes("setMobileTab('task')") &&
    workspaceLayout.includes("setMobileTab('files')"),
  'WorkspaceLayout provides 3-way mobile view switcher (Code / Task / Files) for small viewports'
);

// Check WorkspaceHeader responsive chip truncation
assert(
  workspaceHeader.includes('hidden sm:inline-flex') && workspaceHeader.includes('hidden md:inline-flex'),
  'WorkspaceHeader responsively hides secondary chips on small viewports (prevents 320px overflow)'
);

// Check MarketingNav mobile toggle touch target
assert(
  marketingNav.includes('min-h-[44px]') && marketingNav.includes('min-w-[44px]'),
  'MarketingNav mobile menu button conforms to 44x44px minimum touch target'
);

// Check primary button min-height in globals.css
assert(
  globalsCss.includes('min-height: 44px'),
  'globals.css enforces min-height: 44px on primary/secondary button pill CTAs'
);

// --------------------------------------------------------------------------
// 5. Code Quality, Anti-AI Design & Pre-Push Security (consider.md & agent_learn.md)
// --------------------------------------------------------------------------
console.log('\n--- 5. Pre-Push Security & Anti-AI Slop Verification ---');

function getAllSourceFiles(dir: string): string[] {
  let results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllSourceFiles(full));
    } else if (/\.(tsx?|css|json)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const allSrcFiles = getAllSourceFiles(path.join(projectRoot, 'src'));

// 1. Zero em dashes across non-test source files
for (const fullPath of allSrcFiles) {
  if (fullPath.includes('__tests__')) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(!content.includes('\u2014'), `Zero em dashes in ${path.relative(projectRoot, fullPath)}`);
}

// 2. Zero banned icons (Sparkles, Zap, Wand2) across non-test source files
const bannedIcons = ['Sparkles', 'Zap', 'Wand2'];
for (const fullPath of allSrcFiles) {
  if (fullPath.includes('__tests__')) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const icon of bannedIcons) {
    assert(!content.includes(icon), `No ${icon} icon in ${path.relative(projectRoot, fullPath)}`);
  }
}

// 3. Zero marketing buzzwords (supercharge, revolutionary, seamlessly)
const bannedWords = ['supercharge', 'revolutionary', 'seamlessly'];
for (const fullPath of allSrcFiles) {
  if (fullPath.includes('__tests__')) continue;
  const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
  for (const word of bannedWords) {
    assert(!content.includes(word), `No '${word}' buzzword in ${path.relative(projectRoot, fullPath)}`);
  }
}

// 4. Zero secret leakage scan
const gitignorePath = path.join(projectRoot, '.gitignore');
const gitignore = fs.readFileSync(gitignorePath, 'utf8');
assert(gitignore.includes('.env'), '.gitignore safely excludes .env files');
assert(gitignore.includes('.env.*'), '.gitignore safely excludes .env.* files');

for (const fullPath of allSrcFiles) {
  if (fullPath.includes('__tests__')) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(!/sk-[a-zA-Z0-9_-]{24,}/.test(content), `No API key leaked in ${path.relative(projectRoot, fullPath)}`);
  assert(!content.includes('AI_API_KEY='), `No secret key literal in ${path.relative(projectRoot, fullPath)}`);
}

console.log('\n============================================================');
console.log('STAGE 4 AUDIT PASSED: ALL WEB QUALITY & A11Y CHECKS 100% GREEN');
console.log('============================================================\n');
