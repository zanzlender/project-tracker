import { db } from "..";

export async function GetProjectTasks({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const response = await db.query.projects.findFirst({
    where: {},
  });
  return;
}
