import { db } from "..";
import { GetUserByUsername } from "../_users";
import { projects_invites as projectInvitesTable } from "../schema";

export async function InviteUserToProject({
  username,
  projectId,
  inviterId,
  allowedActions,
  role,
}: {
  username: string;
  projectId: string;
  inviterId: string;
  role: string;
  allowedActions: string[];
}) {
  const foundUser = await GetUserByUsername({ username });

  if (!foundUser) {
    throw new Error("USER_NOT_FOUND");
  }
  const createdInvite = await db
    .insert(projectInvitesTable)
    .values({
      role: role,
      allowedActions: allowedActions,
      projectId: projectId,
      inviterId: inviterId,
      inviteeId: foundUser.id,
    })
    .returning();

  return createdInvite[0];
}
