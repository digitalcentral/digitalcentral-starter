"use client";

import { CreditCard, LayoutDashboard, Settings } from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./sidebar-nav-item";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Subscription", href: "/subscription", icon: CreditCard },
	{ name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
	return (
		<SidebarMenu>
			{navigation.map((item) => (
				<SidebarMenuItem key={item.name}>
					<SidebarNavItem href={item.href} icon={item.icon}>
						{item.name}
					</SidebarNavItem>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}
