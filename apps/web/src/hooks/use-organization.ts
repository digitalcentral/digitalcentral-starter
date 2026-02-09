"use client";

import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@digitalcentral/backend/convex/_generated/api";

/** Polar subscription from portal API (subscriptions.list with referenceId) */
export type PolarSubscriptionItem = {
	id: string;
	status?: string;
	product?: { id?: string; name?: string; recurring_interval?: string };
	current_period_end?: string;
	[key: string]: unknown;
};

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
 * Fetch Polar subscriptions for an organization via portal plugin (referenceId = organizationId).
 * Use this to determine if the org has an active paid subscription.
 * @see https://www.better-auth.com/docs/plugins/polar#subscriptions
 */
export function usePolarSubscriptions(organizationId: string | undefined) {
	const [subscriptions, setSubscriptions] = useState<PolarSubscriptionItem[]>([]);
	const [isLoading, setIsLoading] = useState(!!organizationId);
	const [error, setError] = useState<Error | null>(null);

	const fetchSubscriptions = useCallback(async (orgId: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const { data } = await authClient.customer.subscriptions.list({
				query: {
					page: 1,
					limit: 10,
					active: true,
					referenceId: orgId,
				},
			});
			setSubscriptions(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to load subscriptions"));
			setSubscriptions([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!organizationId) {
			setSubscriptions([]);
			setIsLoading(false);
			return;
		}
		fetchSubscriptions(organizationId);
	}, [organizationId, fetchSubscriptions]);

	const activeSubscription = subscriptions[0] ?? null;
	const hasActivePolar = subscriptions.length > 0;

	return {
		subscriptions,
		activeSubscription,
		hasActivePolar,
		isLoading,
		error,
		refetch: () => organizationId && fetchSubscriptions(organizationId),
	};
}

/**
 * Hook to get subscription status (trial from Convex + Polar from portal with organization support).
 */
export function useSubscription() {
	const { organizationId } = useOrganization();

	const subscription = useQuery(api.subscriptions.getByOrganization, organizationId ? { organizationId } : "skip");
	const access = useQuery(api.subscriptions.hasValidAccess, organizationId ? { organizationId } : "skip");
	const { hasActivePolar, activeSubscription: polarSubscription, isLoading: isPolarLoading } = usePolarSubscriptions(organizationId || undefined);

	const hasAccess = (access?.hasAccess ?? false) || hasActivePolar;
	const accessReason = hasActivePolar ? "active" : access?.reason;
	const sub = subscription as { status?: string; trialDaysRemaining?: number } | null;

	return {
		subscription,
		/** Polar subscriptions for this org (portal API with referenceId) */
		polarSubscriptions: { hasActivePolar, activeSubscription: polarSubscription },
		hasAccess,
		accessReason,
		isLoading: subscription === undefined || isPolarLoading,
		isTrial: sub?.status === "trial",
		isActive: sub?.status === "active" || hasActivePolar,
		trialDaysRemaining: sub?.trialDaysRemaining ?? 0,
	};
}
