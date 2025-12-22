import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, getReminderHtml } from '@/lib/email';

export async function GET(request: Request) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow unauthenticated local testing if needed, or enforce strictly in prod
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Calculate "Tomorrow" date string YYYY-MM-DD
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];

        const bookings = await prisma.booking.findMany({
            where: {
                date: dateString,
                status: { not: 'cancelled' },
                userEmail: { not: null }
            }
        });

        const results = [];

        for (const booking of bookings) {
            if (booking.userEmail) {
                const result = await sendEmail({
                    to: booking.userEmail,
                    subject: 'Recordatorio de Cita Mañana - VRX Performance',
                    html: getReminderHtml(booking)
                });
                results.push({ id: booking.id, email: booking.userEmail, status: result.success ? 'sent' : 'failed' });
            }
        }

        return NextResponse.json({ success: true, count: bookings.length, results });
    } catch (error) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
