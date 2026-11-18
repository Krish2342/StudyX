# Changelog

All notable changes to StudyX. Newest first.

## 2026-11-18 — Production data cleanup

### Changed
- Removed the hardcoded student, resource, request, community, notification, and dashboard datasets.
- Connected dashboard cards to saved resources, requests, notifications, discussions, and real account details.
- Removed invented resource counts, ratings, downloads, and AI-tool counts.
- Added a real account Settings page and removed the previous settings placeholder.
- Kept only available AI explanation and translation tools visible as active features.

## 2026-11-17 — Logical login flow

### Added
- Reworked the login page with responsive product context, clear Google sign-in states, configuration
  and authentication errors, and a first-login explanation.
- Protected student routes so signed-out users go to login, incomplete profiles go to onboarding,
  and suspended accounts go to the suspension screen.
- Authenticated users visiting `/login` now return to the dashboard or onboarding automatically.

## 2026-11-17 — Milestone 9 quality and deployment preparation

### Added
- Repeatable `npm run verify` checks for required deployment files, SEO metadata, SPA rewrites,
  reduced-motion configuration, tracked environment files, and server-only secret names in builds.
- Updated the deployment checklist with lint and quality verification commands.

### Notes
- Live RLS, OAuth, Supabase migration, Vercel deployment, and production-domain checks require
  the configured Supabase, Google Cloud, GitHub, and Vercel accounts.

## 2026-11-17 — Milestone 8 admin controls and analytics

### Added
- Database-backed admin overview metrics for students, resources, moderation, support, and AI activity.
- Student search with audited suspend/restore actions that cannot suspend the current administrator.
- Academic catalog activation controls for colleges, branches, semesters, subjects, and categories.
- Platform and AI JSON settings with server-side admin authorization and audit entries.
- Date-range analytics, workflow queues, referral event storage, and read-only admin activity logs.
- Migration `20261117220000_admin_controls_and_analytics.sql` with referral RLS and privileged admin functions.

### Notes
- Apply the new migration before testing Milestone 8 against Supabase.
- Provider credentials remain Supabase Function Secrets; the AI settings page never handles secret values.

## 2026-11-16 — Milestone 7 AI foundation

### Added
- Secure `ai-generate` Supabase Edge Function with authenticated requests, provider fallback,
  input validation, timeouts, and no browser-visible provider keys.
- Gemini and Groq provider adapters in `supabase/functions/_shared/providers.ts`.
- Daily per-user AI usage limits and private AI history migration.
- `/app/ai` with explanation and translation request flows.

### Notes
- Configure only rotated provider keys as Supabase Function Secrets.
- Remaining AI tools, PDF processing, grounding, and AI history browsing are later Milestone 7 work.

## 2026-11-16 — Milestone 6 workflow foundation

### Added
- Student request and support pages with owner-scoped lists and creation forms.
- Community discussions with published-post listing, replies, and creation.
- Private notifications with individual and bulk read actions.
- Migration `20261116214000_requests_support_community.sql` for community schema and tightened
  request/support/community RLS.

### Notes
- Run `supabase db push` only after reviewing the migration. Real Supabase account and Super Admin
  verification remains required before calling Milestone 6 complete.

## 2026-11-16 — Milestone 5 student resource experience started

### Added
- Saved resources page at `/app/saved`.
- Resource pagination with a Load more action.
- One-report-per-student resource reporting flow.
- Server-side view/share counters through a protected Supabase function.
- Exact future API locations documented for Gemini, Groq, and translation providers.

### Notes
- Gemini, Groq, and translator keys are not needed for this milestone and must remain server-side.
- AI study tools and translation are scheduled for Milestone 7 with Edge Function rate limits.

## 2026-11-16 — Milestone 4 resource management

### Added
- Database migration `20261116195000_resource_management.sql` with student submission policies,
  catalog indexes, and an audited Super Admin moderation function.
- Approved resource discovery at `/app/explore`, resource details, Google Drive opening, bookmarks,
  ratings, native/copy sharing, and empty/loading/error states.
- Student resource submission at `/app/explore/submit` and submission status tracking in
  `/app/study-space`.
- Protected Super Admin moderation at `/admin/resources` with pending, approved, rejected, and
  removed queues.

### Notes
- The migration must be applied with `supabase db push` before database workflows can be tested.
- Cover files remain governed by the private Storage design; the upload UI is not enabled yet.

