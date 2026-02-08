import { Building2, Box } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateOrganizationForm } from "@/components/forms/create-organization-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { fetchAuthMutation, fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";
import { APP_NAME } from "@/lib/constants";

export default async function OnboardingPage() {
	const isAuthed = await isAuthenticated();

	if (!isAuthed) {
		redirect("/sign-in");
	}

	await fetchAuthMutation(api.organizations.ensureActiveOrganization);

	const organization = await fetchAuthQuery(api.organizations.getActiveOrganization);
	if (organization?.id) {
		redirect("/dashboard");
	}

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
					<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
						<Building2 className="size-8 text-primary" />
					</div>
					<CardTitle className="text-2xl">Set up your organization</CardTitle>
					<CardDescription>Create your company or team profile to get started</CardDescription>
				</CardHeader>
				<CardContent>
					<CreateOrganizationForm />

					<div className="mt-6 rounded-lg bg-muted/50 p-4">
						<h4 className="mb-2 font-medium text-sm">Your 7-day free trial includes:</h4>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>• Organizations & team members</li>
							<li>• Subscription & billing flow</li>
							<li>• Real-time data</li>
							<li>• No credit card required</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
