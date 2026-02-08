import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { fetchAuthMutation } from "@/lib/auth-server";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { Button } from "../ui/button";

export function SignOut() {
	return (
		<form>
			<Button
				className="h-10 min-w-10 justify-center gap-2 px-3 sm:justify-start sm:px-4"
				formAction={async () => {
					"use server";
					await fetchAuthMutation(api.auth.signOut);
					redirect("/");
				}}
				size="sm"
				type="submit"
				variant="ghost"
			>
				<LogOut className="size-5" />
				<span className="hidden sm:inline">Sign out</span>
			</Button>
		</form>
	);
}
