import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Trial period in milliseconds (7 days)
const TRIAL_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

// ============================================
// Subscription Queries
// ============================================

// Get subscription for an organization (trial only; Polar state via portal plugin with referenceId)
export const getByOrganization = query({
	args: { organizationId: v.string() },
	handler: async (ctx, args): Promise<Record<string, unknown> | null> => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		const base = (sub: typeof subscription) => ({
			...(sub ?? {}),
			id: sub?._id,
			polarSubscription: null as { status: string; productKey?: string; productId?: string; currentPeriodEnd?: number } | null,
			isExpired: true,
			daysRemaining: 0,
			isTrialExpired: true,
			trialDaysRemaining: 0,
		});

		if (!subscription) return null;

		if (subscription.status === "trial" && subscription.trialEndsAt) {
			const isExpired = Date.now() > subscription.trialEndsAt;
			return {
				...base(subscription),
				isTrialExpired: isExpired,
				trialDaysRemaining: isExpired ? 0 : Math.ceil((subscription.trialEndsAt - Date.now()) / (24 * 60 * 60 * 1000)),
			};
		}

		return base(subscription);
	},
});

// Check if organization has valid access (trial only; Polar checked via portal plugin on client)
export const hasValidAccess = query({
	args: { organizationId: v.string() },
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		if (subscription?.status === "trial" && subscription.trialEndsAt) {
			if (Date.now() <= subscription.trialEndsAt) {
				return {
					hasAccess: true,
					reason: "trial",
					daysRemaining: Math.ceil((subscription.trialEndsAt - Date.now()) / (24 * 60 * 60 * 1000)),
				};
			}
			return { hasAccess: false, reason: "trial_expired" };
		}

		return { hasAccess: false, reason: subscription ? "subscription_expired" : "no_subscription" };
	},
});

// ============================================
// Subscription Mutations
// ============================================

// Create a trial subscription for a new organization (also used inline in organizations.ts)
export const createTrial = mutation({
	args: {
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		if (existing) {
			throw new Error("Subscription already exists for this organization");
		}

		const now = Date.now();
		const trialEndsAt = now + TRIAL_PERIOD_MS;

		return await ctx.db.insert("subscriptions", {
			organizationId: args.organizationId,
			billingPeriod: "monthly",
			status: "trial",
			trialEndsAt,
			createdAt: now,
			updatedAt: now,
		});
	},
});
