import Link from "next/link";
import { ArrowRight, Gauge, Wrench, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 animate-fade-in relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-up">
          <Zap className="w-4 h-4" /> Especialistas en Stage 1, 2 y 3
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 italic uppercase">
          Potencia tu <span className="text-primary">Motor</span>
        </h1>
        <p className="max-w-[700px] text-gray-400 text-lg md:text-xl mb-8">
          Reprogramación de centralitas, mecánica de alto rendimiento y banco de potencia.
          Saca el máximo partido a tu vehículo con VRX Performance.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md md:max-w-none justify-center">
          <Link
            href="/booking"
            className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] uppercase tracking-wide"
          >
            Pedir Cita
            <Wrench className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </Link>
          <Link
            href="/store"
            className="group flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 px-8 py-3 rounded-full font-bold transition-all duration-300 uppercase tracking-wide"
          >
            Tienda Performance
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="w-full max-w-6xl px-4 grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-secondary/50 p-8 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group backdrop-blur-sm">
          <Gauge className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2 italic">REPROGRAMACIONES</h2>
          <p className="text-gray-400 mb-6">
            Optimizamos la electrónica de tu coche para ganar potencia y reducir consumo. Stage 1, 2 y 3 personalizadas.
          </p>
          <Link href="/booking" className="text-primary flex items-center gap-2 text-sm font-bold uppercase group-hover:translate-x-1 transition-transform">
            Ver Opciones <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-secondary/50 p-8 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group backdrop-blur-sm">
          <Wrench className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2 italic">MECÁNICA SPORT</h2>
          <p className="text-gray-400 mb-6">
            Instalación de downpipes, intercoolers, suspensiones y frenos deportivos. Mantenimiento premium.
          </p>
          <Link href="/booking" className="text-primary flex items-center gap-2 text-sm font-bold uppercase group-hover:translate-x-1 transition-transform">
            Pedir Presupuesto <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-secondary/50 p-8 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group backdrop-blur-sm">
          <Zap className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2 italic">PIEZAS PERFORMANCE</h2>
          <p className="text-gray-400 mb-6">
            Tienda oficial de las mejores marcas: Brembo, Akrapovic, Eventuri, KW y más.
          </p>
          <Link href="/store" className="text-primary flex items-center gap-2 text-sm font-bold uppercase group-hover:translate-x-1 transition-transform">
            Ir a la Tienda <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
