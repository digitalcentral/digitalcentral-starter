import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { type BetterAuthOptions, betterAuth } from "better-auth/minimal";
import { admin, organization, username } from "better-auth/plugins";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";

// Fallback so Polar portal plugin never sees Invalid URL during Convex push/analyze (env may be unset at bundle time)
const siteUrl = process.env.BETTER_AUTH_URL;
const polarToken = process.env.POLAR_ACCESS_TOKEN;
const polarServer = process.env.POLAR_SERVER;

const polarClient = new Polar({
	accessToken: polarToken,
	server: polarServer as "sandbox" | "production",
});

// Create authComponent first (needed by createAuthOptions)
export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth, {
	local: {
		schema: authSchema,
	},
});

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
	return {
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		// Configure simple, non-verified email/password to get started
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex({ authConfig }),
			// Additional Better Auth plugins
			admin(),
			organization(),
			username(),
			// Polar: checkout + portal (see https://www.better-auth.com/docs/plugins/polar)
			polar({
				client: polarClient,
				createCustomerOnSignUp: true,
				use: [
					checkout({
						products: [
							{
								productId: process.env.POLAR_PRODUCT_ID_PRO_MONTHLY ?? "",
								slug: "pro-monthly",
							},
							{
								productId: process.env.POLAR_PRODUCT_ID_PRO_YEARLY ?? "",
								slug: "pro-yearly",
							},
						],
						successUrl: `${siteUrl}/subscription?success=1`,
						returnUrl: `${siteUrl}/subscription`,
						authenticatedUsersOnly: true,
					}),
					portal({
						returnUrl: `${siteUrl}/subscription`,
					}),
				],
			}),
		],
		socialProviders: {
			google: {
				clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID ?? "",
				clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET ?? "",
				// disableSignUp: true,
			},
		},
	} satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth(createAuthOptions(ctx));
};

// Query for getting the current user
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.getAuthUser(ctx);
	},
});

// Query to list all users using Better Auth admin plugin
export const listUsers = query({
	args: {},
	handler: async (ctx) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
		const result = await auth.api.listUsers({
			headers,
			query: {
				limit: 100,
				offset: 0,
			},
		});
		return result.users;
	},
});

// Mutation to create a user
export const createUser = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		password: v.string(),
		role: v.string(),
		username: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		return auth.api.createUser({
			headers,
			body: {
				name: args.name,
				email: args.email,
				password: args.password,
				role: args.role as "user" | "admin",
				data: {
					username: args.username,
				},
			},
		});
	},
});

// Mutation to update a user
export const updateUser = mutation({
	args: {
		id: v.string(),
		name: v.string(),
		email: v.string(),
		role: v.string(),
		username: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
		return auth.api.adminUpdateUser({
			headers,
			body: {
				userId: args.id,
				data: {
					name: args.name,
					email: args.email,
					role: args.role,
					username: args.username,
				},
			},
		});
	},
});

export const signOut = mutation({
	args: {},
	handler: async (ctx) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
		await auth.api.signOut({
			headers,
		});
		return { success: true };
	},
});

// Export types
export type Auth = ReturnType<typeof createAuthOptions>;
