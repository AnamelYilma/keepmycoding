# KeepCoding Landing Page 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Landing Page 1, The Practice Loop, as a responsive, accessible, scroll-led entry point that preserves the existing KeepCoding practice workflow.

**Architecture:** Keep `src/app/page.tsx` as the stateful route boundary for challenge setup, history, modals, and workspace transitions. Extract the new landing presentation into focused components under `src/components/landing/`, with a single client-side scroll choreography hook that exposes the active practice stage. Reuse the existing prompt and paste components rather than duplicating their behavior.

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript, Tailwind CSS v4, Geist Sans/Mono, lucide-react, browser IntersectionObserver and scroll APIs.

**Spec:** `docs/superpowers/specs/2026-10-31-landing-page-1-practice-loop-design.md`

## Global Constraints

- Preserve the existing KeepCoding brand: dark zinc surfaces, mint primary accent, Geist typography, code-first utility language, and purposeful Lucide icons.
- Do not add WebGL, video, remote image dependencies, authentication, billing, testimonials, fake metrics, or invented customer stories.
- Do not introduce Sparkles, Wand2, decorative Zap usage, pastel washes, neon blobs, rainbow accents, pulsing hype badges, em dashes, or marketing fluff.
- Keep the existing challenge parser, judge API, history persistence, workspace behavior, prompt flow, paste flow, and modal behavior intact.
- Respect `prefers-reduced-motion: reduce`; the complete practice sequence must remain readable without scroll choreography.
- Use semantic headings, visible keyboard focus, meaningful labels, no hover-only critical interactions, and touch targets at least 44px where applicable.
- Reserve layout space for animated artifacts and avoid horizontal scrolling at 375px, tablet, and desktop widths.

## Review Focus

- Reduced motion: the four stages remain visible in a logical static order when animation is disabled. Test in the landing component test or browser verification for the reduced-motion branch.
- Small viewport composition: the scroll-driven desktop layout becomes a normal vertical sequence without clipped code or horizontal overflow. Test at 375px in browser verification.
- Existing setup state: clicking the new sample CTA still reaches the existing sample challenge and does not reset or duplicate page state. Test through the existing e2e workflow and manual browser verification.
- Keyboard path: navigation, stage CTA, sample CTA, and existing setup controls receive visible focus and remain reachable in DOM order. Test in browser verification.
- Dynamic content height: stage changes do not cause layout jumps or hide the focused control behind sticky content. Test with keyboard focus while scrolling through the sequence.

---

### Task 1: Add a landing-stage model and scroll choreography hook

**Files:**
- Create: `src/components/landing/landing-stages.ts`
- Create: `src/components/landing/usePracticeLoop.ts`
- Test: `src/components/landing/__tests__/usePracticeLoop.test.ts`

**Interfaces:**
- Consumes: browser viewport and scroll state only.
- Produces: `LandingStageId`, `LandingStage`, and `usePracticeLoop()` returning `{ activeStage, progress, prefersReducedMotion }`.

- [ ] **Step 1: Write the failing tests**

Add tests for:

- The stage model contains exactly `read`, `think`, `write`, and `verify` in that order.
- `usePracticeLoop()` returns `read` and `progress: 0` when the browser APIs are unavailable.
- A reduced-motion media query returns `prefersReducedMotion: true`.
- Stage changes are derived from bounded progress and never produce an invalid stage.

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm test -- --runInBand` is not a supported test runner in this repository, so run the file with the repository's available TypeScript test tooling after checking the existing test conventions.

Expected: FAIL because the landing stage module and hook do not exist yet.

- [ ] **Step 3: Implement the stage model and hook**

Define `LandingStageId = 'read' | 'think' | 'write' | 'verify'`, the stage copy and artifact metadata in `landing-stages.ts`, and `usePracticeLoop(): { activeStage: LandingStageId; progress: number; prefersReducedMotion: boolean }` in `usePracticeLoop.ts`.

Use passive scroll listeners and `requestAnimationFrame` batching. Clamp progress to `[0, 1]`, use a safe static fallback for SSR, and subscribe to `prefers-reduced-motion` without assuming `matchMedia` exists.

- [ ] **Step 4: Run the targeted test to verify it passes**

Run the same targeted test command.

Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/landing-stages.ts src/components/landing/usePracticeLoop.ts src/components/landing/__tests__/usePracticeLoop.test.ts
git commit -m "feat: add practice loop stage model"
```

### Task 2: Build the Practice Loop landing presentation

