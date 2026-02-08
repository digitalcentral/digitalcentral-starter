import { Box } from "lucide-react";
import Link from "next/link";
import { SidebarHeader as ShadcnSidebarHeader } from "@/components/ui/sidebar";
import { APP_NAME } from "@/lib/constants";

export function SidebarHeader() {
	return (
		<ShadcnSidebarHeader>
			<Link className="flex items-center gap-2 px-2" href="/dashboard">
				<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<Box className="size-5" />
				</div>
				<span className="font-bold text-lg">{APP_NAME}</span>
			</Link>
		</ShadcnSidebarHeader>
	);
}
