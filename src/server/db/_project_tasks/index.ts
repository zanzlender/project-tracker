import { eq } from "drizzle-orm";
import { db } from "..";
import { type InsertProjectTask } from "../schema";
import {
  project_tasks as projectTasksTable,
  projects as projectsTable,
} from "../schema";

export async function GetProjectTasks({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const projectWithTasks = await db.query.projects.findFirst({
    with: {
      tasks: {
        with: {
          author: {
            columns: {
              username: true,
            },
          },
        },
      },
    },
    where: eq(projectsTable.id, projectId),
  });

  return projectWithTasks;
}

export async function CreateNewProjectTask(props: InsertProjectTask) {
  const response = await db
    .insert(projectTasksTable)
    .values({
      authorId: props.authorId,
      column: props.column,
      description: props.description,
      projectId: props.projectId,
      title: props.title,
      badges: props.badges,
    })
    .returning();

  const newTaskId = response[0]?.id ?? "";

  const newTaskDataWithAuthor = await db.query.project_tasks.findFirst({
    where: eq(projectTasksTable.id, newTaskId),
    with: {
      author: {
        columns: { username: true },
      },
    },
  });
  return newTaskDataWithAuthor;
}

export async function UpdateProjectTask(
  props: Omit<InsertProjectTask, "projectId"> & { id: string },
) {
  // TODO check only author can edit?
  await db
    .update(projectTasksTable)
    .set({
      badges: props.badges,
      column: props.column,
      description: props.description,
      title: props.title,
    })
    .where(eq(projectTasksTable.id, props.id))
    .returning();

  const updatedTaskData = await db.query.project_tasks.findFirst({
    where: eq(projectTasksTable.id, props.id),
    with: {
      author: {
        columns: { username: true },
      },
    },
  });

  return updatedTaskData;
}
