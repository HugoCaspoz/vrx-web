"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function blockDate(date: string, reason?: string) {
    try {
        await prisma.blockedDate.create({
            data: {
                date,
                reason: reason || "Cerrado"
            }
        });
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error blocking date:", error);
        return { success: false, error: "Error al bloquear la fecha" };
    }
}

export async function unblockDate(id: string) {
    try {
        await prisma.blockedDate.delete({
            where: { id }
        });
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error unblocking date:", error);
        return { success: false, error: "Error al desbloquear la fecha" };
    }
}
