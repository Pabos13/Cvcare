import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  const session = event.data.object as any

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)

    await db.user.update({
      where: { stripeCustomerId: session.customer },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        plan: "PRO",
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)

    await db.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    })
  }

  return NextResponse.json({ received: true })
}
