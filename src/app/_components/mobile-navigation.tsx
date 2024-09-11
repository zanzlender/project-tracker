import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "~/app/_components/ui/sheet";
import { NAVIGATION_ITEMS } from "~/lib/constants";
import { Button } from "./ui/button";
import SelectProject from "./select-project";
import { SignOutButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default function MobileNavigation({
  projects,
}: {
  projects: {
    name: string;
    id: string;
    url: string;
  }[];
}) {
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="mb-6">Project planner</SheetTitle>

            <div className="flex w-full flex-col gap-4">
              {NAVIGATION_ITEMS.map((item) => {
                return (
                  <Link
                    href={item.url}
                    className="w-full"
                    key={`nav-item-id-${item.url}`}
                  >
                    <SheetClose className="w-full" asChild>
                      <Button variant={"outline"} className="w-full">
                        {item.displayName}
                      </Button>
                    </SheetClose>
                  </Link>
                );
              })}

              <div className="my-4 h-[2px] bg-gray-300"></div>

              <div className="relative flex h-10 w-full items-center justify-start gap-3">
                <SelectProject
                  projects={projects.map((p) => ({
                    id: p.id,
                    name: p.name ?? "",
                    url: `/dashboard/${p.id}/overview`,
                  }))}
                />

                <SheetClose asChild>
                  <Button asChild className="w-full" variant={"destructive"}>
                    <SignOutButton>Sign out</SignOutButton>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
