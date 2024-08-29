import { and, desc, eq } from "drizzle-orm";
import { db } from "..";
import { projects as projectsTable, type InsertProject } from "../schema";

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
