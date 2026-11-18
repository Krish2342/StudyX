StudyX — Backend, Database & Admin Panel Implementation Guide
Purpose: Give OpenCode and Google Antigravity a single source of truth for implementing the backend, database, authentication, admin panel, and real workflows for the existing StudyX frontend.

Current implementation status:
- Milestone 0 — Repository audit: complete.
- Milestone 1 — Backend foundation: complete; migrations are applied to the linked Supabase project.
- Milestone 2 — Authentication and profiles: code complete; Google OAuth dashboard configuration is still required.
- Milestone 3 — Admin access and shell: code complete; the one-time Super Admin role bootstrap is still required.
- Milestone 4 — Resource management: code complete; apply `20261116195000_resource_management.sql` before testing against Supabase.
- Milestone 5 — Student resource experience: complete; saved resources, pagination, reports, and engagement tracking are connected.
- Milestone 6 — Requests, support, community, notifications: frontend and migration prepared; apply the migration and complete real-account verification.
- Milestone 7 — AI foundation and first AI features: explanation and translation are implemented through the `ai-generate` Edge Function; deploy the function, configure rotated secrets, and verify with an authenticated account.
- Milestone 8 — Admin controls and analytics: implemented; apply `20261117220000_admin_controls_and_analytics.sql` and verify against a real Super Admin account.

Current frontend URL (local): http://localhost:5174/

IMPORTANT: This URL is only the developer's local frontend. It is not accessible to the coding agent unless the frontend project files are opened in the IDE. The agent must inspect the actual repository before making changes.

0. Instructions for the coding agent
You are working on StudyX, an existing frontend project. The developer says the frontend currently runs at http://localhost:5174/.
Non-negotiable rules
1. Inspect before editing. Read the repository structure, package.json, existing routes, components, styles, and current frontend framework. Determine whether it is Vite/React, Next.js, or another stack. Do not assume.
2. Do not replace, recreate, or redesign the existing frontend unless a specific change is required. Preserve its current visual design, layout, colors, animations, and responsive behavior.
3. Do not migrate from Vite to Next.js just because a previous plan mentioned Next.js. First inspect the current project. Prefer adding a secure backend integration compatible with the existing frontend. Explain any migration proposal and wait for approval before doing it.
4. Do not delete working components or routes. Reuse existing UI and connect it to real data.
5. Do not use mock arrays, fake success messages, localStorage as the database, or hard-coded dashboard statistics in production workflows. Temporary mock data may only be used behind an explicit development-only flag and must be removed/replaced before completion.
6. Do not leave dead buttons, placeholder forms, or non-functional navigation. Every visible action must work or be clearly marked as not yet implemented.
7. Never expose Supabase service-role keys, OpenAI keys, Gemini keys, Groq keys, or other secrets in browser code, frontend environment variables, Git commits, or API responses.
8. Use database migrations for schema changes. Do not make undocumented manual-only database changes.
9. Implement authorization on the server/database, not only by hiding UI elements.
10. Work in small milestones. After each milestone, run type checks, lint/build where configured, and report changed files, commands, test results, and anything still requiring a dashboard setting or secret.
11. Before making broad changes, create a Git checkpoint/commit if Git is configured and the working tree is understood. Never overwrite uncommitted user work.
12. If an environment variable, OAuth setting, Supabase project, or API credential is missing, create a safe .env.example, explain exactly where the user obtains the value, and continue with code that can be completed after configuration. Never invent credentials.
First response required from the coding agent
Before editing, report:
- Detected frontend framework and version.
- Existing package manager and run/build commands.
- Existing routing approach.
- Existing authentication/backend integration, if any.
- Existing admin page or admin route, if any.
- Existing pages/components that can be reused.
- Proposed backend integration approach compatible with this repository.
- Any blockers.
Then implement the plan below without asking the developer to repeat requirements already written here. Ask only when a genuinely blocking choice cannot safely be inferred.
1. Product definition
StudyX is a multi-college student learning platform.

Student journey:

Sign in with Google → Complete academic profile → Explore/search resources → Open/save/rate/share resources → Use AI study tools → Track personal study history

Resource contributor journey:

Submit resource → Validate Google Drive link → Pending review → Admin approves/rejects → Approved resource becomes discoverable

Admin journey:

