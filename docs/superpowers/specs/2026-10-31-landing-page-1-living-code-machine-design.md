# KeepCoding Landing Page 1: The Living Code Machine

## Decision

Replace the previous Landing Page 1 concept, The Practice Loop. Keep Landing Page 2 untouched.

Landing Page 1 is the root route at `/`. Landing Page 2 remains `/landing-page-2`.

The selected implementation is cinematic browser-native motion: sticky layout, CSS transforms, clip paths, and a requestAnimationFrame scroll controller. No WebGL, video, remote imagery, or animation dependency is required.

## Intent

Make KeepCoding feel like a serious instrument for rebuilding coding intuition, not a conventional SaaS landing page. The visitor should see one real coding problem become understandable through deliberate work.

The page's central artifact is a living code machine. It is one challenge surface that changes state as the visitor scrolls:

1. **ASSUMPTION**: the buggy comparison is isolated in a real code line.
2. **EDGE CASE**: the contract and failing boundary move into focus.
3. **HANDWRITE**: the editable file becomes the center, with locked context visibly receding.
4. **VERDICT**: the private judge returns a structured pass/fail result and coaching signal.

This is not four cards. It is one object changing state.

## Audience and success

KeepCoding serves a mixed developer audience: working developers rebuilding fluency, self-taught developers strengthening fundamentals, and experienced developers protecting hands-on reasoning.

Success means a visitor can answer three questions quickly:

- What is KeepCoding?
- Why is it different from asking an AI to write the code?
- How do I enter a real challenge?

The primary action is to open the existing built-in sample challenge.

## Goals

- Preserve the zinc foundation, mint brand accent, Geist typography, and code-first voice.
- Create a visually distinct first viewport with a real point of view.
- Use a single authored motion sequence that gives scroll a purpose.
- Show believable product mechanics from the existing sample challenge.
- Make the transition into the existing workspace immediate and understandable.
- Remain responsive, keyboard accessible, and useful with reduced motion.

## Non-goals

- Do not modify `/landing-page-2`.
- Do not redesign the 3-column workspace.
- Do not add fake testimonials, metrics, customer stories, authentication, billing, or claims.
- Do not use WebGL, video, remote images, gradient blobs, pastel washes, decorative AI icons, or a new animation package.
- Do not change parser, judge, history, or challenge behavior.

## Visual direction

### Composition

The first viewport is split asymmetrically:

- Left: oversized editorial statement and a narrow vertical rail that names the active stage.
- Right: the Living Code Machine, occupying real visual weight and extending beyond the first viewport.
- The code machine is not a floating dashboard. It is a framed, layered work surface with a visible file tab, line numbers, contract note, and judge output track.

Below the hero, the machine becomes sticky while the stage narrative scrolls beside it. The left story controls the machine state; a thin mint trace on the rail shows the active position. The machine’s panels slide, crop, and reorder rather than simply fading in.

### Materials

- Background: `#09090b` with a restrained 1px grid and hard section boundaries.
- Surfaces: `#111113`, `#18181b`, and zinc borders.
- Accent: existing `#88bda4`, used for active state, focus, and primary action.
- Semantic result colors: emerald for pass, rose for fail, amber for boundary.
- Depth: offset soft black shadows and layered borders, never glowing blobs.
- Typography: Geist Sans for display and UI, Geist Mono for code, stage labels, and measured metadata.

### Copy voice

Direct and specific:

- “The code is not the practice.”
- “Keep the decision yours.”
- “Find the boundary before the judge finds it.”

No hype words, em dashes, fake urgency, or generic AI marketing language.

## Motion behavior

The machine has one continuous scroll timeline while the sticky section is active:

- `0.00 - 0.22`: code window enters from an offset, the bug line receives a rose underline, and the stage rail activates `ASSUMPTION`.
- `0.22 - 0.48`: a contract strip clips into view, the comparison line shifts upward, and an amber boundary marker lands beside the relevant test.
- `0.48 - 0.74`: the editor panel expands, the locked companion file shifts behind it, and the solution line is revealed without pretending to type for the user.
- `0.74 - 1.00`: the judge panel slides in from the right, the verdict becomes explicit, and the final CTA becomes available.

The default first frame must be fully readable. Motion must not be required to discover the product's purpose.

With reduced motion:

- The machine renders as a static four-part composition.
- All four stage labels remain fully visible.
- No stage is dimmed solely because it is not active.
- The primary CTA and workspace handoff remain in normal DOM order.

## Responsive behavior

- Desktop: sticky machine with story rail and asymmetric composition.
- Tablet: sticky machine remains, but the story rail becomes a horizontal stage index above the artifact.
- Mobile: no sticky choreography. The four machine states become a vertical sequence with the relevant code and explanation stacked.
- No horizontal scroll, clipped code, hover-only behavior, or pointer tracking.
- All controls have visible focus, accessible names, and touch-safe targets.

## Existing product integration

- `Start a sample challenge` calls the existing sample parsing path and opens the existing workspace.
- Header actions continue to open How It Works and History.
- The existing prompt and paste setup remains below the landing narrative as the manual route.
- Landing Page 2 remains an independent route and file set.

## Acceptance criteria

- The root route is unmistakably Landing Page 1 and visually distinct from `/landing-page-2`.
- The first viewport contains a strong artifact, not only a heading and supporting text.
- Scrolling through the machine visibly changes the artifact across all four states.
- The code specimen uses actual KeepCoding sample content or faithful representations of it.
- Reduced-motion mode presents all content statically and legibly.
- Mobile composition is intentional, not a compressed desktop layout.
- The sample CTA enters the existing workspace.
- No banned patterns from `agent_learn.md` appear.
- Static detector, lint, test, build, and rendered viewport verification are run when the local toolchain is available.
