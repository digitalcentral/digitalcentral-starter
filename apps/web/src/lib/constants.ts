/**
 * Application constants — customize these for your project.
 */

import { env } from "@/env";


// App branding — change these for your project
export const APP_NAME = "Starter";
export const APP_DESCRIPTION = "A starter template for SaaS apps with authentication";
export const APP_URL = env.NEXT_PUBLIC_SITE_URL;

// Features list (marketing / landing page)
export const FEATURES = [
	{
		title: "Authentication",
		description: "Better Auth with email and password. Convex-backed sessions.",
		icon: "Shield",
	},
	{
		title: "Real-time",
		description: "Live data with Convex. No polling, no stale state.",
		icon: "Zap",
	},
	{
		title: "Modern Stack",
		description: "Next.js 16, React 19, Tailwind 4, TypeScript.",
		icon: "Layout",
	},
	{
		title: "Monorepo",
		description: "Turborepo with web app and Convex backend in one repo.",
		icon: "Box",
	},
] as const;

// How it works (landing page)
export const HOW_IT_WORKS = [
	{
		step: 1,
		title: "Sign Up",
		description: "Create your account with email and password.",
	},
	{
		step: 2,
		title: "Start Building",
		description: "Customize the app for your product and add your features.",
	},
	{
		step: 3,
		title: "Deploy",
		description: "Deploy to production and scale your application.",
	},
] as const;
