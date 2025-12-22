"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail, getConfirmationHtml } from "@/lib/email";

export async function createBooking(formData: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
        // Check if date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(formData.date);
        
        if (bookingDate < today) {
            return { success: false, error: "No se puede reservar en el pasado" };
        }

        // Check if it is weekend (Saturday=6, Sunday=0)
        const dayOfWeek = bookingDate.getUTCDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return { success: false, error: "Lo sentimos, no abrimos los fines de semana." };
        }

        // Check if date is blocked by Admin
        const blockedDate = await prisma.blockedDate.findUnique({
            where: { date: formData.date }
        });

        if (blockedDate) {
            return { success: false, error: "Lo sentimos, este día está cerrado." };
        }

        // Check availability (Double check)
        const existingBooking = await prisma.booking.findFirst({
            where: {
                date: formData.date,
                time: formData.time,
                status: { not: "cancelled" }
            }
        });

        if (existingBooking) {
            return { success: false, error: "Lo sentimos, esa hora ya no está disponible." };
        }

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
        // 0. Check Weekend
        const checkDate = new Date(date);
        const day = checkDate.getUTCDay();
        if (day === 0 || day === 6) {
             // Return ALL slots if weekend
             return ["ALL"]; 
        }

        // 1. Check if the date is fully blocked by Admin
        const blockedDate = await prisma.blockedDate.findUnique({
            where: { date: date }
        });

        if (blockedDate) {
            // Return ALL possible time slots
            return ["ALL"]; 
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
