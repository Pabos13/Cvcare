import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export const getStripeSession = async ({
  priceId,
  domainUrl,
  customerId,
}: {
  priceId: string
  domainUrl: string
  customerId: string
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${domainUrl}/dashboard?success=true`,
    cancel_url: `${domainUrl}/pricing?canceled=true`,
    subscription_data: {
      metadata: {
        userId: customerId,
      },
    },
  })
  return session.url
}
