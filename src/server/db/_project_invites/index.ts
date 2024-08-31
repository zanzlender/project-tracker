import { and, eq } from "drizzle-orm";
import { db } from "..";
import { GetUserByUsername } from "../_users";
import {
  users as usersTable,
  projects as projectsTable,
  projects_invites as projectInvitesTable,
} from "../schema";

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

export async function DeleteInvite({
  username,
  projectId,
  kickerId,
}: {
  username: string;
  projectId: string;
  kickerId: string;
}) {
  const project = await db.query.projects.findFirst({
    where: eq(projectsTable.id, projectId),
  });
  if (!project || project.authorId !== kickerId) {
    throw new Error("NOT_AUTHORIZED");
  }

  const user = await db.query.users.findFirst({
    where: eq(usersTable.username, username),
  });
  if (!user) {
    throw new Error("NOT_AUTHORIZED");
  }

  await db
    .delete(projectInvitesTable)
    .where(
      and(
        eq(projectInvitesTable.projectId, projectId),
        eq(projectInvitesTable.inviterId, kickerId),
        eq(projectInvitesTable.inviteeId, user.id),
      ),
    )
    .returning();

  return true;
}
