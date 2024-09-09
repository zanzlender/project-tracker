"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";

const DELETE_PROJECT_PASSPHRASE = "Delete project";

export default function DeleteProjectDialog({
  projectId,
  onAfterDelete,
}: {
  projectId: string;
  onAfterDelete?: () => void;
}) {
  const [input, setInput] = useState("");
  const inputPassed = input === DELETE_PROJECT_PASSPHRASE;
  const router = useRouter();

  const deleteProjectMutation = api.project.deleteProject.useMutation({
    onError: () => {
      toast("❌ Failed to delete project");
    },
    onSuccess: () => {
      toast("🎉 Project deleted!");
      router.replace("/dashboard");
    },
  });

  const handleDeleteProject = async () => {
    if (inputPassed) {
      deleteProjectMutation.mutate({
        projectId: projectId,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Delete projtect</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This action will permanently delete the project! If this action is
            intended write down{" "}
            <span className="font-semibold">Delete project</span> in the input
            field below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            placeholder="Delete project"
            className="col-span-3"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          {!inputPassed && (
            <span className="text-sm text-red-600">Wrong input</span>
          )}
        </div>
        <DialogFooter>
          <Button
            disabled={!inputPassed || deleteProjectMutation.isPending}
            type="button"
            variant="destructive"
            onClick={handleDeleteProject}
          >
            {deleteProjectMutation.isPending ? "Deleting..." : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
