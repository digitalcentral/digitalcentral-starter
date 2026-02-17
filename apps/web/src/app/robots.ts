import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = APP_URL || "https://example.com";
	return {
		rules: {
			userAgent: "*",
			disallow: "/",
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
