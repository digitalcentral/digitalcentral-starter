# Digital Central Starter

A **project starter** for building SaaS apps with authentication, organizations, team members, and subscriptions. Use it as a base and customize branding, copy, and features for your product.

## What’s included

- **Turborepo monorepo**: `apps/web` (Next.js) and `apps/backend` (Convex)
- **Auth**: [Better Auth](https://www.better-auth.com/) with Convex plugin — Google OAuth and email
- **Organizations**: Create orgs, invite members, assign roles (admin/member)
- **Subscriptions**: Trial period, subscription status, and a placeholder flow you can connect to Stripe, Paddle, or another provider
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
- A [Convex](https://convex.dev/referral/DIGITA6401) account (free tier is enough)

## Getting started

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
- **Better Auth**: Set `BETTER_AUTH_SECRET` (e.g. `openssl rand -base64 32`). For Google sign-in, add `BETTER_AUTH_GOOGLE_CLIENT_ID` and `BETTER_AUTH_GOOGLE_CLIENT_SECRET`.
- **URLs**: `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your app URL (e.g. `http://localhost:3000` for local dev).

**Don’t forget:** Set the same variables in your [Convex project](https://dashboard.convex.dev) (Settings → Environment Variables) so the backend can use them when running.

### 3. Run Convex (first time)

From the repo root, push your Convex schema and start the backend dev server:

```bash
pnpm -F backend dev
```

Follow the prompts to log in and create/link a Convex project. Once it’s running, you can stop it and use `pnpm dev` in the next step (Turborepo will run both web and backend).

### 4. Start development

From the repo root:

```bash
pnpm dev
```

This starts:

- **Next.js** (e.g. http://localhost:3000)
- **Convex** backend dev

Sign in with Google (or email if configured), create an organization, and you’re in the app.

## Project structure

```
├── apps/
│   ├── web/                    # Next.js app (@digitalcentral/web)
│   │   ├── src/
│   │   │   ├── app/            # Routes: landing, sign-in, dashboard, settings, subscription, onboarding
│   │   │   ├── components/     # UI, layout, forms, providers
│   │   │   └── lib/            # constants, auth, utils
│   │   └── public/
│   └── backend/                # Convex (@digitalcentral/backend)
│       └── convex/
│           ├── schema.ts       # Tables: users, orgs, subscriptions, payments, etc.
│           ├── auth.ts        # Better Auth Convex integration
│           ├── organizations.ts
│           ├── subscriptions.ts
│           └── ...
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Customizing for your product

### Branding and copy

Edit **`apps/web/src/lib/constants.ts`**:

- **`APP_NAME`** — Used in header, sign-in, onboarding, footer (default: `"Starter"`).
- **`APP_DESCRIPTION`** — Short tagline.
- **`FEATURES`** — List of features for the landing page (title, description, icon).
- **`HOW_IT_WORKS`** — Steps for the “How it works” section.
- **`PLAN_PRICES`** — Example monthly/yearly prices (USD). Adjust or add plans as needed.

Landing, pricing, and paywall copy pull from these constants so one place drives the narrative.

### Adding features

- **New Convex logic**: Add files under `apps/backend/convex/` and call them from the web app via `@digitalcentral/backend/convex/_generated/api`.
- **New pages**: Add routes under `apps/web/src/app/` and, if needed, new items in `apps/web/src/components/layout/sidebar-nav.tsx`.
- **Payments**: The subscription flow is ready for you to plug in your provider (e.g. Stripe) in Convex and in the subscription page/API.

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start all apps (web + Convex) via Turborepo |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | TypeScript check across the workspace |
| `pnpm check` | Run Biome linter |
| `pnpm check:write` | Biome format and safe fixes |

From the repo root: `pnpm --filter @digitalcentral/web start` runs the production Next.js server; `pnpm --filter @digitalcentral/backend dev` runs Convex dev; `pnpm release` deploys Convex to production.

## Deployment

- **Next.js**: Deploy `apps/web` to Vercel, Netlify, or any Node host. Set the same env vars as in the root `.env.local` (and point URLs to your production domain).
- **Convex**: Run `pnpm release` from the repo root to deploy Convex. Don’t forget to set environment variables in the [Convex dashboard](https://dashboard.convex.dev) (Settings → Environment Variables) for your project.

## License

Apache 2.0
