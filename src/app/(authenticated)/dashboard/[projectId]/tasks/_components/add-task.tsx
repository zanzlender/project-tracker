"use client";

import { type inferRouterOutputs } from "@trpc/server";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "~/app/_components/ui/textarea";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type Props = {
  projectId: string;
  column: string;
  onAfterCreateTask: (
    props: inferRouterOutputs<AppRouter>["project"]["createTask"],
  ) => void;
};

export function AddTaskSheet({ projectId, column, onAfterCreateTask }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badges, setBadges] = useState([]);
  const trpcUtils = api.useUtils();

  const createNewTaskMutation = api.project.createTask.useMutation({
    onError: () => {
      toast("❌ Failed to create new task");
    },
    onSuccess: async (data) => {
      toast("✅ New task created!");
      setTitle("");
      setDescription("");
      setBadges([]);
      onAfterCreateTask({
        description: data.description,
        id: data.id,
        title: data.title,
        badges: data.badges ?? [],
        authorId: data.authorId,
        column: data.column,
        projectId: data.projectId,
        author: data.author,
      });
      //await trpcUtils.project.getTasksForProject.invalidate();
      setIsOpen(false);
    },
  });

  const handleCreateTask = () => {
    createNewTaskMutation.mutate({
      title: title,
      description: description,
      badges: badges,
      column: column,
      projectId: projectId,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <SheetTrigger asChild>
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
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="mt-4 w-full">
            <Button
              disabled={createNewTaskMutation.isPending}
              type="button"
              className="w-full"
              onClick={handleCreateTask}
            >
              {createNewTaskMutation.isPending ? "Saving..." : "Create task"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
