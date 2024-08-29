import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { projects as projectsTable } from "~/server/db/schema";
import { createProjectSchema } from "~/server/db/zod-schemas/project";

export const projectsRouter = createTRPCRouter({
  getProjectsForUser: publicProcedure.query(async ({ ctx }) => {
    const { userId } = auth();
    if (!userId) throw new Error("NOT_LOGGED_IN");

    const projects = await ctx.db.query.projects.findMany({
      where: eq(projectsTable.authorId, userId),
    });

    return projects;
  }),

  createProject: publicProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = auth();
      console.log("USERID", userId);
      if (!userId) throw new Error("NOT_LOGGED_IN");

      const response = await ctx.db
        .insert(projectsTable)
        .values({
          name: input.name,
          description: input.description,
          authorId: userId,
        })
        .returning({ projectId: projectsTable.id });

      const createdProject = response[0];

      return createdProject;
    }),
});
