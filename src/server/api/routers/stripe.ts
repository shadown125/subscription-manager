import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { env } from "@/env";
import { getAbsoluteUrl } from "@/utils";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

export const stripeRouter = createTRPCRouter({
  createStripeSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new Error("User not found");
      }

      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("User not found");
      }

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${getAbsoluteUrl()}/`,
        cancel_url: `${getAbsoluteUrl()}/`,
        payment_method_types: ["card"],
        mode: "payment",
        allow_promotion_codes: true,
        customer_creation: "always",
        billing_address_collection: "auto",
        line_items: [
          {
            price: input.priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
        },
      });

      return {
        url: stripeSession.url,
      };
    }),
});
