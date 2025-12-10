import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

export const redirectToCheckout = async (
  listing: { name: string; pricePerNight: number; id: string },
  startDate: Date,
  endDate: Date,
  daysDifference: number,
  phone: string,
  specialRequests: string,
  guests: number
) => {
  try {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    if (!stripe) throw new Error("Stripe failed to initialize");

    const {
      data: { sessionId },
    } = await axios.post("/api/stripe", {
      listing,
      startDate,
      endDate,
      daysDifference,
      phone,
      specialRequests,
      guests,
    });

    const result = await stripe.redirectToCheckout({
      sessionId,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  } catch (error) {
    console.error("Error redirecting to checkout:", error);
  }
};
