# KeepCoding Landing Page 1: Living Code Machine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the root Landing Page 1 with a cinematic, scroll-driven Living Code Machine while preserving Landing Page 2 and the existing practice workflow.

**Architecture:** Keep `src/app/page.tsx` as the stateful route boundary. Replace the current Landing Page 1 presentation with focused components under `src/components/landing/`: a machine state model, a section-relative scroll controller, a layered artifact, and responsive story/CTA presentation. The implementation uses browser-native motion and existing product data, with no new animation dependency.

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript, Tailwind CSS v4, existing Geist fonts, lucide-react, CSS transforms/clip-path, IntersectionObserver or requestAnimationFrame.

**Spec:** `docs/superpowers/specs/2026-10-31-landing-page-1-living-code-machine-design.md`

## Global Constraints

- Landing Page 1 is the root route `/`; Landing Page 2 is `/landing-page-2` and must not be modified.
- Use the existing zinc foundation, mint brand accent, Geist typography, and code-first voice.
- The machine is one artifact changing state through `ASSUMPTION`, `EDGE CASE`, `HANDWRITE`, and `VERDICT`, not four unrelated cards.
- Do not use WebGL, video, remote imagery, new animation packages, gradient blobs, pastel washes, decorative AI icons, fake metrics, testimonials, authentication, or billing.
- Use actual KeepCoding sample content or faithful representations of it.
- Reduced-motion mode must show all four stages fully and statically; no stage may be dimmed solely for inactivity.
- Preserve existing parser, judge, history, prompt, paste, modal, and workspace behavior.
- No horizontal scrolling, clipped code, hover-only critical interaction, or hidden keyboard focus.

## Review Focus

- The root route must remain distinct from `/landing-page-2`; integration checks must assert both route surfaces remain separate.
- Scroll progress must be relative to the machine section, not the whole document; a user entering the section must begin at `ASSUMPTION`.
- Reduced-motion users must see all four states legibly with no scroll-driven state changes; test the preference branch and CSS fallback.
- Sample data may be unavailable or invalid; the machine must retain readable fallback code and the primary CTA must not throw.
- Mobile must render the full story as a vertical sequence without sticky overflow; verify at 375px.

---

### Task 1: Define machine states and section-relative timeline

**Files:**
- Create: `src/components/landing/living-code-machine.ts`
- Create: `src/components/landing/useLivingCodeTimeline.ts`
- Create: `src/components/landing/__tests__/verify-living-code-machine.ts`

**Interfaces:**
- Produces `LivingMachineStage = 'assumption' | 'edge-case' | 'handwrite' | 'verdict'`.
- Produces `LivingMachineState` with `{ stage, progress, prefersReducedMotion }`.
- Produces `useLivingCodeTimeline(elementId: string): LivingMachineState`.

- [ ] **Step 1: Write the failing verification**

Assert stage order, progress clamping at `0` and `1`, quarter-boundary mapping, and that reduced motion resolves to the static first stage.

- [ ] **Step 2: Run the verification and watch it fail**

Run: `npx tsx src/components/landing/__tests__/verify-living-code-machine.ts`

Expected: FAIL because the state model and timeline hook do not exist.

- [ ] **Step 3: Implement the state model and hook**

Define the four stages and their exact labels, artifact copy, file markers, and semantic colors. Calculate progress from the target section’s top and scrollable height, clamp it to `[0, 1]`, batch scroll updates with `requestAnimationFrame`, and stop stage updates when reduced motion is enabled.

- [ ] **Step 4: Run the verification**

