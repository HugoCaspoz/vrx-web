"use client";

import { useState, useMemo } from "react";
import { BookingTable } from "./BookingTable";
import BlockedDatesManager from "./BlockedDatesManager";
import { Filter, Calendar } from "lucide-react";

interface AdminDashboardProps {
    bookings: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    blockedDates: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function AdminDashboard({ bookings: initialBookings, blockedDates, user }: AdminDashboardProps) {
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all"); // 'all', 'week', 'month', 'custom'
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const filteredBookings = useMemo(() => {
        return initialBookings.filter(booking => {
            // Status Filter
            if (statusFilter !== "all" && booking.status !== statusFilter) return false;

            // Date Filter
            const bookingDate = new Date(booking.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dateFilter === "week") {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                if (bookingDate < weekAgo) return false;
            } else if (dateFilter === "month") {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                if (bookingDate < monthAgo) return false;
            } else if (dateFilter === "custom") {
                if (customStart && bookingDate < new Date(customStart)) return false;
                if (customEnd && bookingDate > new Date(customEnd)) return false;
            }

            return true;
        });
    }, [initialBookings, statusFilter, dateFilter, customStart, customEnd]);

    const stats = useMemo(() => {
        return {
            total: filteredBookings.length,
            pending: filteredBookings.filter(b => b.status === "pending").length,
            revenue: filteredBookings
                .filter(b => b.status === "confirmed")
                .reduce((acc, b) => acc + (b.cost || 0), 0)
        };
    }, [filteredBookings]);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold italic">Panel de Control <span className="text-primary">VRX</span></h1>
                    <div className="text-sm text-gray-400">Hola, {user?.name}</div>
                </div>

                {/* Filter Controls */}
                <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 bg-zinc-900 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between gap-2 md:border-r md:border-white/10 md:pr-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-gray-400 uppercase">Filtros</span>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-black/50 text-sm border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-primary text-white"
                        >
                            <option value="all">Todos</option>
                            <option value="pending">Pendientes</option>
                            <option value="confirmed">Completadas</option>
                            <option value="cancelled">Canceladas</option>
                        </select>
                    </div>

                    <div className="hidden md:block h-6 w-px bg-white/10 mx-2" />

                    <div className="flex overflow-x-auto pb-1 md:pb-0 gap-1 no-scrollbar">
                        <button
                            onClick={() => setDateFilter("all")}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === "all" ? "bg-primary text-black font-bold" : "hover:bg-white/10 text-gray-400"}`}
                        >
                            Todo
                        </button>
                        <button
                            onClick={() => setDateFilter("week")}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === "week" ? "bg-primary text-black font-bold" : "hover:bg-white/10 text-gray-400"}`}
                        >
                            7 Días
                        </button>
                        <button
                            onClick={() => setDateFilter("month")}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === "month" ? "bg-primary text-black font-bold" : "hover:bg-white/10 text-gray-400"}`}
                        >
                            Mes
                        </button>
                        <button
                            onClick={() => setDateFilter(dateFilter === "custom" ? "all" : "custom")}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${dateFilter === "custom" ? "bg-primary text-black font-bold" : "hover:bg-white/10 text-gray-400"}`}
                        >
                            <Calendar className="w-4 h-4" /> Custom
                        </button>
                    </div>

                    {dateFilter === "custom" && (
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
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <BlockedDatesManager blockedDates={blockedDates} />
        </div>
    );
}
