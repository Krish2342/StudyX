# StudyX Supabase setup

This document prepares Milestone 1. It does not create a Supabase project, run migrations, or create an administrator.

## 1. Create the project

1. Create a Supabase project from the Supabase dashboard.
2. Record the project URL and the public anon key from **Project Settings → API**.
3. Copy `.env.example` to `.env.local`.
4. Set only these browser-safe values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The anon key is not a secret. Its access is constrained by database RLS. Never put a service-role key or AI provider key in a `VITE_` variable.

## 2. Configure Google OAuth

1. In Supabase, enable Google under **Authentication → Providers**.
2. Create a Google OAuth web client in Google Cloud.
3. Add the Supabase callback URL shown by Supabase to the Google client.
4. Add local and production application URLs under **Authentication → URL Configuration**:
   - `http://localhost:5174`
   - The final production origin
5. Keep the redirect target restricted to known application origins.

## 3. Migration files

The proposed migrations are in `supabase/migrations/`:

1. `20261115160000_initial_schema.sql`
   - Extensions, enums, academic catalog, profiles, roles, resources, bookmarks, ratings, requests, support, notifications, audit logs, and settings.
   - Seeds only semester labels and resource categories.
2. `20261115161000_rls_and_admin.sql`
   - `is_super_admin()` security-definer helper.
   - RLS enablement and student/admin policies.
3. `20261115162000_storage.sql`
   - Private `resource-covers` bucket and ownership policies.
4. `20261115193000_auth_and_onboarding.sql`
   - Creates a profile and student role automatically for every new Auth user.
   - Adds student-owned college requests.
   - Adds the profile insert policy required by first-login fallback handling.
5. `20261116195000_resource_management.sql`
   - Adds resource discovery indexes and owner submission policies.
   - Adds the audited Super Admin review function that approves, rejects, or removes resources.
6. `20261116203000_resource_experience.sql`
   - Adds one-report-per-student resource reports and safe view/share tracking.
7. `20261116214000_requests_support_community.sql`
   - Adds community posts, replies, reports, indexes, and student/admin RLS.
   - Restricts students to creating and reading their own requests and tickets; status changes
     remain Super Admin-only.
8. `20261116230000_ai_foundation.sql`
   - Adds private AI history and daily usage tables.
   - Adds the authenticated `consume_ai_request` rate-limit function.

Apply pending migrations only after reviewing them with:

```powershell
cd C:\NoteShareWebsite
supabase db push
```

Do not run this command against production without confirming the linked project and reviewing the
SQL diff first.

## 4. One Super Admin bootstrap

There must be no public admin registration and no frontend-controlled role assignment.

Recommended process after the migrations are approved:

1. Sign in once with Google using the intended operator account.
2. Obtain that authenticated user's Supabase UUID from the Auth dashboard.
3. Run a controlled, one-time server-side or migration-only operation that inserts:

```sql
insert into public.user_roles (user_id, role)
values ('REPLACE_WITH_VERIFIED_AUTH_USER_UUID', 'super_admin');
```

4. Verify `public.is_super_admin()` while authenticated as that user.
5. Remove or disable the bootstrap operation.

Do not place the UUID or email in frontend source. The partial unique index in the schema prevents more than one `super_admin` role row. All admin actions must be performed through RLS-protected operations or trusted Edge Functions and written to `admin_audit_logs`.

## 5. Activate Milestone 2

After reviewing the migration files, apply the pending Auth/onboarding migration locally:

```powershell
cd C:\NoteShareWebsite
supabase db push
```

The CLI will request the database password locally. Do not paste it into chat or commit it.

Then configure Google OAuth in the Supabase dashboard:

1. Open **Authentication → Providers → Google** and enable Google.
2. Add the Google client ID and client secret from Google Cloud.
3. Add the Supabase callback URL shown on that provider page to Google Cloud.
4. Under **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:5174`
   - Additional redirect URL: `http://localhost:5174/app`
5. Add the production site URL and `/app` redirect later before deployment.

The browser flow is:

```text
/login → Google OAuth → /app → /onboarding (first login) → /app
```

The app also blocks suspended profiles before rendering student routes.

## 6. Activate Milestone 4

After reviewing the resource migration, apply it through the normal Supabase workflow:

```powershell
cd C:\NoteShareWebsite
supabase db push
```

Milestone 4 provides:

- `/app/explore` for approved resource search and filters.
- `/app/explore/:resourceId` for opening, saving, rating, and sharing resources.
- `/app/explore/submit` for Google Drive submissions.
- `/app/study-space` for the user's submission statuses.
- `/admin/resources` for audited Super Admin review.

