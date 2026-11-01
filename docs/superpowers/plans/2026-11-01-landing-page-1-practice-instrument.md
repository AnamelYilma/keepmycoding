# KeepCoding Landing Page 1: 4D Practice Instrument Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the root landing page with the complete 4D Practice Instrument and move the prompt-generation/setup experience into a separate `/studio` route.

**Architecture:** Keep challenge and workspace state in a shared client surface, but separate presentation by route. The root route renders an explanation-first cinematic instrument with a final Studio CTA. `/studio` renders the existing prompt, paste, history, and modal setup behavior unchanged, and starting a challenge still enters the existing workspace.

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript, Tailwind CSS v4, Geist fonts, lucide-react, CSS perspective/transforms/clip-path, requestAnimationFrame.

**Spec:** `docs/superpowers/specs/2026-11-01-landing-page-1-practice-instrument-design.md`

## Global Constraints

- Landing Page 1 is `/`; Landing Page 2 is `/landing-page-2` and must not be modified.
- The landing page must not render the prompt-builder, copy-master-prompt, paste form, or setup dashboard.
- `/studio` must contain the prompt-generation and paste-challenge interface.
- The central visual is one 4D instrument changing through READ, THINK, WRITE, and VERIFY.
- Use the existing zinc/mint brand, Geist typography, and existing product sample content.
- No WebGL, video, remote imagery, new animation packages, gradient blobs, pastel washes, fake metrics, testimonials, or marketing claims.
- Preserve parser, judge, history, prompt, paste, modal, and workspace behavior.
- Reduced motion exposes all stages statically and legibly.

## Review Focus

- Route separation: `/` must not contain setup controls; `/studio` must contain them; `/landing-page-2` must remain untouched. Cover in route integration checks.
- Machine progress: stage updates must be relative to the machine section, not the document. Cover in timeline tests.
- Reduced motion: all four planes stay readable and no stage depends on opacity. Cover in state/CSS checks.
- Mobile: no sticky transform overflow or clipped code at 375px. Cover in rendered verification.
- Existing sample flow: Studio’s sample action still opens the existing workspace. Cover in workflow verification.

---

### Task 1: Define the 4D machine timeline

**Files:**
- Create: `src/components/landing/instrument-stages.ts`
- Create: `src/components/landing/useInstrumentTimeline.ts`
- Test: `src/components/landing/__tests__/verify-instrument-timeline.ts`

**Interfaces:**
- Produces `InstrumentStageId = 'read' | 'think' | 'write' | 'verify'`.
- Produces `getInstrumentStage(progress: number): InstrumentStageId`.
- Produces `useInstrumentTimeline(targetId: string): { activeStage, progress, prefersReducedMotion }`.

- [ ] **Step 1: Write the failing verification**

Assert stage order, progress clamping, quarter boundaries, and reduced-motion static behavior.

- [ ] **Step 2: Run the verification**

Run: `npx tsx src/components/landing/__tests__/verify-instrument-timeline.ts`

Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Implement the model and hook**

Use the target section’s top and scrollable height, batch scroll updates with `requestAnimationFrame`, and freeze stage changes when reduced motion is enabled.

- [ ] **Step 4: Run the verification**

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/instrument-stages.ts src/components/landing/useInstrumentTimeline.ts src/components/landing/__tests__/verify-instrument-timeline.ts
git commit -m "feat: add practice instrument timeline"
```

### Task 2: Build the 4D instrument landing surface

**Files:**
- Create: `src/components/landing/PracticeInstrumentLanding.tsx`
- Create: `src/components/landing/PracticeInstrument.tsx`
- Create: `src/components/landing/PracticeInstrument.css`

**Interfaces:**
- Consumes the timeline state, existing sample challenge data, and `onEnterStudio: () => void`.
- Produces a full landing-only experience with entry hero, sticky instrument, stage rail, resolution state, and final Studio CTA.

- [ ] **Step 1: Write the failing verification**

Assert the landing surface contains no prompt-builder/paste-form labels, contains all four stage labels, contains the real timestamp comparison, and exposes an accessible Studio CTA.

- [ ] **Step 2: Run the verification**

Expected: FAIL because the landing components do not exist.

- [ ] **Step 3: Implement the surface**

Make the instrument the dominant element. Use layered planes with perspective, translate/rotate/clip state transitions, a persistent stage rail, contract strip, locked file, editable file, verdict panel, and final CTA. Do not append the existing setup UI.

- [ ] **Step 4: Implement responsive states**

Desktop uses sticky scroll choreography. Tablet uses a horizontal stage rail. Mobile uses a vertical sequence without sticky transforms. Reduced motion shows all planes at full opacity.

- [ ] **Step 5: Run `git diff --check`**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing
git commit -m "feat: build four-dimensional practice instrument"
```

### Task 3: Extract the existing setup flow into Studio

**Files:**
- Create: `src/app/studio/page.tsx`
- Create: `src/app/studio/StudioPage.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/landing/PracticeInstrumentLanding.tsx`

**Interfaces:**
- Consumes the current Home challenge/judge/workspace behavior.
- Produces `/studio` with the existing prompt, paste, history, and modal setup flow; root landing links to `/studio`.

- [ ] **Step 1: Write the failing integration verification**

Assert:

- `/` renders the instrument and not setup controls.
- `/studio` renders `MasterPromptCard` and `PasteChallengeBox`.
- Studio sample launch still reaches the existing workspace.
- `/landing-page-2` files and route remain untouched.

- [ ] **Step 2: Run the integration verification**

Run: `npm test`

Expected: FAIL before route extraction.

- [ ] **Step 3: Extract setup state into Studio**

Move only setup rendering and its current callbacks into `StudioPage`. Keep active challenge rendering, judge submission, result modal, and history persistence behavior equivalent. Link landing CTA to `/studio`.

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/studio src/components/landing/PracticeInstrumentLanding.tsx
git commit -m "feat: separate studio from landing page"
```

### Task 4: Rendered quality verification

**Files:**
- Modify only root landing or Studio files if verification finds a defect.

- [ ] **Step 1: Verify `/`, `/studio`, and `/landing-page-2`**

Confirm each route has a distinct role and Landing Page 2 has no changes.

- [ ] **Step 2: Verify viewports**

Inspect desktop, tablet, and 375px mobile. Confirm every viewport is intentionally composed, with no overflow or unfinished empty space.

- [ ] **Step 3: Verify motion and accessibility**

Scroll through all four instrument states, test keyboard focus, and enable reduced motion. Confirm all stages remain understandable.

- [ ] **Step 4: Run final checks**

```powershell
& 'C:\Users\yilma\.agents\skills\impeccable\scripts\impeccable.cmd' detect --json src\app\page.tsx src\app\studio src\components\landing
npm run lint
npm test
npm run build
```

Expected: detector has no critical findings and all available project commands pass.
