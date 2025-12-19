"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { updateBooking } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface Booking {
    id: string;
    date: string;
    status: string;
    cost: number | null;
    carMake: string;
}

export function EditBookingModal({ booking, onClose }: { booking: Booking, onClose: () => void }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: booking.date,
        status: booking.status,
        cost: booking.cost || 0
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting booking update:", formData);
        setLoading(true);

        try {
            const result = await updateBooking(booking.id, formData);
            if (result && result.success) {
                console.log("Update success, refreshing...");
                router.refresh();
                onClose();
            } else {
                console.error("Update failed:", result);
                alert("Error al actualizar: " + (result?.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Critical error:", error);
            alert("Error crítico al contactar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-1 italic">Editar Reserva</h2>
                <p className="text-gray-400 text-sm mb-6">{booking.carMake} - ID: {booking.id.slice(0, 8)}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Fecha</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Estado</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none [&>option]:bg-black"
                        >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Precio Cobrado (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.cost}
                            onChange={e => {
                                const val = parseFloat(e.target.value);
                                setFormData({ ...formData, cost: isNaN(val) ? 0 : val });
                            }}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? "Guardando..." : (
                            <><Save className="w-4 h-4" /> Guardar Cambios</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
