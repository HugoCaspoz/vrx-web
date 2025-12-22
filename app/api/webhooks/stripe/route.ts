import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getOrderConfirmationHtml } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        // Fallback for local testing or if secret is missing/not set yet
        console.warn("STRIPE_WEBHOOK_SECRET is missing. Webhook verification skipped (unsafe for prod).");
        event = stripe.webhooks.constructEvent(body, signature, "whsec_test"); // Dummy or handle differently on first deploy
        // Actually, we should FAIL if secret is missing to avoid security risks, but for now lets return Error
        return new NextResponse("Webhook Secret Missing", { status: 500 });
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve line items to show in email
    // checking if session.id exists is implicit since event type matches
    const lineItemsWithDetails = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
    });

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || "Cliente";
    
    // Format items for email and DB
    const items = lineItemsWithDetails.data.map(item => ({
        name: item.description || "Producto",
        quantity: item.quantity || 1,
        price: (item.amount_total / 100) // Renamed from amount to price
    }));

    if (customerEmail) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessionWithShipping = session as any;
        const shippingDetails = sessionWithShipping.shipping_details?.address;

        // Save Order to DB
        await prisma.order.create({
            data: {
                stripeSessionId: session.id,
                customerName: customerName,
                customerEmail: customerEmail,
                totalAmount: (session.amount_total || 0) / 100,
                status: "paid",
                shippingAddress: shippingDetails ? JSON.stringify(shippingDetails) : null,
                items: {
                    create: items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        await resend.emails.send({
            from: 'VRX Performance <onboarding@resend.dev>', // Update to verified domain in prod
            to: [customerEmail],
            subject: `Confirmación de Pedido - VRX Performance`,
            html: getOrderConfirmationHtml({
                orderId: session.id,
                customerName,
                customerEmail,
                total: (session.amount_total || 0) / 100,
                items,
                shippingAddress: shippingDetails ? {
                    line1: shippingDetails.line1!,
                    line2: shippingDetails.line2,
                    city: shippingDetails.city!,
                    postal_code: shippingDetails.postal_code!,
                } : undefined
            })
        });
    }
  }

  return new NextResponse(null, { status: 200 });
}
