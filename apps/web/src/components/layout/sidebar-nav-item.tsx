"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
	href: string;
	icon: LucideIcon;
	children: React.ReactNode;
}

export function SidebarNavItem({ href, icon: Icon, children }: SidebarNavItemProps) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

	return (
		<SidebarMenuButton asChild isActive={isActive} tooltip={typeof children === "string" ? children : undefined}>
			<Link href={href}>
				<Icon />
				<span>{children}</span>
			</Link>
		</SidebarMenuButton>
	);
}
