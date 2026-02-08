"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@digitalcentral/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const createOrganizationSchema = z.object({
	name: z.string().min(1, "Company name is required"),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export function CreateOrganizationForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const createOrganization = useMutation(api.organizations.create);
	const form = useForm<CreateOrganizationFormValues>({
		resolver: zodResolver(createOrganizationSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (data: CreateOrganizationFormValues) => {
		setIsLoading(true);

		try {
			// Generate slug from company name
			const slug = data.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "");

			await createOrganization({
				name: data.name,
				slug,
			});

			toast.success("Organization created! Your 7-day trial has started.");
			router.push("/dashboard");
		} catch (error) {
			toast.error("Failed to create organization. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company Name</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="Acme Ltd" {...field} />
							</FormControl>
							<FormDescription>This is your registered business name in Seychelles</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" disabled={isLoading || !form.watch("name")?.trim()} type="submit">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 size-4 animate-spin" />
							Creating organization...
						</>
					) : (
						"Continue"
					)}
				</Button>
			</form>
		</Form>
	);
}
