/**
 * Application constants — customize these for your project.
 */

import { env } from "@/env";

// Subscription pricing (USD) — Polar sandbox products
export const PLAN_PRICES = {
	monthly: 5,
	yearly: 50, // Per year (2000 credits/month)
	credits: 25, // One-time 5000 credits
} as const;

export const PLAN_CREDITS = {
	monthly: 1000,
	yearly: 2000,
	credits: 5000,
} as const;

export const PLAN_DESCRIPTIONS = {
	monthly: "1000 credits/month, billed monthly",
	yearly: "2000 credits/month, billed annually",
	credits: "5000 credits one-time add-on",
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
