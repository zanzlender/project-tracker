import { and, eq } from "drizzle-orm";
import { db } from "..";
import { GetUserByUsername } from "../_users";
import {
  users as usersTable,
  projects as projectsTable,
  projects_invites as projectInvitesTable,
  InsertProjectInvites,
} from "../schema";
import { AddUserToProject } from "../_projects";

export async function InviteUserToProject({
  username,
  projectId,
  inviterId,
  allowedActions,
  role,
}: Omit<InsertProjectInvites, "inviteeId" | ""> & { username: string }) {
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
  inviteId,
  kickerId,
}: {
  inviteId: string;
  kickerId: string;
}) {
  // TODO check if user can kick

  await db
    .delete(projectInvitesTable)
    .where(eq(projectInvitesTable.id, inviteId))
    .returning();

  return true;
}

export async function GetInvitesForUser({ userId }: { userId: string }) {
  const invites = await db.query.projects_invites.findMany({
    where: eq(projectInvitesTable.inviteeId, userId),
    columns: {
      id: true,
      projectId: true,
      createdAt: true,
    },
    with: {
      project: {
        columns: {
          name: true,
        },
      },
      inviter: {
        columns: {
          username: true,
        },
      },
    },
  });

  return invites;
}

export async function RejectInvite({
  inviteId,
  userId,
}: {
  inviteId: string;
  userId: string;
}) {
  await db
    .delete(projectInvitesTable)
    .where(
      and(
        eq(projectInvitesTable.inviteeId, userId),
        eq(projectInvitesTable.id, inviteId),
      ),
    )
    .returning();

  return true;
}

export async function AcceptInvite({
  userId,
  inviteId,
}: {
  userId: string;
  inviteId: string;
}) {
  const response = await db.transaction(async (tx) => {
    const invite = await db.query.projects_invites.findFirst({
      where: and(
        eq(projectInvitesTable.id, inviteId),
        eq(projectInvitesTable.inviteeId, userId),
      ),
    });
    if (!invite) return false;

    const addUser = await AddUserToProject({
      projectId: invite.projectId,
      userId: invite.inviteeId,
      allowedActions: invite.allowedActions,
      role: invite.role,
    });
    if (addUser.length === 0) {
      tx.rollback();
      return false;
    }

    await db
      .delete(projectInvitesTable)
      .where(
        and(
          eq(projectInvitesTable.inviteeId, userId),
          eq(projectInvitesTable.id, inviteId),
        ),
      )
      .returning();

    return true;
  });

  return response;
}
