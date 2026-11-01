# Landing Page 1: The 4D Practice Instrument

## Scope

This replaces the root landing page only. It must not modify or render the `/landing-page-2` surface. The root landing experience ends with a complete final state and a clear doorway into Studio. The prompt-generation and paste-challenge UI belongs to Studio, not to the landing page.

## Creative thesis

KeepCoding is a practice instrument, not a marketing dashboard. The page should make the act of deliberate coding visible as a physical system.

The central object is a 4D Practice Instrument: four layered code planes representing:

- **READ**: the contract and task surface
- **THINK**: boundary cases and test pressure
- **WRITE**: the editable code plane
- **VERIFY**: the judge result and coaching signal

Scroll is the primary interaction. It does not merely reveal sections. It changes the relationship between the planes:

- planes separate on the z-axis,
- the active plane enlarges and rotates into focus,
- the inactive planes become structural context,
- a thin trace line connects the decision through the machine,
- the stage rail advances from intent to proof.

The last state is not another feature section. It is the finished instrument: a stable verdict, a concise explanation of what was learned, and one primary action to enter a real challenge.

## Visual world

- Dark zinc workbench with precise grid lines and hard edges.
- Mint is the single brand action color.
- Rose marks the broken assumption, amber marks boundary pressure, emerald marks the verified state.
- Geist Sans handles large statements. Geist Mono handles code, labels, and measured state.
- Layered planes use borders, offset shadows, clipped corners, and perspective transforms. No blurred gradient blobs, glass decoration, pastel cards, or generic rounded-card grids.
- The central machine should occupy most of the viewport, not sit as a small illustration beside a headline.

## Page composition

1. **Entry viewport**: a strong short statement and the instrument already visible in its initial READ state.
2. **Instrument viewport**: the machine pins while the user scrolls through the four planes. Each plane has its own code/text artifact and active explanation.
3. **Resolution viewport**: the planes settle into a single readable verdict. The page explains the distinction between generated output and retained coding intuition.
4. **Final doorway**: one prominent CTA to enter Studio. No prompt-builder card, no paste form, no setup dashboard, and no challenge-generation form on this route.

The landing page must feel longer than one screen, but every viewport must have a designed composition and a clear purpose. No partially finished blank sections.

## Motion

Use browser-native CSS transforms, perspective, clip-path, and requestAnimationFrame. No WebGL or animation dependency is required.

- Desktop: sticky instrument stage, scroll-driven progress within the machine section.
- Tablet: reduced perspective and a horizontal stage rail.
- Mobile: no sticky transform choreography; show four full-width planes in a deliberate vertical sequence with a static final state.
- Reduced motion: all four planes are fully visible, opacity is not used to hide meaning, and the final doorway is immediately available.

## Content

Use the existing built-in token-expiration challenge as the content source. The central line must be recognizable:

`return token.exp >= currentTimestampSec;`

The instrument should show the contract, boundary case, editable file, locked companion file, and a PASS/FAIL verdict as product evidence. Avoid invented usage metrics, testimonials, or claims.

## Studio boundary

Landing Page 1's primary CTA navigates to `/studio`. Studio is the practical entry surface and contains the existing prompt-generation controls, copy-master-prompt action, paste-challenge flow, history, and sample launch. The landing page explains why the work matters; Studio is where the guest configures or brings a challenge.

The existing setup UI should be moved or extracted into `/studio` without changing its behavior. Starting a sample challenge from Studio continues into the existing workspace.

## Completion criteria

- Root route is clearly Landing Page 1 and distinct from `/landing-page-2`.
- The setup UI is not appended to the landing page.
- Studio provides the prompt-generation and paste-challenge interface at `/studio`.
- The central instrument is the dominant visual element.
- Scroll visibly changes the planes and stage relationship, not only text opacity.
- The ending is a finished verdict plus workspace CTA.
- Desktop, tablet, 375px mobile, keyboard navigation, and reduced motion are intentionally designed.
- Existing workspace and parser behavior remain intact.
