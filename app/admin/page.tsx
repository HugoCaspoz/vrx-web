import { getBookings } from "@/app/actions/admin";
import { getOrders } from "@/app/actions/orders"; // Import fetcher
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const bookings = await getBookings();
    const orders = await getOrders(); // Fetch orders
    const blockedDates = await prisma.blockedDate.findMany({
        orderBy: { date: 'asc' }
    });

    return (
        <AdminDashboard bookings={bookings} blockedDates={blockedDates} orders={orders} user={session.user} />
    );
}
