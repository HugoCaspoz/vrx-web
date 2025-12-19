"use server";

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
});

export interface StripeProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    priceId: string;
    image: string;
}

export async function getProducts(): Promise<StripeProduct[]> {
    try {
        const products = await stripe.products.list({
            limit: 100,
            active: true,
            expand: ['data.default_price']
        });

        return products.data.map(product => {
            const price = product.default_price as Stripe.Price;

            return {
                id: product.id,
                name: product.name,
                description: product.description || "",
                price: price ? (price.unit_amount || 0) / 100 : 0,
                priceId: price ? price.id : '',
                image: product.images[0] || '', // Use first image
            };
        }).filter(p => p.priceId !== ''); // Only return products with valid prices
    } catch (error) {
        console.error("Error fetching products from Stripe:", error);
        return [];
    }
}
