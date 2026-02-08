"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization, useSubscription } from "@/hooks/use-organization";
import { APP_NAME } from "@/lib/constants";

const EXEMPT_PATHS = ["/subscription", "/onboarding", "/settings"];

interface PaywallCheckProps {
	children: React.ReactNode;
}

export function PaywallCheck({ children }: PaywallCheckProps) {
	const pathname = usePathname();
	const { organizationId } = useOrganization();
	const { hasAccess, accessReason, isLoading: isSubscriptionLoading } = useSubscription();

	const isExemptPath = EXEMPT_PATHS.some((path) => pathname.startsWith(path));
	const showPaywall = organizationId && !isSubscriptionLoading && !hasAccess && !isExemptPath;

	if (showPaywall) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
							<AlertTriangle className="size-8 text-destructive" />
						</div>
						<CardTitle className="text-2xl">{accessReason === "trial_expired" ? "Trial Expired" : "Subscription Required"}</CardTitle>
						<CardDescription>
							{accessReason === "trial_expired"
								? `Your 7-day free trial has ended. Subscribe to continue using ${APP_NAME}.`
								: accessReason === "subscription_expired"
									? "Your subscription has expired. Please renew to continue."
									: "You need an active subscription to access this feature."}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="rounded-lg bg-muted/50 p-4">
							<h4 className="mb-2 font-medium text-sm">{APP_NAME} includes:</h4>
							<ul className="space-y-1 text-muted-foreground text-sm">
								<li>• Organizations & team members</li>
								<li>• Subscription & billing</li>
								<li>• Real-time data</li>
							</ul>
						</div>
						<Button asChild className="w-full">
							<Link href="/subscription">View Plans & Subscribe</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return <>{children}</>;
}
