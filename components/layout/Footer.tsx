import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground py-12 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary italic">VRX PERFORMANCE</h3>
                        <p className="text-sm text-gray-400">
                            Expertos en electrónica, reprogramaciones y mecánica de alto rendimiento.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/booking" className="hover:text-primary">Reservas</Link></li>
                            <li><Link href="/store" className="hover:text-primary">Tienda</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contacto</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Calle Ejemplo 123</li>
                            <li>Madrid, España</li>
                            <li>info@vrx.com</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} VRX. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
