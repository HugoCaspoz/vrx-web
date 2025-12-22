"use client";

import { useState } from "react";
import { blockDate, unblockDate } from "@/app/actions/admin-availability";

interface BlockedDatesManagerProps {
    blockedDates: { id: string; date: string; reason: string | null }[];
}

export default function BlockedDatesManager({ blockedDates }: BlockedDatesManagerProps) {
    const [date, setDate] = useState("");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;
        setIsSubmitting(true);
        await blockDate(date, reason);
        setIsSubmitting(false);
        setDate("");
        setReason("");
    };

    const handleUnblock = async (id: string) => {
        if (!confirm("¿Desbloquear fecha?")) return;
        await unblockDate(id);
    };

    return (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-8">
            <h2 className="text-xl font-bold mb-4">Gestión de Cierres y Festivos</h2>
            
            <form onSubmit={handleBlock} className="flex gap-4 mb-6 items-end">
                <div>
                    <label className="block text-sm mb-1 text-gray-400">Fecha a bloquear</label>
                    <input 
                        type="date" 
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded p-2 text-white"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm mb-1 text-gray-400">Motivo (Opcional)</label>
                    <input 
                        type="text" 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ej: Vacaciones"
                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                    />
                </div>
                <button 
                    disabled={isSubmitting}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                    {isSubmitting ? "Bloqueando..." : "Bloquear Día"}
                </button>
            </form>

            <div className="space-y-2">
                {blockedDates.length === 0 && <p className="text-gray-500">No hay fechas bloqueadas.</p>}
                {blockedDates.map((block) => (
                    <div key={block.id} className="flex items-center justify-between bg-white/5 p-3 rounded hover:bg-white/10 transition">
                        <div>
                            <span className="font-bold mr-4">{new Date(block.date).toLocaleDateString()}</span>
                            <span className="text-gray-400 text-sm">{block.reason || "Cerrado"}</span>
                        </div>
                        <button 
                            onClick={() => handleUnblock(block.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                        >
                            Desbloquear
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
