
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