Secure admin sign-in → Admin dashboard → Review submissions → Manage resources and academic catalog → Manage students/requests/support/community → Configure AI limits/providers → Review analytics

The platform must be usable on desktop, tablet, and mobile.
Visual design constraints
Preserve the existing frontend's visual identity. StudyX's intended theme:
- Dark-first background: #0A0A0A (60%)
- Blue: #007BA7 (30%)
- Pink accent: #FF2D95 (10%)
- Premium, clear, accessible UI.
- Smooth but restrained animations.
- Loading, empty, error, success, and confirmation states.
- Respect reduced-motion preferences.
Do not redesign the UI while implementing backend logic unless required for usability or security.
2. Roles and access model
Use role-based access control with these roles:
Student
- Signs in using Google OAuth.
- Can read approved/public resources.
- Can create and manage their own profile.
- Can submit resources; sees their own pending/rejected/approved submissions.
- Can create/read/update/delete their own bookmarks, AI history, study plans, ratings (subject to rating rules), resource requests, and support tickets.
- Can participate in community discussions.
- Cannot access admin routes or admin data.
- Cannot approve or edit another user's submissions.
Super Admin
- One initial Super Admin account for V1.
- Can access the protected /admin area.
- Can manage resources, resource submissions, users, colleges, branches, semesters, subjects, resource categories, requests, support tickets, community moderation, AI provider settings, AI usage limits, and analytics.
- Can change resource metadata and replace a resource's Google Drive URL without deleting/recreating the resource.
- Can create resources directly.
- Can suspend/block accounts and remove inappropriate resources.
- Admin actions must be recorded in an audit log.
Admin access: secure bootstrap
Do NOT create a public “Admin Sign Up” button or allow users to choose their own role.

Implement a safe first-admin bootstrap:
1. Student signs in through Google OAuth.
2. Server verifies the authenticated user's ID/email.
3. A one-time server-side bootstrap process promotes the configured account to super_admin.
4. The bootstrap email/user ID is supplied through a server-only environment variable or a documented SQL/manual setup procedure.
5. The promotion must be idempotent and must not allow a normal user to promote themselves.
6. Once the first admin exists, disable/remove the bootstrap path or require an explicit server-side secret/controlled migration.
7. Do not rely on an email string stored in frontend code as authorization.
8. If a user is not an admin, /admin must deny access even if they manually type the URL.
Recommended initial setup: create the first admin using a documented, one-time SQL migration or secure server-side script after the admin has completed Google login. Do not seed an unknown or invented email address.
3. Recommended backend architecture
First inspect the current app. If the frontend is Vite + React, keep it and use:
- Existing Vite frontend.
- Supabase Auth for Google OAuth.
- Supabase PostgreSQL for relational data.
- Supabase Storage for cover images and private user files where appropriate.
- Supabase Row Level Security (RLS) for database authorization.
- Supabase Edge Functions or a separate server/API service for privileged operations and AI calls.
- Server-only secrets for AI provider keys.
- PostgreSQL full-text search and trigram matching for fast resource search.
If the project is already Next.js, use server route handlers/server actions where appropriate, but retain Supabase RLS and server-side authorization.

Do not create a second backend framework without explaining why. Prefer the simplest maintainable architecture for this repository.
Environment variables
Create .env.example with placeholders only. Adapt names to the detected framework.

Typical Vite public variables:
- VITE_SUPABASE_URL=
- VITE_SUPABASE_ANON_KEY=
Typical server-only variables (never prefix with VITE_):
- SUPABASE_SERVICE_ROLE_KEY=
- GEMINI_API_KEY=
- OPENAI_API_KEY=
- GROQ_API_KEY=
- ADMIN_BOOTSTRAP_EMAIL= (only if the chosen bootstrap design requires it)
- APP_BASE_URL=
For Next.js, use NEXT_PUBLIC_ only for values intentionally public, such as Supabase project URL and anon key. Keep service-role and AI keys server-only.

