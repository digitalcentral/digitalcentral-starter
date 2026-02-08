"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SidebarFooter as ShadcnSidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { SignOutButton } from "./sign-out-button";

export function SidebarFooter() {
	return (
		<ShadcnSidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<SignOutButton />
				</SidebarMenuItem>
			</SidebarMenu>
		</ShadcnSidebarFooter>
	);
}
