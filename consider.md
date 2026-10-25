# Security and Pre-Push Guide (consider.md)

This project is public and deployed to production. 
All AI agents and developers must follow these security rules.

---

## 1. Golden Rule: Zero Secret Leakage

- Never put real API keys, tokens, or passwords in any code file.
- Never commit `.env` or any file with sensitive values.
- Assume anything committed to git will be visible to the entire world forever.

### Where Secrets Belong

| Environment | Where to Store Secrets | How Code Reads Them |
| :--- | :--- | :--- |
| **Local dev** | `.env.local` or `.env` | `process.env.KEY` |
| **Production** | Hosting dashboard (Vercel, Railway, etc.) | Injected at runtime |
| **CI / CD** | GitHub Repository Secrets | GitHub Actions env |

### Safe Setup for `.env`

1. Put secrets in `.env`:
   ```bash
   AI_API_KEY=your_actual_key_here
   DATABASE_URL=your_actual_db_url
   ```
2. Commit only `.env.example` with dummy values:
   ```bash
   AI_API_KEY=your_key_here
   DATABASE_URL=your_db_url_here
   ```
3. Make sure `.gitignore` contains:
   ```gitignore
   .env
   .env.*
   !.env.example
   ```

---

## 2. Before Every Git Push: 3-Step Check

Always run these commands before you commit and push:

### Step 1: Check staged files
```bash
git status
```
- Look at the list of files.
- If you see `.env`, credentials, or config with keys, stop immediately!

### Step 2: Review changes line by line
```bash
git diff --staged
```
- Read every green line you are about to commit.
- Search for strings like `sk-`, `key`, `secret`, `token`, `password`.

### Step 3: Run quick scan (optional but recommended)
```bash
git log -n 1 -p
```
- Confirm the commit content is clean before running `git push`.

---

## 3. Rules for AI Agents

When writing or editing code in this workspace:

1. **Never write hardcoded keys**
   - Use environment variables only.
   - Example: use `process.env.OPENAI_API_KEY`, never `"sk-proj-12345..."`.

2. **Check `.gitignore` first**
   - Before creating any config or cache file, verify it will not be tracked by git.

3. **Never print secrets to logs or console**
   - Do not use `console.log(process.env)` or log API responses containing tokens.

4. **Sanitize error messages**
   - Do not show internal system errors or API keys to end users.

5. **Stop and alert if a secret is found**
   - If an API key is already in git history, treat it as compromised.
   - Rotate the key immediately.

---

## 4. Emergency Action: What If a Key Is Pushed?

1. **Rotate immediately**
   - Go to your AI provider or cloud dashboard and revoke the leaked key right now.
2. **Remove from history**
   - Removing the file in a new commit is not enough.
   - The key must be revoked, and git history must be rewritten if necessary.
3. **Generate a fresh key**
   - Add the new key only to your hosting provider settings.
