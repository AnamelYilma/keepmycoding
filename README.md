# KeepCoding

Deliberate active coding practice for developers. Read, think, and write code by hand in an in-browser workspace with private AI judging.

## Overview

Modern AI code generation tools can erode core mental coding models. KeepCoding provides targeted daily practice:
- Copy a structured prompt tailored to your track, difficulty level, and past attempts.
- Paste the prompt into your preferred AI chat model (Claude, ChatGPT, Gemini) to generate a standardized tagged challenge.
- Ingest the challenge into an in-browser 3-column workspace with a multi-file editor, read-only file locks, and live symbol outline.
- Submit your solution to a private server-side AI judge (Google AI Studio Gemini) or use the deterministic offline evaluator.

## Practice Tracks

1. **User Identity and Access**: JWT validation, RBAC policies, password hashing, session revocation.
2. **Interactive UI and State**: Debounce hooks, optimistic updates, race condition guards, form reducers.
3. **API and Persistence**: Cursor pagination, cache invalidation, idempotency keys, connection retry.
4. **Data Security**: Constant-time comparison, SQL injection prevention, input sanitization, rate limiting.

## Quick Start

### 1. Prerequisites
- Node.js 20+
- npm 10+

### 2. Installation
```bash
git clone <repository-url>
cd keepcoding
npm install
```

### 3. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env.local
```

Configure your Google AI Studio API key in `.env.local`:
```env
AI_API_KEY=your_gemini_api_key_here
```
> Note: If no API key is configured, KeepCoding automatically falls back to an offline deterministic evaluator so you can test challenges locally without external dependencies.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev`: Start Next.js development server.
- `npm run build`: Build production application bundle.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint check.
- `npm test`: Run test verification suite (parser, judge, workflow).

## Security Policy

KeepCoding follows strict security practices:
- **Zero Secret Leakage**: API keys and tokens are stored exclusively in `.env.local` and runtime environment variables. They are never sent to the browser or logged to stdout.
- **Header Authentication**: API requests to AI providers use HTTP headers rather than query strings to prevent access log exposure.
- **Sanitized Errors**: Error responses omit internal tracebacks and keys.
- **Tracked Configuration**: Only `.env.example` with dummy values is committed to git. All actual `.env*` files are strictly ignored.

## License

MIT
