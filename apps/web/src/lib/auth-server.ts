import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { cache } from "react";
import { env } from "@/env";

export const { handler, preloadAuthQuery, isAuthenticated, getToken, fetchAuthQuery, fetchAuthMutation, fetchAuthAction } = convexBetterAuthNextJs({
	convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
	convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL,
});

export const getUser = cache(async () => {
	const isAuthed = await isAuthenticated();
	if (!isAuthed) return null;

	try {
		return await fetchAuthQuery(api.auth.getCurrentUser);
	} catch {
		return null;
	}
});

export const getRole = cache(async () => {
	const user = await getUser();
	return user?.role;
});

export const listUsers = cache(async () => {
	return await fetchAuthQuery(api.auth.listUsers);
});
