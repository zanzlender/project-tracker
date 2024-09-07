import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { checkIfUsernameExists } from "~/server/db/_users";
import dto from "~/server/db/dto";

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

  getCurrentUserData: protectedProcedure.query(async ({ ctx }) => {
    const userData = await dto.GetUserById(ctx.currentUser.id);
    return userData;
  }),
});
