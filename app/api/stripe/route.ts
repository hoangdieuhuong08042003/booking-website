import { getCurrentUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";
import Stripe from "stripe"
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover"
})

export async function POST(req) {
  try {
    const {
      listing: { name, pricePerNight, id: listingId },
      startDate,
      endDate,
      daysDifference,
      phone,
      specialRequests,
      guests
    } = await req.json()

    const stripe_obj = [
      {
        price_data: {
          currency: "vnd",
          product_data: {
            name
          },
          unit_amount: pricePerNight
        },
        quantity: daysDifference
      }
    ]

    const currentUser = await getCurrentUser()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: stripe_obj,
      mode: "payment",
      success_url: "http://localhost:3000/dashboard/success-page",
      cancel_url: "http://localhost:3000",
      metadata: {
        startDate,
        endDate,
        listingId,
        pricePerNight,
        daysDifference,
        useId: currentUser.id,
        email: currentUser.email,
        phone,
        specialRequests,
        guests
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get("charge_id");

    if (!paymentIntentId) {
      return NextResponse.json(
        { message: "Missing payment intent id" },
        { status: 400 }
      );
    }

    const refundedPayment = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    if (refundedPayment.status !== "succeeded") {
      return NextResponse.json(
        { message: "Refund failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Successfully cancelled the reservation",
      refundId: refundedPayment.id,
    });
  } catch (error) {
    console.error("Stripe refund error:", error);

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