The resource cover bucket remains private. The current submission form accepts an optional cover
image URL; uploading cover files through Storage can be added when the upload UX is enabled.

## 7. Where Gemini, Groq, and translation APIs belong

Do not put Gemini, Groq, OpenAI, or translator keys in `.env.local`, `VITE_*` variables, React
components, or browser requests. The correct future location is Supabase Edge Functions:

- `supabase/functions/ai-generate/index.ts` — authenticated Gemini/Groq routing for explanation
  and translation tools.
- `supabase/functions/_shared/providers.ts` — server-only provider adapters and timeouts.
- `supabase/functions/_shared/cors.ts` — controlled browser boundary and JSON responses.

The browser calls only `ai-generate` with the user's Supabase session. Provider keys are stored as
Supabase Function Secrets, and the function returns text—not provider credentials. Additional AI
tools should use this same authenticated boundary rather than direct browser provider calls.

Required Edge Function secrets for Milestone 7:

```text
GEMINI_API_KEY
GROQ_API_KEY
GROQ_MODEL (optional)
APP_ORIGIN
```

## 8. Server-only secrets

These belong in Supabase Edge Function secrets or the hosting provider's server-side secret store, never in the Vite app:

```text
SUPABASE_SERVICE_ROLE_KEY
ADMIN_BOOTSTRAP_USER_ID
GEMINI_API_KEY
GROQ_API_KEY
APP_ORIGIN
```

Set them from the Supabase project directory:

```powershell
supabase secrets set GEMINI_API_KEY="REPLACE_WITH_ROTATED_KEY" GROQ_API_KEY="REPLACE_WITH_ROTATED_KEY" APP_ORIGIN="http://localhost:5174"
supabase functions deploy ai-generate
```

Never use the provider keys previously pasted into chat. Rotate them first and set only replacement
values through Supabase secrets. The frontend calls `/app/ai`, but it cannot use the tool until a
user session exists and at least one provider secret is configured.

The service-role key bypasses RLS and must never be returned to the browser or committed to Git.

## 9. Required Edge Functions

The following server-side boundaries are planned:

- `admin-resource-moderation` — approve, reject, edit, remove resources; notify uploader; audit actions.
- `admin-catalog-management` — manage colleges, branches, semesters, subjects, and categories.
- `admin-user-management` — suspension and restoration with audit logging.
- `resource-submit` — validate ownership, metadata, and Google Drive URL.
- `resource-search` — database-backed full-text/trigram search with safe pagination.
- `resource-actions` — bookmark, rating, share/view tracking, and report submission.
- `support-workflow` — ticket replies, status changes, and notifications.
- `community-moderation` — reports, hide/remove actions, and audit logging.
- `notification-worker` — trusted notification creation and read-state operations.
- `ai-generate` — provider abstraction, input validation, rate limits, and server-only AI calls.
- `ai-file-process` — PDF size/page validation and safe text extraction.
- `admin-analytics` — authorized aggregate queries without exposing private data.

## 10. Required decisions before applying migrations

- Confirm the Supabase project and production application origin.
- Confirm the Google OAuth application and redirect URLs.
- Confirm the intended operator account only after Google login; no credential is needed in this chat.
- Approve the proposed schema, enum values, and private cover-image bucket.
- Decide whether resource cover images should remain private with signed URLs or be served through a controlled public representation.

## 11. Milestone 3 admin activation

The protected admin route is implemented at `/admin`. It fails closed:

- Signed-out users see the Google sign-in screen.
- Signed-in non-admin users see **Access denied**.
- Role-check errors never render admin content.
- The browser calls `public.is_super_admin()`, but database RLS remains the real authorization boundary.

After the intended operator has completed Google login and the Auth/onboarding migration is applied, obtain the operator's Auth user UUID from **Authentication → Users**. Run this SQL once in the Supabase SQL Editor:

```sql
insert into public.user_roles (user_id, role)
values ('REPLACE_WITH_VERIFIED_AUTH_USER_UUID', 'super_admin')
on conflict (user_id) do update set role = 'super_admin';
```

Verify the single-admin invariant:

```sql
select user_id, role
from public.user_roles
where role = 'super_admin';
```

This must return exactly one row. Do not put the UUID, email, service-role key, or any bootstrap secret in frontend code. Do not create a public admin signup flow. Once the row exists, open `http://localhost:5174/admin` and sign in with that Google account.

## 10. Current validation

From `C:\NoteShareWebsite`:

```powershell
npm run build
npm run lint
```

The production build passes. Lint completes with two pre-existing warnings in `src/features/admin/components/AdminQuickSearch.tsx` about synchronous state updates inside effects; these do not block the build.
