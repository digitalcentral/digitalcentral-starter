"use client";

import { AlertTriangle, CheckCircle2, Clock, CreditCard, Loader2, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization, useSubscription } from "@/hooks/use-organization";
import { authClient } from "@/lib/auth-client";

export default function SubscriptionPage() {
	const { organizationId } = useOrganization();
	const { subscription, polarSubscriptions } = useSubscription();
	const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | false>(false);
	const [isPortalLoading, setIsPortalLoading] = useState(false);

	const { hasActivePolar, activeSubscription: polarSubscription } = polarSubscriptions;
	const sub = subscription as { status?: string; isTrialExpired?: boolean; trialDaysRemaining?: number; daysRemaining?: number } | null;

	const getStatusBadge = () => {
		if (!subscription) return null;

		if (sub?.status === "trial") {
			return (
				<Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
					<Clock className="mr-1 size-3" />
					Trial
				</Badge>
			);
		}
		if (hasActivePolar) {
			return (
				<Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
					<CheckCircle2 className="mr-1 size-3" />
					Active
				</Badge>
			);
		}
		if (sub?.status === "expired" || sub?.isTrialExpired) {
			return (
				<Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
					<AlertTriangle className="mr-1 size-3" />
					Expired
				</Badge>
			);
		}
		if (sub?.status === "cancelled") {
			return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">Cancelled</Badge>;
		}
		return null;
	};

	const handleCheckout = async (slug: "pro-monthly" | "pro-yearly") => {
		setIsCheckoutLoading(slug);
		try {
			await authClient.checkout({
				slug,
				referenceId: organizationId ?? undefined,
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Checkout failed");
		} finally {
			setIsCheckoutLoading(false);
		}
	};

	const handlePortal = async () => {
		setIsPortalLoading(true);
		try {
			await authClient.customer.portal();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not open portal");
			setIsPortalLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight lg:text-3xl">Subscription</h1>
				<p className="text-muted-foreground">Manage your subscription</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Current Plan</CardTitle>
							{getStatusBadge()}
						</div>
						<CardDescription>Your subscription status</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{sub?.status === "trial" && (
							<>
								<div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
									<div className="flex items-center gap-3">
										<Clock className="size-8 text-yellow-600 dark:text-yellow-400" />
										<div>
											<p className="font-semibold text-yellow-800 dark:text-yellow-200">Free Trial</p>
											<p className="text-sm text-yellow-700 dark:text-yellow-300">{Number((subscription as { trialDaysRemaining?: number })?.trialDaysRemaining ?? 0)} days remaining</p>
										</div>
									</div>
								</div>
								<p className="text-muted-foreground text-sm">Subscribe before your trial ends to continue without interruption.</p>
							</>
						)}

						{hasActivePolar && (
							<>
								<div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
									<div className="flex items-center gap-3">
										<CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
										<div>
											<p className="font-semibold text-green-800 dark:text-green-200">Pro</p>
											<p className="text-green-700 text-sm dark:text-green-300">
												{polarSubscription?.product?.recurring_interval === "year" ? "Annual" : "Monthly"} billing
											</p>
										</div>
									</div>
								</div>
								{polarSubscription?.current_period_end && (
									<p className="text-muted-foreground text-sm">
										Renews {new Date(polarSubscription.current_period_end).toLocaleDateString()}
									</p>
								)}
							</>
						)}

						{(sub?.status === "expired" || sub?.isTrialExpired) && !hasActivePolar && (
							<div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
								<div className="flex items-center gap-3">
									<AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
									<div>
										<p className="font-semibold text-red-800 dark:text-red-200">{sub?.isTrialExpired ? "Trial Expired" : "Subscription Expired"}</p>
										<p className="text-red-700 text-sm dark:text-red-300">Subscribe to continue</p>
									</div>
								</div>
							</div>
						)}

						{!subscription && (
							<div className="rounded-lg bg-muted p-4">
								<p className="text-muted-foreground">No subscription found. Please complete onboarding to start your free trial.</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{hasActivePolar ? "Manage Subscription" : "Subscribe"}</CardTitle>
						<CardDescription>Choose a plan — checkout and billing are powered by Polar</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex flex-col gap-2">
							<Button
								className="w-full"
								disabled={isCheckoutLoading !== false}
								onClick={() => handleCheckout("pro-monthly")}
								size="lg"
							>
								{isCheckoutLoading === "pro-monthly" ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<>
										<CreditCard className="mr-2 size-4" />
										Pro Monthly
									</>
								)}
							</Button>
							<Button
								className="w-full"
								disabled={isCheckoutLoading !== false}
								onClick={() => handleCheckout("pro-yearly")}
								size="lg"
								variant="outline"
							>
								{isCheckoutLoading === "pro-yearly" ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<>
										<CreditCard className="mr-2 size-4" />
										Pro Yearly
									</>
								)}
							</Button>
						</div>

						{hasActivePolar && (
							<Button className="w-full" disabled={isPortalLoading} onClick={handlePortal} variant="outline">
								{isPortalLoading ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<>
										<Settings className="mr-2 size-4" />
										Manage billing & subscription
									</>
								)}
							</Button>
						)}

						<p className="text-center text-muted-foreground text-xs">
							Checkout & management via Better Auth Polar plugin. Organization subscriptions from portal (referenceId).
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Payment History</CardTitle>
					<CardDescription>View and manage invoices in the customer portal above.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="py-8 text-center text-muted-foreground">Use “Manage billing & subscription” to see invoices and payment history.</div>
				</CardContent>
			</Card>
		</div>
	);
}
