import { env } from "@/env";
import { stripe } from "@/server/api/routers/stripe";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.credits) {
    return new Response(null, {
      status: 200,
    });
  }

  if (event.type === "checkout.session.completed") {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.metadata!.userId!),
    });

    if (!user) {
      return new Response(null, { status: 200 });
    }

    await db
      .update(users)
      .set({
        isPaid: true,
      })
      .where(eq(users.id, user.id));
  }

  return new Response(null, { status: 200 });
}
