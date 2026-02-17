"use client";

import { ArrowLeft, Box, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { APP_NAME } from "@/lib/constants";

export default function PricingPage() {
	const { data: session } = authClient.useSession();

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
									<Link href="/sign-up">Get Started</Link>
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
						<p className="text-lg text-muted-foreground">One plan with everything included.</p>
					</div>

					<div className="mx-auto max-w-md">
						<Card className="relative overflow-hidden border-2 border-primary">
							<CardHeader className="pt-8 text-center">
								<CardTitle className="text-2xl">Pro</CardTitle>
								<CardDescription>Everything you need to run your product</CardDescription>
							</CardHeader>
							<CardContent className="text-center">
								<ul className="mb-8 space-y-3 text-left">
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-green-500" />
										<span>Real-time data</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-green-500" />
										<span>Email support</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-green-500" />
										<span>Modern UI components</span>
									</li>
								</ul>
								<Button asChild className="w-full" size="lg">
									<Link href="/sign-up">Get Started</Link>
								</Button>
							</CardContent>
						</Card>
					</div>

					<div className="mx-auto mt-20 max-w-2xl">
						<h2 className="mb-8 text-center font-bold text-2xl">Frequently asked questions</h2>
						<div className="space-y-6">
							<div>
								<h3 className="mb-2 font-semibold">How do I get started?</h3>
								<p className="text-muted-foreground">Simply sign up with your email and password to create an account and start using the platform.</p>
							</div>
							<div>
								<h3 className="mb-2 font-semibold">What features are included?</h3>
								<p className="text-muted-foreground">All features are included: authentication, real-time data synchronization, and modern UI components.</p>
							</div>
							<div>
								<h3 className="mb-2 font-semibold">Can I customize this starter?</h3>
								<p className="text-muted-foreground">Yes! This is a starter template designed to be customized for your specific product needs.</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
