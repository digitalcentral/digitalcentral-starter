"use client";

import { api } from "@digitalcentral/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { AlertCircle, ArrowRight, Building2, CreditCard, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization, useSubscription } from "@/hooks/use-organization";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
	const { data: session } = authClient.useSession();
	const { organizationId, isLoading: isOrgLoading } = useOrganization();
	const { subscription, isLoading: isSubscriptionLoading } = useSubscription();

	const organization = useQuery(api.organizations.getById, organizationId ? { organizationId } : "skip");

	const isStillLoading = isOrgLoading || isSubscriptionLoading;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight lg:text-3xl">Dashboard</h1>
					<p className="text-muted-foreground">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!</p>
				</div>
				<Button asChild variant="outline">
					<Link href="/settings">
						<Building2 className="mr-2 size-4" />
						Settings
					</Link>
				</Button>
			</div>

			{/* Trial/Subscription Banner */}
			{subscription?.status === "trial" && (
				<Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
					<CardContent className="flex items-center justify-between p-4">
						<div className="flex items-center gap-3">
							<CreditCard className="size-5 text-yellow-600 dark:text-yellow-400" />
							<div>
								<p className="font-medium text-yellow-800 dark:text-yellow-200">Trial Period - {Number(subscription?.trialDaysRemaining ?? 0)} days remaining</p>
								<p className="text-sm text-yellow-700 dark:text-yellow-300">Subscribe to continue after your trial ends.</p>
							</div>
						</div>
						<Button asChild className="shrink-0" size="sm" variant="outline">
							<Link href="/subscription">Subscribe Now</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{/* No Organization Warning */}
			{!isStillLoading && !organizationId && (
				<Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
					<CardContent className="flex items-center gap-3 p-4">
						<AlertCircle className="size-5 text-red-600 dark:text-red-400" />
						<div>
							<p className="font-medium text-red-800 dark:text-red-200">No organization found</p>
							<p className="text-red-700 text-sm dark:text-red-300">Please complete your onboarding to create an organization.</p>
						</div>
						<Button asChild className="ml-auto shrink-0" size="sm" variant="outline">
							<Link href="/onboarding">Complete Setup</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Organization & Subscription Cards */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Organization</CardTitle>
						<Building2 className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{organization ? (
							<>
								<div className="font-bold text-2xl">{organization.name}</div>
								<p className="text-muted-foreground text-xs">{organization.slug || "—"}</p>
							</>
						) : (
							<p className="text-muted-foreground text-sm">Loading…</p>
						)}
						<Button asChild className="mt-3" size="sm" variant="outline">
							<Link href="/settings">
								Manage
								<ArrowRight className="ml-2 size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Subscription</CardTitle>
						<Users className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl capitalize">{String(subscription?.status ?? "—")}</div>
						<p className="text-muted-foreground text-xs">{String(subscription?.billingPeriod ?? "No plan")}</p>
						<Button asChild className="mt-3" size="sm" variant="outline">
							<Link href="/subscription">
								View plan
								<ArrowRight className="ml-2 size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
