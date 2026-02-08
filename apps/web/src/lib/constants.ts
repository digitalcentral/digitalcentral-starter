/**
 * Application constants — customize these for your project.
 */

import { env } from "@/env";

// Subscription pricing (USD) — adjust for your product
export const PLAN_PRICES = {
	monthly: 29,
	yearly: 24, // Per month when paid yearly ($288/year)
} as const;

export const PLAN_DESCRIPTIONS = {
	monthly: "Full access, billed monthly",
	yearly: "Full access, save 20% with annual billing",
} as const;

export type BillingPeriod = "monthly" | "yearly";

// Trial period (days)
export const TRIAL_DAYS = 7;

// Currency
export const DEFAULT_CURRENCY = "USD";
export const PAYMENT_CURRENCY = "USD";

// App branding — change these for your project
export const APP_NAME = "Starter";
export const APP_DESCRIPTION = "A starter template for SaaS apps with auth, organizations, and subscriptions";
export const APP_URL = env.NEXT_PUBLIC_SITE_URL;

// Features list (marketing / landing page)
export const FEATURES = [
	{
		title: "Organizations",
		description: "Create and manage organizations with team members and roles.",
		icon: "Building2",
	},
	{
		title: "Subscriptions",
		description: "Built-in trial, subscription plans, and payment-ready structure.",
		icon: "CreditCard",
	},
	{
		title: "Authentication",
		description: "Better Auth with Google and email. Convex-backed sessions.",
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
		title: "Create Your Organization",
		description: "Sign up and set up your company or team in minutes.",
	},
	{
		step: 2,
		title: "Invite Your Team",
		description: "Add members and assign roles. Control who sees what.",
	},
	{
		step: 3,
		title: "Subscribe & Build",
		description: "Start a trial, then subscribe. Customize the app for your product.",
	},
] as const;
