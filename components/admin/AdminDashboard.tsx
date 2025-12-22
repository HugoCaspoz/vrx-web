
"use client";

import { useState, useMemo } from "react";
import { BookingTable } from "./BookingTable";
import BlockedDatesManager from "./BlockedDatesManager";
import OrderTable from "./OrderTable"; // Import component
import { Filter, Calendar, LayoutGrid, Package } from "lucide-react";

interface AdminDashboardProps {
    bookings: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    blockedDates: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    orders: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function AdminDashboard({ bookings: initialBookings, blockedDates, orders, user }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<"bookings" | "orders">("bookings");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all"); // 'all', 'week', 'month', 'custom'
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const filteredBookings = useMemo(() => {
        let result = initialBookings;

        // 1. Status Filter
        if (statusFilter !== "all") {
            result = result.filter(b => b.status === statusFilter);
        }

        // 2. Date Filter
        const now = new Date();
        now.setHours(0,0,0,0);

        if (dateFilter === 'today') {
           const todayStr = now.toISOString().split('T')[0];
           result = result.filter(b => b.date === todayStr);
        } else if (dateFilter === 'week') {
            const nextWeek = new Date(now);
            nextWeek.setDate(now.getDate() + 7);
            result = result.filter(b => {
                const bDate = new Date(b.date);
                return bDate >= now && bDate <= nextWeek;
            });
        } else if (dateFilter === 'month') {
             const nextMonth = new Date(now);
             nextMonth.setMonth(now.getMonth() + 1);
             result = result.filter(b => {
                const bDate = new Date(b.date);
                return bDate >= now && bDate <= nextMonth;
             });
        } else if (dateFilter === 'custom' && customStart && customEnd) {
             const start = new Date(customStart);
             const end = new Date(customEnd);
             result = result.filter(b => {
                const bDate = new Date(b.date);
                return bDate >= start && bDate <= end;
             });
        }

        return result;
    }, [initialBookings, statusFilter, dateFilter, customStart, customEnd]);

    // Calculate Stats
    const stats = useMemo(() => {
        const completed = filteredBookings.filter(b => b.status === 'completed').length;
        const pending = filteredBookings.filter(b => b.status === 'pending').length;
        const revenue = filteredBookings
            .filter(b => b.status === 'completed')
            .reduce((acc, curr) => acc + (curr.cost || 0), 0);
        
        return { completed, pending, revenue };
    }, [filteredBookings]);

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-10">
                <div>
                    {dateFilter === 'custom' && (
                        <div className="flex items-center gap-2 ml-2 animate-in fade-in slide-in-from-right-4">
                            <input
                                type="date"
                                value={customStart}
                                onChange={e => setCustomStart(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg px-2 py-2 text-xs outline-none focus:border-primary"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={e => setCustomEnd(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg px-2 py-2 text-xs outline-none focus:border-primary"
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-2">Reservas (Selección)</h3>
                    <p className="text-4xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-2">Pendientes</h3>
                    <p className="text-4xl font-bold text-primary">{stats.pending}</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-2">Ingresos Totales</h3>
                    <p className="text-4xl font-bold text-green-500">{stats.revenue.toFixed(2)}€</p>
                </div>
            </div>

            {/* Table */}
            <BookingTable bookings={filteredBookings} />

            {/* Availability Manager */}
            <BlockedDatesManager blockedDates={blockedDates} />
        </div>
    );
}
