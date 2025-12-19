import { getBookings } from "@/app/actions/admin";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const bookings = await getBookings();

    return (
        <AdminDashboard bookings={bookings} user={session.user} />
    );
}
