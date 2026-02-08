import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: {
		default: "SeyPayroll - Professional Payroll for Seychelles",
		template: "%s | SeyPayroll",
	},
	description: "Automate your payroll with accurate income tax, SPF, and social security calculations for Seychelles businesses.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable}`} lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans antialiased">
				<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
					<ConvexClientProvider>
						{children}
						<Toaster position="top-right" richColors />
					</ConvexClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
