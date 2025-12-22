
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

interface EmailProps {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return { success: false, error: "Missing API Key" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'VRX Performance <onboarding@resend.dev>', // Use onboarding domain for testing
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email Sending Error:", error);
        return { success: false, error };
    }
}


interface EmailBookingDetails {
    userName?: string; // For reminder
    name?: string; // For confirmation (formData)
    date: string;
    time: string;
    carMake: string;
    carModel: string;
    carEngine?: string;
    serviceType?: string;
}

const serviceNames: Record<string, string> = {
    repro: "Reprogramación de Software",
    banco: "Prueba en Banco de Potencia",
    mecanica: "Mecánica General",
    mantenimiento: "Mantenimiento / Revisión",
    diagnosis: "Diagnosis Avanzada"
};

export function getConfirmationHtml(booking: EmailBookingDetails) {
    const serviceName = serviceNames[booking.serviceType || ""] || booking.serviceType;

    return `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #333; text-align: center;">¡Reserva Confirmada!</h1>
                <p>Hola <strong>${booking.name || booking.userName}</strong>,</p>
                <p>Tu cita en <strong>VRX Performance</strong> ha sido confirmada con éxito.</p>
                
                <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Fecha:</strong> ${booking.date}</p>
                    <p style="margin: 5px 0;"><strong>Hora:</strong> ${booking.time}</p>
                    <p style="margin: 5px 0;"><strong>Vehículo:</strong> ${booking.carMake} ${booking.carModel}</p>
                    <p style="margin: 5px 0;"><strong>Motor:</strong> ${booking.carEngine}</p>
                    <p style="margin: 5px 0;"><strong>Servicio:</strong> ${serviceName}</p>
                </div>

                <p>Si necesitas modificar o cancelar tu cita, por favor contáctanos lo antes posible.</p>
                <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">&copy; VRX Performance</p>
            </div>
        </div>
    `;
}

export function getReminderHtml(booking: EmailBookingDetails) {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #d9534f; text-align: center;">Recordatorio de Cita</h1>
                <p>Hola <strong>${booking.userName}</strong>,</p>
                <p>Te recordamos que tienes una cita mañana en <strong>VRX Performance</strong>.</p>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #ffc107;">
                    <p style="margin: 5px 0;"><strong>Fecha:</strong> ${booking.date}</p>
                    <p style="margin: 5px 0;"><strong>Hora:</strong> ${booking.time}</p>
                    <p style="margin: 5px 0;"><strong>Vehículo:</strong> ${booking.carMake} ${booking.carModel}</p>
                </div>

                <p>¡Te esperamos!</p>
                <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">&copy; VRX Performance</p>
            </div>
        </div>
    `;
}

interface OrderItem {
    name: string;
    quantity: number;
    price: number; // Renamed from amount to match Prisma
}

interface OrderDetails {
    orderId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress?: {
        line1: string;
        line2?: string | null;
        city: string;
        postal_code: string;
    };
    items: OrderItem[];
    total: number;
}

export function getOrderConfirmationHtml(order: OrderDetails) {
    const itemsHtml = order.items.map(item => `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p style="margin: 0; font-weight: bold;">${item.name}</p>
            <p style="margin: 0; font-size: 14px; color: #555;">Cantidad: ${item.quantity} - ${(item.price).toFixed(2)}€</p>
        </div>
    `).join('');

    const addressHtml = order.shippingAddress ? `
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Dirección de Envío:</p>
            <p style="margin: 0;">${order.shippingAddress.line1}</p>
            ${order.shippingAddress.line2 ? `<p style="margin: 0;">${order.shippingAddress.line2}</p>` : ''}
            <p style="margin: 0;">${order.shippingAddress.postal_code}, ${order.shippingAddress.city}</p>
        </div>
    ` : '';

    return `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #333; text-align: center;">¡Pedido Recibido!</h1>
                <p>Hola <strong>${order.customerName}</strong>,</p>
                <p>Gracias por tu compra en <strong>VRX Performance</strong>. Estamos preparando tu pedido.</p>
                
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Detalles del Pedido #${order.orderId.slice(-6)}</h3>
                
                ${itemsHtml}
                
                <div style="text-align: right; margin-top: 20px; font-size: 18px;">
                    <strong>Total: ${order.total.toFixed(2)}€</strong>
                </div>

                ${addressHtml}

                <p style="margin-top: 30px;">Recibirás otro correo cuando tu pedido haya sido enviado.</p>
                <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">&copy; VRX Performance</p>
            </div>
        </div>
    `;
}

interface ShippingConfirmationDetails {
    customerName: string;
    orderId: string;
    trackingNumber?: string;
    items: OrderItem[];
    shippingAddress: {
        line1: string;
        line2?: string | null;
        city: string;
        postal_code: string;
    } | null;
}

export function getShippingConfirmationHtml(details: ShippingConfirmationDetails) {
    const itemsHtml = details.items.map(item => `
        <li style="margin-bottom: 5px;">${item.name} (x${item.quantity})</li>
    `).join('');

    const addressHtml = details.shippingAddress ? `
        <p style="margin-bottom: 5px;"><strong>Dirección de entrega:</strong></p>
        <p style="margin: 0;">${details.shippingAddress.line1}</p>
        ${details.shippingAddress.line2 ? `<p style="margin: 0;">${details.shippingAddress.line2}</p>` : ''}
        <p style="margin: 0;">${details.shippingAddress.postal_code}, ${details.shippingAddress.city}</p>
    ` : '';

    return `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #28a745; text-align: center;">¡Tu pedido ha sido enviado!</h1>
                <p>Hola <strong>${details.customerName}</strong>,</p>
                <p>Tu pedido <strong>#${details.orderId.slice(-6)}</strong> ha salido de nuestras instalaciones.</p>
                
                ${details.trackingNumber ? `
                    <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #28a745;">
                        <p style="margin: 0; font-weight: bold;">Número de Seguimiento:</p>
                        <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 16px;">${details.trackingNumber}</p>
                    </div>
                ` : ''}

                <div style="margin: 20px 0;">
                    <h3>Productos enviados:</h3>
                    <ul>
                        ${itemsHtml}
                    </ul>
                </div>

                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
                    ${addressHtml}
                </div>

                <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">&copy; VRX Performance</p>
            </div>
        </div>
    `;
}
