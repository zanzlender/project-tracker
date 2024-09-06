"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/_components/ui/sheet";

export function AddTaskSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-row items-center gap-1"
        >
          <PlusIcon /> Add item
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Create new task</SheetTitle>
          <SheetDescription>
            Create a new task for the project! It will automaticall be placed in
            the Backlog column, but you can move it anywhere later.
          </SheetDescription>
        </SheetHeader>

        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>

          <div className="mt-4 w-full">
            <Button className="w-full">Create task</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
