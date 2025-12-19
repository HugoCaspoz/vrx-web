"use client";

import { useShop } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";

export function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, cartTotal } = useShop();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-secondary border-l border-white/10 z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" /> Tu Cesta
                            </h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
                                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Tu cesta está vacía</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold uppercase relative overflow-hidden">
                                            {item.image ? (
                                                <div className="relative w-full h-full">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                item.name.substring(0, 2)
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm">{item.name}</h4>
                                            <div className="text-primary text-sm font-semibold">
                                                {item.price.toFixed(2)}€ x {item.quantity}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-400">Total</span>
                                    <span className="text-2xl font-bold text-primary">{cartTotal.toFixed(2)}€</span>
                                </div>
                                <button
                                    onClick={async () => {
                                        const { createCheckoutSession } = await import("@/lib/payments");
                                        const res = await createCheckoutSession(cart);
                                        if (res?.url) window.location.href = res.url;
                                    }}
                                    className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-wide"
                                >
                                    TRAMITAR PEDIDO (STRIPE)
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
