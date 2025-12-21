import { getDatesInRange } from "@/lib/dateToMilliseconds";
import { createReservation } from "@/app/_actions/reservation/reservation-actions";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe"; // ES module import

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover"
})

export async function POST(req) {
    try {
        const h = await headers();
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
            // Store PaymentIntent ID instead of Charge ID for easier refunding (since Checkout sessions use PI)
            const chargeId = paymentIntentId;

            const {
                startDate,
                endDate,
                listingId,
                pricePerNight,
                daysDifference,
                useId,
                phone,
                specialRequests
            } = session.metadata

            const reservedDates = getDatesInRange(startDate, endDate)

            // Use createReservation action
            const reservationData = {
                userId: useId,
                listingId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                chargeId: String(chargeId),
                reservedDates,
                daysDifference: Number(daysDifference),
                phone: phone || "",
                specialRequests: specialRequests || null,
                totalPrice: Number(daysDifference) * Number(pricePerNight),
            }
            console.log('reservationData', reservationData);

            const newReservation = await createReservation(reservationData);

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