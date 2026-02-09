import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paymentStatusValidator } from "./schema";

// Create payment (from Polar webhook)
export const create = mutation({
	args: {
		organizationId: v.string(),
		subscriptionId: v.optional(v.id("subscriptions")),
		polarOrderId: v.string(),
		amount: v.number(),
		status: paymentStatusValidator,
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		return await ctx.db.insert("payments", {
			organizationId: args.organizationId,
			subscriptionId: args.subscriptionId,
			polarOrderId: args.polarOrderId,
			amount: args.amount,
			status: args.status,
			createdAt: now,
			updatedAt: now,
		});
	},
});

// Find payment by Polar order ID
export const findByPolarOrderId = query({
	args: { polarOrderId: v.string() },
	handler: async (ctx, args) => {
		const payment = await ctx.db
			.query("payments")
			.withIndex("by_polar_order", (q) => q.eq("polarOrderId", args.polarOrderId))
			.first();
		if (!payment) return null;
		return { ...payment, id: payment._id };
	},
});

// List payments for an organization
export const listByOrganization = query({
	args: { organizationId: v.string() },
	handler: async (ctx, args) => {
		const payments = await ctx.db
			.query("payments")
			.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
			.order("desc")
			.collect();
		return payments.map((payment) => ({ ...payment, id: payment._id }));
	},
});
