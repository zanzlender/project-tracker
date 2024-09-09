"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DASHBOARD_SIDEBAR_LINKS } from "~/lib/constants";

import { Menu } from "lucide-react";
import { Button } from "~/app/_components/ui/button";

export default function LoggedInLayout({
  children,
  params: { projectId },
}: Readonly<{ children: React.ReactNode; params: { projectId: string } }>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const sidebarItems = DASHBOARD_SIDEBAR_LINKS(projectId);

  return (
    <>
      <div className="flex h-full min-h-full w-full flex-shrink-0 flex-grow flex-col overflow-x-hidden sm:flex-row">
        <div className="relative flex w-full flex-grow flex-col sm:flex-row">
          {/* DESKTOP SIDEBAR */}
          <div className="hidden w-72 shrink-0 flex-col justify-between bg-gray-100 shadow sm:relative sm:flex md:h-full">
            <ul className="mt-12">
              {sidebarItems.map((item, idx) => {
                const isActiveLink = pathname === item.url;

                return (
                  <li key={`sidebar-item-${idx}`}>
                    <Link
                      href={item.url}
                      className={`flex w-full cursor-pointer items-center justify-between px-8 py-3 text-gray-800 transition-all duration-150 ${isActiveLink ? "bg-gray-200 font-semibold" : "hover:bg-amber-400 hover:font-semibold"}`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-2 text-sm">{item.displayName}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="z-20 flex h-12 w-full flex-row items-center justify-start gap-2 border-b-2 bg-gray-100 p-2 sm:hidden">
            <Button
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              variant={"ghost"}
            >
              <Menu />
            </Button>
            <span>Resources</span>
          </div>

          {/** MOBILE SIDEBAR */}
          <div
            className={`absolute z-10 ${isMobileNavOpen ? "flex" : "hidden"} min-h-[50%] w-64 flex-col justify-between bg-gray-100 shadow-lg transition duration-150 ease-in-out sm:hidden md:h-full`}
            id="mobile-nav"
          >
            <ul className="mt-12">
              {sidebarItems.map((item, idx) => {
                const isActiveLink = pathname === item.url;

                return (
                  <li key={`sidebar-item-${idx}`}>
                    <Link
                      href={item.url}
                      className={`flex w-full cursor-pointer items-center justify-between px-8 py-3 text-gray-800 transition-all duration-150 ${isActiveLink ? "bg-gray-200 font-semibold" : "hover:bg-amber-400 hover:font-semibold"}`}
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-2 text-sm">{item.displayName}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative mx-auto h-full w-full overflow-y-auto overflow-x-hidden p-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
