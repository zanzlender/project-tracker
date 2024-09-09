import { eq, sql, SQL } from "drizzle-orm";
import { db } from "..";
import { type InsertProjectTask } from "../schema";
import {
  project_tasks as projectTasksTable,
  projects as projectsTable,
} from "../schema";
import { KanbanColumn } from "~/lib/constants";

async function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function WORK(ms: number) {
  const x = await waitFor(ms);
  return ms;
}

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

export type UpdateTask = {
  id: string;
  description: string;
  title: string;
  badges: string[] | null;
  column: string;
  position: number;
};

export async function UpdateAllProjectTasks({
  tasks,
  userId,
}: {
  tasks: UpdateTask[];
  userId: string;
}) {
  // You have to be sure that inputs array is not empty
  if (tasks.length === 0) {
    return undefined;
  }

  const allTasks: UpdateTask[] = tasks.map((task, idx) => {
    return {
      column: task.column,
      description: task.description,
      title: task.title,
      badges: task.badges,
      position: idx,
      id: task.id,
    };
  });

  const res = await db.transaction(async (transaction) => {
    const updateResponse = await Promise.allSettled(
      allTasks.map(async (task) => {
        return await db
          .update(projectTasksTable)
          .set({
            column: task.column,
            description: task.description,
            title: task.title,
            badges: task.badges,
            position: task.position,
          })
          .where(eq(projectTasksTable.id, task.id));
      }),
    );

    const errors = updateResponse.filter((r) => r.status === "rejected");
    if (errors.length > 0) {
      transaction.rollback();
      return;
    }

    return true;
  });

  return res;
}
