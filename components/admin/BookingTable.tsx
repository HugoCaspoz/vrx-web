"use client";

import { useState } from "react";
import { Calendar, User, Wrench, Filter, X, Edit } from "lucide-react";
import { EditBookingModal } from "@/components/admin/EditBookingModal";

export function BookingTable({ bookings }: { bookings: any[] }) {
    const [editingBooking, setEditingBooking] = useState<any>(null);

    return (
        <div className="bg-zinc-900 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="text-primary" /> Gestión de Reservas
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">Vehículo</th>
                            <th className="p-4">Servicio</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Coste</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4">Editar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold">{booking.carMake} {booking.carModel}</div>
                                    <div className="text-xs text-gray-500">{booking.carEngine}</div>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                                        <Wrench className="w-3 h-3" /> {booking.serviceType}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {booking.date} <span className="text-gray-500">at</span> {booking.time}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <div>{booking.userName}</div>
                                            <div className="text-xs text-gray-500">{booking.userPhone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-bold">
                                    {booking.cost ? `${booking.cost}€` : '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500 border-green-500/20' :
                                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                                            'bg-yellow-500/20 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {booking.status === 'confirmed' ? 'Completado' : booking.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => setEditingBooking(booking)}
                                        className="p-2 text-gray-400 hover:text-primary hover:bg-white/10 rounded transition-colors"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-gray-500 bg-white/5">
                                    No se encontraron reservas con estos filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingBooking && (
                <EditBookingModal
                    booking={editingBooking}
                    onClose={() => setEditingBooking(null)}
                />
            )}
        </div>
    );
}
