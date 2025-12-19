import { ProductCard } from "@/components/store/ProductCard";
import { getProducts } from "@/lib/stripe-products";

export const dynamic = 'force-dynamic';

export default async function StorePage() {
    const products = await getProducts();

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 italic uppercase">Tienda <span className="text-primary">Performance</span></h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Componentes de alta calidad para llevar tu proyecto al siguiente nivel.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400 mb-4">No hay productos disponibles en este momento.</p>
                        <p className="text-sm text-gray-500">Asegúrate de haber creado productos en tu panel de Stripe.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