**Files:**
- Create: `src/components/landing/PracticeLoopLanding.tsx`
- Create: `src/components/landing/PracticeLoopArtifact.tsx`
- Create: `src/components/landing/PracticeLoopStages.tsx`
- Create: `src/components/landing/PracticeLoopProof.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `onStartSample: () => void`, `onOpenHowItWorks: () => void`, `onOpenHistory: () => void`, and the `usePracticeLoop()` result.
- Produces: presentational landing markup with the primary sample CTA and secondary navigation callbacks.

- [ ] **Step 1: Add the failing rendering contract**

Create a focused component test or static render check for `PracticeLoopLanding` that asserts:

- Exactly one `h1` communicates deliberate hands-on coding practice.
- The four stage labels `READ`, `THINK`, `WRITE`, and `VERIFY` are present.
- The primary sample action has an accessible name.
- The page includes a reduced-motion fallback sequence and no image/video dependency.

- [ ] **Step 2: Run the focused check to verify it fails**

Run the repository's existing TypeScript test command for the new component test.

Expected: FAIL because the landing components do not exist yet.

- [ ] **Step 3: Implement the landing composition**

Build the following structure:

- A semantic `header` with KeepCoding branding, Practice, How It Works, and History actions.
- A first viewport with a large editorial heading, concise product explanation, primary `Start sample challenge` CTA, and a code/challenge specimen.
- A scroll region that uses the active stage to update one continuous artifact rather than rendering four unrelated cards.
- A static four-stage fallback for reduced motion and narrow screens.
- A proof section that shows the actual mechanics: prompt, isolated workspace, and private judge.
- A final CTA that hands the visitor into the existing setup experience.

Use only existing palette tokens and contextual Lucide icons. Keep the copy short, factual, and free of em dashes and hype claims. Use `aria-current` or an equivalent state description for the active stage. Keep all primary controls keyboard reachable.

- [ ] **Step 4: Add the authored motion and responsive CSS**

In `globals.css`, add scoped classes or variables for the Practice Loop only:

- stage progress and artifact transforms,
- clip-path or opacity transitions that preserve a readable default state,
- `prefers-reduced-motion: reduce` overrides,
- mobile stacking and removal of pinned behavior,
- visible selection, caret, focus ring, and scrollbar styling consistent with the brand.

Do not add a generic animation utility or a page-wide gradient.

- [ ] **Step 5: Run lint and type validation**

Run: `npm run lint`

Expected: PASS with no new lint or accessibility-related JSX errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing src/app/globals.css
git commit -m "feat: build practice loop landing page"
```

### Task 3: Wire the landing page to the existing home state

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `PracticeLoopLanding` callbacks and existing `handleStartChallenge`, `setActiveTab`, `setIsHistoryOpen`, and `setIsHowItWorksOpen` state.
- Produces: the landing page as the default home view while preserving the active workspace branch and existing setup components.

- [ ] **Step 1: Write the integration checks**

Extend the existing e2e workflow or add a focused integration test that asserts:

- The default route renders the Practice Loop landing content.
- The primary sample CTA launches the existing first sample challenge.
- How It Works and History still open through their existing components.
- The prompt and paste setup controls remain reachable after the landing CTA or secondary practice action.
- The active challenge branch still renders `WorkspaceLayout` and `ResultModal`.

- [ ] **Step 2: Run the integration check to verify it fails**

Run: `npm test`

Expected: the new landing assertions fail before the route is wired.

- [ ] **Step 3: Wire `PracticeLoopLanding` into `Home`**

Render `PracticeLoopLanding` only in the existing home setup branch. Map its callbacks to the current state handlers. Keep the existing active challenge early return unchanged. Avoid moving judge, history, or challenge parsing logic into the landing components.

- [ ] **Step 4: Run the full repository test suite**

Run: `npm test`

Expected: PASS for parser, judge, workflow, and landing integration coverage.

- [ ] **Step 5: Run the production build**

Run: `npm run build`

Expected: PASS with no server/client boundary or TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/__tests__
git commit -m "feat: wire landing page into home flow"
```

### Task 4: Perform rendered visual and accessibility verification

**Files:**
- Modify: `src/components/landing/PracticeLoopLanding.tsx` only if verification finds a defect.
- Modify: `src/components/landing/PracticeLoopArtifact.tsx` only if verification finds a defect.
- Modify: `src/components/landing/PracticeLoopStages.tsx` only if verification finds a defect.
- Modify: `src/app/globals.css` only if verification finds a defect.

**Interfaces:**
- Consumes: the running production or development route.
- Produces: verified responsive, accessible, reduced-motion landing experience.

- [ ] **Step 1: Start the app and verify the route**

Run: `npm run dev`

Open the landing route and confirm the page responds, the sample CTA works, and the workspace transition is intact.

- [ ] **Step 2: Review shipped viewport sizes**

Inspect at 375px wide, tablet width, and desktop width. Confirm no horizontal overflow, clipped code, layout shift, or sticky content obscuring focus.

- [ ] **Step 3: Verify interaction states**

Keyboard through the header, stage controls, primary CTA, and existing setup controls. Verify visible focus rings, accessible names, disabled/loading behavior, and modal escape routes.

- [ ] **Step 4: Verify reduced motion**

Enable `prefers-reduced-motion: reduce`. Confirm the page presents the four stages statically and remains fully understandable without scroll-driven transitions.

- [ ] **Step 5: Run the Impeccable detector once**

Run:

```powershell
& 'C:\Users\yilma\.agents\skills\impeccable\scripts\impeccable.cmd' detect --json src\app\page.tsx src\app\globals.css src\components\landing
```

Expected: no critical design-system violations. Resolve any findings that conflict with `agent_learn.md` or the approved design spec.

- [ ] **Step 6: Run final validation**

Run:

```powershell
npm run lint
npm test
npm run build
```

Expected: all commands pass.

- [ ] **Step 7: Commit verification fixes**

```bash
git add src/app/page.tsx src/app/globals.css src/components/landing
git commit -m "fix: polish landing page responsive states"
```
