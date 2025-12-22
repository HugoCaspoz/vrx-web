"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail, getConfirmationHtml } from "@/lib/email";

export async function createBooking(formData: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
        const booking = await prisma.booking.create({
            data: {
                date: formData.date,
                time: formData.time,
                carMake: formData.carMake,
                carModel: formData.carModel,
                carEngine: formData.carEngine,
                fuelType: formData.carEngine.toLowerCase().includes("diésel") || formData.carEngine.toLowerCase().includes("diesel") ? "diesel" : "gasolina",
                serviceType: formData.serviceType,
                userName: formData.name,
                userPhone: formData.phone,
                userEmail: formData.email,
                status: "pending",
            },
        });

        revalidatePath("/admin");

        // Send Confirmation Email
        if (formData.email) {
            await sendEmail({
                to: formData.email,
                subject: 'Confirmación de Reserva - VRX Performance',
                html: getConfirmationHtml({ ...formData, ...booking, date: formData.date, time: formData.time })
            });
        }

        return { success: true, bookingId: booking.id };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: "Error al crear la reserva" };
    }
}

export async function getUnavailableTimes(date: string) {
    try {
        // 1. Check if the date is fully blocked by Admin
        const blockedDate = await prisma.blockedDate.findUnique({
            where: { date: date }
        });

        if (blockedDate) {
            // Return ALL possible time slots to disable everything (or handle in UI with a specific flag)
            // For now, returning a list of all hours usually available in the frontend ensures they are disabled
            return [
                "09:00", "10:00", "11:00", "12:00", "13:00", 
                "15:00", "16:00", "17:00", "18:00"
            ]; 
        }

        // 2. Check existing bookings
        const bookings = await prisma.booking.findMany({
            where: {
                date: date,
                status: {
                    not: "cancelled"
                }
            },
            select: {
                time: true
            }
        });

        return bookings.map(b => b.time);
    } catch (error) {
        console.error("Error fetching unavailable times:", error);
        return [];
    }
}
