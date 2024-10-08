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
import { DEFAULT_BADGES_SELECT } from "~/lib/constants";
import { MultiSelect } from "~/app/_components/ui/multi-select";
import { createTaskSchema } from "~/server/db/zod-schemas/project";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";

type Props = {
  projectId: string;
  column: string;
  onAfterCreateTask: (
    props: inferRouterOutputs<AppRouter>["project"]["createTask"],
  ) => void;
};

export function AddTaskSheet({ projectId, column, onAfterCreateTask }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      badges: [],
      column: column,
      projectId: projectId,
      title: "",
      description: "",
    },
  });

  const createNewTaskMutation = api.project.createTask.useMutation({
    onError: () => {
      toast("❌ Failed to create new task");
    },
    onSuccess: async (data) => {
      toast("✅ New task created!");
      setBadges([]);
      form.reset();
      onAfterCreateTask({
        description: data.description,
        id: data.id,
        title: data.title,
        badges: data.badges,
        authorId: data.authorId,
        column: data.column,
        projectId: data.projectId,
        author: data.author,
        createdAt: data.createdAt,
        position: data.position,
      });
      setIsSheetOpen(false);
    },
  });

  const handleSelectBadge = (data: string[]) => {
    setBadges(data);
  };

  async function onSubmit(values: z.infer<typeof createTaskSchema>) {
    createNewTaskMutation.mutate({
      title: values.title,
      description: values.description,
      badges: badges,
      column: column,
      projectId: projectId,
    });
  }

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={() => setIsSheetOpen((prev) => !prev)}
    >
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Create landing page" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Task description..."
                        {...field}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <MultiSelect
                options={DEFAULT_BADGES_SELECT}
                onValueChange={handleSelectBadge}
                defaultValue={badges}
                placeholder="Select badges"
                variant="inverted"
                animation={2}
                maxCount={3}
              />

              <Button
                className="mt-2 w-full"
                type="submit"
                disabled={createNewTaskMutation.isPending}
              >
                {createNewTaskMutation.isPending
                  ? "Creating..."
                  : "Create task"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
