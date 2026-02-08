"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@digitalcentral/backend/convex/_generated/api";

/**
 * Hook to get the current organization context
 * Returns the active organization ID and related data
 * Automatically sets an active organization if user has organizations but none is active
 */
export function useOrganization() {
	const { data: session, isPending: isSessionPending } = authClient.useSession();
	const activeOrg = useQuery(api.organizations.getActiveOrganization);
	const ensureActiveOrg = useMutation(api.organizations.ensureActiveOrganization);
	const hasAttemptedRestore = useRef(false);

	const organizationId = activeOrg?.id || session?.session?.activeOrganizationId || "";
	const isLoading = isSessionPending || activeOrg === undefined;

	// Auto-restore organization if user is logged in but has no active org
	useEffect(() => {
		// Only run once per session, when we have session data but no active org
		if (!isSessionPending && session && activeOrg === null && !hasAttemptedRestore.current) {
			hasAttemptedRestore.current = true;
			ensureActiveOrg().catch(() => {
				// Silently fail - user may genuinely have no organizations
			});
		}
	}, [session, isSessionPending, activeOrg, ensureActiveOrg]);

	// Reset the ref when session changes (e.g., user logs out and back in)
	useEffect(() => {
		if (!session) {
			hasAttemptedRestore.current = false;
		}
	}, [session]);

	return {
		organizationId,
		organization: activeOrg,
		isLoading,
		hasOrganization: !!organizationId,
	};
}

/**
 * Hook to get subscription status
 */
export function useSubscription() {
	const { organizationId } = useOrganization();

	const subscription = useQuery(api.subscriptions.getByOrganization, organizationId ? { organizationId } : "skip");

	const access = useQuery(api.subscriptions.hasValidAccess, organizationId ? { organizationId } : "skip");

	return {
		subscription,
		hasAccess: access?.hasAccess ?? false,
		accessReason: access?.reason,
		isLoading: subscription === undefined,
		isTrial: subscription?.status === "trial",
		isActive: subscription?.status === "active",
		trialDaysRemaining: subscription?.trialDaysRemaining ?? 0,
	};
}
