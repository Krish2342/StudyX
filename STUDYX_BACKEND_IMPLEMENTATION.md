# StudyX

An AI-powered study platform for college students. Find notes, books and previous year papers,
understand hard topics, and prepare for exams — in one focused dark workspace.

This repository started as a Stage 1 frontend. Milestones 1–6 now include a Supabase foundation,
Google-auth-ready student onboarding, a protected Super Admin shell, and database-backed resource
submission, discovery, bookmarking, rating, moderation, saved-resource, reporting, and engagement
workflows. Milestone 6 adds requests, support, community discussions, and private notifications.
Milestone 7 adds the secure AI foundation, usage limits, private AI history, explanations, and
translation through Supabase Edge Functions. Milestone 8 adds database-backed admin controls,
analytics, settings, moderation queues, referral records, and audit history.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (design tokens in `src/index.css`) |
| Animation | Motion (`motion/react`) — respects `prefers-reduced-motion` |
| Icons | `lucide-react` |
| Routing | React Router 7 (all routes code-split) |
| Linting | Oxlint |

## Getting started

You need [Node.js](https://nodejs.org) 20 or newer. In PowerShell:

```powershell
cd C:\NoteShareWebsite
npm install
npm run dev
```

Open <http://localhost:5173>.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload on port 5173 |
| `npm run build` | Type-check and build the production site into `dist/` |
| `npm run preview` | Serve the built `dist/` on port 4173, exactly as production |
| `npm run lint` | Run Oxlint |

## Project structure

```
src/
├── types/            shared TypeScript types
├── data/             all content (replace with API responses in Stage 2)
├── services/         adapter contract + search logic (no React, no network)
├── hooks/            useToast, useReducedMotion, ToastProvider
├── components/
│   ├── ui/           Button, Card, Input, Badge, Toast, SectionHeading, PageLoader
│   ├── layout/       AppShell, Sidebar, TopBar, BottomNav, GlobalSearch,
│   │                 NotificationMenu, ProfileMenu
│   ├── navigation/   navConfig, AnimatedLink
│   ├── landing/      Hero, AiShowcase, ResourceShowcase, BentoFeatures,
│   │                 HowItWorks, FinalCta, Footer, FooterSocialLinks,
│   │                 Navbar, Reveal
│   └── dashboard/    Greeting, Continue, AiTools, ResourceList, Requests,
│                     Activity, QuickActions
├── pages/            Landing, Dashboard, Placeholder, NotFound
├── App.tsx           routes (lazy-loaded)
└── main.tsx          providers: ErrorBoundary → Router → Toasts
```

Two rules keep the code replaceable later:

- **Data lives in `src/data/`** — never hardcoded inside a component.
- **Logic lives in `src/services/`** — e.g. `searchService.ts` is pure functions, so a real search
  API can swap in without touching the UI.

## Routes

| Route | State |
| --- | --- |
| `/` | Landing page |
| `/app` | Student dashboard |
| `/app/explore`, `/app/saved`, `/app/study-space`, `/app/community`, `/app/requests`, `/app/support`, `/app/notifications` | Database-backed student workflows |
| `/app/ai` | Secure explanation and translation tools |
| `/app/profile`, `/app/settings` | "Not yet available" holding pages |
| anything else | 404 page |

## Deploying

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step Vercel instructions.

## Current backend progress

- Supabase browser client is configured through `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Versioned migrations define the database schema, RLS policies, Storage design, profile bootstrap,
  student roles, and college requests.
- `/login`, `/onboarding`, `/suspended`, and protected `/app` routes are implemented.
- `/admin` verifies `public.is_super_admin()` and fails closed for non-admin users.
- `/app/community`, `/app/requests`, `/app/support`, and `/app/notifications` are wired to
  Supabase services with student-owned access enforced by RLS.
- `/app/ai` calls the `ai-generate` Edge Function only; provider credentials never enter the
  browser bundle. The first AI tools are explanation and translation.
- AI requests are authenticated, limited to 20 per user per day, and recorded in private
  `ai_history` rows.
- The one-time Super Admin bootstrap is documented in `SUPABASE_SETUP.md`.
- Google OAuth provider configuration still requires Supabase and Google Cloud dashboard setup.

## Notes for remaining backend work

- `src/services/adapter.ts` defines the `StudyXAdapter` interface. `demoAdapter` implements it with
  hardcoded data today; an `apiAdapter` will implement the same interface later, and no component
  needs to change.
- Environment variables belong in the hosting dashboard, never in this repository.
- Service-role and AI provider keys must remain server-side.