Add .env* to .gitignore, but keep .env.example tracked.
4. Database schema
Create versioned SQL migrations. Use UUID primary keys, foreign keys, timestamps, appropriate indexes, and constraints. Add created_at and updated_at where useful. Use ON DELETE behavior deliberately; do not cascade-delete important history accidentally.
4.1 Profiles and roles
profiles
- id uuid primary key references auth.users(id) on delete cascade
- full_name text
- email text
- avatar_url text
- college_id uuid references colleges(id)
- branch_id uuid references branches(id)
- semester_id uuid references semesters(id)
- bio text
- preferred_language text default 'English'
- preferred_answer_style text
- is_suspended boolean default false
- created_at, updated_at
user_roles
- user_id uuid references auth.users(id) on delete cascade
- role text check role in ('student','super_admin')
- created_at
- Unique constraint on (user_id, role)
Do not let users update their own role. Only secure server/admin procedures may change roles.
4.2 Academic catalog
colleges
- id, name, slug, city, state, country, is_active, timestamps
branches
- id, college_id, name, code, is_active, timestamps
- Unique sensible combination for college and branch.
semesters
- id, number, label, is_active
- Semester is generally reusable across colleges/branches unless the existing project requires a more specific academic structure.
subjects
- id, college_id, branch_id, semester_id, name, code, description, is_active, timestamps
- Index college/branch/semester and searchable subject names.
college_requests
- id, user_id, college_name, city, state, message, status (pending, approved, rejected), admin_note, timestamps
Students request a missing college; only admin adds it to the catalog.
4.3 Resource catalog
resource_categories
- id, name, slug, is_active, sort_order
Seed categories:
- Notes
- Books
- Assignments
- Previous-year papers
- Question banks
- Lab manuals
- PPTs
- Important questions
- Study material
- Other
resources
- id
- title
- slug
- description
- resource_type
- college_id
- branch_id
- semester_id
- subject_id
- google_drive_url
- drive_access_status (unchecked, accessible, permission_required, broken, unknown)
- cover_image_url
- created_by
- status (pending, approved, rejected, removed)
- admin_note
- approved_by
- approved_at
- view_count default 0
- share_count default 0
- created_at, updated_at
Important rules:
- Only approved resources are visible in public search.
- A student can see their own pending/rejected submissions.
- Admin can see/manage all resources.
- Admin can edit or replace the Drive URL in place.
- Validate URL format and allowed Google Drive domains. Do not claim a Drive file is accessible merely because the URL looks valid.
- If automated Drive permission checking is not available, show unchecked and provide a clear user/admin check workflow. Never expose private Drive credentials.
resource_keywords
- id, resource_id, keyword, normalized_keyword, source (auto, admin), timestamps
- Unique normalized keyword per resource.
- Generate useful keyword candidates from title, subject, description, resource type, and academic context. AI-assisted keyword generation may be used server-side, but provide deterministic fallback tokenization.
- Admin can edit keywords.
resource_ratings
- id, resource_id, user_id, rating integer check 1 through 5, timestamps
- Unique (resource_id, user_id).
- Recompute or safely aggregate average rating and count; do not trust client-submitted aggregate values.
bookmarks
- id, user_id, resource_id, created_at
- Unique (user_id, resource_id).
resource_reports
- id, resource_id, user_id, reason, details, status (open, reviewing, resolved, dismissed), timestamps.
4.4 Resource requests
resource_requests
- id, user_id, college_id, branch_id, semester_id, subject_id
- resource_type, request_description, additional_message
- status (pending, added, not_available)
- admin_note, fulfilled_resource_id, timestamps
Students can see only their own requests. Admin can see all.
4.5 AI history and study tools
ai_generations
- id, user_id
- feature_type (assignment, translation, quiz, flashcards, summary, simple_explanation, paper_prediction, question_generator, study_plan, weak_topic_analysis)
- title
- input_metadata jsonb (do not store secrets)
- output_content jsonb or text
- source_resource_ids uuid[] or a normalized join table
- language
- status (queued, processing, completed, failed)
- provider, model
- input_tokens, output_tokens where available
- created_at, updated_at
study_plans
- id, user_id, title, exam_date, subjects jsonb, available_minutes_per_day, preparation_level, preferred_language, plan_content jsonb, status, timestamps
quiz_attempts
- id, user_id, generation_id, score, total_questions, answers jsonb, topic_breakdown jsonb, completed_at
ai_usage
- id, user_id, feature_type, provider, model, usage_units, estimated_cost, created_at
AI history is private to its owner. Students can open, rename, and delete their own history.
4.6 Community
discussions
- id, user_id, title, body, college_id, branch_id, subject_id, status (published, hidden, removed), timestamps
discussion_replies
- id, discussion_id, user_id, body, status, timestamps
V1 community is questions/discussions only. Resource submissions remain in the admin-approved resource system.
4.7 Support and notifications
support_tickets
- id, ticket_number unique, user_id
- category (bug, broken_resource, request_notes, question, feature_suggestion, feedback, other)
- subject, message
- status (open, in_progress, resolved)
- assigned_admin_id, timestamps
support_replies
- id, ticket_id, sender_user_id, message, created_at
notifications
- id, user_id, type, title, body, target_url, is_read, created_at
Notifications should be created for resource approval/rejection, fulfilled requests, support replies, study reminders, and relevant referral events.
4.8 Referrals
referral_codes
- id, user_id, code unique, created_at
referral_events
- id, referrer_user_id, referred_user_id, event_type, status, created_at
- Prevent self-referrals and duplicate qualifying referrals.
- Do not award rewards merely for opening a link. Define a meaningful qualifying action and enforce it server-side.
- Referral tracking should respect privacy and applicable platform rules.
- Referral reward amounts and broader points economy are configurable future decisions. Do not invent a points/AI-credit economy without approval.
4.9 Admin audit and settings
admin_audit_logs
- id, admin_user_id, action, entity_type, entity_id, before_data jsonb, after_data jsonb, created_at
platform_settings
- key text primary key, value jsonb, updated_by, updated_at
Store AI limits and non-secret feature settings here. Keep provider API secrets in server-side environment/secret storage, not ordinary readable client tables.
5. Row Level Security and security requirements
Enable RLS on all user-facing tables.

