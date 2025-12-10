import db from "@/lib/db";
import { getDatesInRange } from "@/lib/dateToMilliseconds";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const { default: Stripe } = require("stripe");
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover"
})

export async function POST(req) {
    try {
        const h = await headers(); // await headers() trước
    const sig = h.get("stripe-signature");

    const body = await req.text()

    let event

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 500 }
        );
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object
        const paymentIntentId = session.payment_intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        const chargeId = paymentIntent.latest_charge

        const {
            startDate,
            endDate,
            listingId,
            pricePerNight,
            daysDifference,
            useId
        } = session.metadata

        const reservedDates = getDatesInRange(startDate, endDate)

        const reservationData = {
            userId: useId,
            listingId,
            startDate,
            endDate,
            chargeId,
            reservedDates,
            daysDifference: Number(daysDifference)
        }
        console.log('reservationData', reservationData);
        const newReservation = await db.reservation.create({
            data: reservationData
        })

        // Send email functionality
        return NextResponse.json(newReservation)
    }
    } catch (error) {
        console.log('error', error);
          return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 500 }
        ); 
    }
}