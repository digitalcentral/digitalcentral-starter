import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================
// Application Validators
// ============================================

// Billing period types
export const billingPeriodValidator = v.union(v.literal("monthly"), v.literal("yearly"));

// Subscription status types
export const subscriptionStatusValidator = v.union(v.literal("active"), v.literal("inactive"), v.literal("trial"), v.literal("cancelled"), v.literal("expired"));

// Payment status types
export const paymentStatusValidator = v.union(v.literal("waiting"), v.literal("confirming"), v.literal("confirmed"), v.literal("sending"), v.literal("partially_paid"), v.literal("finished"), v.literal("failed"), v.literal("refunded"), v.literal("expired"));

export default defineSchema({
	// ============================================
	// Subscription & Payment Tables
	// ============================================

	// Subscriptions table
	subscriptions: defineTable({
		organizationId: v.string(),
		billingPeriod: billingPeriodValidator,
		status: subscriptionStatusValidator,
		trialEndsAt: v.optional(v.number()),
		startDate: v.optional(v.number()),
		endDate: v.optional(v.number()),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_organization", ["organizationId"]),

	// Payments table
	payments: defineTable({
		organizationId: v.string(),
		subscriptionId: v.optional(v.id("subscriptions")),
		nowpaymentsId: v.string(),
		billingPeriod: billingPeriodValidator,
		amount: v.string(),
		currency: v.string(),
		payAddress: v.string(),
		status: paymentStatusValidator,
		actuallyPaid: v.optional(v.string()),
		ipnCallbackUrl: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_organization", ["organizationId"])
		.index("by_subscription", ["subscriptionId"])
		.index("by_status", ["status"])
		.index("by_nowpayments_id", ["nowpaymentsId"]),
});
