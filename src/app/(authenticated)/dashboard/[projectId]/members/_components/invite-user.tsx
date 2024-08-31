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
import { Label } from "~/app/_components/ui/label";
import { api } from "~/trpc/react";

export default function InviteUserDialog({ projectId }: { projectId: string }) {
  const [error, setError] = useState<undefined | string>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState("");

  const checkIfUsernameExists = api.user.checkIfUsernameExists.useMutation({
    onError: () => {
      setError("Username doesn't exist");
    },
    onSuccess: (data) => {
      if (data) {
        setError(undefined);
      } else {
        setError("Username doesn't exist");
      }
    },
  });

  const inviteUserMutation = api.project.inviteUserToProject.useMutation({
    onError: (err) => {
      console.log(err);
      toast("❌ Failed to invite user");
    },
    onSuccess: async () => {
      toast("🎉 User invited!");
      setError(undefined);
      setIsDialogOpen(false);
      router.refresh();
    },
  });

  const handleInviteUser = async () => {
    const res = await checkIfUsernameExists.mutateAsync({
      username: username,
    });

    if (res) {
      inviteUserMutation.mutate({
        username: username,
        role: "MEMBER",
        projectId: projectId,
        allowedActions: ["A"],
      });
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen((prev) => !prev)}
    >
      <DialogTrigger asChild>
        <Button variant="default">Invite member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">Invite members</DialogTitle>
          <DialogDescription>
            Add a new member to this project. An invite will be sent to the
            user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              className="col-span-3"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {error && <span className="text-red-500">{error}</span>}
        </div>
        <DialogFooter>
          <Button
            disabled={
              checkIfUsernameExists.isPending || inviteUserMutation.isPending
            }
            type="button"
            onClick={handleInviteUser}
          >
            {checkIfUsernameExists.isPending || inviteUserMutation.isPending
              ? "Saving..."
              : "Invite user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
