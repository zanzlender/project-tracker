import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "~/trpc/server";
import MobileNavigation from "../_components/mobile-navigation";
import { Suspense } from "react";
import Notifications from "../_components/notifications";

export default async function LoggedInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const projects = await api.project.getProjectsForUser();

  return (
    <>
      <header className="flex flex-row items-center justify-between border">
        {/** DESKTOP NAVIGATION */}
        <div className="mx-auto hidden h-24 w-full max-w-7xl items-center justify-between gap-x-6 p-6 sm:flex lg:px-8">
          <div className="flex items-center gap-x-4">
            <Link href="/dashboard">
              <h1 className="relative flex select-none flex-row items-baseline text-3xl font-bold">
                ProjectPlanner
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-x-4">
            <Suspense>
              <Notifications key={"desktop-notifications-1"} />
            </Suspense>
            <div className="relative h-10 w-10">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "100%",
                      height: "100%",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/** MOBILE NAVIGATION */}
        <div className="mx-auto flex h-16 w-full items-center justify-between gap-x-6 p-4 sm:hidden">
          <div>
            <Link href="/dashboard">
              <h1 className="relative flex select-none flex-row items-baseline text-3xl font-bold">
                ProjectPlanner
              </h1>
            </Link>
          </div>

          <div className="flex gap-4">
            <Suspense>
              <Notifications key={"desktop-notifications-2"} />
              <MobileNavigation
                projects={projects.map((project) => ({
                  id: project.id,
                  name: project.name ?? "",
                  url: `/dashboard/${project.id}/overview`,
                }))}
              />
            </Suspense>
          </div>
        </div>
      </header>

      <main className="relative flex h-full w-full flex-grow flex-col">
        {children}
      </main>
    </>
  );
}
