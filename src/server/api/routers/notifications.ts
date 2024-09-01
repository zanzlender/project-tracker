import dto from "~/server/db/dto";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const notificationsRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await dto.GetInvitesForUser({
      userId: ctx.currentUser.id,
    });

    return notifications;
  }),

  rejectInvite: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await dto.RejectInvite({
        projectId: input.projectId,
        userId: ctx.currentUser.id,
      });
      return response;
    }),

  acceptInvite: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await dto.AcceptInvite({
        projectId: input.projectId,
        userId: ctx.currentUser.id,
      });
      return response;
    }),
});
