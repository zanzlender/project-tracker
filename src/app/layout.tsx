import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Toaster } from "~/app/_components/ui/sonner";
import PlausibleProvider from "next-plausible";
import Script from "next/script";

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
  const domain =
    process.env.NODE_ENV === "production"
      ? "projectplanner.online"
      : "localhost:3000";

  return (
    <ClerkProvider>
      <html lang="en" className={`${fontSans.variable}`}>
        <head>
          {/*   <PlausibleProvider
            domain={domain}
            enabled={!domain.includes("localhost")}
          /> */}
          <Script
            id="plauible-basic-script"
            data-domain={domain}
            src="https://plausible.io/js/script.js"
          />
        </head>
        <body
          className={cn(
            "flex min-h-screen w-screen flex-col overflow-x-hidden bg-background font-sans antialiased",
          )}
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster
            toastOptions={{
              closeButton: true,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
