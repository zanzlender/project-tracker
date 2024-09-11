import { and, eq, or } from "drizzle-orm";
import { db } from "..";
import {
  InsertProjectUser,
  projects as projectsTable,
  projects_users as projectsUsersTable,
  users as usersTable,
  type InsertProject,
} from "../schema";
import { unstable_cache } from "next/cache";

export const GetP = unstable_cache(async ({ userId }: { userId: string }) => {
  const projectsResults = await db
    .select()
    .from(projectsTable)
    .leftJoin(
      projectsUsersTable,
      eq(projectsTable.id, projectsUsersTable.projectId),
    )
    .where(
      or(
        eq(projectsTable.authorId, userId),
        eq(projectsUsersTable.userId, userId),
      ),
    );

  type GetProjectsReturnType = ((typeof projectsResults)[number]["projects"] & {
    members: (typeof projectsResults)[number]["projects_users"][];
  })[];

  const res = projectsResults.reduce((acc, item) => {
    const { projects, projects_users } = item;
    const projectId = projects.id;

    const existingProject = acc?.find((project) => project.id === projectId);

    if (existingProject && projects_users) {
      existingProject.members.push(projects_users);
    } else {
      if (projects_users) {
        acc.push({
          ...projects,
          members: [projects_users],
        });
      } else {
        acc.push({
          ...projects,
          members: [],
        });
      }
    }

    return acc;
  }, [] as GetProjectsReturnType);

  return res;
});

export async function GetProjects({ userId }: { userId: string }) {
  const projectsResults = await db
    .select()
    .from(projectsTable)
    .leftJoin(
      projectsUsersTable,
      eq(projectsTable.id, projectsUsersTable.projectId),
    )
    .where(
      or(
        eq(projectsTable.authorId, userId),
        eq(projectsUsersTable.userId, userId),
      ),
    );

  type GetProjectsReturnType = ((typeof projectsResults)[number]["projects"] & {
    members: (typeof projectsResults)[number]["projects_users"][];
  })[];

  const res = projectsResults.reduce((acc, item) => {
    const { projects, projects_users } = item;
    const projectId = projects.id;

    const existingProject = acc?.find((project) => project.id === projectId);

    if (existingProject && projects_users) {
      existingProject.members.push(projects_users);
    } else {
      if (projects_users) {
        acc.push({
          ...projects,
          members: [projects_users],
        });
      } else {
        acc.push({
          ...projects,
          members: [],
        });
      }
    }

    return acc;
  }, [] as GetProjectsReturnType);

  return res;
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
    project.authorId !== userId &&
    !project.members.find((member) => member.userId === userId)
  ) {
    return new Error("ACCESS_DENIED");
  }

  return project;
}

// TODO for now only the owner can kick
export async function KickUserFromProject({
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
    .delete(projectsUsersTable)
    .where(
      and(
        eq(projectsUsersTable.projectId, projectId),
        eq(projectsUsersTable.userId, user.id),
      ),
    )
    .returning();

  return true;
}

export async function AddUserToProject(params: InsertProjectUser) {
  const response = await db
    .insert(projectsUsersTable)
    .values({
      allowedActions: params.allowedActions,
      projectId: params.projectId,
      role: params.role,
      userId: params.userId,
    })
    .returning();

  return response;
}

export async function LeaveProject({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  return await db
    .delete(projectsUsersTable)
    .where(
      and(
        eq(projectsUsersTable.projectId, projectId),
        eq(projectsUsersTable.userId, userId),
      ),
    )
    .returning();
}