Minimum access policies:
- profiles: authenticated user can read/update only their own profile; admin can read/manage profiles as needed.
- user_roles: users cannot self-assign or change roles. Role reads should be narrowly controlled.
- resources: public/authenticated users can read approved resources; owner can read their own submissions; only admin can approve, reject, remove, or edit catalog resources.
- resource_keywords: visible for approved resources; admin manages keywords.
- bookmarks, resource_ratings, ai_generations, study_plans, quiz_attempts: owner-only access, with admin access only when justified and audited.
- resource_requests: owner reads/creates their own; admin manages all.
- support_tickets: owner reads/creates their own; admin manages all. Replies visible only to ticket owner and admin.
- notifications: owner reads/updates their own; trusted server/admin processes create them.
- discussions: published discussions readable according to community design; users manage their own; admin moderates.
- admin_audit_logs: admin-only read; inserts only through trusted server/admin operations.
Use database helper functions or secure server checks for admin role validation. Avoid recursive RLS policies. Test policies using both student and admin accounts.
6. Authentication and onboarding workflow
1. Show Google sign-in.
2. Authenticate with Supabase Auth.
3. On first login, create a profiles row safely (trigger or server-side upsert).
4. Send the student to profile completion if college/branch/semester are missing.
5. Collect name, email (from auth provider), college, branch, semester.
6. If college is unavailable, let the student submit a college_request.
7. Returning students go to their dashboard.
8. Students can change semester later; do not delete old resources, saved items, or AI history.
9. Suspended accounts must be blocked from protected actions and shown a clear message.
10. Route guards are for UX only; database/server authorization remains mandatory.
7. Admin panel: required pages and behavior
Create a separate protected admin area. Suggested routes (adapt to the existing router):
- /admin/login only if a separate admin sign-in screen is useful; it must still use the same trusted Google auth and role check.
- /admin — overview dashboard.
- /admin/resources — all resources and submissions.
- /admin/resources/[id] or equivalent — edit resource metadata and Drive URL.
- /admin/colleges
- /admin/branches
- /admin/semesters
- /admin/subjects
- /admin/categories
- /admin/students
- /admin/requests
- /admin/college-requests
- /admin/reports
- /admin/community
- /admin/support
- /admin/ai-settings
- /admin/analytics
- /admin/audit-logs
Admin overview cards
Show real database counts:
- Total students
- Active students (define the period clearly)
- Total approved resources
- Pending resource approvals
- Pending resource requests
- Open support tickets
- Open reports
- AI usage for selected period
Do not hard-code numbers.
Resource moderation workflow
- Pending queue with filters/search.
- Preview metadata and Drive link.
- Approve, reject with reason, edit, or remove.
- On approval: set status, admin ID, approval timestamp; create notification for uploader; make resource discoverable.
- On rejection: store reason; create notification for uploader; resource remains visible only to uploader/admin.
- Admin can edit approved resources and replace Drive link without changing resource ID.
- Record every important admin action in audit logs.
Admin security
- If a non-admin visits /admin, deny access and redirect to an appropriate student page.
- Admin APIs/functions independently verify admin role.
- Do not rely on a hidden sidebar link or frontend route guard alone.
- No public admin registration.
- Add confirmation dialogs for destructive actions.
- Use pagination for large lists.
8. Resource search and discovery
Search is a core feature. Implement server/database-backed search, not only browser filtering.

