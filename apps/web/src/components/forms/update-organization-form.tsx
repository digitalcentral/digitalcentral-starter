"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useOrganization } from "@/hooks/use-organization";

const updateOrganizationSchema = z.object({
	name: z.string().min(1, "Company name is required"),
});

type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;

export function UpdateOrganizationForm() {
	const { organizationId, organization, isLoading: isOrgLoading } = useOrganization();

	const updateOrganization = useMutation(api.organizations.update);

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<UpdateOrganizationFormValues>({
		resolver: zodResolver(updateOrganizationSchema),
		defaultValues: {
			name: "",
		},
	});

	useEffect(() => {
		if (organization) {
			form.reset({
				name: organization.name || "",
			});
		}
	}, [organization, form]);

	const onSubmit = async (data: UpdateOrganizationFormValues) => {
		if (!organizationId) return;

		setIsLoading(true);
		try {
			await updateOrganization({
				organizationId,
				name: data.name,
			});
			toast.success("Company details updated");
		} catch (error) {
			console.error(error);
			toast.error("Failed to update company details");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company Name</FormLabel>
							<FormControl>{isOrgLoading ? <Spinner className="size-5 animate-spin" /> : <Input disabled placeholder="Your company name" {...field} />}</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-2">
					<FormLabel>Organization ID</FormLabel>
					{isOrgLoading ? <Spinner className="size-5 animate-spin" /> : <Input className="font-mono text-sm" disabled value={organizationId} />}
					<FormDescription>This is your unique organization identifier</FormDescription>
				</div>

				<Button disabled={isLoading} type="submit">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 size-4 animate-spin" />
							Saving...
						</>
					) : (
						"Save Changes"
					)}
				</Button>
			</form>
		</Form>
	);
}
