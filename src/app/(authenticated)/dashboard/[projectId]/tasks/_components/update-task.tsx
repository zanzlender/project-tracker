"use client";

import { useState } from "react";
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
import { DEFAULT_BADGES_SELECT } from "~/lib/constants";
import { MultiSelect } from "~/app/_components/ui/multi-select";
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
import { UpdateTaskSchema } from "~/server/db/zod-schemas/project-tasks";
import { usePathname, useRouter } from "next/navigation";

type UpdateTask = {
  column: string;
  badges: string[];
  taskId: string;
  title: string;
  description: string;
};

type Props = UpdateTask & {
  updateTask: (task: UpdateTask) => void;
};

export function UpdateTaskSheet({
  column,
  badges,
  taskId,
  title,
  description,
  updateTask,
}: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [_badges, setBadges] = useState<string[]>(() => badges);

  const form = useForm<z.infer<typeof UpdateTaskSchema>>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      id: taskId,
      badges: badges,
      column: column,
      title: title,
      description: description,
    },
  });

  const handleSelectBadge = (data: string[]) => {
    setBadges(data);
  };

  async function onSubmit(values: z.infer<typeof UpdateTaskSchema>) {
    updateTask({
      badges: _badges,
      taskId: taskId,
      title: values.title,
      description: values.description,
      column: column,
    });
    setIsSheetOpen(false);
  }

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={() => {
        if (isSheetOpen) router.push(pathName);
        setIsSheetOpen((prev) => !prev);
      }}
    >
      <SheetContent className="flex w-full max-w-2xl flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>
            Update and save modified task data!
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
                defaultValue={_badges}
                placeholder="Select badges"
                variant="inverted"
                animation={2}
                maxCount={3}
              />

              <Button className="mt-2 w-full" type="submit">
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
