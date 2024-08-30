import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CanUserAccessProject } from "~/server/db/_projects";
import { checkIfUsernameExists } from "~/server/db/_users";
import {
  projects as projectsTable,
  projects_users as projectsUsersTable,
} from "~/server/db/schema";
import {
  createProjectSchema,
  updateProjectSchema,
} from "~/server/db/zod-schemas/project";

export const usersRouter = createTRPCRouter({
  checkIfUsernameExists: protectedProcedure
    .input(
      z.object({
        username: z.string().min(4),
      }),
    )
    .mutation(async ({ input }) => {
      const usernameExists = checkIfUsernameExists({
        username: input.username,
      });
      return usernameExists;
    }),
});
