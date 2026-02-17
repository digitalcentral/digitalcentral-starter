"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function SettingsPage() {
	const { data: session } = authClient.useSession();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-bold text-2xl tracking-tight lg:text-3xl">Settings</h1>
				<p className="text-muted-foreground">Manage your account settings</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
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
							<h4 className="font-medium">Delete Account</h4>
							<p className="mt-1 text-muted-foreground text-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
							<Button className="mt-4" disabled size="sm" variant="destructive">
								Delete Account
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
