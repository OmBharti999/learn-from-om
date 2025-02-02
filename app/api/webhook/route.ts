import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// headers
// NextResponse
export const POST = async (req: Request) => {
  const body = await req.text();
  const header = await headers();
  const signature = header.get("Stripe-Signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }

  const sessions = event.data.object as Stripe.Checkout.Session;
  const userId = sessions?.metadata?.userId as string;
  const courseId = sessions?.metadata?.courseId as string;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing Stripe Metadata" },
        { status: 400 }
      );
    }
    await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    });
  } else {
    return NextResponse.json(
      {
        error: "Webhook handler not found",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
};
