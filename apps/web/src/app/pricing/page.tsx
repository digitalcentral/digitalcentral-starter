"use client";

import { ArrowLeft, Box, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { APP_NAME, PLAN_PRICES } from "@/lib/constants";

export default function PricingPage() {
	const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
	const { data: session } = authClient.useSession();

	const price = billingPeriod === "monthly" ? PLAN_PRICES.monthly : PLAN_PRICES.yearly;
	const yearlyTotal = PLAN_PRICES.yearly * 12;
	const monthlySavings = (PLAN_PRICES.monthly * 12 - yearlyTotal).toFixed(0);

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Link className="flex items-center gap-2" href="/">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Box className="size-5" />
						</div>
						<span className="font-bold text-xl">{APP_NAME}</span>
					</Link>
					<div className="flex items-center gap-4">
						{session ? (
							<Button asChild>
								<Link href="/dashboard">Dashboard</Link>
							</Button>
						) : (
							<>
								<Button asChild variant="ghost">
									<Link href="/sign-in">Sign In</Link>
								</Button>
								<Button asChild>
									<Link href="/sign-in">Start Free Trial</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</header>

			<main className="py-20">
				<div className="container mx-auto px-4">
					<div className="mx-auto mb-4">
						<Link className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground" href="/">
							<ArrowLeft className="size-4" />
							Back to home
						</Link>
					</div>

					<div className="mx-auto mb-16 max-w-2xl text-center">
						<h1 className="mb-4 font-bold text-4xl tracking-tight">Simple, transparent pricing</h1>
						<p className="text-lg text-muted-foreground">One plan with everything included. Start with a 7-day free trial.</p>
					</div>

					<div className="mb-12 flex items-center justify-center gap-4">
						<button
							className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${billingPeriod === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
							onClick={() => setBillingPeriod("monthly")}
							type="button"
						>
							Monthly
						</button>
						<button
							className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${billingPeriod === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
							onClick={() => setBillingPeriod("yearly")}
							type="button"
						>
							Yearly
							<span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
								Save ${monthlySavings}
							</span>
						</button>
					</div>

					<div className="mx-auto max-w-md">
						<Card className="relative overflow-hidden border-2 border-primary">
							<div className="absolute top-0 right-0 rounded-bl-lg bg-primary px-3 py-1 font-medium text-primary-foreground text-xs">
								7-Day Free Trial
							</div>
							<CardHeader className="pt-8 text-center">
								<CardTitle className="text-2xl">Pro</CardTitle>
								<CardDescription>Everything you need to run your product</CardDescription>
							</CardHeader>
							<CardContent className="text-center">
								<div className="mb-6">
									<span className="font-bold text-5xl">${price}</span>
									<span className="text-muted-foreground">/month</span>
									{billingPeriod === "yearly" && (
										<p className="mt-1 text-muted-foreground text-sm">Billed annually (${yearlyTotal}/year)</p>
									)}
								</div>
								<ul className="mb-8 space-y-3 text-left">
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-green-500" />
										<span>Unlimited organizations</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-green-500" />
										<span>Team members & roles</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-green-500" />
										<span>Real-time data</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-green-500" />
										<span>Email support</span>
									</li>
								</ul>
								<Button asChild className="w-full" size="lg">
									<Link href="/sign-in">Start Free Trial</Link>
								</Button>
								<p className="mt-3 text-muted-foreground text-sm">No credit card required for trial</p>
							</CardContent>
						</Card>
					</div>

					<div className="mx-auto mt-20 max-w-2xl">
						<h2 className="mb-8 text-center font-bold text-2xl">Frequently asked questions</h2>
						<div className="space-y-6">
							<div>
								<h3 className="mb-2 font-semibold">What happens after my trial ends?</h3>
								<p className="text-muted-foreground">
									After your 7-day trial, you can subscribe to continue. Your data is preserved.
								</p>
							</div>
							<div>
								<h3 className="mb-2 font-semibold">How do I pay?</h3>
								<p className="text-muted-foreground">
									The starter includes a subscription flow. Wire up your preferred payment provider (Stripe, Paddle, etc.) in the backend.
								</p>
							</div>
							<div>
								<h3 className="mb-2 font-semibold">Can I cancel anytime?</h3>
								<p className="text-muted-foreground">
									Yes. You keep access until the end of your billing period.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
