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

export default function InvitesActionDropdown({
  inviteId,
}: {
  inviteId: string;
}) {
  const router = useRouter();
  const handleDeleteInviteMutation = api.project.deleteInvite.useMutation({
    onError: () => {
      toast("❌ Failed to delete invite, try again...");
    },
    onSuccess: () => {
      toast("🎉 Invite has been deleted!");
      router.refresh();
    },
  });

  const handleDeleteInvite = async () => {
    handleDeleteInviteMutation.mutate({
      inviteId: inviteId,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Invites actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteInvite}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
