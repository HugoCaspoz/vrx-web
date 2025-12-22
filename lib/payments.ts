"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
});

export async function createCheckoutSession(cart: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
        const origin = (await headers()).get("origin");

        const lineItems = cart.map((item) => {
            if (item.priceId) {
                return {
                    price: item.priceId,
                    quantity: item.quantity,
                };
            } else {
                return {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: item.name,
                            images: [item.image || "https://placehold.co/600x400"],
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                };
            }
        });

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: `${origin}/store?success=true`,
            cancel_url: `${origin}/store?canceled=true`,
            shipping_address_collection: {
                allowed_countries: ["ES"], // Add more countries if needed (e.g. ["ES", "PT", "FR"])
            },
            phone_number_collection: {
                enabled: true,
            },
        });

        return { url: session.url };
    } catch (error) {
        console.error("Stripe Error:", error);
        return { error: "Error creating checkout session" };
    }
}
