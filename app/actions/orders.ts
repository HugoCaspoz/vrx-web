"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail, getShippingConfirmationHtml } from "@/lib/email";

export async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: true
            }
        });
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

export async function markOrderAsSent(orderId: string, trackingNumber?: string) {
    try {
        // 1. Update Order Status
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { 
                status: "sent" 
            },
            include: {
                items: true
            }
        });

        // 2. Parse Address (stored as JSON)
        let shippingAddress = null;
        try {
            if (order.shippingAddress) {
                shippingAddress = JSON.parse(order.shippingAddress);
            }
        } catch (e) {
            console.error("Error parsing address JSON", e);
        }

        // 3. Send Email
        await sendEmail({
            to: order.customerEmail,
            subject: '¡Tu pedido ha sido enviado! - VRX Performance',
            html: getShippingConfirmationHtml({
                customerName: order.customerName || "Cliente",
                orderId: order.stripeSessionId,
                items: order.items,
                trackingNumber: trackingNumber,
                shippingAddress: shippingAddress
            })
        });

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error marking order as sent:", error);
        return { success: false, error: "Error al actualizar el pedido" };
    }
}
