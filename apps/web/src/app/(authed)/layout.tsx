import { redirect } from "next/navigation";
import { PaywallCheck } from "@/components/layout/paywall-check";
import { SidebarFooter } from "@/components/layout/sidebar-footer";
import { SidebarHeader } from "@/components/layout/sidebar-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { isAuthenticated } from "@/lib/auth-server";

interface AuthedLayoutProps {
	children: React.ReactNode;
}

export default async function AuthedLayout({ children }: AuthedLayoutProps) {
	const isAuthed = await isAuthenticated();

	if (!isAuthed) {
		redirect("/sign-in");
	}

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader />
				<SidebarContent>
					<SidebarNav />
				</SidebarContent>
				<SidebarFooter />
			</Sidebar>
			<SidebarInset>
				<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
					<SidebarTrigger />
					<Separator orientation="vertical" />
					<div className="flex-1" />
				</header>
				<main className="flex-1 p-4 lg:p-6">
					<PaywallCheck>{children}</PaywallCheck>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
