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

const DELETE_PROJECT_PASSPHRASE = "Leave project";

export default function MemberSettings({
  projectId,
  onAfterDelete,
}: {
  projectId: string;
  onAfterDelete?: () => void;
}) {
  const [input, setInput] = useState("");
  const inputPassed = input === DELETE_PROJECT_PASSPHRASE;
  const router = useRouter();

  const leaveProjectMutation = api.project.leaveProject.useMutation({
    onError: () => {
      toast("❌ Failed to leave project");
    },
    onSuccess: () => {
      toast("🎉 Project left!");
      router.replace("/dashboard");
    },
  });

  const handleLeaveProject = async () => {
    if (inputPassed) {
      leaveProjectMutation.mutate({
        projectId: projectId,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Leave project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave project</DialogTitle>
          <DialogDescription>
            This action will permanently remove you from the project! If this
            action is intended write down{" "}
            <span className="font-semibold">Leave project</span> in the input
            field below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            placeholder="Leave project"
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
            disabled={!inputPassed || leaveProjectMutation.isPending}
            type="button"
            variant="destructive"
            onClick={handleLeaveProject}
          >
            {leaveProjectMutation.isPending ? "Leaving..." : "Leave project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
