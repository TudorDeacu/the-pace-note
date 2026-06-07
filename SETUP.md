# The Pace Note — Setup, Security & Operations Guide

This guide walks through everything you must configure outside the code:
**secret rotation**, **Supabase**, **Google OAuth**, **Resend (email)**, and **Vercel**.

> ⚠️ **Do the secret rotation (Section 0) first.** Your old `.env` with live keys
> was committed to git, so those keys must be considered compromised.

Environment variables the app uses (see `.env.example`):

| Variable | Where | Public? | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API | yes (browser) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API | yes (browser) | Anon/public key (RLS enforced) |
| `RESEND_API_KEY` | Resend → API Keys | **no (server only)** | Sending email |
| `NEXT_PUBLIC_URL_SECRET` | you generate | yes (browser) | URL-param obfuscation only |

---

## 0) Rotate the leaked secrets (do this now)

### 0.1 Supabase keys
1. Supabase Dashboard → your project → **Project Settings → API**.
2. Note the **Project URL** (this is not secret).
3. The **anon/public key** is safe to expose *as long as RLS is correct* (you fix
   RLS in Section 1). If you want to invalidate it anyway: **Settings → API →
   "Roll" / regenerate JWT secret** (this rotates anon + service keys). Only do
   this if you also update every place the keys are used, because it logs everyone
   out.
4. **Service role key** (the one the old `test-*.js` scripts referenced): treat as
   compromised. **Roll the JWT secret** if it was ever used in production. Never
   put the service role key in this Next.js app — it must never reach the browser.

### 0.2 Resend key
1. Resend Dashboard → **API Keys** → delete the old key → **Create API Key**
   (scope: *Sending access*).
2. Put the new value in `RESEND_API_KEY` locally (`.env`) and in Vercel (Section 4).

### 0.3 Make sure the secrets can never be committed again
Already done in code: `.env` is now untracked and `.gitignore` only tracks
`.env.example`. The old keys still exist in **git history** though. Options:
- **Minimum (required):** rotate the keys (above) so the historical ones are useless.
- **Optional (thorough):** scrub history with `git filter-repo` or BFG, then
  force-push. Only do this if you understand the implications for collaborators.

---

## 1) Supabase

### 1.1 Run the hardening SQL
Open **SQL Editor → New query**, paste the contents of `hardening.sql`, and **Run**.
This:
- Fixes the **PII leak** (profiles were world-readable — emails/phones/addresses).
- Stops users from editing their own `role` (privilege escalation).
- Restricts **storage uploads** to admins.
- Lets you mark your admin account.

In `hardening.sql`, **uncomment and edit** this line with your real email, then run it:
```sql
update public.profiles set role = 'admin' where email = 'YOUR-ADMIN-EMAIL@example.com';
```
Verify: `select email, role from public.profiles where role = 'admin';`

### 1.2 Auth URL configuration
**Authentication → URL Configuration**:
- **Site URL:** `https://thepacenote.ro`
- **Redirect URLs (allow-list):** add all of these
  - `https://thepacenote.ro/**`
  - `https://www.thepacenote.ro/**` (if you serve www)
  - `https://<your-vercel-preview>.vercel.app/**` (for preview deploys, optional)
  - `http://localhost:3000/**` (local dev)

The app redirects to `/auth/callback` after sign-in, email confirmation, Google
login, and password reset — these are covered by the `/**` wildcards above.

### 1.3 Email templates (Supabase Auth)
**Authentication → Email Templates** — make sure the **Confirm signup** and
**Reset password** templates point at `{{ .ConfirmationURL }}` (default is fine).
By default Supabase sends these from its own mail server. If you want them sent
from your domain, configure **Custom SMTP** (Authentication → Settings → SMTP)
using Resend SMTP (host `smtp.resend.com`, port `465`, user `resend`, password =
your Resend API key, sender `no-reply@thepacenote.ro`). Recommended for production
so confirmation emails don't hit spam.

### 1.4 Confirm RLS is on everywhere
**Database → Tables** → each table should show **RLS enabled**. The schema files
(`schema.sql`, `orders_schema.sql`, etc.) already enable it; `hardening.sql`
tightens the loose policies.

---

## 2) Google OAuth (Sign in with Google)

### 2.1 Google Cloud Console
1. https://console.cloud.google.com → create/select a project.
2. **APIs & Services → OAuth consent screen**:
   - User type: **External**, Publish status: **In production** (so any Google
     user can sign in, not just test users).
   - App name, support email, logo, app domain `thepacenote.ro`, privacy policy
     (`/terms`) and homepage links. Authorized domains: `thepacenote.ro` and
     `supabase.co`.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins:**
     - `https://thepacenote.ro`
     - `http://localhost:3000`
   - **Authorized redirect URIs** (this is the Supabase callback, *not* your app):
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
       (find the exact URL in Supabase → Authentication → Providers → Google)
   - Save → copy **Client ID** and **Client Secret**.

