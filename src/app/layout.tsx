import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Toaster } from "~/app/_components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Project Planner App",
  description:
    "This project is a Project tracker and planner application developed for the practical task part for my Masters thesis, 'Developing web applications in TypeScript'",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${fontSans.variable}`}>
        <body
          className={cn("min-h-screen bg-background font-sans antialiased")}
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
