# Digital Central Starter

A **project starter** for building modern SaaS apps with authentication and reactive database. Use it as a base and customize branding, copy, and features for your product. Works great with [OpenClaw](https://docs.openclaw.ai/) or other AI agents on a VPS (e.g. via Telegram).

## Who this is for

- **Beginners** who want a clear path from zero to a live app.
- **People using an AI agent** (e.g. OpenClaw on a VPS via Telegram) to scaffold, configure, and deploy step by step.

## What's included

- **Turborepo monorepo**: `apps/web` (Next.js) and `apps/backend` (Convex)
- **Auth**: [Better Auth](https://www.better-auth.com/) with Convex plugin — email and password authentication
- **UI**: [shadcn/ui](https://ui.shadcn.com/) (Radix), Tailwind CSS 4, dark/light theme
- **Real-time**: [Convex](https://convex.dev/referral/DIGITA6401) for database and server functions

## Tech stack

| Layer        | Tech |
|-------------|------|
| Frontend    | Next.js 16, React 19, Tailwind CSS 4 |
| Backend     | Convex (real-time DB + serverless functions) |
| Auth        | Better Auth + Convex adapter |
| UI          | Radix UI, shadcn/ui |
| Monorepo    | pnpm, Turborepo |

## Prerequisites

- **Node.js** 18+
- **pnpm** 10+
- **Accounts** (for the full path to a live site): [Convex](https://convex.dev/referral/DIGITA6401) (free tier), [Vercel](https://vercel.com), and GitHub

---

## OpenClaw / agent path: From zero to live

Follow these phases in order. Each step builds on the previous one. If you use OpenClaw (e.g. in Telegram), there are [copy-paste prompts](#prompts-to-use-with-openclaw) at the bottom for each phase.

```
Clone starter → Prepare GitHub clean → Scaffold (install + env) → Convex (project + deploy key + dashboard env) → Vercel (project + env) → Deploy → Live URL → Write plan and requirements
```

### Phase 1: Prepare GitHub (clean repo)

**Why:** A "clean" repo means your own GitHub repo with no starter history and the correct remote. Agents often fail when the repo is still a clone of the starter with the wrong remote.

- [ ] Clone the starter: `git clone https://github.com/digitalcentral/digitalcentral-starter.git my-app && cd my-app`
- [ ] Create a **new** empty repo on GitHub (under your account or org). Do not push the starter there yet.
- [ ] Replace the remote so your repo points only at your new repo:

  ```bash
  git remote remove origin
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
  git push -u origin main
  ```

  (Use `master` if your default branch is `master`.)  
  Your code is now in your own repo with a clean history for the project.

### Phase 2: Scaffold locally

**Why:** Get dependencies and env in place before touching Convex or Vercel.

- [ ] Install dependencies: `pnpm install`
- [ ] Copy env: `cp .env.example .env.local`
- [ ] Edit `.env.local` (in the **repo root**). Use the [Environment variables checklist](#environment-variables-checklist) below for each variable and where to get it.

Do not run Convex or Vercel yet. Fill Convex URLs after Phase 3.

### Phase 3: Convex

**Why:** The backend runs on Convex. You need a project, its URLs, a deploy key for non-interactive deploys, and env vars in the Convex dashboard so the backend can use them.

- [ ] Create or link a Convex project: from repo root run `pnpm -F backend dev`. Follow the prompts to log in and create/link a project. Once it’s running you can stop it.
- [ ] In the [Convex dashboard](https://dashboard.convex.dev): open your project → **Settings** → copy **Deployment URL** (and optionally **Site URL**). Put these in `.env.local` as `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` (often the same as your app URL for auth).
- [ ] **Deploy key (for CI/agent):** In Convex dashboard → **Settings** → **Deploy keys** → create a **production** deploy key. Set it as `CONVEX_DEPLOY_KEY` in your repo env (or Vercel / agent env) so deploys work without interactive login.
- [ ] **Convex dashboard env:** In Convex dashboard → **Settings** → **Environment Variables**, set the same variables your backend needs: at least `BETTER_AUTH_URL` (and `BETTER_AUTH_SECRET` if your Convex code uses it). If these are missing, the backend can fail at runtime.

### Phase 4: Vercel

**Why:** The Next.js app is deployed to Vercel. You need a project connected to your GitHub repo and all env vars set.

- [ ] In [Vercel](https://vercel.com): **Add New** → **Project** → import your GitHub repo. Use the **root** of the repo (Vercel will detect the monorepo; set **Root Directory** to `.` or leave default per Vercel’s monorepo docs). Set **Framework** to Next.js and the app directory to `apps/web` if prompted.
- [ ] Add **Environment Variables** in Vercel. Use the same names as in [.env.example](.env.example). At minimum: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`. Point URLs to your production domain (e.g. `https://your-app.vercel.app`).
- [ ] (Optional) For CLI deploys: create a token at [Vercel Account Tokens](https://vercel.com/account/tokens). You can use `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` so `vercel deploy --token YOUR_TOKEN` works non-interactively.

### Phase 5: Publish

**Why:** Deploy backend and frontend so the app is live.

- [ ] Deploy Convex: from repo root run `pnpm release` (or `CONVEX_DEPLOY_KEY=your_key pnpm release` if you’re in CI or on a VPS without interactive login).
- [ ] Deploy the web app: either let Vercel deploy from Git (push to your main branch) or run `vercel deploy --prod --token YOUR_TOKEN` (and set `VERCEL_PROJECT_ID` / `VERCEL_ORG_ID` if needed).
- [ ] Confirm the live URL. Open the site and test sign-in so you know auth and Convex are working.

### Phase 6: You're live — then write your plan

Once the app is live, you have a URL to share. Next step is to **write a short plan and requirements** for your product (user stories or tasks). Use [Prompt 6](#prompt-6--plan-and-requirements-after-live) below in OpenClaw to generate that from your product idea.

---

## Environment variables checklist

Set these in **local** (`.env.local`), **Vercel** (project env vars), and **Convex** (dashboard → Settings → Environment Variables) where noted.

| Variable | Where to set | Notes |
|----------|--------------|--------|
| `NEXT_PUBLIC_CONVEX_URL` | Local, Vercel | Convex dashboard → your project → Settings → Deployment URL |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Local, Vercel | Same as site URL (e.g. `https://your-app.vercel.app`) for auth |
| `NEXT_PUBLIC_SITE_URL` | Local, Vercel | Your app URL (localhost for dev, Vercel URL for prod) |
| `BETTER_AUTH_URL` | Local, Vercel, **Convex dashboard** | Same as `NEXT_PUBLIC_SITE_URL`. Backend reads this — must be in Convex dashboard. |
| `BETTER_AUTH_SECRET` | Local, Vercel, **Convex dashboard** | e.g. `openssl rand -base64 32`. Must be in Convex dashboard if backend uses it. |
| `CONVEX_DEPLOY_KEY` | Local / CI / Vercel (optional) | Convex dashboard → Settings → Deploy keys (production). Needed for non-interactive deploy. |

---

## Quick start (for experts)

If you already know Turborepo, Convex, and Vercel:

### 1. Clone and install

```bash
git clone https://github.com/digitalcentral/digitalcentral-starter.git my-app
cd my-app
pnpm install
```

### 2. Environment variables

Copy the example env to the **repo root**. Both the web app and the backend read from this single file:

```bash
cp .env.example .env.local
```

Edit `.env.local` (in the root) and set:

- **Convex**: Create a project at [dashboard.convex.dev](https://dashboard.convex.dev), then set `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL`.
- **Better Auth**: Set `BETTER_AUTH_SECRET` (e.g. `openssl rand -base64 32`).
- **URLs**: `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your app URL (e.g. `http://localhost:3000` for local dev).

**Don't forget:** Set the same variables in your [Convex project](https://dashboard.convex.dev) (Settings → Environment Variables) so the backend can use them when running.

### 3. Run Convex (first time)

From the repo root, push your Convex schema and start the backend dev server:

```bash
pnpm -F backend dev
```

Follow the prompts to log in and create/link a Convex project. Once it's running, you can stop it and use `pnpm dev` in the next step (Turborepo will run both web and backend).

### 4. Start development

From the repo root:

```bash
pnpm dev
```

This starts:

- **Next.js** (e.g. http://localhost:3000)
- **Convex** backend dev

Sign in with email and password, and you're in the app.

---

## Project structure

```
├── apps/
│   ├── web/                    # Next.js app (@digitalcentral/web)
│   │   ├── src/
│   │   │   ├── app/            # Routes: landing, sign-in, sign-up, dashboard, settings
│   │   │   ├── components/     # UI, layout, forms, providers
│   │   │   └── lib/            # constants, auth, utils
│   │   └── public/
│   └── backend/                # Convex (@digitalcentral/backend)
│       └── convex/
│           ├── schema.ts       # Tables: users, etc.
│           ├── auth.ts         # Better Auth Convex integration
│           └── ...
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Customizing for your product

### Branding and copy

Edit **`apps/web/src/lib/constants.ts`**:

- **`APP_NAME`** — Used in header, sign-in, sign-up, footer (default: `"Starter"`).
- **`APP_DESCRIPTION`** — Short tagline.
- **`FEATURES`** — List of features for the landing page (title, description, icon).
- **`HOW_IT_WORKS`** — Steps for the "How it works" section.

Landing page copy pulls from these constants so one place drives the narrative.

### Adding features

- **New Convex logic**: Add files under `apps/backend/convex/` and call them from the web app via `@digitalcentral/backend/convex/_generated/api`.
- **New pages**: Add routes under `apps/web/src/app/` and, if needed, new items in `apps/web/src/components/layout/sidebar-nav.tsx`.

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start all apps (web + Convex) via Turborepo |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | TypeScript check across the workspace |
| `pnpm check` | Run Biome linter |
| `pnpm check:write` | Biome format and safe fixes |

From the repo root: `pnpm -F web start` runs the production Next.js server; `pnpm -F backend dev` runs Convex dev; `pnpm release` deploys Convex to production.

## Deployment

For a step-by-step path (including Convex deploy key and Vercel env), see [OpenClaw / agent path](#openclaw--agent-path-from-zero-to-live) above.

- **Next.js**: Deploy `apps/web` to Vercel, or any Node host. Set the same env vars as in the root `.env.local` (and point URLs to your production domain).
- **Convex**: Run `pnpm release` from the repo root to deploy Convex (use `CONVEX_DEPLOY_KEY` in CI). Set environment variables in the [Convex dashboard](https://dashboard.convex.dev) (Settings → Environment Variables) for your project.

---

## Prompts to use with OpenClaw

Copy the text below into your OpenClaw chat (e.g. Telegram). Replace placeholders in square brackets with your details.

### Prompt 1 — Prepare GitHub (clean repo)

```
I'm using the Digital Central Starter. Help me prepare a clean GitHub repo: clone the starter, create a new GitHub repo under my account (no history from the starter), and push the code so the new repo is the only remote. Give me exact commands for [my GitHub username/org and desired repo name].
```

### Prompt 2 — Scaffold the project

```
Using the Digital Central Starter repo we just set up: install dependencies (pnpm install), copy .env.example to .env.local, and tell me exactly which env vars I need to fill and where to get each value (Convex dashboard, etc.). Don't run Convex or Vercel yet.
```

### Prompt 3 — Set up Convex

```
For this Digital Central Starter project: I need to set up Convex. Walk me through: 1) Creating/linking a Convex project (e.g. by running pnpm -F backend dev once), 2) Where to find NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_CONVEX_SITE_URL, 3) Creating a production deploy key in the Convex dashboard and where to set CONVEX_DEPLOY_KEY, 4) Which environment variables must be set in the Convex dashboard (e.g. BETTER_AUTH_URL) so the backend works.
```

### Prompt 4 — Set up Vercel

```
For this Digital Central Starter (Next.js in apps/web, monorepo): help me connect the GitHub repo to Vercel, set the correct root and build settings, and list every environment variable I need to add in Vercel (with the same names as in .env.example). If I want to deploy from the CLI later, what token and env vars do I need?
```

### Prompt 5 — Deploy and get live URL

```
Deploy this Digital Central Starter to production: 1) Deploy the Convex backend (using CONVEX_DEPLOY_KEY if needed), 2) Deploy the Next.js app to Vercel (or run vercel deploy with token). Confirm the live URL and that the app loads and sign-in works.
```

### Prompt 6 — Plan and requirements (after live)

```
My app is live at [URL]. I want to build [one-sentence product idea]. Help me write a short plan and a list of requirements I can use to implement features step by step (user stories or tasks).
```

---

## License

Apache 2.0
