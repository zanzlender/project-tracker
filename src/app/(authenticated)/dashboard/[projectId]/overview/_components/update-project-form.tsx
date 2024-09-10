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
import { api, type RouterOutputs } from "~/trpc/react";
import { toast } from "sonner";
import { type z } from "zod";
import TiptapEditor, {
  type TiptapEditorForwardedRefProps,
} from "~/app/_components/tiptap-editor";
import { useRef } from "react";
import { useAuth } from "@clerk/nextjs";

type Project = Required<RouterOutputs["project"]["getProject"]>;

export function UpdateProjectForm({ project }: { project: Project }) {
  const tiptapEditorRef = useRef<TiptapEditorForwardedRefProps>(null);
  const auth = useAuth();
  const canUserEdit = auth.userId === project.authorId;

  const updateProjectMutation = api.project.updateProject.useMutation({
    onError: (err) => {
      console.error(err);
      toast(`❌ Failed to update project...`);
    },
    onSuccess: () => {
      toast("🎉 Project updated!");
    },
  });

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      id: project.id,
      name: project?.name ?? "",
      description: project?.description ?? "",
      content: project.content ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof updateProjectSchema>) {
    const jsonContentData = tiptapEditorRef.current?.getEditorData();

    updateProjectMutation.mutate({
      id: project?.id ?? "",
      name: values.name,
      description: values.description,
      content: jsonContentData,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <span className="text-2xl font-semibold">General </span>

        <FormField
          disabled={!canUserEdit}
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
          disabled={!canUserEdit}
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

        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <TiptapEditor
              key="tiptap-editor-update-project"
              ref={tiptapEditorRef}
              immediatelyRender={false}
              data={project.content ?? undefined}
              readOnly={!canUserEdit}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {canUserEdit && (
          <Button
            className="mt-2 w-full"
            type="submit"
            disabled={updateProjectMutation.isPending}
          >
            {updateProjectMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        )}
      </form>
    </Form>
  );
}
