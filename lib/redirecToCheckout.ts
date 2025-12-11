import { loadStripe} from "@stripe/stripe-js"
import AXIOS_API from "./axiosAPI"

export const redirectToCheckout = async(
    listing,
    startDate,
    endDate,
    daysDifference
) => {
    try {
        console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

        if(!stripe) throw new Error("Stripe failed to initialize")

            const { data: {sessionId}}= await AXIOS_API.post('/stripe', {
                listing,
                startDate,
                endDate,
                daysDifference
            })

            const stripeError = await stripe.redirectToCheckout({
                sessionId
            })

            if(stripeError){
                return
            }
    } catch (error) {
        console.log(error)
    }
}