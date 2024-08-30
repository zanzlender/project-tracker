import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { InviteUserToProject } from "~/server/db/_project_invites";
import { CanUserAccessProject } from "~/server/db/_projects";
import {
  projects as projectsTable,
  projects_users as projectsUsersTable,
} from "~/server/db/schema";
import {
  createProjectSchema,
  updateProjectSchema,
} from "~/server/db/zod-schemas/project";

export const projectsRouter = createTRPCRouter({
  getProjectsForUser: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.query.projects.findMany({
      where: eq(projectsTable.authorId, ctx.currentUser.id),
    });

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
});
