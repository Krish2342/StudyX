# Changelog

All notable changes to StudyX. Newest first.

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
- Still frontend-only: no database, no authentication, no AI provider. Data comes from
  `src/data/` through `demoAdapter`.
- Several controls are intentionally honest placeholders (share, sign out, tour, resource request)
  and show "not available yet" messages instead of pretending to work.
