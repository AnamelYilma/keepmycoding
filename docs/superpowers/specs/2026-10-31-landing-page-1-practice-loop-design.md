# KeepCoding Landing Page 1: The Practice Loop

## Intent

Create the first true landing page for KeepCoding without changing the existing practice workflow. The page should make the product feel like a deliberate developer instrument, not a generic AI productivity site.

The page's narrative is the product's core loop:

1. Read a real task.
2. Think through the contract and edge cases.
3. Write the solution by hand.
4. Verify it against a private judge.

The primary audience is mixed developers, with language that remains useful to working developers, self-taught developers, and experienced developers protecting hands-on fluency.

## Goals

- Preserve the existing KeepCoding brand: dark zinc surfaces, mint primary accent, Geist typography, code-first utility language, and purposeful Lucide icons.
- Give the first viewport a clear point of view and a memorable visual hook.
- Make the current sample challenge the fastest path into the product.
- Use scroll as a meaningful narrative transition rather than as decorative reveal effects.
- Explain the practice philosophy with concise copy and real product surfaces.
- Keep the page responsive from small mobile screens through wide desktop displays.
- Respect reduced-motion preferences and maintain a usable keyboard path.
- Keep the initial implementation dependency-light and performant.

## Non-goals

- Do not replace or redesign the 3-column coding workspace.
- Do not add authentication, billing, testimonials, fake metrics, or invented customer stories.
- Do not add WebGL, video, or remote image dependencies in this first landing-page build.
- Do not introduce a second visual identity, pastel washes, rainbow accents, hype badges, or decorative AI iconography.
- Do not alter the challenge parser, judge API, history persistence, or workspace behavior.

## Anti-goals

The result fails if it looks like a centered marketing template with a gradient background, a stock hero image, a row of identical feature cards, or a wall of product copy. It also fails if motion distracts from the practice action, blocks keyboard users, causes layout shifts, or makes the mobile page feel like a reduced desktop composition.

## Current product constraints

- The home route is a client component that currently owns setup tabs, history, the how-it-works modal, and the transition into the active workspace.
- The existing setup flow is functional and should be retained behind the new landing narrative.
- The current visual system is defined in `src/app/globals.css` and uses `#09090b`, zinc surfaces, and `#88bda4` as the brand accent.
- Existing UI uses Geist Sans and Geist Mono through `next/font`, and Lucide React for contextual icons.
- The repository explicitly bans Sparkles, Wand2, decorative Zap usage, pastel washes, neon blobs, rainbow cards, pulsing hype badges, fake testimonials, em dashes, and marketing fluff.

## Selected approach

### The Practice Loop

The landing page is a scroll-led editorial sequence built from real product artifacts:

- **Opening:** a large, left-weighted statement about keeping coding intuition sharp, paired with a live-looking challenge specimen on the right. The specimen is not a fake dashboard. It is a compact, readable slice of the existing challenge format.
- **Transition:** as the visitor scrolls, the specimen moves through four authored states: `READ`, `THINK`, `WRITE`, and `VERIFY`. Each state changes the visible artifact and supporting copy. The motion should feel like one continuous instrument being opened, not four unrelated card animations.
- **Proof:** the actual product mechanics appear as a horizontal or stacked sequence on responsive layouts: prompt generation, isolated workspace, private judge. Each step uses existing language and real controls or representations.
- **Action:** the page ends the narrative at the current setup experience, with a prominent sample launch action and a secondary path to configure a prompt manually.

The page should feel expressive through composition, typography, clipping, code texture, and spatial continuity. It should not depend on generic gradients or ornamental effects.

## Alternatives considered

### The Signal / Noise Terminal

This would use a diagnostic-console metaphor where generated code noise is separated from deliberate reasoning. It is more experimental, but risks making the product look like an AI demo and could obscure the simple practice loop. It is not selected for Landing Page 1.

### The Daily Circuit

This would use a cinematic video or branded motion asset showing a developer moving through the practice cycle. It could create the strongest first impression, but it introduces production, loading, accessibility, and asset ownership costs before the product story is proven. It is not selected for Landing Page 1.

## Visual system

- **World:** dark developer workbench, editorial composition, precise and restrained.
- **Palette:** zinc foundation with the existing mint accent used for action and meaningful progress only. Semantic emerald, rose, and amber remain reserved for judge status.
- **Typography:** Geist Sans for display and UI, Geist Mono for challenge metadata, code, and measured state labels. No display font change in this first pass.
- **Shape:** mostly squared or lightly rounded surfaces that echo the current product. Avoid a wall of rounded cards.
- **Iconography:** Lucide icons only, used where they explain an interaction or state.
- **Texture:** code lines, rulers, borders, selection states, and subtle surface contrast. No blurry neon blobs.

## Motion and interaction

- One main scroll choreography drives the practice-loop specimen.
- Motion should use transform, opacity, clip-path, and shadow where useful, with an exponential ease-out feel.
- The default state must already be readable before animation begins.
- `prefers-reduced-motion: reduce` disables the choreography and presents the four stages as a static, accessible sequence.
- Buttons provide clear hover, pressed, disabled, and keyboard focus states.
- Any sticky or pinned region must never obscure the focused control.
- The page must remain usable without hover, pointer tracking, or scrolling past a particular animation threshold.

## Responsive behavior

- On wide screens, use an asymmetrical editorial split with the text and artifact sharing the first viewport.
- On small screens, stack the message before the artifact and convert the pinned sequence into a normal vertical sequence.
- Avoid horizontal scrolling and avoid requiring precise pointer movement.
- Keep body copy within a readable measure and preserve the existing touch target standards.
- Reserve space for every animated artifact so the page does not jump during scroll.

## Assets and implementation calls

- Use no user-supplied image or video asset for Landing Page 1.
- Prefer CSS and existing product primitives over a new animation package.
- Keep the current setup controls and callbacks intact; the landing composition may reorganize how they are introduced but must not duplicate their state logic.
- If the existing `page.tsx` becomes too large, extract presentational landing sections into `src/components/landing/` while keeping the route state orchestration in the page.

## Acceptance criteria

- A visitor can understand what KeepCoding is and why it differs from passive AI-generated coding within the first viewport.
- A visitor can launch the existing sample challenge without learning a new flow.
- The scroll sequence visibly communicates all four stages of the practice loop.
- The original prompt, paste, history, modal, and workspace behaviors still work.
- The layout is coherent at 375px, tablet width, and desktop width.
- Reduced motion, keyboard navigation, focus visibility, semantic headings, and meaningful labels are implemented.
- No banned visual or copy patterns from `agent_learn.md` are introduced.
- The final rendered page is reviewed at shipped viewport sizes before delivery.
