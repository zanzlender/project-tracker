"use client";

import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { api } from "~/trpc/react";

export default function MembersActionDropdown({
  username,
  projectId,
}: {
  username: string;
  projectId: string;
}) {
  const router = useRouter();
  const handleKickUserMutation = api.project.kickMemberFromProject.useMutation({
    onError: () => {
      toast("❌ Failed to kick user, try again...");
    },
    onSuccess: () => {
      toast("🎉 User has been kicked out of the project!");
      router.refresh();
    },
  });

  const handleKickUser = async () => {
    handleKickUserMutation.mutate({
      projectId: projectId,
      username: username,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Member actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleKickUser}>Kick</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
