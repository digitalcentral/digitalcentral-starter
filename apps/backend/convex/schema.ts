import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================
// Application Validators
// ============================================

// Billing period types
export const billingPeriodValidator = v.union(v.literal("monthly"), v.literal("yearly"));

// Subscription status types
export const subscriptionStatusValidator = v.union(v.literal("active"), v.literal("inactive"), v.literal("trial"), v.literal("cancelled"), v.literal("expired"));

// Payment status types (simplified for Polar)
export const paymentStatusValidator = v.union(v.literal("pending"), v.literal("paid"), v.literal("failed"), v.literal("refunded"));

export default defineSchema({
	// ============================================
	// Subscription & Payment Tables
	// ============================================

	// Trial subscriptions only (paid state from Polar portal via referenceId)
	subscriptions: defineTable({
		organizationId: v.string(),
		status: subscriptionStatusValidator,
		trialEndsAt: v.optional(v.number()),
		billingPeriod: v.optional(billingPeriodValidator),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_organization", ["organizationId"]),

	// Payments table (minimal for Polar)
	payments: defineTable({
		organizationId: v.string(),
		subscriptionId: v.optional(v.id("subscriptions")),
		polarOrderId: v.string(),
		amount: v.number(),
		status: paymentStatusValidator,
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_organization", ["organizationId"])
		.index("by_polar_order", ["polarOrderId"]),
});