## 2026-11-15 — Footer social links

### Added
- **`src/data/socialLinks.ts`**: the footer's social profiles in one editable list —
  Instagram, X, LinkedIn, GitHub, in that order. A link with an empty url is skipped when
  rendering, so an unfinished profile can never become a dead button.
- **`src/components/ui/SocialIcons.tsx`**: inline SVG brand marks (Instagram, X, LinkedIn,
  GitHub) drawn with `currentColor`. No icon package was added — `lucide-react` has no brand icons.
- **`src/components/landing/FooterSocialLinks.tsx`**: the social row. 44px touch targets,
  opens in a new tab with `rel="noopener noreferrer"`, hover in `#8DB9F0`, a small Motion
  hover/press animation that is skipped when reduced motion is on, and a focus-visible ring.
- **Types**: `SocialLink` and `SocialIconName` in `src/types/index.ts`.

### Changed
- **Footer**: the three mail / code / globe icon buttons are replaced by the social row.
- **Footer**: removed the Company column (About StudyX, Careers, Privacy policy, Terms of
  service). None of those pages exist, so all four links pointed back to `/`. The footer now
  only lists pages that actually open.

## 2026-11-15 — Milestone 1, wording cleanup, deployment prep

### Added
- **Design system**: colour tokens, typography and global styles in `src/index.css`
  (`#0A0A0A` 60%, `#FFFFFF` 30%, `#8DB9F0` 10%), CSS-only perspective helpers.
- **UI primitives**: `Button`, `Card`, `Input`, `Badge`, `Toast`, `SectionHeading`, `PageLoader`.
- **App shell**: collapsible desktop sidebar, top bar, separate mobile bottom navigation
  (Home, Search, AI, Saved, Profile), mobile slide-over drawer.
- **Global search** with instant results, suggestions and recent searches, powered by
  `src/services/searchService.ts` (pure functions, no network).
- **Landing page**: hero with CSS-perspective preview, AI tools showcase, resource showcase,
  bento feature grid, how-it-works, final CTA, footer.
- **Student dashboard**: real bento grid with varied card sizes (greeting, quick actions, continue
  studying, AI tools, recent/popular resources, requests, activity).
- **Holding pages** for sections that are not open yet, with a route back.
- **404 page** and a **global error boundary** with a recovery screen.
- **SEO**: page title, meta description, canonical URL, Open Graph and Twitter card tags,
  `robots.txt`, `sitemap.xml`, branded favicon, 32px PNG favicon, Apple touch icon and a
  1200×630 social preview image.
- **Deployment**: `vercel.json` with SPA rewrites, long-cache headers for hashed assets and basic
  security headers. Beginner-friendly `DEPLOY.md`.
- **Performance**: every route is lazy-loaded and code-split; the page loader uses CSS animation so
  the entry bundle stays free of the animation library.

### Changed
- Rewrote all user-facing copy that mentioned "demo", "sample data", "placeholder" or "Built with"
  so the product reads as a real product (16 changes across 13 files).
- Split `TopBar` into `TopBar` + `NotificationMenu` + `ProfileMenu` to keep every component file
  under ~200 lines.
- Fixed a duplicate DOM `id` when the search box renders in both the top bar and the dashboard
  (now `useId`).
- Raised `--color-paper-faint` from `#6b6b6b` to `#8f8f8f` for WCAG AA contrast.
- Replaced the default Vite favicon and removed unreferenced assets (`icons.svg`, Vite logos).

### Removed
- All Vite template boilerplate (`App.css`, `src/assets/`).
- On-screen notes about the build state (dev-only information moved into code comments).

### Notes
- At that time the student app was still frontend-only: data came from `src/data/` through
  `demoAdapter`. Supabase foundation and authentication/admin preparation were added in later
  milestones.
- Several controls are intentionally honest placeholders (share, sign out, tour, resource request)
  and show "not available yet" messages instead of pretending to work.
## 2026-11-15

### Milestone 3 — Super Admin access foundation

- Added protected `/admin` routing with fail-closed role verification.
- Aligned the browser admin check with the database `is_super_admin()` function.
- Added the admin access screen, denied state, verification state, and retry behavior.
- Added the authenticated admin overview and planned-section placeholders without fake metrics.
- Documented the one-time Super Admin bootstrap and local validation commands in `SUPABASE_SETUP.md`.
