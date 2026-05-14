import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeamTasker | Collaborative Project Management",
  description: "A modern, collaborative task and project management platform built for agile teams to track progress, assign work, and succeed together.",
  keywords: ["project management", "task tracker", "saas", "team collaboration"],
  openGraph: {
    title: "TeamTasker | Collaborative Project Management",
    description: "A modern, collaborative task and project management platform built for agile teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
