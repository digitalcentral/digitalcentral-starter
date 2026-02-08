"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await authClient.signOut();
			toast.success("Signed out successfully");
			router.push("/");
		} catch (error) {
			toast.error("Failed to sign out");
		}
	};

	return (
		<SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
			<LogOut />
			<span>Sign Out</span>
		</SidebarMenuButton>
	);
}
