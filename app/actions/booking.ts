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
