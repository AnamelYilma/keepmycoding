import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    throw new Error(message);
  }
  console.log(`[PASS] ${message}`);
}

console.log('--- Verifying KeepCoding Studio & Workspace Ergonomics (Stage 2) ---');

const projectRoot = path.resolve(__dirname, '../../../..');

const targetFiles = [
  'src/app/studio/StudioPage.tsx',
  'src/components/home/MasterPromptCard.tsx',
  'src/components/home/PasteChallengeBox.tsx',
  'src/components/home/StudioFlowPipeline.tsx',
  'src/components/home/ExternalAIGuideModal.tsx',
  'src/components/home/ValidationFeedback.tsx',
  'src/components/home/HistoryDrawer.tsx',
  'src/components/home/HowItWorksModal.tsx',
  'src/components/workspace/WorkspaceHeader.tsx',
  'src/components/workspace/WorkspaceLayout.tsx',
  'src/components/workspace/CodeEditor.tsx',
  'src/components/workspace/FileList.tsx',
  'src/components/workspace/SymbolOutline.tsx',
  'src/components/workspace/TaskGuidePane.tsx',
  'src/components/result/ResultModal.tsx',
];

// Check file existence
for (const fileRel of targetFiles) {
  const fullPath = path.join(projectRoot, fileRel);
  assert(fs.existsSync(fullPath), `Target file exists: ${fileRel}`);
}

// Check for forbidden em dash, banned icons, and banned buzzwords
const bannedWords = ['supercharge', 'revolutionary', 'seamlessly'];

for (const fileRel of targetFiles) {
  const fullPath = path.join(projectRoot, fileRel);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Zero em dashes
  assert(!content.includes('\u2014'), `Zero em dashes in ${fileRel}`);

  // No Sparkles or Zap icons
  assert(!content.includes('Sparkles'), `No Sparkles icon in ${fileRel}`);
  assert(!content.includes('Zap'), `No Zap icon in ${fileRel}`);

  // No banned buzzwords
  for (const word of bannedWords) {
    assert(!content.toLowerCase().includes(word), `No '${word}' buzzword in ${fileRel}`);
  }

  // Check design ergonomics tokens (e.g., rounded-full, rounded-xl/rounded-2xl, rounded-lg)
  assert(
    content.includes('rounded-full') || content.includes('rounded-xl') || content.includes('rounded-2xl') || content.includes('rounded-lg'),
    `Ergonomic border-radius present in ${fileRel}`
  );
}

// Verify StudioPage connects to /api/judge for zero secret leakage
const studioPageContent = fs.readFileSync(path.join(projectRoot, 'src/app/studio/StudioPage.tsx'), 'utf8');
assert(studioPageContent.includes("fetch('/api/judge'"), 'StudioPage routes evaluations securely through /api/judge');
assert(!studioPageContent.includes('OPENAI_API_KEY'), 'No API key leaked in client StudioPage');
assert(!studioPageContent.includes('AI_API_KEY'), 'No API key leaked in client StudioPage');

// Verify ResultModal has PASS/FAIL badges and rounded-2xl modal dialog
const resultModalContent = fs.readFileSync(path.join(projectRoot, 'src/components/result/ResultModal.tsx'), 'utf8');
assert(resultModalContent.includes('rounded-2xl'), 'ResultModal uses rounded-2xl container');
assert(resultModalContent.includes('CheckCircle2'), 'ResultModal has CheckCircle2 icon');
assert(resultModalContent.includes('XCircle'), 'ResultModal has XCircle icon');

// Verify WorkspaceHeader has Submit to Judge and breadcrumbs
const headerContent = fs.readFileSync(path.join(projectRoot, 'src/components/workspace/WorkspaceHeader.tsx'), 'utf8');
assert(headerContent.includes('Submit to Judge'), 'WorkspaceHeader has Submit to Judge button');
assert(headerContent.includes('rounded-full'), 'WorkspaceHeader uses rounded-full pill buttons');

// Verify StudioFlowPipeline is a lean, fast-scan step flow text box
const pipelineContent = fs.readFileSync(path.join(projectRoot, 'src/components/home/StudioFlowPipeline.tsx'), 'utf8');
assert(pipelineContent.includes('1. Choose option'), 'StudioFlowPipeline includes Step 1 Choose option');
assert(pipelineContent.includes('2. Copy prompt'), 'StudioFlowPipeline includes Step 2 Copy prompt');
assert(pipelineContent.includes('3. Give to your AI'), 'StudioFlowPipeline includes Step 3 Give to your AI');
assert(pipelineContent.includes('4. Paste back'), 'StudioFlowPipeline includes Step 4 Paste back');
assert(pipelineContent.includes('5. Load &amp; practice') || pipelineContent.includes('5. Load & practice'), 'StudioFlowPipeline includes Step 5 Load & practice');

// Verify MasterPromptCard header is minimal without useless filler text or extra buttons
const promptCardContent = fs.readFileSync(path.join(projectRoot, 'src/components/home/MasterPromptCard.tsx'), 'utf8');
assert(promptCardContent.includes('Configure Practice Prompt'), 'MasterPromptCard includes title');
assert(!promptCardContent.includes('Select your focus track and difficulty level'), 'MasterPromptCard removed useless filler subtext');
assert(!promptCardContent.includes('Skip to Paste'), 'MasterPromptCard removed useless Skip to Paste button');

console.log('--- Studio & Workspace Ergonomics Verification: All checks passed! ---');
