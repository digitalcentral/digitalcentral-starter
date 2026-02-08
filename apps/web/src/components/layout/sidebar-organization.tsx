"use client";

import { useMutation, useQuery } from "convex/react";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@digitalcentral/backend/convex/_generated/api";

export function SidebarOrganization() {
	const router = useRouter();
	const organization = useQuery(api.organizations.getActiveOrganization);
	const organizations = useQuery(api.organizations.listMyOrganizations);
	const setActive = useMutation(api.organizations.setActive);
	const [isSwitching, setIsSwitching] = useState(false);

	// Convex useQuery returns undefined while loading
	if (organization === undefined || organizations === undefined) {
		return (
			<Button className="h-auto w-full justify-start gap-3 px-2 py-2" disabled variant="ghost">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
					<Building2 className="size-5 text-muted-foreground" />
				</div>
				<div className="flex-1 truncate text-left">
					<p className="truncate font-medium text-sm">Loading…</p>
					<p className="truncate text-muted-foreground text-xs">Organization</p>
				</div>
				<ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
			</Button>
		);
	}

	const handleSwitchOrganization = async (organizationId: string) => {
		if (organizationId === organization?.id) {
			return; // Already active
		}

		setIsSwitching(true);
		try {
			await setActive({ organizationId });
			toast.success("Organization switched");
			// Reload the page to update all data
			router.refresh();
		} catch (error) {
			toast.error("Failed to switch organization");
			console.error(error);
		} finally {
			setIsSwitching(false);
		}
	};

	const handleCreateOrganization = () => {
		router.push("/onboarding");
	};

	if (!organizations || organizations.length === 0) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="h-auto w-full justify-start gap-3 px-2 py-2" disabled={isSwitching} variant="ghost">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
						<Building2 className="size-5 text-muted-foreground" />
					</div>
					<div className="flex-1 truncate text-left">
						<p className="truncate font-medium text-sm">{organization?.name || "Select organization"}</p>
						<p className="truncate text-muted-foreground text-xs">Organization</p>
					</div>
					<ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
				<DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{organizations.map((org) => (
					<DropdownMenuItem className="flex cursor-pointer items-center gap-2" key={org.id} onClick={() => handleSwitchOrganization(org.id)}>
						<Building2 className="size-4 text-muted-foreground" />
						<span className="flex-1 truncate">{org.name}</span>
						{org.id === organization?.id && <Check className="size-4 text-primary" />}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex cursor-pointer items-center gap-2" onClick={handleCreateOrganization}>
					<Plus className="size-4 text-muted-foreground" />
					<span>Create Organization</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
