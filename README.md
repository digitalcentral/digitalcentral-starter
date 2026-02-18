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

**Why:** A "clean" repo means your own GitHub repo with no starter history — fresh `git init` so the agent works against your repo only. The agent creates the repo on GitHub and does the first push; you do not create the repo manually on the website.

- [ ] **You:** Create a **GitHub Personal Access Token (classic)** with `repo` scope. Give it to the agent (e.g. in its environment or secrets). The agent will use it to create the new repo and push. Do not commit the token to the repo.
- [ ] **Agent (or you):** Clone the starter, drop starter history, then have the agent create the repo and push:

  ```bash
  git clone https://github.com/digitalcentral/digitalcentral-starter.git my-app && cd my-app
  rm -rf .git
  git init
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
  git add .
  git commit -m "Initial commit"
  git push -u origin master
  ```

  The agent creates the new GitHub repo (e.g. via `gh repo create` or the GitHub API using the PAT) so it exists before the push. Default branch is **master**.

### Phase 2: Scaffold locally

**Why:** Get dependencies and env in place before touching Convex or Vercel.

- [ ] Install dependencies: `pnpm install`
- [ ] Copy env: `cp .env.example .env.local`
- [ ] Edit `.env.local` (in the **repo root**). Use the [Environment variables checklist](#environment-variables-checklist) below for each variable and where to get it.

Do not run Convex or Vercel yet. Fill Convex URLs after Phase 3.

### Phase 3: Convex

**Why:** The backend runs on Convex. You need a project, its URLs, and a **deploy key** so the agent (or CI) can run Convex commands without interactive login. An agent on a VPS cannot run `pnpm -F backend dev` and log in in a browser — you do the one-time setup in the Convex dashboard and give the agent the deploy key.

**One-time setup (you do this in a browser):**

- [ ] Go to [dashboard.convex.dev](https://dashboard.convex.dev) and sign in. Create a **new project** (or use an existing one). You get a project and a production deployment.
- [ ] Open your project → **Settings**. Copy the **Deployment URL**. This is your `NEXT_PUBLIC_CONVEX_URL` (and often `NEXT_PUBLIC_CONVEX_SITE_URL` too — use your app URL for auth).
- [ ] In **Settings** → **Deploy keys**, create a **production** deploy key. Copy it — you will give this to the agent (or put it in env) as `CONVEX_DEPLOY_KEY`. With this key set, the agent can run `pnpm -F backend dev` and `pnpm release` on the VPS without any login prompts.
- [ ] In **Settings** → **Environment Variables**, add the variables your backend needs: at least `BETTER_AUTH_URL` (your app URL, e.g. `https://your-app.vercel.app`) and `BETTER_AUTH_SECRET` (e.g. generate with `openssl rand -base64 32`). Without these, the backend can fail at runtime.

**What to give the agent (so it can do Convex setup on the VPS):**

- **`CONVEX_DEPLOY_KEY`** — the production deploy key you just created. The agent should set this in the repo's `.env.local` (or in the agent's environment). Then the agent can run `pnpm -F backend dev` or `pnpm release` non-interactively.
- **Deployment URL** — so the agent (or you) can set `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` in `.env.local` and in Vercel. The agent cannot discover these without the dashboard; you provide them after creating the project.

### Phase 4: Vercel

**Why:** The Next.js app is deployed to Vercel. Connect your GitHub repo; deploys run automatically when you push to **master**.

- [ ] In [Vercel](https://vercel.com): **Add New** → **Project** → import your GitHub repo. Use the **root** of the repo (Vercel will detect the monorepo; set **Root Directory** to `.` or leave default per Vercel’s monorepo docs). Set **Framework** to Next.js and the app directory to `apps/web` if prompted.
- [ ] Add **Environment Variables** in Vercel. Only the Next.js/site vars are needed: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `NEXT_PUBLIC_SITE_URL`.

### Phase 5: Publish

**Why:** Deploy backend and frontend so the app is live.

- [ ] Deploy Convex: from repo root run `CONVEX_DEPLOY_KEY=your_key pnpm release` on a VPS without interactive login.
- [ ] Deploy the web app: push to **master**; Vercel deploys from Git automatically.
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
| `BETTER_AUTH_URL` | Local, **Convex dashboard only** | Same as `NEXT_PUBLIC_SITE_URL`. Backend reads this — set only in Convex dashboard (not Vercel). |
| `BETTER_AUTH_SECRET` | Local, **Convex dashboard only** | e.g. `openssl rand -base64 32`. Set only in Convex dashboard (not Vercel). |
| `CONVEX_DEPLOY_KEY` | Local / CI (optional) | Convex dashboard → Settings → Deploy keys (production). Needed for non-interactive deploy. |

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
I'm using the Digital Central Starter. I've created a GitHub PAT (classic) and will give it to you. Clone the starter, run rm -rf .git and git init, create a new GitHub repo under [my GitHub username/org] named [desired repo name] (using the PAT), then add remote, commit with message "Initial commit", and push to master. Give me the exact steps; you create the repo — I don't create it on the website.
```

### Prompt 2 — Scaffold the project

```
Using the Digital Central Starter repo we just set up: install dependencies (pnpm install), copy .env.example to .env.local, and tell me exactly which env vars I need to fill and where to get each value (Convex dashboard, etc.). Don't run Convex or Vercel yet.
```

### Prompt 3 — Set up Convex

```
For this Digital Central Starter project: I will create the Convex project myself in the dashboard (the agent runs on a VPS and cannot log in in a browser). After I create the project and a production deploy key, I'll give the agent CONVEX_DEPLOY_KEY and the deployment URL. Help me: 1) Confirm where in the Convex dashboard to create the project and the production deploy key, 2) Where to find NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_CONVEX_SITE_URL to give to the agent, 3) Which environment variables I must set in the Convex dashboard (e.g. BETTER_AUTH_URL, BETTER_AUTH_SECRET) so the backend works, 4) Exactly where the agent should set CONVEX_DEPLOY_KEY (e.g. in .env.local on the VPS) so it can run pnpm -F backend dev and pnpm release without prompts.
```

### Prompt 4 — Set up Vercel

```
For this Digital Central Starter (Next.js in apps/web, monorepo): help me connect the GitHub repo to Vercel and set the correct root and build settings. List only the environment variables Vercel needs (NEXT_PUBLIC_CONVEX_URL, NEXT_PUBLIC_CONVEX_SITE_URL, NEXT_PUBLIC_SITE_URL — not BETTER_AUTH_*). Deploys will happen when I push to master.
```

### Prompt 5 — Deploy and get live URL

```
Deploy this Digital Central Starter to production: 1) Deploy the Convex backend (using CONVEX_DEPLOY_KEY if needed), 2) Push to master so Vercel deploys the web app. Confirm the live URL and that the app loads and sign-in works.
```

### Prompt 6 — Plan and requirements (after live)

```
My app is live at [URL]. I want to build [one-sentence product idea]. Help me write a short plan and a list of requirements I can use to implement features step by step (user stories or tasks).
```

---

## License

Apache 2.0
