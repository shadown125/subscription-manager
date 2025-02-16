import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    if (!user) {
      throw new Error("unauthorized");
    }

    return ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });
  }),
  getPublicUser: publicProcedure
    .input(
      z.object({
        id: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input?.id) {
        return null;
      }

      return ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.id!),
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userWithEmailExists = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (userWithEmailExists) {
        throw new Error("User with that email already exists");
      }

      await ctx.db.insert(users).values({
        email: input.email,
        password: input.password,
        name: input.name,
      });
    }),
});
