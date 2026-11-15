# Deploying StudyX to Vercel

StudyX is a **static frontend** (React + Vite). There is no backend, no database and no API keys,
so deployment is short and safe.

Everything needed is already in the repo:

| File | Why it exists |
| --- | --- |
| `vercel.json` | Tells Vercel to build with `npm run build`, serve `dist/`, and send every URL to `index.html` so refreshing `/app` or `/app/explore` works |
| `public/robots.txt` | Tells search engines they may crawl the site and where the sitemap is |
| `public/sitemap.xml` | Lists the public pages |
| `public/og-image.png` | The 1200×630 preview card shown when the link is shared |
| `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Browser tab and phone home-screen icons |

---

## Step 1 — Create the GitHub repository

1. Open <https://github.com/new> in your browser.
2. **Repository name:** `studyx` (or `NoteShareWebsite` — any name works).
3. Set it to **Private** if you do not want the code public yet.
4. **Do not** tick "Add a README", "Add .gitignore" or "Choose a license" — the project already has
   them, and extra files cause a conflict on the first push.
5. Click **Create repository**.

## Step 2 — Push your code

Copy the URL GitHub shows you (it looks like `https://github.com/YOUR-NAME/studyx.git`).

Then in **PowerShell**, run these one at a time:

```powershell
cd C:\NoteShareWebsite
git remote add origin https://github.com/YOUR-NAME/studyx.git
git branch -M main
git push -u origin main
```

- `git remote add origin …` tells Git where the project lives online. Run it **once**.
- `git branch -M main` renames your local branch from `master` to `main`.
- `git push -u origin main` uploads the code.

GitHub will open a browser window asking you to sign in the first time. Sign in there — never paste
passwords or tokens into a chat.

## Step 3 — Import the project into Vercel

1. Go to <https://vercel.com/signup> and choose **Continue with GitHub**.
2. On the dashboard click **Add New… → Project**.
3. Find `studyx` in the list and click **Import**.
   If it is missing, click **Adjust GitHub App Permissions** and grant access to the repository.
4. Vercel reads the settings automatically. Confirm they look like this:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | **Vite** |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

5. Leave **Environment Variables** empty — this project needs none.
6. Click **Deploy**.

The first build takes about a minute. When it finishes you get a URL like
`https://studyx-abc123.vercel.app`.

## Step 4 — Test the live site

Visit each of these on your phone **and** your laptop:

- `https://YOUR-PROJECT.vercel.app/` — landing page
- `https://YOUR-PROJECT.vercel.app/app` — dashboard
- `https://YOUR-PROJECT.vercel.app/app/explore` — "Not yet available" page
- `https://YOUR-PROJECT.vercel.app/robots.txt`
- `https://YOUR-PROJECT.vercel.app/sitemap.xml`
- `https://YOUR-PROJECT.vercel.app/og-image.png`

Then **press F5 on `/app/explore`**. If the page survives a refresh instead of showing a 404, SPA
routing is working.

## Step 5 — Point the metadata at your real URL

I used a placeholder domain (`https://studyx.vercel.app`) so the tags were not empty. Replace it
with your actual Vercel URL — or with your own domain if you add one (Step 6).

Search for `studyx.vercel.app` in these three files and replace every hit:

- `index.html` — canonical link, `og:url`, `og:image`, `twitter:image`
- `public/robots.txt` — the `Sitemap:` line
- `public/sitemap.xml` — both `<loc>` entries

Then push the change (Vercel redeploys automatically):

```powershell
cd C:\NoteShareWebsite
git add .
git commit -m "chore: point metadata at the live domain"
git push
```

## Step 6 — Add your own domain (optional)

1. In Vercel open your project → **Settings → Domains**.
2. Type your domain (for example `studyx.in`) and click **Add**.
3. Vercel shows either an **A record** or a **CNAME record**. Add those at your domain registrar
   (GoDaddy, Namecheap, Cloudflare…).
4. Wait for Vercel to show a green **Valid Configuration** tick — usually a few minutes, sometimes
   up to 24 hours.
5. Redo Step 5 with the new domain, because Google and social previews use that URL.

Vercel issues the HTTPS certificate automatically. Nothing to install.

---

## How updates work

You do **not** upload files by hand. Every push to `main` redeploys the site:

```powershell
cd C:\NoteShareWebsite
git add .
git commit -m "feat: explore page with search"
git push
```

Watch the build in the Vercel dashboard under **Deployments**. A green **Ready** badge means it is
live.

## Environment variables

This project has none, and it has no `.env` file. When Stage 2 adds a backend, put the keys in
**Vercel → Settings → Environment Variables**, never in the code, and add `.env` to `.gitignore`
(already there).

---

## Troubleshooting

**Refreshing a page shows "404: NOT_FOUND".**
`vercel.json` is missing or was not committed. Check it exists at the repo root, then push again.

**The build fails with a TypeScript error.**
Run `npm run build` locally, fix the error, commit and push. Never push a build you have not seen
succeed.

**The site loads but looks unstyled.**
The CSS file did not upload. Run `npm run build` and confirm `dist/assets/*.css` exists, then
redeploy.

**I deployed and the old version is still showing.**
Vercel keeps the previous deployment live until the new build succeeds. Open **Deployments** and
check whether the newest one is still **Building** or shows **Error**. Hard-refresh with
`Ctrl + Shift + R`.

**A shared link has no preview image.**
Some apps cache link previews for days. Test your card at
<https://www.opengraph.xyz/> or in a fresh WhatsApp chat, and make sure Step 5 is done.

---

## Checklist before every deploy

```powershell
cd C:\NoteShareWebsite
npm run build     # must finish with zero errors
npm run preview   # open the printed http://localhost:4173 and click around
```

If both are clean, push.
