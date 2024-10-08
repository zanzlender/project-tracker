import { api } from "~/trpc/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import InviteUserDialog from "./_components/invite-user";
import InvitesActionDropdown from "./_components/invites-actions-dropdown";
import MembersActionDropdown from "./_components/members-actions-dropdown";

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

  void api.project.getProject.prefetch(
    { projectId: params.projectId },
    {
      staleTime: 1000,
    },
  );

  console.log("PPPP", project);

  const { userId } = auth();
  const isUserOwner = project.authorId === userId;

  return (
    <>
      <div className="flex w-full flex-col gap-8 p-6 lg:px-8">
        <div className="flex w-full max-w-4xl flex-col gap-6">
          {/** MEMBERS TABLE */}
          <div className="flex w-full flex-row items-center justify-between">
            <span className="text-2xl font-semibold">Members</span>

            <Suspense>
              {isUserOwner && <InviteUserDialog projectId={params.projectId} />}
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
                  {isUserOwner && <TableHead></TableHead>}
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
                      {member.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    {isUserOwner && (
                      <TableCell>
                        <MembersActionDropdown
                          projectId={params.projectId}
                          username={member.user.username}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell className="font-medium">
                    {project.owner?.name}
                  </TableCell>
                  <TableCell>MEMBER</TableCell>
                  <TableCell>
                    {project.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>OWNER</TableCell>
                  {isUserOwner && <TableCell></TableCell>}
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={isUserOwner ? 5 : 4}>
                    Total members: {project.members.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/** INVITES TABLE */}
          {isUserOwner && (
            <>
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
                          <TableCell>
                            <InvitesActionDropdown inviteId={invite.id} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5}>
                        Total active invites: {project.invites.length}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
