# KeepCoding Project Plan

## Overview
A minimalist web app for daily active coding practice.
Developers paste a generated tagged challenge block from an external chat AI, edit code by hand in an in-browser workspace, and submit it to a private server-side AI judge for instant feedback.

## Architecture & Constraints
- Framework: Next.js (App Router), TypeScript, Tailwind CSS
- Editor: Multi-file code editor with read-only lock support
- Security: Server-side AI judge call via environment variables; zero client key exposure
- UI Style: Clean, minimalist, simple language, no wall of text, no em dash characters

## Execution Roadmap
- Task 1: Project Setup and Scaffolding
- Task 2: Tagged Challenge Parser and Validator Engine
- Task 3: Master Prompt Generator and Ingestion UI
- Task 4: Minimalist 3-Column Code Workspace
- Task 5: Secure AI Judge Route
- Task 6: Verdict and Result Screen
- Task 7: Local History Storage and Full Loop Verification
