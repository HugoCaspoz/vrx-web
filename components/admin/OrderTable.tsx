"use client";

import { useState } from "react";
import { markOrderAsSent } from "@/app/actions/orders";
import { Package, Truck, CheckCircle } from "lucide-react";

interface OrderTableProps {
    orders: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function OrderTable({ orders }: OrderTableProps) {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleMarkAsSent = async (orderId: string) => {
        if (!confirm("¿Marcar pedido como enviado y notificar al cliente?")) return;
        
        const tracking = prompt("Introduce número de seguimiento (Opcional):");
        
        setUpdatingId(orderId);
        await markOrderAsSent(orderId, tracking || undefined);
        setUpdatingId(null);
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-10 bg-zinc-900 rounded-xl border border-white/5 mt-8">
                <Package className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No hay pedidos registrados aún.</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="text-primary" /> Pedidos Tienda
            </h2>
            <div className="bg-zinc-900 rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-xs uppercase bg-black/20">
                            <th className="p-4">ID / Cliente</th>
                            <th className="p-4">Productos</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-white">#{order.stripeSessionId.slice(-6)}</div>
                                    <div className="text-gray-400">{order.customerName}</div>
                                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                    <div className="text-xs text-gray-600 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="p-4">
                                    <ul className="space-y-1">
                                    {order.items.map((item: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                        <li key={item.id} className="text-gray-300">
                                            {item.quantity}x {item.name}
                                        </li>
                                    ))}
                                    </ul>
                                </td>
                                <td className="p-4 font-bold">
                                    {order.totalAmount.toFixed(2)}€
                                </td>
                                <td className="p-4">
                                    {order.status === "paid" && (
                                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs border border-yellow-500/20">
                                            Pagado (Pendiente Envío)
                                        </span>
                                    )}
                                    {order.status === "sent" && (
                                        <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs border border-green-500/20 flex items-center gap-1 w-fit">
                                            <CheckCircle className="w-3 h-3" /> Enviado
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {order.status === "paid" && (
                                        <button
                                            disabled={updatingId === order.id}
                                            onClick={() => handleMarkAsSent(order.id)}
                                            className="bg-primary hover:bg-white text-black text-xs font-bold px-3 py-2 rounded transition flex items-center gap-2 ml-auto disabled:opacity-50"
                                        >
                                            {updatingId === order.id ? "Procesando..." : (
                                                <>
                                                    <Truck className="w-3 h-3" /> Marcar Enviado
                                                </>
                                            )}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
