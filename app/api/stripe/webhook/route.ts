import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createReservation } from "@/app/_actions/reservation/reservation-actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract metadata
      const {
        startDate,
        endDate,
        listingId,
        pricePerNight,
        daysDifference,
        useId: userId,
        phone,
        specialRequests,
      } = session.metadata!;

      // Parse reserved dates
      const reservedDates: number[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      const current = new Date(start);

      while (current < end) {
        const dateInt = parseInt(
          current.toISOString().slice(0, 10).replace(/-/g, "")
        );
        reservedDates.push(dateInt);
        current.setDate(current.getDate() + 1);
      }

      // Create reservation
      try {
        await createReservation({
          listingId,
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          chargeId: session.payment_intent as string,
          daysDifference: parseInt(daysDifference),
          reservedDates,
          phone,
          totalPrice: session.amount_total!, // Convert from cents to VND
          specialRequests: specialRequests || null,
        });

        console.log("Reservation created successfully for session:", session.id);
      } catch (error) {
        console.error("Failed to create reservation:", error);
        // Log error but return 200 to avoid Stripe retrying
        return NextResponse.json({
          received: true,
          error: "Failed to create reservation",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
   
  }
   return new NextResponse(null, { status: 200 });
}
