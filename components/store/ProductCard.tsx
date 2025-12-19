"use client";

import { Product, useShop } from "@/context/ShopContext";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useShop();

    return (
        <div className="bg-secondary/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
            <div className="relative aspect-square bg-white/5 p-8 flex items-center justify-center">
                {product.image ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                ) : (
                    <div className="text-secondary-foreground/20 text-6xl font-bold uppercase tracking-widest">{product.name.substring(0, 2)}</div>
                )}

                <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-primary text-black p-3 rounded-full translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-white"
                >
                    <ShoppingCart className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6">
                <h3 className="tex-xl font-bold mb-1">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price.toFixed(2)}€</span>
                </div>
            </div>
        </div>
    );
}
