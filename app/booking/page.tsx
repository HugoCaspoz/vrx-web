import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { BookingForm } from "@/components/booking/BookingForm";

export default function BookingPage() {
    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Reserva tu Experiencia</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Selecciona tu fecha y hora preferida para sumergirte en mundos virtuales.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-secondary/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <BookingForm />
            </div>
        </div>
    );
}
