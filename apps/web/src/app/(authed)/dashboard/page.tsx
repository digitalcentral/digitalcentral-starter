"use client";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
	const { data: session } = authClient.useSession();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-bold text-2xl tracking-tight lg:text-3xl">Dashboard</h1>
				<p className="text-muted-foreground">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!</p>
			</div>

			{/* Welcome Card */}
			<div className="rounded-lg border bg-card p-6">
				<h2 className="mb-2 font-semibold text-lg">Get Started</h2>
				<p className="text-muted-foreground">Start building your application. Customize this starter template to add your features.</p>
			</div>
		</div>
	);
}
