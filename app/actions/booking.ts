"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
                status: "pending",
            },
        });

        revalidatePath("/admin");
        return { success: true, bookingId: booking.id };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: "Error al crear la reserva" };
    }
}

export async function getUnavailableTimes(date: string) {
    try {
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
