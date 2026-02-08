import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

// ============================================
// Organization Queries
// ============================================

// Get the current user's active organization
export const getActiveOrganization = query({
	args: {},
	handler: async (ctx) => {
		try {
			const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

			const session = await auth.api.getSession({ headers });
			if (!session?.session.activeOrganizationId) {
				return null;
			}

			const org = await auth.api.getFullOrganization({
				headers,
				query: {
					organizationId: session.session.activeOrganizationId,
				},
			});

			return org;
		} catch {
			// No valid session (e.g. after sign-out) — return null so client doesn't throw
			return null;
		}
	},
});

// List all organizations for the current user
export const listMyOrganizations = query({
	args: {},
	handler: async (ctx) => {
		try {
			const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

			const result = await auth.api.listOrganizations({
				headers,
			});

			return result ?? [];
		} catch {
			// No valid session (e.g. after sign-out) — return empty so client doesn't throw
			return [];
		}
	},
});

// Get organization by ID
export const getById = query({
	args: {
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		try {
			const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

			const org = await auth.api.getFullOrganization({
				headers,
				query: {
					organizationId: args.organizationId,
				},
			});

			return org;
		} catch {
			// No valid session (e.g. after sign-out) — return null so client doesn't throw
			return null;
		}
	},
});

// Get organization members
export const getMembers = query({
	args: {
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		const result = await auth.api.getFullOrganization({
			headers,
			query: {
				organizationId: args.organizationId,
			},
		});

		return result?.members || [];
	},
});

// ============================================
// Organization Mutations
// ============================================

// Create a new organization
export const create = mutation({
	args: {
		name: v.string(),
		slug: v.string(),
		logo: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		const org = await auth.api.createOrganization({
			headers,
			body: {
				name: args.name,
				slug: args.slug,
				logo: args.logo,
			},
		});

		// Create a trial subscription for the new organization
		if (org?.id) {
			const now = Date.now();
			const trialEndsAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days from now

			await ctx.db.insert("subscriptions", {
				organizationId: org.id,
				billingPeriod: "monthly",
				status: "trial",
				trialEndsAt,
				createdAt: now,
				updatedAt: now,
			});

			// Set the new organization as active on the current session
			await auth.api.setActiveOrganization({
				headers,
				body: {
					organizationId: org.id,
				},
			});
		}

		return org;
	},
});

// Update organization details
export const update = mutation({
	args: {
		organizationId: v.string(),
		name: v.optional(v.string()),
		logo: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		// Build update data object
		const data: { name?: string; logo?: string } = {};
		if (args.name) data.name = args.name;
		if (args.logo) data.logo = args.logo;

		const result = await auth.api.updateOrganization({
			headers,
			body: {
				organizationId: args.organizationId,
				data,
			},
		});

		return result;
	},
});

// Set active organization for the current session
export const setActive = mutation({
	args: {
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		await auth.api.setActiveOrganization({
			headers,
			body: {
				organizationId: args.organizationId,
			},
		});

		return { success: true };
	},
});

// Ensure active organization is set (call after login)
// If user has organizations but no active one, sets the first one as active
export const ensureActiveOrganization = mutation({
	args: {},
	handler: async (ctx) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		const session = await auth.api.getSession({ headers });
		if (!session) {
			return { success: false, reason: "no_session" };
		}

		// If already has an active organization, nothing to do
		if (session.session.activeOrganizationId) {
			return { success: true, organizationId: session.session.activeOrganizationId };
		}

		// Get user's organizations
		const organizations = await auth.api.listOrganizations({ headers });
		if (!organizations || organizations.length === 0) {
			return { success: false, reason: "no_organizations" };
		}

		// Set the first organization as active
		const firstOrg = organizations[0];

		if (firstOrg?.id) {
			await auth.api.setActiveOrganization({
				headers,
				body: {
					organizationId: firstOrg.id,
				},
			});
		}

		return { success: true, organizationId: firstOrg?.id || "" };
	},
});

// Invite a member to the organization
export const inviteMember = mutation({
	args: {
		organizationId: v.string(),
		email: v.string(),
		role: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		const result = await auth.api.createInvitation({
			headers,
			body: {
				organizationId: args.organizationId,
				email: args.email,
				role: args.role as "admin" | "member" | "owner",
			},
		});

		return result;
	},
});

// Remove a member from the organization
export const removeMember = mutation({
	args: {
		organizationId: v.string(),
		memberIdToRemove: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		await auth.api.removeMember({
			headers,
			body: {
				organizationId: args.organizationId,
				memberIdOrEmail: args.memberIdToRemove,
			},
		});

		return { success: true };
	},
});

// Update member role
export const updateMemberRole = mutation({
	args: {
		organizationId: v.string(),
		memberId: v.string(),
		role: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		await auth.api.updateMemberRole({
			headers,
			body: {
				organizationId: args.organizationId,
				memberId: args.memberId,
				role: args.role as "admin" | "member" | "owner",
			},
		});

		return { success: true };
	},
});
