# Changelog

All notable changes to StudyX. Newest first.

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
