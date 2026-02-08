import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { billingPeriodValidator, subscriptionStatusValidator } from "./schema";

// Trial period in milliseconds (7 days)
const TRIAL_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

// ============================================
// Subscription Queries
// ============================================

// Get subscription for an organization
export const getByOrganization = query({
	args: { organizationId: v.string() },
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		if (!subscription) return null;

		// Check trial
		if (subscription.status === "trial" && subscription.trialEndsAt) {
			const isExpired = Date.now() > subscription.trialEndsAt;
			return {
				...subscription,
				id: subscription._id,
				isExpired: true,
				daysRemaining: 0,
				isTrialExpired: isExpired,
				trialDaysRemaining: isExpired ? 0 : Math.ceil((subscription.trialEndsAt - Date.now()) / (24 * 60 * 60 * 1000)),
			};
		}

		// Check subscription
		if (subscription.status === "active" && subscription.endDate) {
			const isExpired = Date.now() > subscription.endDate;
			return {
				...subscription,
				id: subscription._id,
				isExpired,
				daysRemaining: isExpired ? 0 : Math.ceil((subscription.endDate - Date.now()) / (24 * 60 * 60 * 1000)),
				isTrialExpired: true,
				trialDaysRemaining: 0,
			};
		}

		return { ...subscription, id: subscription._id, isExpired: true, daysRemaining: 0, isTrialExpired: true, trialDaysRemaining: 0 };
	},
});

// Check if organization has valid access (trial or active subscription)
export const hasValidAccess = query({
	args: { organizationId: v.string() },
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		if (!subscription) return { hasAccess: false, reason: "no_subscription" };

		// Check trial
		if (subscription.status === "trial") {
			if (subscription.trialEndsAt && Date.now() > subscription.trialEndsAt) {
				return { hasAccess: false, reason: "trial_expired" };
			}
			return {
				hasAccess: true,
				reason: "trial",
				daysRemaining: subscription.trialEndsAt ? Math.ceil((subscription.trialEndsAt - Date.now()) / (24 * 60 * 60 * 1000)) : 0,
			};
		}

		// Check active subscription
		if (subscription.status === "active") {
			if (subscription.endDate && Date.now() > subscription.endDate) {
				return { hasAccess: false, reason: "subscription_expired" };
			}
			return { hasAccess: true, reason: "active" };
		}

		return { hasAccess: false, reason: subscription.status };
	},
});

// ============================================
// Subscription Mutations
// ============================================

// Create a trial subscription for a new organization
export const createTrial = mutation({
	args: {
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		// Check if subscription already exists
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

// Activate subscription after payment
export const activate = mutation({
	args: {
		organizationId: v.string(),
		billingPeriod: billingPeriodValidator,
	},
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		if (!subscription) {
			throw new Error("Subscription not found");
		}

		const now = Date.now();
		const periodMs = args.billingPeriod === "yearly" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

		await ctx.db.patch(subscription._id, {
			status: "active",
			billingPeriod: args.billingPeriod,
			startDate: now,
			endDate: now + periodMs,
			updatedAt: now,
		});

		return { success: true };
	},
});

// Update subscription status
export const updateStatus = mutation({
	args: {
		id: v.id("subscriptions"),
		status: subscriptionStatusValidator,
		startDate: v.optional(v.number()),
		endDate: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const { id, ...data } = args;
		await ctx.db.patch(id, {
			...data,
			updatedAt: Date.now(),
		});
		return { success: true };
	},
});

// Extend subscription (for renewals)
export const extend = mutation({
	args: {
		organizationId: v.string(),
		billingPeriod: billingPeriodValidator,
	},
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		if (!subscription) {
			throw new Error("Subscription not found");
		}

		const now = Date.now();
		const periodMs = args.billingPeriod === "yearly" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

		// Start from current end date if still valid, otherwise from now
		const startDate = subscription.endDate && subscription.endDate > now ? subscription.endDate : now;

		await ctx.db.patch(subscription._id, {
			status: "active",
			billingPeriod: args.billingPeriod,
			endDate: startDate + periodMs,
			updatedAt: now,
		});

		return { success: true };
	},
});

// Cancel subscription
export const cancel = mutation({
	args: {
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.first();

		if (!subscription) {
			throw new Error("Subscription not found");
		}

		await ctx.db.patch(subscription._id, {
			status: "cancelled",
			updatedAt: Date.now(),
		});

		return { success: true };
	},
});
