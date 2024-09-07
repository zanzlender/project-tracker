import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { DEFAULT_KANBAN_COLUMNS, KanbanColumn } from "~/lib/constants";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  DeleteInvite,
  InviteUserToProject,
} from "~/server/db/_project_invites";
import {
  CreateNewProjectTask,
  GetProjectTasks,
  UpdateProjectTask,
} from "~/server/db/_project_tasks";
import {
  CanUserAccessProject,
  DeleteProject,
  GetProjects,
  KickUserFromProject,
  LeaveProject,
} from "~/server/db/_projects";
import {
  projects as projectsTable,
  projects_users as projectsUsersTable,
} from "~/server/db/schema";
import {
  createProjectSchema,
  createTaskSchema,
  updateProjectSchema,
} from "~/server/db/zod-schemas/project";
import {
  UpdateTaskSchema,
  UpdateTasksSchema,
} from "~/server/db/zod-schemas/project-tasks";

export const projectsRouter = createTRPCRouter({
  getProjectsForUser: protectedProcedure.query(async ({ ctx }) => {
    const projects = await GetProjects({ userId: ctx.currentUser.id });
    return projects;
  }),

  getProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(2),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accessGranted = await CanUserAccessProject({
        userId: ctx.currentUser.id,
        projectId: input.projectId,
      });

      if (accessGranted instanceof Error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return accessGranted;
    }),

  createProject: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db
        .insert(projectsTable)
        .values({
          name: input.name,
          description: input.description,
          authorId: ctx.currentUser.id,
        })
        .returning({ projectId: projectsTable.id });

      const createdProject = response[0];

      return createdProject;
    }),

  updateProject: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const accessGranted = await CanUserAccessProject({
        userId: ctx.currentUser.id,
        projectId: input.id,
      });

      if (accessGranted instanceof Error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const response = await ctx.db
        .update(projectsTable)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(eq(projectsTable.id, input.id))
        .returning({ projectId: projectsTable.id });

      const createdProject = response[0];

      return createdProject;
    }),

  inviteUserToProject: protectedProcedure
    .input(
      z.object({
        username: z.string().min(4),
        projectId: z.string(),
        role: z.string(),
        allowedActions: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invite = await InviteUserToProject({
        allowedActions: input.allowedActions,
        inviterId: ctx.currentUser.id,
        role: "MEMBER",
        projectId: input.projectId,
        username: input.username,
      });

      if (!invite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),

  kickMemberFromProject: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const kickUserResponse = await KickUserFromProject({
        kickerId: ctx.currentUser.id,
        projectId: input.projectId,
        username: input.username,
      });

      return kickUserResponse;
    }),

  deleteInvite: protectedProcedure
    .input(
      z.object({
        inviteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await DeleteInvite({
        inviteId: input.inviteId,
        kickerId: ctx.currentUser.id,
      });

      return response;
    }),

  deleteProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await DeleteProject({
        projectId: input.projectId,
        userId: ctx.currentUser.id,
      });

      return response;
    }),

  leaveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await LeaveProject({
        projectId: input.projectId,
        userId: ctx.currentUser.id,
      });

      return true;
    }),

  getTasksForProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const response = await GetProjectTasks({
        projectId: input.projectId,
        userId: ctx.currentUser.id,
      });

      console.log("TSK", response?.tasks);

      const kanbanColumns: KanbanColumn[] = [...DEFAULT_KANBAN_COLUMNS];
      console.log("KB1", kanbanColumns);

      response?.tasks.forEach((task) => {
        const foundColumnIndex = kanbanColumns.findIndex(
          (c) => c.id === task.column,
        );
        if (foundColumnIndex !== -1) {
          kanbanColumns[foundColumnIndex]?.tasks.push(task);
        } else {
          const backlogColumnIndex = kanbanColumns.findIndex(
            (x) => x.id === "1",
          );
          if (backlogColumnIndex) {
            kanbanColumns[backlogColumnIndex]?.tasks.push(task);
          }
        }
      });

      console.log("KB2", kanbanColumns);

      return kanbanColumns;
    }),

  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const response = await CreateNewProjectTask({
        authorId: ctx.currentUser.id,
        column: input.column,
        description: input.description,
        projectId: input.projectId,
        title: input.title,
        badges: input.badges,
      });

      if (!response) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      return response;
    }),

  updateTask: protectedProcedure
    .input(UpdateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const response = await UpdateProjectTask({
        id: input.id,
        column: input.column,
        description: input.description,
        title: input.title,
        badges: input.badges,
        authorId: ctx.currentUser.id,
      });

      return response;
    }),
});
