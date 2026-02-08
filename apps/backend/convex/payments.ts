import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { billingPeriodValidator, paymentStatusValidator } from "./schema";

// Create payment
export const create = mutation({
	args: {
		organizationId: v.string(),
		subscriptionId: v.optional(v.id("subscriptions")),
		nowpaymentsId: v.string(),
		billingPeriod: billingPeriodValidator,
		amount: v.string(),
		currency: v.string(),
		payAddress: v.string(),
		status: paymentStatusValidator,
		ipnCallbackUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		return await ctx.db.insert("payments", {
			organizationId: args.organizationId,
			subscriptionId: args.subscriptionId,
			nowpaymentsId: args.nowpaymentsId,
			billingPeriod: args.billingPeriod,
			amount: args.amount,
			currency: args.currency,
			payAddress: args.payAddress,
			status: args.status,
			ipnCallbackUrl: args.ipnCallbackUrl,
			createdAt: now,
			updatedAt: now,
		});
	},
});

// Find payment by ID and organization
export const findByIdAndOrganization = query({
	args: {
		paymentId: v.id("payments"),
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		const payment = await ctx.db.get(args.paymentId);
		if (!payment || payment.organizationId !== args.organizationId) {
			return null;
		}
		return { ...payment, id: payment._id };
	},
});

// Find payment by nowpayments ID
export const findByNowpaymentsId = query({
	args: { nowpaymentsId: v.string() },
	handler: async (ctx, args) => {
		const payment = await ctx.db
			.query("payments")
			.withIndex("by_nowpayments_id", (q) => q.eq("nowpaymentsId", args.nowpaymentsId))
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

// Update payment status
export const update = mutation({
	args: {
		paymentId: v.id("payments"),
		status: paymentStatusValidator,
		actuallyPaid: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { paymentId, ...data } = args;
		await ctx.db.patch(paymentId, {
			...data,
			updatedAt: Date.now(),
		});
		return { success: true };
	},
});
