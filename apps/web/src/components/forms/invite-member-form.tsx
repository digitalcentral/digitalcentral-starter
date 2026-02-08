"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrganization } from "@/hooks/use-organization";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const inviteMemberSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	role: z.enum(["admin", "member", "owner"]),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export function InviteMemberForm() {
	const { organizationId } = useOrganization();

	const inviteMember = useMutation(api.organizations.inviteMember);
	const [isInviting, setIsInviting] = useState(false);

	const form = useForm<InviteMemberFormValues>({
		resolver: zodResolver(inviteMemberSchema),
		defaultValues: {
			email: "",
			role: "member",
		},
	});

	const onSubmit = async (data: InviteMemberFormValues) => {
		if (!organizationId || !data.email) return;

		setIsInviting(true);
		try {
			await inviteMember({
				organizationId,
				email: data.email,
				role: data.role,
			});
			toast.success(`Invitation sent to ${data.email}`);
			form.reset();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to send invitation";
			toast.error(message);
		} finally {
			setIsInviting(false);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<h4 className="font-medium text-sm">Invite Team Member</h4>
				<div className="flex gap-2">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormControl>
									<Input placeholder="email@example.com" type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem className="w-32">
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="member">Member</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
										<SelectItem value="owner">Owner</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={isInviting || !form.watch("email")} type="submit">
						{isInviting ? <Loader2 className="size-4 animate-spin" /> : <Mail className="mr-2 size-4" />}
						{!isInviting && "Invite"}
					</Button>
				</div>
				<FormDescription>Invited members will receive an email to join your organization</FormDescription>
			</form>
		</Form>
	);
}
