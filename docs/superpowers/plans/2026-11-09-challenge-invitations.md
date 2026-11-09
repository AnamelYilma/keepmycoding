# Challenge Invitations (Private & Public) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

---

## 1. Overview & Core Philosophy

KeepCoding allows developers to author deliberate practice challenges. Currently, challenges have three visibility modes: `temporary` (local one-time practice), `private` (restricted), and `public` (community library).

This plan introduces an **end-to-end invitation and access system** allowing authors to:
1. **Invite Developers to Private Challenges:** Private challenges remain hidden from the public library. Only the author and developers with a valid invitation can view, attempt, and solve them.
2. **Share Public Challenges via Invite Links:** Authors can generate a trackable challenge invite (e.g. `https://keepcoding.dev/join/[token]`) to invite friends or engineering teams to deliberate practice sessions.
3. **Seamless Recipient Experience:** Anyone with the link can join:
   - Authenticated developers automatically gain persistent access in their **"Shared with Me"** tab.
   - Unauthenticated visitors can preview the challenge details, sign in with one click, or try it directly as a guest.

---

## 2. Proposed Architecture & Data Model

### A. Database Tables (Supabase Postgres)

```sql
-- 1. Invite Links & Grants
CREATE TABLE IF NOT EXISTS public.challenge_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_email TEXT, -- Optional: for targeted invites
  max_uses INTEGER,     -- NULL = unlimited
  uses_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ, -- Optional expiration
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenge_invites_token ON public.challenge_invites(token);
CREATE INDEX IF NOT EXISTS idx_challenge_invites_challenge ON public.challenge_invites(challenge_id);

-- 2. Granted Access (who has accepted / has permission to access private challenges)
CREATE TABLE IF NOT EXISTS public.challenge_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_id UUID REFERENCES public.challenge_invites(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_access_user ON public.challenge_access(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_access_challenge ON public.challenge_access(challenge_id);
```

### B. Security & RLS Rules
- **Public Challenges:** Viewable by everyone in the library and via direct link.
- **Private Challenges:**
  - Viewable in API/Library ONLY if:
    - User is the `owner_id`, OR
    - User has a record in `challenge_access`, OR
    - Request includes a valid, active `invite` token.
  - Never exposed to unauthorized search or scraping.

---

## 3. User Flows & Interfaces

```
                    ┌─────────────────────────┐
                    │ Author Creates / Opens  │
                    │   Private or Public     │
                    │       Challenge         │
                    └───────────┬─────────────┘
                                │
                                ▼
                     Clicks [Invite / Share]
                                │
                                ▼
                   ┌──────────────────────────┐
                   │  InviteDevelopersModal   │
                   │                          │
                   │  - Shareable Join Link   │
                   │  - Optional Email Invite │
                   │  - Expiry / Usage Limits │
                   │  - Active Solvers List   │
                   └───────────┬─────────────┘
                                │
                        Copies Link / Sends
                                │
                                ▼
                   ┌──────────────────────────┐
                   │  Recipient Opens URL     │
                   │  /join/[token]           │
                   └───────────┬─────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         [Authenticated]                 [Guest / Unauth]
                 │                             │
    - Accepts invite token        - Shows invite welcome card
    - Grants `challenge_access`   - Options:
    - Adds to "Shared With Me"       a) 1-Click Sign in to save
    - Launches /studio               b) "Try as guest" directly
```

---

## 4. Implementation Tasks Breakdown

### Phase 1: Database Migration & Storage Layer
- [ ] **Task 1.1:** Create Supabase migration `supabase/migrations/202611090001_challenge_invitations.sql` for `challenge_invites` and `challenge_access` tables.
- [ ] **Task 1.2:** Add RPC helper function `accept_challenge_invite(p_token text, p_user_id uuid)` to handle atomic validation, use-count increment, and access grant.
- [ ] **Task 1.3:** Apply migration to Supabase using pooler connection and verify tables and indices.

### Phase 2: Backend API Endpoints
- [ ] **Task 2.1:** Implement `POST /api/challenges/[id]/invites`:
  - Validate that caller is the challenge owner.
  - Generate a secure random token (e.g. `inv_` + 16-byte base64url).
  - Return existing active invite or create new one.
- [ ] **Task 2.2:** Implement `GET /api/invites/[token]`:
  - Public endpoint to validate an invite token.
  - Returns challenge metadata (title, summary, language, level, author name).
  - Checks expiration, revocation, and use limits.
- [ ] **Task 2.3:** Implement `POST /api/invites/[token]/accept`:
  - Enrolls the authenticated user into `challenge_access`.
  - Increments `uses_count`.
  - Returns redirect route to `/studio?id=${challenge_id}`.
- [ ] **Task 2.4:** Update `GET /api/challenges`:
  - Support `tab=shared` returning challenges granted to the current user via `challenge_access`.
  - Filter out private challenges from the public library tab for non-owners.
- [ ] **Task 2.5:** Update `GET /api/challenges/[id]`:
  - Verify access: allowed if public, owner, in `challenge_access`, or if valid `?invite=` query token is passed.

### Phase 3: UI Components & Frontend Views
- [ ] **Task 3.1:** Create `src/components/challenges/InviteModal.tsx`:
  - Clean dark modal (`bg-zinc-900 border border-zinc-800`).
  - Copyable invite link input with 1-click clipboard button and visual toast.
  - Expiration selector (Never, 7 days, 30 days).
  - List of people who joined and their completion status.
- [ ] **Task 3.2:** Add "Invite" button to:
  - Challenge cards in `src/app/challenges/ChallengeLibraryPage.tsx` (for authored challenges).
  - Header of `src/app/challenges/[id]/ChallengeDetailsPage.tsx`.
- [ ] **Task 3.3:** Create Join Invitation Page at `src/app/join/[token]/page.tsx`:
  - Header with KeepCoding logo and brand badge.
  - Challenge summary card: "Invited by **[Author Name]**".
  - Language, difficulty level, and acceptance criteria tags.
  - "Accept Invite & Start Practice" CTA button.
  - "Try as Guest" secondary CTA.
- [ ] **Task 3.4:** Add **"Shared with Me"** tab to `src/app/challenges/ChallengeLibraryPage.tsx`:
  - 3-way segmented toggle: **Challenge Library** | **Shared with Me** | **My Challenges**.
  - Displays private challenges the user was invited to solve.

### Phase 4: Testing & Verification
- [ ] **Task 4.1:** Write unit/integration tests in `src/__tests__/challenge-invites.test.ts`:
  - Test token generation, expiration check, and one-time vs multi-use limits.
  - Test access grant and private challenge visibility enforcement.
- [ ] **Task 4.2:** Run `npm run test` and `npm run build` to verify zero regression.
- [ ] **Task 4.3:** Verify live invitation creation, link copying, and accepting in the browser.

---

## 5. Design & Security Commitments
- **Zero Secret Leakage:** Author credentials or sensitive challenge reference solutions are never exposed on invite preview.
- **Anti-AI Design Protection (`agent_learn.md`):** Dark Tailwind zinc palette (`bg-zinc-950`, `bg-zinc-900`, `border-zinc-800`, `#88BDA4` mint accents). No Sparkles, no Wand2, no em dashes, no marketing fluff.
- **Viewport Ergonomics:** Any popover/modal uses standard accessible focus trap and viewport auto-positioning.
