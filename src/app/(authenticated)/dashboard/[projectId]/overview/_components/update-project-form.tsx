"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { Textarea } from "~/app/_components/ui/textarea";
import { updateProjectSchema } from "~/server/db/zod-schemas/project";
import { api, RouterOutputs } from "~/trpc/react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { type z } from "zod";
import { revalidatePath } from "next/cache";

type Project = Required<RouterOutputs["project"]["getProject"]>;

export function UpdateProjectForm({ project }: { project: Project }) {
  const pathname = usePathname();

  const createProjectMutation = api.project.updateProject.useMutation({
    onError: () => {
      toast(`❌ Failed to update project...`);
    },
    onSuccess: () => {
      toast("🎉 Project updated!");
      revalidatePath(pathname);
    },
  });

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateProjectSchema>) {
    createProjectMutation.mutate({
      id: project?.id ?? "",
      name: values.name,
      description: values.description,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <span className="text-2xl font-semibold">General </span>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input placeholder="My project 123" {...field} />
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
                  placeholder="Project description..."
                  {...field}
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mt-2 w-full"
          type="submit"
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
