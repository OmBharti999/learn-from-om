"use server";

import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

export const purchaseCheckout = async ({ courseId }: { courseId: string }) => {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return returnError("Unauthorized");
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });
    const isPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });
    if (isPurchase) {
      returnError("You have already purchased this course");
    }
    if (!course) {
      return returnError("Course not found");
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const sessions = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return sessions.url;
  } catch (error) {
    console.log("🚀 ~ purchaseCheckout ~ error:", error);
    return returnError("Something went wrong");
  }
};
