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
import { createProjectSchema } from "~/server/db/zod-schemas/project";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type z } from "zod";
import { useRef } from "react";
import TiptapEditor, {
  type TiptapEditorForwardedRefProps,
} from "~/app/_components/tiptap-editor";

export function CreateProjectForm() {
  const router = useRouter();
  const tiptapEditorRef = useRef<TiptapEditorForwardedRefProps>(null);

  const createProjectMutation = api.project.createProject.useMutation({
    onError: ({ message }) => {
      toast(`❌ Failed to create project... ${message}`);
    },
    onSuccess: (data) => {
      toast("🎉 New project created!");
      router.push(`/dashboard/${data?.projectId}/overview`);
    },
  });

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createProjectSchema>) {
    const jsonContentData = tiptapEditorRef.current?.getEditorData();

    createProjectMutation.mutate({
      name: values.name,
      description: values.description,
      content: jsonContentData,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
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

        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <TiptapEditor
              immediatelyRender={false}
              key="tiptap-editor-create-project"
              ref={tiptapEditorRef}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button
          className="mt-2 w-full"
          type="submit"
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Creating..." : "Create project"}
        </Button>
      </form>
    </Form>
  );
}