Search across:
- Resource title/book name
- Subject
- Keywords
- Description
- College
- Branch
- Semester
- Resource type
Initial approach:
- PostgreSQL full-text search with a suitable text-search configuration.
- pg_trgm for typo tolerance/partial matching where available.
- GIN indexes for full-text and trigram search.
- Normalize terms and maintain resource_keywords.
- Search only approved resources for ordinary students.
- Rank exact title match first, then strong keyword/title match, subject relevance, usefulness/popularity, then recent approval.
- Add pagination and safe query limits.
- Debounce frontend requests and cancel stale searches.
- Search dbms should find DBMS, Database Management System, DBMS Unit 1, DBMS PYQ, SQL/normalization-related resources where indexed.
- Do not claim semantic/AI search exists unless implemented and tested.
9. Google Drive resource workflow
Students submit a Google Drive URL, not a file upload for the resource itself.

Implement:
1. Validate URL syntax and allow only expected Google Drive URL formats/domains.
2. Normalize supported Drive links safely.
3. Explain to the uploader that the file must be shared with appropriate viewing permission (typically “Anyone with the link can view” if that is the platform's chosen policy).
4. Do not try to bypass Drive permissions.
5. If permission cannot be checked automatically, mark as unchecked and make the status clear.
6. Admin can mark a link as checked/accessibile after verifying it.
7. Student sees their own submission state.
8. Public users see only the resource card and an “Open Resource” action; never display the raw long URL as the main card content.
9. Open the Drive URL safely in a new tab with appropriate link attributes.
10. Allow admin to replace the URL and preserve the resource ID, ratings, bookmarks, and history.
Cover images should be uploaded to Supabase Storage using a controlled bucket and file validation. Use a default cover when none exists.
10. AI architecture and workflows
All AI requests must go through a trusted server-side endpoint/function. Never call paid provider APIs directly from browser code.

Create a provider abstraction, for example:
- AIProvider interface
- GeminiProvider
- OpenAIProvider
- GroqProvider
- AIService that chooses provider/model by task and configured availability
Do not hard-code a provider as the only possible provider. Log provider/model and safe usage metadata. Never log API keys or sensitive full document content unnecessarily.
AI features in V1
1. Assignment Generator
2. Exam Ready Answer
3. Knowledge Answer
4. English/Hindi/Gujarati output
5. PDF translator
6. Text translator
7. AI quiz
8. Flashcards
9. Simple explanation
10. AI study plan
11. Paper prediction
12. Weak-topic detection
13. AI summary
14. AI question generator
Assignment generator
Inputs:
- Student's question/assignment prompt.
- Source choice: My Notes, Platform Notes, Both, or no source where appropriate.
- Answer mode: Exam Ready or Knowledge.
- Language: English, Hindi, Gujarati.
- Marks: 2, 4, 5, 7, 10.
Generate an answer appropriate to the marks. Include diagrams/flowcharts only where useful and represent them in a format the UI can render (for example Mermaid or structured diagram data); do not invent a diagram if it is not relevant.
Source grounding
When sources are selected:
1. Verify user is allowed to access each source.
2. Extract/index text from supported source files or accessible documents.
3. Retrieve relevant chunks.
4. Pass only relevant context to the AI provider.
5. Show source names and page/chunk references when actually available.
6. Clearly say when no source content was available.
7. Do not fabricate page numbers or citations.
PDF/text translation
- Enforce file size/page limits.
- Extract text safely.
- Split large documents into chunks.
- Translate chunks while preserving headings/order.
- Combine results and provide progress/status.
- Handle scanned PDFs as unsupported unless OCR is implemented.
- Do not silently return incomplete translations.
Paper prediction
Accept 4+ years of papers where available. Analyze repeated/similar questions and topics. Categorize high/medium/low priority. Always show: “This is an AI-based study aid, not a guarantee of actual exam questions.”
Quiz and weak-topic analysis
Generate questions from selected sources. Save attempts. Derive weak/average/strong topics from actual answer performance, not invented values.
AI limits and cost controls
Implement server-side:
- Per-user daily/monthly usage limits.
- Per-feature limits.
- PDF size/page limits.
- Request and output token limits.
- Rate limiting.
- Admin-configurable limits.
- Friendly quota-exceeded responses.
- Usage logging and estimated cost where provider data allows.
11. Remaining V1 features
My Study Space
- Saved resources
- AI history
- My assignments
- My quizzes
- My study plans
- My submissions
- Requested resources
- My ratings
Ratings
- One 1–5 star rating per user per resource.
- User can update their rating.
- No written reviews/comments in V1.
Sharing and referrals
- Share resource through copy link, WhatsApp, Telegram, and native share where supported.
- Track referral code safely.
- Do not reward self-referrals, duplicate accounts, or link opens alone.
- Reward rules/amounts must be configurable and explicitly approved before enabling rewards.
Community
- Questions and discussions only in V1.
- No public resource uploads through community.
- Users can report content; admin can hide/remove it.
Support
- Ticket categories: bug, broken resource, request notes, question, feature suggestion, feedback, other.
- Generate unique ticket ID.
- Student and admin can reply.
- Ticket statuses: open, in progress, resolved.
- Notify student on admin reply.
Notifications
- Resource approved/rejected.
- Resource request status changed.
- Admin support reply.
- Study plan reminders where scheduled notifications are implemented.
- Relevant referral events.
- Read/unread state.
V1 exclusions
Do not implement XP, levels, leaderboards, badges, streaks, friend competitions, or advanced gamification in V1. Keep the architecture extensible for a future version.
12. API/service boundaries
Use the existing project's conventions. Create clear service modules rather than putting all logic in page components.

Suggested logical services:
- authService
- profileService
- academicCatalogService
- resourceService
- resourceSearchService
- bookmarkService
- ratingService
- resourceRequestService
- adminService
- notificationService
- supportService
- communityService
- referralService
- aiService
- aiUsageService
- auditLogService
Suggested server endpoints/functions:
- Profile completion/update
- College request submission
- Resource submission
- Resource search
- Resource view/share tracking
- Resource rating
- Bookmark toggle
- Resource request submission
- Admin approve/reject/edit resource
- Admin create resource
- Admin manage academic catalog
- Admin manage users/reports/support
- AI generation by feature
- AI usage check/log
- Notification read state
- Support ticket and replies
Validate every input server-side. Return consistent structured errors. Never trust user_id, role, price/cost, aggregate rating, or admin identity supplied by the browser; derive identity from the verified session.
13. Implementation milestones
Do not attempt all features in one pass. Implement in this order.
Milestone 0 — Repository audit
- Inspect app and report framework, routes, scripts, dependencies, and existing UI.
- Create/verify Git checkpoint.
- Identify frontend pages and missing states.
Milestone 1 — Backend foundation
- Supabase project setup instructions.
- Environment variables and .env.example.
- Supabase client setup for the detected framework.
- Database migrations.
- RLS policies.
- Seed safe public catalog data (categories and semester labels only; do not invent real colleges/subjects).
- Document local setup.
Milestone 2 — Authentication and profiles
- Google OAuth.
- Profile creation/onboarding.
- Academic catalog selectors.
- College request.
- Protected routes and suspended-account handling.
- Test student access.
Milestone 3 — Admin access and admin shell
- Secure first-admin bootstrap instructions.
- Server/database admin role verification.
- Protected admin layout and navigation.
- Admin overview with real counts.
- Test that a student cannot access admin pages or admin APIs.
Milestone 4 — Resource management
- Student submission form and My Submissions status view.
- Approved resource search, detail, open, bookmark, rating, and share flows.
- Admin pending/approved/rejected/removed review queues.
- Google Drive URL validation and audited approve/reject/remove actions.
- Uploader notifications for moderation decisions.
- Cover image storage design remains private and upload UI is pending.
Milestone 5 — Student resource experience
- Real search.
- Resource detail/open action.
- Bookmarks.
- Ratings.
- Share links.
- Resource reports.
- Pagination and loading/error/empty states.
Milestone 6 — Requests, support, community, notifications
- Resource requests.
- Support tickets/replies.
- Community discussions/replies/moderation.
- Notification center.
Milestone 7 — AI foundation and first AI features
- Provider abstraction with Gemini first and Groq fallback.
- Server-only API keys in Supabase Function Secrets.
- Authenticated daily usage limits and private request history.
- Explanation and translation tools at `/app/ai`.
- Remaining tools, source grounding, PDF chunking, and AI history browsing require a later slice.
Milestone 8 — Admin controls and analytics
- AI provider/model/limit settings (secrets remain in server secret storage).
- User management and suspension.
- Catalog management.
- Reports/moderation.
- Analytics and audit logs.
Milestone 9 — Quality and deployment: code checks and deployment preparation complete; live Supabase/Vercel verification remains account-dependent.
- RLS/security tests.
- Student/admin end-to-end tests.
- Mobile/responsive checks.
- Accessibility and reduced-motion checks.
- Production build.
- Vercel deployment and production OAuth redirect setup.
- Verify no secrets are committed.
14. Required acceptance tests
Do not mark the platform complete until these tests pass.
Student
- Google login works.
- First-login profile onboarding works.
- Student can update semester without losing saved/history data.
- Student can submit a resource.
- Student sees own pending submission; another student cannot.
- Student can search and open approved resources.
- Student cannot see pending submissions from other users.
- Student can bookmark and rate a resource.
- Student cannot rate the same resource multiple times as separate ratings.
- Student can submit a resource request and support ticket.
- Student sees their own AI history and notifications only.
- Student cannot open admin pages or call admin actions.
Admin
- Configured admin can sign in with Google and access /admin.
- Non-admin is denied even when manually entering /admin.
- Admin can see pending resources.
- Admin can approve/reject and the uploader receives notification.
- Approved resource appears in student search.
- Rejected resource stays private to uploader/admin.
- Admin can edit metadata and replace Drive URL without changing resource ID.
- Admin can create a resource directly.
- Admin can manage academic catalog, users, requests, support, reports, and moderation.
- Admin actions are written to audit log.
AI
- API keys never appear in browser network responses or built frontend assets.
- Usage limits are enforced server-side.
- Invalid/oversized PDF is rejected with a useful message.
- AI history is private.
- Source references are shown only when real extraction/retrieval references exist.
- Paper prediction includes the non-guarantee disclaimer.
Production
- Build succeeds.
- RLS policies are enabled and tested.
- No secrets in Git.
- OAuth redirect URLs work in production.
- No critical console errors.
- All visible buttons have a real action or are clearly labelled as unavailable.
15. Developer workflow using OpenCode and Antigravity
Use one editor/agent at a time for file modifications.
OpenCode
Primary implementation agent:
- Read this document first.
- Inspect the repository.
- Implement the current milestone only.
- Explain files changed and commands to run.
- Never skip tests or silently change architecture.
Antigravity
Use as reviewer/test assistant:
- Review the current milestone's code and database policies.
- Look for security issues, broken flows, missing loading/error states, and type errors.
- Do not independently rewrite the same files while OpenCode is editing.
- Suggest fixes; apply them only after reviewing the diff.
Git
At each successful milestone:
- Review git diff.
- Run tests/build.
- Commit with a meaningful message.
- Do not commit .env files or secrets.
16. Completion reporting format
At the end of each milestone, report:
1. Completed: exact working features.
2. Files changed: list of important files.
3. Database changes: migration names and tables/policies added.
4. Commands run: exact commands.
5. Tests: pass/fail and what was tested.
6. Manual setup needed: Supabase dashboard, Google OAuth, secrets, etc.
7. Known issues: honest list; do not hide incomplete functionality.
8. Next milestone: one clear next step.
Start now with Milestone 0 — Repository audit. Do not start by generating a new app or replacing the existing frontend.