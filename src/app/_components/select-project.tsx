import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { SheetClose } from "./ui/sheet";

export default async function SelectProject({
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full gap-1" variant="outline">
            Select project <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>My projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {projects.map((project) => {
              return (
                <Link
                  key={`project-select-item-${project.id}`}
                  href={project.url}
                >
                  <DropdownMenuItem asChild>
                    <SheetClose>{project.name}</SheetClose>
                  </DropdownMenuItem>
                </Link>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
