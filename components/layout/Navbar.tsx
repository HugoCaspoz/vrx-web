"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export function Navbar() {
    const { toggleCart, cartCount } = useShop();

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-primary italic">
                    VRX <span className="text-white not-italic">PERFORMANCE</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/booking" className="text-sm font-medium hover:text-primary transition-colors">
                        Reservar
                    </Link>
                    <Link href="/store" className="text-sm font-medium hover:text-primary transition-colors">
                        Tienda
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        Nosotros
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-accent/10 rounded-full transition-colors relative"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 text-[10px] flex items-center justify-center bg-primary text-black font-bold rounded-full translate-x-1 -translate-y-1">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button className="md:hidden p-2 hover:bg-accent/10 rounded-full transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
