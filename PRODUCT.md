# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers learning to code and working developers who want deliberate practice writing code by hand.

## Product Purpose

KeepCoding is an open-source tool for keeping coding intuition sharp through hands-on practice. Success means understanding a challenge, solving it in an isolated editor, and learning from evaluation feedback.

## Positioning

KeepCoding combines externally generated structured challenges, a focused multi-file coding workspace, and a private server-side AI judge in one practice loop.

## Operating Context

Users choose a track, difficulty, challenge type, and language; send a generated prompt to an AI of their choice; paste the tagged response into KeepCoding; write code in the browser; and submit it for feedback. A built-in sample challenge is available for trying the workspace.

## Capabilities and Constraints

- The workspace presents challenge instructions, editable and read-only files, and verification feedback.
- Challenge evaluation is sent through the server-side `/api/judge` route.
- Email and password accounts use Supabase Auth. Sign-up collects a name, developer role, experience level, and optional gender.
- Account confirmation and password reset use Supabase email links routed through `/auth/callback`.
- Practice history is stored locally in the browser.

## Brand Commitments

- Product name: KeepCoding.
- The interface uses a dark zinc foundation, a mint primary accent (`#88BDA4`), Geist sans-serif for UI text, and Geist Mono for code.
- Keep the experience focused on hands-on developer practice. Avoid invented testimonials, metrics, and promotional claims.

## Evidence on Hand

- The repository includes a working browser editor, a private judge route, and built-in sample challenges.
- No customer testimonials, usage metrics, production video, or product photography are present.

## Product Principles

- Keep the developer responsible for writing and changing their solution.
- Make challenge requirements and evaluation feedback clear.
- Keep the practice flow focused and free of distractions.
