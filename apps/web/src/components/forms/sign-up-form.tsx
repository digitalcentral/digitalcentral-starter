"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const signUpSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: SignUpFormValues) => {
		setIsLoading(true);

		try {
			const result = await authClient.signUp.email({
				name: data.name,
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				toast.error(result.error.message || "Failed to sign up");
				return;
			}

			toast.success("Account created! Let's set up your organization.");
			router.push("/onboarding");
		} catch (error) {
			console.error(error);
			toast.error("An unexpected error occurred");
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
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="you@example.com" type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="••••••••" type="password" {...field} />
							</FormControl>
							<FormDescription>Must be at least 8 characters</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" disabled={isLoading} type="submit">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 size-4 animate-spin" />
							Creating account...
						</>
					) : (
						"Create Account"
					)}
				</Button>
			</form>
		</Form>
	);
}
