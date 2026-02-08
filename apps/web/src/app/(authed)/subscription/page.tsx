"use client";

import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, CheckCircle2, Clock, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/use-organization";
import { PLAN_PRICES } from "@/lib/constants";

export default function SubscriptionPage() {
	const { organizationId } = useOrganization();

	const subscription = useQuery(api.subscriptions.getByOrganization, organizationId ? { organizationId } : "skip");

	const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly");
	const [isProcessing, setIsProcessing] = useState(false);

	const activateSubscription = useMutation(api.subscriptions.activate);

	const price = selectedPeriod === "monthly" ? PLAN_PRICES.monthly : PLAN_PRICES.yearly;
	const yearlyTotal = PLAN_PRICES.yearly * 12;
	const monthlySavings = (PLAN_PRICES.monthly * 12 - yearlyTotal).toFixed(0);

	const handleSubscribe = async () => {
		if (!organizationId) {
			toast.error("No organization found");
			return;
		}

		setIsProcessing(true);

		try {
			// In a real implementation, this would redirect to NOWpayments
			// For now, we'll simulate the payment and activate the subscription
			await activateSubscription({
				organizationId,
				billingPeriod: selectedPeriod,
			});

			toast.success("Subscription activated successfully!");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to process subscription";
			toast.error(message);
		} finally {
			setIsProcessing(false);
		}
	};

	const getStatusBadge = () => {
		if (!subscription) return null;

		switch (subscription.status) {
			case "trial":
				return (
					<Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
						<Clock className="mr-1 size-3" />
						Trial
					</Badge>
				);
			case "active":
				return (
					<Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
						<CheckCircle2 className="mr-1 size-3" />
						Active
					</Badge>
				);
			case "expired":
				return (
					<Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
						<AlertTriangle className="mr-1 size-3" />
						Expired
					</Badge>
				);
			case "cancelled":
				return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">Cancelled</Badge>;
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-bold text-2xl tracking-tight lg:text-3xl">Subscription</h1>
				<p className="text-muted-foreground">Manage your subscription</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Current Status */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Current Plan</CardTitle>
							{getStatusBadge()}
						</div>
						<CardDescription>Your subscription status</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{subscription?.status === "trial" && (
							<>
								<div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
									<div className="flex items-center gap-3">
										<Clock className="size-8 text-yellow-600 dark:text-yellow-400" />
										<div>
											<p className="font-semibold text-yellow-800 dark:text-yellow-200">Free Trial</p>
											<p className="text-sm text-yellow-700 dark:text-yellow-300">{subscription?.trialDaysRemaining} days remaining</p>
										</div>
									</div>
								</div>
								<p className="text-muted-foreground text-sm">Subscribe before your trial ends to continue without interruption.</p>
							</>
						)}

						{subscription?.status === "active" && (
							<>
								<div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
									<div className="flex items-center gap-3">
										<CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
										<div>
											<p className="font-semibold text-green-800 dark:text-green-200">Professional Plan</p>
											<p className="text-green-700 text-sm dark:text-green-300">{subscription.billingPeriod === "yearly" ? "Annual" : "Monthly"} billing</p>
										</div>
									</div>
								</div>
								{subscription.daysRemaining > 0 && <p className="text-muted-foreground text-sm">{subscription.daysRemaining} days until renewal</p>}
							</>
						)}

						{(subscription?.status === "expired" || subscription?.isTrialExpired) && (
							<div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
								<div className="flex items-center gap-3">
									<AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
									<div>
										<p className="font-semibold text-red-800 dark:text-red-200">{subscription?.isTrialExpired ? "Trial Expired" : "Subscription Expired"}</p>
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

				{/* Subscribe/Upgrade */}
				<Card>
					<CardHeader>
						<CardTitle>{subscription?.status === "active" ? "Manage Subscription" : "Subscribe"}</CardTitle>
						<CardDescription>{subscription?.status === "active" ? "Update your billing preferences" : "Choose your billing period"}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Billing Period Toggle */}
						<div className="flex items-center justify-center gap-4 rounded-lg border p-2">
							<button className={`flex-1 rounded-md px-4 py-2 font-medium text-sm transition-colors ${selectedPeriod === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setSelectedPeriod("monthly")} type="button">
								Monthly
							</button>
							<button className={`flex-1 rounded-md px-4 py-2 font-medium text-sm transition-colors ${selectedPeriod === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setSelectedPeriod("yearly")} type="button">
								Yearly
								<span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">Save ${monthlySavings}</span>
							</button>
						</div>

						{/* Price */}
						<div className="text-center">
							<p className="font-bold text-4xl">${price}</p>
							<p className="text-muted-foreground">per month</p>
							{selectedPeriod === "yearly" && <p className="mt-1 text-muted-foreground text-sm">Billed annually (${yearlyTotal}/year)</p>}
						</div>

						{/* Features */}
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-green-500" />
								Unlimited organizations
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-green-500" />
								Team members & roles
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-green-500" />
								Real-time data
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-green-500" />
								Email support
							</li>
						</ul>

						{/* Subscribe Button */}
						{subscription?.status !== "active" && (
							<Button className="w-full" disabled={isProcessing} onClick={handleSubscribe} size="lg">
								{isProcessing ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<CreditCard className="mr-2 size-4" />
										Subscribe Now
									</>
								)}
							</Button>
						)}

						<p className="text-center text-muted-foreground text-xs">Wire up your payment provider in the backend</p>
					</CardContent>
				</Card>
			</div>

			{/* Payment History */}
			<Card>
				<CardHeader>
					<CardTitle>Payment History</CardTitle>
					<CardDescription>Your past payments and invoices</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="py-8 text-center text-muted-foreground">No payment history yet</div>
				</CardContent>
			</Card>
		</div>
	);
}
