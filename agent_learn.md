# Agent Learning & System Design Rules

## 1. Icon & Visual Language Guidelines
- **NEVER use the `Sparkles` icon** (or similar "magic AI sparkle" decorative icons) anywhere on this platform or website. It gives an immediate "AI slop" / frivolous impression.
- **NEVER use `Zap` as a decorative or generic "hype" icon** (e.g. above headings or next to steps). Only use contextual, practical icons.
- Avoid cluttered, meaningless decorative iconography. Every icon must represent concrete utility:
  - For work / tasks: `Briefcase`, `Layers`, `FolderKanban`, `FileText`
  - For academic / learning: `GraduationCap`, `School`, `BookOpen`
  - For verification & trust: `ShieldCheck`, `CheckCircle2`
  - For users & accounts: `User`, `Users`
  - For navigation & actions: `ArrowRight`, `ExternalLink`, `Plus`

---

## 2. Anti-AI Color & Styling Rules (Strictly Banned Patterns)
The user strongly dislikes generic "AI template vibe" color choices. The following patterns are **BANNED**:

### ❌ BANNED:

1. **Light / Low-Opacity Color Washes as Backgrounds:**
   - NEVER use `bg-emerald-50`, `bg-blue-500/10`, `bg-amber-50`, `bg-indigo-50`, `bg-emerald-100`, `bg-teal-500/10`, or `style={{ backgroundColor: "var(--brand-lightwash)" }}` for:
     - Avatar letter fallbacks
     - Card backgrounds or banner backgrounds
     - Pill badges or small text wrappers
     - Icon container boxes (`w-11 h-11` or `w-9 h-9`)
   - The user considers light green / light blue / light amber backgrounds on cards or icons to be a telltale sign of bad AI-generated design.
2. **Multi-Color Accents on the Same Page:**
   - NEVER mix different random Tailwind color families across chips or cards on the same page (e.g., using indigo for Card 1, amber for Card 2, emerald for Card 3).
   - Stick strictly to the cohesive brand palette or neutral container tones.
3. **Random Non-Brand Colors:**
   - NEVER introduce unapproved random colors (e.g., raw `amber-500`, `indigo-600`, `blue-700`, `emerald-600`).
   - Use the official brand tokens:
4. **Card Gradients & Neon Blurs:**
   - NEVER give individual cards aggressive gradient backgrounds or massive neon blur backdrops that make them stand out in an artificial, jarring way. Keep cards clean and consistent using `var(--card-bg)`.

### ✅ ALLOWED & REQUIRED:
- **Icon Containers:** Use clean neutral borders and surfaces: `border border-[var(--card-border)] bg-[var(--background)]` or `bg-[var(--card-bg)]`, with the icon colored using `var(--brand-primary)`.
- **Avatar Letter Fallbacks:** Use solid brand background `backgroundColor: "var(--brand-primary)"` with white text `color: "var(--brand-primary-foreground)"`.
- **Badges & Labels:** Use clean neutral borders and subtle text rather than loud or pastel pill fills.

---

## 3. Banned Badge & Shape Anti-Patterns
- **No Pill Badges with Ping/Dot above Headings:**
  - BANNED: Pill badges with a pulsing dot / icon + 2–3 words floating above heroes or sections (e.g., `<span class="animate-ping ..."></span> Live University Network`).
  - The user explicitly bans this pattern in `agentSkill.md`: *"NEVER render them as a pill badge with a dot/icon + 2-3 words above the hero — that pattern is banned"*.
- **No Tiny Colored Pill Rectangles Everywhere:**
  - Do NOT clutter cards and steps with tiny rounded colored rectangles (e.g., `Single Focus`, `Verification`, `Direct Work`).
  - Use simple, humanized structural labels (e.g., `Step 1`, `Step 2`, `Step 3`, or plain bold text without pill wrappers).

---

## 4. Real Content Over AI Placeholders
- **NO Fake Testimonials / Placeholder Reviews:**
  - Do not render fabricated customer reviews with fake quotes and initials (`“Found motivated students... — Dawit A.”`).
  - Replace fake feedback with **concrete value props and actual product mechanics** (e.g., Job Postings, Gigs & Contracts, Internships).
- **Humanized, Pragmatic Copy:**
  - Avoid AI marketing fluff ("Next-Gen", "Seamless Synergies", "Empowering Dreams").
  - Speak plainly about real workflows: student ID verification, 100 ETB anti-spam listing fee, 0% commission take-home for students, faculty targeting.

---

## 5. Hero Illustration Sizing & Placement
- The hero character image must be **bold, prominent, and sized naturally**:
  - Should crop cleanly at knee level (`scale-[1.32] lg:scale-[1.38]` with `origin-top-right`).
  - Must not sit too far right with an awkward, empty gap on wide screens (`translate-x-[-8%] lg:translate-x-[-12%]`).
  - Must NOT be clipped away or made invisible by aggressive `clip-path` animations or reduced-motion opacity freeze bugs.

---

## 6. Theme & Contrast Rules
- In **Dark Mode**, `--brand-primary` is a light pastel mint green (`#88BDA4`).
- Any button or badge that uses `style={{ backgroundColor: "var(--brand-primary)" }}` MUST use dark/black text (`text-white dark:text-[#0D1613]`) rather than remaining white. White on `#88BDA4` has poor contrast and is hard to read.
- Similarly, icons placed inside a container with `backgroundColor: "var(--brand-primary)"` must adapt to dark text/icon color in dark mode (`text-white dark:text-[#0D1613]`).

---

## 7. Guest & Public Navigation Rules
- Guests should **only** see public landing pages, about, how it works, FAQ, and Auth (Login/Register).
- **Never expose "Client Portal" or "Student Portal" links** in the guest navbar or public headers. Workspace portals are private and accessible only after authenticating into the corresponding user role.
