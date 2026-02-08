"use client";

import { useQuery } from "convex/react";
import { Building2, Trash2, Users } from "lucide-react";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { InviteMemberForm } from "@/components/forms/invite-member-form";
import { UpdateOrganizationForm } from "@/components/forms/update-organization-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useOrganization } from "@/hooks/use-organization";
import { authClient } from "@/lib/auth-client";

export default function SettingsPage() {
	const { data: session } = authClient.useSession();
	const { organizationId } = useOrganization();

	const organization = useQuery(api.organizations.getById, organizationId ? { organizationId } : "skip");

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-bold text-2xl tracking-tight lg:text-3xl">Settings</h1>
				<p className="text-muted-foreground">Manage your organization settings</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Company Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building2 className="size-5" />
							Company Details
						</CardTitle>
						<CardDescription>Update your company information</CardDescription>
					</CardHeader>
					<CardContent>
						<UpdateOrganizationForm />
					</CardContent>
				</Card>

				{/* Team Members */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="size-5" />
							Team Members
						</CardTitle>
						<CardDescription>Manage who has access to your organization</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Current Members */}
						<div className="space-y-3">
							{organization?.members?.map((member) => (
								<div className="flex items-center justify-between rounded-lg border p-3" key={member.id}>
									<div className="flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">{member.user.name?.[0] || member.user.email?.[0]?.toUpperCase() || ""}</div>
										<div>
											<p className="font-medium text-sm">{member.user.name || "Unknown"}</p>
											<p className="text-muted-foreground text-xs">{member.user.email}</p>
										</div>
									</div>
									<span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">{member.role}</span>
								</div>
							))}
						</div>

						<Separator />

						{/* Invite New Member */}
						<InviteMemberForm />
					</CardContent>
				</Card>

				{/* Account Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>Your personal account settings</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Name</Label>
							<Input disabled value={session?.user?.name || ""} />
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input disabled value={session?.user?.email || ""} />
						</div>
						<p className="text-muted-foreground text-xs">Contact support to update your account details</p>
					</CardContent>
				</Card>

				{/* Danger Zone */}
				<Card className="border-destructive">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<Trash2 className="size-5" />
							Danger Zone
						</CardTitle>
						<CardDescription>Irreversible actions</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="rounded-lg border border-destructive/20 p-4">
							<h4 className="font-medium">Delete Organization</h4>
							<p className="mt-1 text-muted-foreground text-sm">Permanently delete your organization and all associated data. This action cannot be undone.</p>
							<Button className="mt-4" disabled size="sm" variant="destructive">
								Delete Organization
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
