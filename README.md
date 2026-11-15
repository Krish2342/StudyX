# StudyX

An AI-powered study platform for college students. Find notes, books and previous year papers,
understand hard topics, and prepare for exams — in one focused dark workspace.

This repository is **Stage 1: frontend only**. There is no backend, no database and no authentication
yet, so nothing is saved to a server.

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
│   │                 HowItWorks, FinalCta, Footer, Navbar, Reveal
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
| `/app/explore`, `/app/saved`, `/app/ai`, `/app/study-space`, `/app/community`, `/app/requests`, `/app/support`, `/app/notifications`, `/app/profile`, `/app/settings` | "Not yet available" holding pages |
| anything else | 404 page |

## Deploying

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step Vercel instructions.

## Notes for Stage 2

- `src/services/adapter.ts` defines the `StudyXAdapter` interface. `demoAdapter` implements it with
  hardcoded data today; an `apiAdapter` will implement the same interface later, and no component
  needs to change.
- Environment variables belong in the hosting dashboard, never in this repository.
- Nothing in the codebase requires a secret today.