### 2.2 Supabase
**Authentication → Providers → Google** → enable → paste **Client ID** and
**Client Secret** → Save. That's it — the app already calls
`signInWithOAuth({ provider: 'google' })` and routes through `/auth/callback`.

> Test: click "Sign in with Google" on `/login`. New Google users land on
> `/login/complete-profile` to set a username, then `/account`.

---

## 3) Resend (transactional + newsletter email)

The app sends from `newsletter@thepacenote.ro` (newsletter/welcome) and the contact
form delivers to `thepacenote.crew@gmail.com`. For these to deliver (not spam),
verify your domain.

### 3.1 Verify the domain
1. Resend → **Domains → Add Domain** → `thepacenote.ro`.
2. Resend shows DNS records. Add them at your DNS provider (where `thepacenote.ro`
   is managed — e.g. registrar or Cloudflare):
   - **SPF** (TXT): `v=spf1 include:amazonses.com ~all` (value Resend gives you).
   - **DKIM** (CNAME/TXT records Resend provides — usually 3).
   - **DMARC** (TXT on `_dmarc.thepacenote.ro`): start with
     `v=DMARC1; p=none; rua=mailto:dmarc@thepacenote.ro;` then tighten to
     `p=quarantine` once delivery looks healthy.
3. Back in Resend, click **Verify** (DNS can take minutes to hours).

### 3.2 Sender addresses
- Newsletter/welcome: `newsletter@thepacenote.ro` (already in `utils/email.ts`).
- You don't need a real inbox for the *from* address, but you **should** create a
  reply-to inbox for replies.
- The contact form delivers to `thepacenote.crew@gmail.com` and sets reply-to to
  the visitor. If you want to change the recipient, edit `app/contact/actions.ts`.

### 3.3 Logo in emails
Emails load the logo from
`https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/logo.jpeg`.
Make sure that file exists in the `other` bucket, or update the URL in
`utils/email.ts`.

---

## 4) Vercel

### 4.1 Environment variables
**Project → Settings → Environment Variables** — add for **Production** (and
**Preview** if you use preview deploys):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your (current) anon key |
| `RESEND_API_KEY` | the **new** Resend key from Section 0.2 |
| `NEXT_PUBLIC_URL_SECRET` | output of `openssl rand -base64 32` |

After adding/changing env vars, **redeploy** (Deployments → ⋯ → Redeploy) — Vercel
does not pick up env changes without a new build.

> Do **not** add a service role key here. This app only needs the anon key.

### 4.2 Domain
**Project → Settings → Domains** → add `thepacenote.ro` (and `www`). Set the DNS
records Vercel shows. Decide whether `www` redirects to apex or vice-versa, and
make sure that choice matches the **Supabase Site URL** (Section 1.2).

### 4.3 Build settings
Defaults are correct: Framework **Next.js**, Build `next build`, Install `npm install`.
No special config needed.

### 4.4 Deploy checklist
- [ ] Secrets rotated (Section 0)
- [ ] `hardening.sql` run; you are an admin; PII policy verified
- [ ] Supabase Site URL + Redirect URLs set
- [ ] Google OAuth client + Supabase provider configured
- [ ] Resend domain verified (SPF/DKIM/DMARC green)
- [ ] Vercel env vars set for Production + redeployed
- [ ] Smoke test on production: register, confirm email, Google login, password
      reset, newsletter signup (welcome email arrives), contact form, place a test
      order, admin panel loads only for the admin account.

---

## 5) Known follow-ups (not yet changed in code)

These were intentionally left alone to avoid risk on the live site — decide if/when
to tackle them:

1. **Translation feature is disabled.** `components/T.tsx` returns raw Romanian and
   the language toggle does nothing. Re-enabling means uncommenting `T.tsx` and
   re-opening the `translations` INSERT policy. Note it calls the free `lingva.ml`
   mirror, which is unreliable.
2. **Contact form has no rate limiting.** It can be abused to send email through
   your Resend account. Consider a captcha (e.g. Cloudflare Turnstile) or simple
   per-IP throttling before heavy traffic.
3. **Lint debt.** `npx eslint .` reports ~70 `no-explicit-any` and a few
   `set-state-in-effect` items. None break the build or runtime; clean up
   gradually (don't bulk-refactor the `useEffect`/localStorage patterns blindly).
4. **`NEXT_PUBLIC_URL_SECRET`** is obfuscation only (it ships to the browser). Real
   access control is RLS. If you ever change this value, previously-emailed
   encrypted order links stop resolving.
