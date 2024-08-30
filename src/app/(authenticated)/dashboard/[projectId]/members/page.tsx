import { api } from "~/trpc/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { Button } from "~/app/_components/ui/button";
import InviteUserDialog from "./_components/invite-user";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await api.project
    .getProject({
      projectId: params.projectId,
    })
    .catch(() => {
      redirect("/dashboard");
    });

  return (
    <>
      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full max-w-4xl flex-col gap-6">
          {/** MEMBERS TABLE */}
          <div className="flex w-full flex-row items-center justify-between">
            <span className="text-2xl font-semibold">Members</span>

            <Suspense>
              <InviteUserDialog projectId={params.projectId} />
            </Suspense>
          </div>

          <div className="mb-10 w-full rounded-md border">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited/Member since</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.members.map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">
                      {member.user.name}
                    </TableCell>
                    <TableCell>MEMBER</TableCell>
                    <TableCell>
                      {member.createdAt.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Button>ACTION</Button>
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell className="font-medium">
                    {project.owner.name}
                  </TableCell>
                  <TableCell>MEMBER</TableCell>
                  <TableCell>
                    {project.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>OWNER</TableCell>
                  <TableCell>ACTION</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total members</TableCell>
                  <TableCell>{project.members.length}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/** INVITES TABLE */}
          <div className="flex w-full flex-row items-center justify-between">
            <span className="text-2xl font-semibold">Invites</span>
          </div>

          <div className="w-full rounded-md border">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited at</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.invites.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center" colSpan={5}>
                      No invites sent yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  project.invites.map((invite) => (
                    <TableRow key={invite.inviteeId}>
                      <TableCell className="font-medium">
                        {invite.invitee.name}
                      </TableCell>
                      <TableCell>INVITED</TableCell>
                      <TableCell>
                        {invite.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{invite.role}</TableCell>
                      <TableCell>ACTION</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total invites</TableCell>
                  <TableCell>{project.invites.length}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
