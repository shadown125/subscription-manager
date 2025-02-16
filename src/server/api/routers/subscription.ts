import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { subscriptions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const subscriptionRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    if (!user) {
      throw new Error("unauthorized");
    }

    return ctx.db.query.subscriptions.findMany({
      where: (subscriptions, { eq }) => eq(subscriptions.userId, user.id),
    });
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.number().nullable() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("unauthorized");
      }

      if (!input.id) {
        return null;
      }

      return ctx.db.query.subscriptions.findFirst({
        where: (subscriptions, { eq }) =>
          eq(subscriptions.userId, user.id) && eq(subscriptions.id, input.id!),
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        subscriptionName: z.string(),
        period: z.enum(["MONTHLY", "YEARLY"]),
        currency: z.enum(["USD", "EUR", "GBP"]),
        price: z.number(),
        status: z.enum(["ACTIVE", "PAUSED"]),
        billingDate: z.string(),
        billingType: z.enum([
          "CREDIT_CARD",
          "PAYPAL",
          "BANK_TRANSFER",
          "APPLE_PAY",
          "OTHER",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("unauthorized");
      }

      await ctx.db.insert(subscriptions).values({
        name: input.subscriptionName,
        userId: user.id,
        period: input.period,
        currency: input.currency,
        price: input.price,
        status: input.status,
        billingDate: input.billingDate,
        billingType: input.billingType,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        subscriptionName: z.string(),
        period: z.enum(["MONTHLY", "YEARLY"]),
        currency: z.enum(["USD", "EUR", "GBP"]),
        price: z.number().multipleOf(0.01),
        status: z.enum(["ACTIVE", "PAUSED"]),
        billingDate: z.string(),
        billingType: z.enum([
          "CREDIT_CARD",
          "PAYPAL",
          "BANK_TRANSFER",
          "APPLE_PAY",
          "OTHER",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("unauthorized");
      }

      await ctx.db
        .update(subscriptions)
        .set({
          name: input.subscriptionName,
          period: input.period,
          currency: input.currency,
          price: input.price,
          status: input.status,
          billingDate: input.billingDate,
          billingType: input.billingType,
        })
        .where(eq(subscriptions.id, input.id));
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("unauthorized");
      }

      await ctx.db.delete(subscriptions).where(eq(subscriptions.id, input.id));
    }),
});
