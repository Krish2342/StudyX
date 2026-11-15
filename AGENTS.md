# StudyX: Permanent Project Rules

Read this file at the start of every session. Also read STUDYX_FRONTEND.md and WORKFLOW.md.

## 1. Product wording (no "demo" in the UI)
- Remove every user-visible "demo", "sample data only", "frontend demo", "placeholder" and "Built with React · Vite · Tailwind · Motion" text.
  Example: the footer line "© 2026 StudyX. Frontend demo — sample data only." becomes "© 2026 StudyX. All rights reserved."
- Write the UI as a real product. Use real, believable content, never lorem ipsum.
- Do NOT write fake claims. If a feature has no backend yet (login, saving to a server, AI output), do not tell users it is saved or processed securely. Use honest, neutral wording instead (e.g. "Coming soon" badge, or hide the feature).
- Developer-only notes belong in code comments and README.md, never on screen.

## 2. Frontend quality
- Every button, link, form and menu must do something meaningful. No dead controls.
- Colors: #0A0A0A (60%), #FFFFFF (30%), #8DB9F0 (10%) only.
- Animations use Motion (import from "motion/react"). Respect prefers-reduced-motion.
- Responsive: mobile, tablet, laptop, desktop. No horizontal overflow. Touch-friendly controls.
- Keep components under about 200 lines. Keep data in src/data and logic in src/services so a real backend can replace them later.
- Accessible: semantic HTML, visible focus, keyboard navigation, good contrast.

## 3. Git and GitHub rules (secure and orderly)
- Commit after every stable milestone. Use small, clear messages like "feat: explore page with search".
- END OF DAY: when I say "end of day", do this checklist in order:
  1. Run npm run build. If it fails, fix it first. Never commit a broken build.
  2. Run git status and show me the file list.
  3. Scan for secrets: check that no .env file, API key, token, password or private key is staged. If any is found, stop and tell me.
  4. git add . then git commit -m "<clear summary of today's work>".
  5. git push origin main.
  6. Report: commit message, files changed, what is finished, what is left for tomorrow.
- Never commit: .env, .env.*, node_modules, dist, API keys, tokens, passwords, service-account files.
- Never use git push --force, git reset --hard or delete branches without asking me first.
- Never ask me to paste tokens or passwords into this chat. Use "gh auth login" or the browser sign-in.
- Keep .gitignore updated. Keep a README.md with setup steps and a CHANGELOG.md with daily progress.

## 4. Deployment rules
- The site must pass npm run build with zero errors before deploying.
- Set the page title, meta description, favicon, Open Graph tags, robots.txt and sitemap.
- Add a 404 page and SPA routing support so that refreshing any route works.
- Environment variables go in the hosting dashboard, never in the code.
- Keep the Vite dev server running during development for preview.

## 5. Working style
- I am a beginner. Explain simply, give exact PowerShell commands and file paths.
- Build in small milestones. Test before saying something works. Never claim a feature works if it was not tested.
- If something is unclear or risky, ask me one clear question before continuing.
- Do not start backend work (database, Google login, AI APIs) until I explicitly say "start Stage 2".