"use client";

import { ArrowRight, Box, Building2, CreditCard, Layout, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { APP_NAME, FEATURES, HOW_IT_WORKS, PLAN_PRICES } from "@/lib/constants";

const iconMap = {
	Building2,
	CreditCard,
	Shield,
	Zap,
	Layout,
	Box,
};

export default function HomePage() {
	const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
	const { data: session, isPending } = authClient.useSession();

	const price = billingPeriod === "monthly" ? PLAN_PRICES.monthly : PLAN_PRICES.yearly;

	return (
		<div className="flex min-h-screen flex-col">
			{/* Navigation */}
			<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Link className="flex items-center gap-2" href="/">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Box className="size-5" />
						</div>
						<span className="font-bold text-xl">{APP_NAME}</span>
					</Link>
					<nav className="hidden items-center gap-6 md:flex">
						<Link className="text-muted-foreground text-sm hover:text-foreground" href="#features">
							Features
						</Link>
						<Link className="text-muted-foreground text-sm hover:text-foreground" href="#how-it-works">
							How It Works
						</Link>
						<Link className="text-muted-foreground text-sm hover:text-foreground" href="#pricing">
							Pricing
						</Link>
					</nav>
					<div className="flex items-center gap-4">
						{isPending ? (
							<div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
						) : session ? (
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

			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden py-20 md:py-32">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
					<div className="container relative mx-auto px-4">
						<div className="mx-auto max-w-4xl text-center">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
								<Shield className="size-4 text-primary" />
								<span>Auth, orgs & subscriptions included</span>
							</div>
							<h1 className="mb-6 font-bold text-4xl tracking-tight md:text-6xl lg:text-7xl">
								Build your product on a <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">solid foundation</span>
							</h1>
							<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">Next.js, Convex, Better Auth, organizations, and subscriptions. Customize the branding and add your features.</p>
							<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
								<Button asChild className="w-full sm:w-auto" size="lg">
									<Link href="/sign-in">
										Start 7-Day Free Trial
										<ArrowRight className="ml-2 size-4" />
									</Link>
								</Button>
								<Button asChild className="w-full sm:w-auto" size="lg" variant="outline">
									<Link href="#how-it-works">See How It Works</Link>
								</Button>
							</div>
							<p className="mt-4 text-muted-foreground text-sm">No credit card required</p>
						</div>
					</div>
				</section>

				{/* Trust Indicators */}
				<section className="border-y bg-muted/30 py-8">
					<div className="container mx-auto px-4">
						<div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="font-medium text-sm">Organizations & teams</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="font-medium text-sm">Subscriptions & trials</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="font-medium text-sm">Google & email auth</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="font-medium text-sm">Real-time with Convex</span>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-20 md:py-32" id="features">
					<div className="container mx-auto px-4">
						<div className="mx-auto mb-16 max-w-2xl text-center">
							<h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">Everything you need to ship</h2>
							<p className="text-lg text-muted-foreground">A production-ready starter you can customize for your product</p>
						</div>
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{FEATURES.map((feature) => {
								const Icon = iconMap[feature.icon as keyof typeof iconMap];
								return (
									<Card className="relative overflow-hidden" key={feature.title}>
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">{Icon && <Icon className="size-6 text-primary" />}</div>
											<CardTitle className="text-xl">{feature.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-base">{feature.description}</CardDescription>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section className="border-y bg-muted/30 py-20 md:py-32" id="how-it-works">
					<div className="container mx-auto px-4">
						<div className="mx-auto mb-16 max-w-2xl text-center">
							<h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">Get started in minutes</h2>
							<p className="text-lg text-muted-foreground">Clone, configure env, and run. Then make it yours.</p>
						</div>
						<div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
							{HOW_IT_WORKS.map((step) => (
								<div className="relative text-center" key={step.step}>
									<div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary font-bold text-2xl text-primary-foreground">{step.step}</div>
									<h3 className="mb-2 font-semibold text-xl">{step.title}</h3>
									<p className="text-muted-foreground">{step.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Pricing Section */}
				<section className="py-20 md:py-32" id="pricing">
					<div className="container mx-auto px-4">
						<div className="mx-auto mb-16 max-w-2xl text-center">
							<h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">Simple, transparent pricing</h2>
							<p className="text-lg text-muted-foreground">One plan with everything included. Start with a free trial.</p>
						</div>

						<div className="mb-12 flex items-center justify-center gap-4">
							<button className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${billingPeriod === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setBillingPeriod("monthly")} type="button">
								Monthly
							</button>
							<button className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${billingPeriod === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setBillingPeriod("yearly")} type="button">
								Yearly
								<span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">2 months FREE</span>
							</button>
						</div>

						<div className="mx-auto max-w-md">
							<Card className="relative overflow-hidden border-2 border-primary">
								<div className="absolute top-0 right-0 rounded-bl-lg bg-primary px-3 py-1 font-medium text-primary-foreground text-xs">7-Day Free Trial</div>
								<CardHeader className="pt-8 text-center">
									<CardTitle className="text-2xl">Pro</CardTitle>
									<CardDescription>Everything you need to run your product</CardDescription>
								</CardHeader>
								<CardContent className="text-center">
									<div className="mb-6">
										<span className="font-bold text-5xl">${price}</span>
										{billingPeriod === "yearly" && <p className="mt-1 text-muted-foreground text-sm">Billed annually</p>}
									</div>
									<ul className="mb-8 space-y-3 text-left">
										<li className="flex items-center gap-2">
											<span className="text-green-500">✓</span>
											<span>Unlimited organizations</span>
										</li>
										<li className="flex items-center gap-2">
											<span className="text-green-500">✓</span>
											<span>Team members & roles</span>
										</li>
										<li className="flex items-center gap-2">
											<span className="text-green-500">✓</span>
											<span>Real-time data</span>
										</li>
										<li className="flex items-center gap-2">
											<span className="text-green-500">✓</span>
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
					</div>
				</section>

				{/* Testimonials placeholder — replace with your own or remove */}
				<section className="border-t bg-muted/30 py-20 md:py-32">
					<div className="container mx-auto px-4">
						<div className="mx-auto mb-16 max-w-2xl text-center">
							<h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">Built to customize</h2>
							<p className="text-muted-foreground">Replace this section with testimonials, logos, or more features.</p>
						</div>
						<div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
							{[
								{ quote: "Clear structure and modern stack. We shipped in a week.", author: "Team A", role: "Startup" },
								{ quote: "Auth and subscriptions out of the box. Huge time saver.", author: "Team B", role: "SaaS" },
								{ quote: "Easy to extend. We added our domain logic on top.", author: "Team C", role: "Product" },
							].map((t) => (
								<Card className="bg-background" key={t.author}>
									<CardContent className="pt-6">
										<div className="mb-4 flex gap-1">
											{[...Array(5)].map((_, i) => (
												<Star className="size-4 fill-yellow-400 text-yellow-400" key={`star-${t.author}-${i}`} />
											))}
										</div>
										<p className="mb-4 text-muted-foreground">"{t.quote}"</p>
										<div>
											<p className="font-semibold">{t.author}</p>
											<p className="text-muted-foreground text-sm">{t.role}</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 md:py-32">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-16">
							<h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">Ready to build?</h2>
							<p className="mb-8 text-lg text-primary-foreground/80">
								Clone the repo, set your env, and start customizing. Add your branding and features in <code className="rounded bg-primary-foreground/20 px-1.5 py-0.5 text-sm">lib/constants.ts</code>.
							</p>
							<Button asChild size="lg" variant="secondary">
								<Link href="/sign-in">
									Start Your Free Trial
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t py-12">
				<div className="container mx-auto px-4">
					<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<Box className="size-5" />
							</div>
							<span className="font-bold text-xl">{APP_NAME}</span>
						</div>
						<p className="text-muted-foreground text-sm">
							© {new Date().getFullYear()} {APP_NAME}. A project starter.
						</p>
						<div className="flex gap-6">
							<Link className="text-muted-foreground text-sm hover:text-foreground" href="/privacy">
								Privacy
							</Link>
							<Link className="text-muted-foreground text-sm hover:text-foreground" href="/terms">
								Terms
							</Link>
							<Link className="text-muted-foreground text-sm hover:text-foreground" href="/contact">
								Contact
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
