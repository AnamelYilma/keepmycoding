# KeepCoding Agent Learning & System Design Rules (agent_learn.md)

This document serves as the design protection and development guideline for **KeepCoding**. It protects the application from generic AI anti-patterns, sloppy aesthetic tropes, and security leaks. All AI agents and contributors working on this codebase must adhere strictly to these rules.

---

## 1. Core Philosophy: Focused Developer Utility Over AI Slop

KeepCoding is a minimalist, distraction-free environment for daily active hands-on coding practice. Developers come here to read specifications, think through edge cases, and write code by hand in an isolated workspace.

- **Developer First:** The UI should feel like a high-performance developer tool (like Linear, Zed, or GitHub), not a flashy SaaS marketing pitch.
- **Zero Distraction:** No decorative fluff, no walls of text, and no gimmicks.
- **Pragmatic Precision:** Every element on screen must serve an active purpose in the user's practice loop.

---

## 2. Icon & Visual Language Guidelines

### 🚫 Strictly Banned:
- **NEVER use the `Sparkles` icon** (or any "magic AI sparkle" icon). It immediately cheapens the app and signals generic "AI slop".
- **NEVER use `Wand2` or magical hype icons**.
- **NEVER use `Zap` as a decorative or generic "hype" icon** (e.g., floating above headings or next to features).
- **NO decorative icon spam:** Do not place icons next to every single word, heading, or bullet point just to fill space.

### ✅ Allowed & Required:
Only use purposeful, contextual, and utilitarian icons from `lucide-react`:
- **Code & Syntax:** `Code2`, `Terminal`, `FileCode`, `Folder`, `Braces`, `FileText`
- **Workspace State:** `Lock`, `Unlock`, `RotateCcw`, `Copy`, `Check`, `ExternalLink`, `Save`
- **Evaluation & Verdict:** `ShieldCheck`, `CheckCircle2`, `XCircle`, `AlertCircle`, `Clock`, `Play`
- **Navigation & Layout:** `ArrowRight`, `ChevronRight`, `ChevronDown`, `History`, `PanelLeft`, `PanelRight`

---

## 3. Anti-AI Color & Styling Rules (Strictly Banned Patterns)

### 🚫 Banned Patterns:
1. **Light / Low-Opacity Color Washes as Backgrounds:**
   - NEVER use pastel washes (`bg-emerald-50`, `bg-blue-500/10`, `bg-purple-500/10`, `bg-indigo-50`, `bg-amber-500/10`) for cards, avatars, badges, or icon containers.
   - Light pastel backgrounds on dark or light themes are an immediate giveaway of automated template code.
2. **Multi-Color Accents on the Same Screen:**
   - NEVER create a "rainbow dashboard" where Card 1 is purple, Card 2 is blue, Card 3 is amber, and Card 4 is emerald.
   - The UI must remain unified and cohesive across all screens.
3. **Random Non-Brand Colors:**
   - Do NOT inject unapproved colors from outside the defined palette (no random `indigo-600`, `violet-500`, or `cyan-400`).
4. **Neon Gradient Blobs & Blurry Glow Overlays:**
   - NEVER place oversized glowing radial gradients, fuzzy neon blobs, or rainbow gradients behind hero titles or cards.

### ✅ Allowed & Required:
- **Palette Foundation:** Clean dark neutral palette based on Tailwind `zinc`:
  - Background: `bg-zinc-950`
  - Elevated Surfaces / Cards: `bg-zinc-900`
  - Borders & Dividers: `border-zinc-800` (subtle `border-zinc-700/60` for interactive focus)
  - Primary Text: `text-zinc-100`
  - Secondary Text: `text-zinc-400`
  - Subtle / Captions: `text-zinc-500`
- **Semantic Signals Only:** Color should be used exclusively for meaningful status communication:
  - **Success / Pass:** `emerald-400` / `text-emerald-400` with subtle `border-emerald-500/30`
  - **Failure / Rejection:** `rose-400` / `text-rose-400` with subtle `border-rose-500/30`
  - **Warning / Syntax Issue:** `amber-400` / `text-amber-400` with subtle `border-amber-500/30`
  - **Info / Metadata:** `zinc-400` / `border-zinc-800`
- **Icon Containers:** Use neutral dark surfaces: `bg-zinc-900 border border-zinc-800 text-zinc-300`.

---

## 4. Banned Badges, Shapes & Copy Anti-Patterns

### 🚫 Banned UI Anti-Patterns:
- **No Pill Badges with Ping / Pulsing Radar Dots:**
  - BANNED: Pill badges with a pulsing dot + 2-3 hype words floating above titles (e.g. `<span class="animate-ping ..."></span> AI-Powered Practice`).
- **No Tiny Colored Pill Rectangles Everywhere:**
  - Do NOT clutter cards with multiple rounded chips in contrasting bright colors. Use clean typography, subtle borders, or plain text labels.
- **No Fake Testimonials or AI Customer Reviews:**
  - Do not invent fake reviews ("Transformed my skills! - Alex K."). Keep all content focused on real mechanics, instructions, and challenge data.

### 🚫 Banned Copy Tropes:
- **NO Em Dash ("—") Characters:** KeepCoding style explicitly forbids em dashes. Use standard hyphens, colons, commas, or separate sentences instead.
- **NO AI Marketing Fluff:** Avoid buzzwords like:
  - "Supercharge"
  - "Next-Gen"
  - "Seamlessly"
  - "Revolutionary"
  - "Unleash your potential"
  - "Elevate your workflow"
- **NO Walls of Text:** Keep descriptions and challenge instructions concise, clear, and actionable.

---

## 5. Workspace & Code Editor Standards

KeepCoding revolves around the 3-column hands-on practice workspace:

1. **Column 1: Challenge Specification & Constraints**
   - Display task objectives, input/output contracts, and constraints clearly.
   - Render code tags, function signatures, and test cases using `font-mono text-xs`.
2. **Column 2: Hands-On Multi-File Editor**
   - Editable files must be clearly separated from read-only companion files.
   - Read-only files must display a visible `Lock` indicator and prevent accidental keyboard edits.
   - Unsaved edits must show an indicator (e.g. dirty dot on tab) and prompt confirmation before leaving or resetting.
   - Editor tabs must display language-appropriate filenames and clean active/inactive tab states.
3. **Column 3: Verification & Judge Output**
   - Must provide clear, structured feedback: Verdict (`PASS` vs `FAIL`), summary breakdown, and actionable coaching tips.
   - Never replace the user's code automatically; the user must write the fix themselves.

---

## 6. Security & Zero Secret Leakage (consider.md Alignment)

- **Golden Rule:** Zero Secret Leakage. Never put API keys, tokens, or credentials in client components or git-tracked files.
- **Judge Calls:** All evaluations must go through the server-side API route (`/api/judge`).
- **No Secret Printing:** Do not log credentials or internal provider headers to the client console or error responses.
- **Sanitized Errors:** If an upstream AI judge call fails, return a clean, friendly error message to the client without leaking provider endpoints, keys, or stack traces.

---

## 7. Contrast & Typography Verification

- **High Contrast:** In dark mode, ensure text is effortlessly readable. Never use dark gray text on a dark background or low-contrast muted colors on small font sizes.
- **Font Pairing:**
  - UI Text: Clean sans-serif (`font-sans`, Geist Sans or system default).
  - Code & Data: Clean monospace (`font-mono`, Geist Mono or system monospace).
- **Interactive States:** Buttons and inputs must have visible focus rings (`focus-visible:ring-1 focus-visible:ring-zinc-400`), smooth hover feedback, and disabled states with `cursor-not-allowed opacity-50`.
