"use client";

import { BellIcon } from "lucide-react";
import { api } from "~/trpc/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export default function Notifications() {
  const router = useRouter();
  const pathname = usePathname();
  const trpcUtils = api.useUtils();

  const notificationsQuery = api.notifications.getNotifications.useQuery();
  const acceptInviteMutation = api.notifications.acceptInvite.useMutation({
    onError: () => {
      toast("❌ Failed to execute");
    },
    onSuccess: async () => {
      toast("🎉 Invite accepted! Check your dashboard to see the project!");
      if (pathname === "/dashboard") router.refresh();
      await trpcUtils.notifications.getNotifications.invalidate();
    },
  });
  const rejectInviteQuery = api.notifications.rejectInvite.useMutation({
    onError: () => {
      toast("❌ Failed to execute");
    },
    onSuccess: async () => {
      toast("🎉 Invite rejected!");
      await trpcUtils.notifications.getNotifications.invalidate();
    },
  });

  const handleAcceptInvite = (inviteId: string) => async () => {
    acceptInviteMutation.mutate({
      inviteId: inviteId,
    });
  };
  const handleRejectInvite = (inviteId: string) => async () => {
    rejectInviteQuery.mutate({
      inviteId: inviteId,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          <BellIcon />
          {notificationsQuery.data && notificationsQuery.data.length > 0 && (
            <div className="absolute right-0 top-0 h-[12px] w-[12px] -translate-y-1/2 translate-x-1/2 animate-pulse rounded-full bg-red-600"></div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[300px]">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {notificationsQuery.data?.length === 0 ? (
            <DropdownMenuItem>
              <div className="flex min-h-[50px] w-full max-w-[400px] flex-row items-center justify-between gap-3">
                <span className="text-center">
                  You have no new notifications
                </span>
              </div>
            </DropdownMenuItem>
          ) : (
            notificationsQuery.data?.map((notification) => {
              return (
                <DropdownMenuItem
                  key={`notification-${notification.projectId}`}
                >
                  <div className="flex min-h-[50px] w-full max-w-[400px] flex-row items-center justify-between gap-3">
                    <div className="flex w-full flex-col gap-1">
                      <span className="text-sm">
                        <span className="font-semibold">
                          {notification.inviter.username}
                        </span>{" "}
                        has invited you to join the project:
                        <span className="font-semibold">
                          {" "}
                          {notification.project.name}
                        </span>
                      </span>
                    </div>
                    <div className="flex w-fit flex-row items-center gap-2">
                      <Button
                        size={"sm"}
                        onClick={handleAcceptInvite(notification.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant={"destructive"}
                        onClick={handleRejectInvite(notification.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
