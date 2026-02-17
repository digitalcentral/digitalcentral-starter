"use client";

import { Box } from "lucide-react";
import Link from "next/link";
import { SignUpForm } from "@/components/forms/sign-up-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export default function SignUpPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<Link className="mb-8 flex items-center gap-2" href="/">
				<div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<Box className="size-6" />
				</div>
				<span className="font-bold text-2xl">{APP_NAME}</span>
			</Link>

			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Create an account</CardTitle>
					<CardDescription>Sign up to get started</CardDescription>
				</CardHeader>
				<CardContent>
					<SignUpForm />
					<p className="mt-4 text-center text-muted-foreground text-sm">
						Already have an account?{" "}
						<Link className="font-medium underline hover:text-foreground" href="/sign-in">
							Sign in
						</Link>
					</p>
					<p className="mt-4 text-center text-muted-foreground text-xs">
						By signing up, you agree to our{" "}
						<Link className="underline hover:text-foreground" href="/terms">
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link className="underline hover:text-foreground" href="/privacy">
							Privacy Policy
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