Run the same command.

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/living-code-machine.ts src/components/landing/useLivingCodeTimeline.ts src/components/landing/__tests__/verify-living-code-machine.ts
git commit -m "feat: add living code machine timeline"
```

### Task 2: Build the layered Living Code Machine artifact

**Files:**
- Create: `src/components/landing/LivingCodeMachine.tsx`
- Create: `src/components/landing/LivingCodeStory.tsx`
- Create: `src/components/landing/LivingCodeMachine.css`

**Interfaces:**
- Consumes `LivingMachineState`, sample challenge data, and `onStartSample: () => void`.
- Produces a semantic artifact with visible code, contract, locked context, editor, verdict, and stage rail.

- [ ] **Step 1: Write the failing verification**

Assert that the artifact renders all four stage labels, a code line containing the timestamp comparison, a locked companion file label, a verdict region, and a keyboard-accessible sample CTA.

- [ ] **Step 2: Run the verification and watch it fail**

Run: `npx tsx src/components/landing/__tests__/verify-living-code-machine.ts`

Expected: FAIL because the artifact components do not exist.

- [ ] **Step 3: Implement the artifact**

Build one layered machine with:

- a vertical stage rail,
- a challenge panel,
- a code editor panel with line numbers,
- a locked companion file panel,
- a verdict panel,
- a contract/boundary strip.

Use state-driven classes to shift, crop, and reorder these layers. Keep the first state fully readable before motion. Use actual sample challenge values with safe fallback strings.

- [ ] **Step 4: Implement responsive and reduced-motion styles**

Desktop uses a sticky artifact beside the story. Tablet moves the stage rail above the artifact. Mobile removes sticky positioning and renders the four state sections vertically. Reduced motion makes all stages visible with full opacity and no transforms.

- [ ] **Step 5: Run lint-level static checks**

Run: `git diff --check`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/LivingCodeMachine.tsx src/components/landing/LivingCodeStory.tsx src/components/landing/LivingCodeMachine.css
git commit -m "feat: build living code machine artifact"
```

### Task 3: Replace only Landing Page 1 and preserve existing flow

**Files:**
- Create: `src/components/landing/LandingPageOne.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` only for shared focus/selection tokens if required

**Interfaces:**
- Consumes `LivingCodeMachine`, `LivingCodeStory`, existing `SAMPLE_CHALLENGES`, and current `Home` callbacks.
- Produces root Landing Page 1 with hero, machine section, proof statement, final CTA, and existing setup section.

- [ ] **Step 1: Write the failing integration verification**

Assert that the root home renders Landing Page 1 markers, the primary CTA opens the existing sample workspace, How It Works and History remain wired, and the `/landing-page-2` route files are unchanged.

- [ ] **Step 2: Run the verification and watch it fail**

Run: `npm test`

Expected: the new Landing Page 1 assertions fail before route replacement.

- [ ] **Step 3: Implement `LandingPageOne` and wire it into `Home`**

Replace the previous Practice Loop presentation at the root route with the Living Code Machine composition. Keep active challenge rendering, judge handling, history, modals, prompt setup, and paste setup intact. Do not import or modify Landing Page 2.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Run the production build**

Run: `npm run build`

Expected: PASS with no client/server boundary or TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/landing src/app/globals.css
git commit -m "feat: replace landing page one with living code machine"
```

### Task 4: Rendered quality and accessibility verification

**Files:**
- Modify only the Landing Page 1 files if verification finds a defect.

**Interfaces:**
- Consumes the running root route and `/landing-page-2`.
- Produces verified desktop, tablet, mobile, keyboard, and reduced-motion behavior.

- [ ] **Step 1: Inspect both routes**

Run the app and compare `/` and `/landing-page-2`. Confirm the root is labeled Landing Page 1 in the implementation and that Landing Page 2 is visually and structurally untouched.

- [ ] **Step 2: Verify shipped viewport sizes**

Inspect 375px, tablet, and desktop. Confirm no horizontal overflow, clipped code, layout shift, or sticky focus obstruction.

- [ ] **Step 3: Verify stage motion**

Scroll through the machine section and confirm all four states visibly change the same artifact: `ASSUMPTION`, `EDGE CASE`, `HANDWRITE`, `VERDICT`.

- [ ] **Step 4: Verify reduced motion and keyboard**

Enable reduced motion. Confirm all stages remain readable. Tab through nav, stage controls, sample CTA, modal controls, and setup controls with visible focus.

- [ ] **Step 5: Run the detector and final commands**

Run:

```powershell
& 'C:\Users\yilma\.agents\skills\impeccable\scripts\impeccable.cmd' detect --json src\app\page.tsx src\components\landing
npm run lint
npm test
npm run build
```

Expected: detector has no critical findings and all available project commands pass.

- [ ] **Step 6: Commit verification fixes**

```bash
git add src/app/page.tsx src/components/landing src/app/globals.css
git commit -m "fix: polish landing page one motion and responsive states"
```
