import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = APP_URL || "https://example.com";

	// Static routes
	const staticRoutes = [""].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "daily" as const,
		priority: route === "" ? 1 : 0.8,
	}));

	return [...staticRoutes];
}
