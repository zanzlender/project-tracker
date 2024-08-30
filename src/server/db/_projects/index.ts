import { and, desc, eq } from "drizzle-orm";
import { db } from "..";
import {
  projects as projectsTable,
  projects_users as projectsUsersTable,
  type InsertProject,
} from "../schema";

export async function GetProjects({ userId }: { userId: string }) {
  const projects = await db.query.projects.findMany({
    where: eq(projectsTable.authorId, userId),
    orderBy: [desc(projectsTable.createdAt)],
  });

  return projects;
}

export async function CreateProject({
  userId,
  project,
}: {
  userId: string;
  project: Pick<InsertProject, "name" | "description">;
}) {
  const createdProject = await db
    .insert(projectsTable)
    .values({
      name: project.name,
      description: project.description,
      authorId: userId,
    })
    .returning();

  return createdProject[0];
}

export async function DeleteProject({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  await db
    .delete(projectsTable)
    .where(
      and(eq(projectsTable.id, projectId), eq(projectsTable.authorId, userId)),
    )
    .returning();

  return true;
}

export async function CanUserAccessProject({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const project = await db.query.projects.findFirst({
    where: eq(projectsTable.id, projectId),
    with: {
      members: {
        with: {
          user: {
            columns: {
              name: true,
              profileImage: true,
              username: true,
            },
          },
        },
      },
      owner: {
        columns: {
          name: true,
          profileImage: true,
          username: true,
        },
      },
      invites: {
        with: {
          invitee: {
            columns: {
              name: true,
              profileImage: true,
              username: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    return new Error("NOT_FOUND");
  }

  if (
    project.authorId !== userId ||
    project.members.find((member) => member.userId !== userId)
  ) {
    return new Error("ACCESS_DENIED");
  }

  return project;
}
