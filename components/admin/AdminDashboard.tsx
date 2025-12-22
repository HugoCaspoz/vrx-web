
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
                    <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
                    <p className="text-gray-400">Bienvenido, {user?.name || "Admin"}</p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
                    <button 
                        onClick={() => setActiveTab("bookings")}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "bookings" ? "bg-primary text-black" : "text-gray-400 hover:text-white"}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Reservas
                    </button>
                    <button 
                        onClick={() => setActiveTab("orders")}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "orders" ? "bg-primary text-black" : "text-gray-400 hover:text-white"}`}
                    >
                        <Package className="w-4 h-4" /> Pedidos
                    </button>
                </div>
            </header>

            {activeTab === "bookings" && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                            <h3 className="text-gray-400 text-sm mb-2">Reservas Pendientes</h3>
                            <p className="text-4xl font-bold text-white">{stats.pending}</p>
                        </div>
                        <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                            <h3 className="text-gray-400 text-sm mb-2">Reservas Completadas</h3>
                            <p className="text-4xl font-bold text-white">{stats.completed}</p>
                        </div>
                        <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                            <h3 className="text-gray-400 text-sm mb-2">Ingresos Totales (Filtrados)</h3>
                            <p className="text-4xl font-bold text-green-500">{stats.revenue.toFixed(2)}€</p>
                        </div>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="flex flex-wrap gap-4 mb-6 bg-zinc-900/50 p-4 rounded-xl border border-white/5 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-gray-300">Estado:</span>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-black border border-white/10 rounded px-3 py-1 text-sm focus:border-primary outline-none"
                            >
                                <option value="all">Todos</option>
                                <option value="pending">Pendientes</option>
                                <option value="confirmed">Confirmados</option>
                                <option value="completed">Completados</option>
                                <option value="cancelled">Cancelados</option>
                            </select>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-gray-300">Fecha:</span>
                            <div className="flex gap-2">
                                {[
                                    { label: "Todas", val: "all" },
                                    { label: "Hoy", val: "today" },
                                    { label: "Semana", val: "week" },
                                    { label: "Mes", val: "month" },
                                    { label: "Rango", val: "custom" },
                                ].map((opt) => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setDateFilter(opt.val)}
                                        className={`px-3 py-1 rounded text-xs border ${dateFilter === opt.val ? "bg-white text-black border-white" : "border-white/10 text-gray-400 hover:border-white/30"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {dateFilter === 'custom' && (
                            <div className="flex items-center gap-2 ml-auto animate-in fade-in zoom-in duration-300">
                                <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="bg-black border border-white/10 rounded px-2 py-1 text-xs" />
                                <span className="text-gray-500">-</span>
                                <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="bg-black border border-white/10 rounded px-2 py-1 text-xs" />
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <BookingTable bookings={filteredBookings} />

                    {/* Availability Manager */}
                    <BlockedDatesManager blockedDates={blockedDates} />
                </>
            )}

            {activeTab === "orders" && (
                <OrderTable orders={orders} />
            )}
        </div>
    );
}
