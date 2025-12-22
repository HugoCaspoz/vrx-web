"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Car, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "date" | "time" | "details" | "confirmation";

const TIME_SLOTS = [
    "09:00", "10:30", "12:00", "15:00", "16:30", "18:00"
];

import { createBooking } from "@/app/actions/booking";

export function BookingForm() {
    const [step, setStep] = useState<Step>("date");
    // const [isSubmitting, setIsSubmitting] = useState(false);
    const [makes, setMakes] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [loadingMakes, setLoadingMakes] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    
    // Popular brands to show at the top
    const POPULAR_MAKES = ["BMW", "Audi", "Mercedes-Benz", "Volkswagen", "Porsche", "SEAT"];

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        carMake: "",
        carModel: "",
        carEngine: "",
        fuelType: "diesel",
        serviceType: "repro",
        name: "",
        phone: ""
    });

    useEffect(() => {
        const fetchMakes = async () => {
            setLoadingMakes(true);
            try {
                const response = await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json");
                const data = await response.json();
                const allMakes = data.Results.map((item: any) => item.MakeName.trim()); // eslint-disable-line @typescript-eslint/no-explicit-any
                
                // Filter and Sort: Popular first, then others alphabetically
                const otherMakes = [...new Set(allMakes)]
                    .filter((m: any) => !POPULAR_MAKES.includes(m)) // eslint-disable-line @typescript-eslint/no-explicit-any
                    .sort();
                
                setMakes([...POPULAR_MAKES, ...otherMakes] as string[]);
            } catch (error) {
                console.error("Error fetching makes:", error);
            } finally {
                setLoadingMakes(false);
            }
        };
        fetchMakes();
    }, []);

    const handleMakeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMake = e.target.value;
        setFormData({ ...formData, carMake: selectedMake, carModel: "" });
        setModels([]);

        if (selectedMake) {
            setLoadingModels(true);
            try {
                const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${selectedMake}?format=json`);
                const data = await response.json();
                const sortedModels = data.Results
                    .map((item: any) => item.Model_Name.trim()) // eslint-disable-line @typescript-eslint/no-explicit-any
                    .sort();
                 setModels([...new Set(sortedModels)] as string[]);
            } catch (error) {
                console.error("Error fetching models:", error);
            } finally {
                setLoadingModels(false);
            }
        }
    };

    const nextStep = (next: Step) => setStep(next);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setIsSubmitting(true);

        try {
            const result = await createBooking(formData);
            if (result.success) {
                nextStep("confirmation");
            } else {
                alert("Hubo un error al procesar tu reserva. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            // setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-secondary/50 p-6 md:p-8 min-h-[500px] flex flex-col">
            {/* Progress Steps */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                {["date", "time", "details"].map((s, i) => {
                    const isActive = step === s || (step === "time" && i === 0) || (step === "details" && i <= 1) || step === "confirmation";
                    return (
                        <div key={s} className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 bg-secondary border-2",
                            isActive ? "border-primary text-primary" : "border-white/20 text-gray-500"
                        )}>
                            {i + 1}
                        </div>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {step === "date" && (
                    <motion.div
                        key="date"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col gap-6"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-2 italic">
                            <Calendar className="text-primary" /> ELIGE UNA FECHA
                        </h2>
                        <input
                            type="date"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 h-[60px] text-white text-lg focus:border-primary outline-none transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            value={formData.date}
                        />
                        <div className="mt-auto flex justify-end">
                            <button
                                disabled={!formData.date}
                                onClick={() => nextStep("time")}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-colors uppercase"
                            >
                                Siguiente
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "time" && (
                    <motion.div
                        key="time"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col gap-6"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-2 italic">
                            <Clock className="text-primary" /> ELIGE UNA HORA
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            {TIME_SLOTS.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setFormData({ ...formData, time: slot })}
                                    className={cn(
                                        "p-3 rounded-lg border transition-all duration-200",
                                        formData.time === slot
                                            ? "bg-primary text-white border-primary font-bold shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                                            : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                                    )}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                        <div className="mt-auto flex justify-between">
                            <button onClick={() => setStep("date")} className="text-gray-400 hover:text-white uppercase font-bold text-sm">Atrás</button>
                            <button
                                disabled={!formData.time}
                                onClick={() => nextStep("details")}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-colors uppercase"
                            >
                                Siguiente
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "details" && (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col gap-6"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-2 italic">
                            <Car className="text-primary" /> DATOS DEL VEHÍCULO
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Marca</label>
                                    <select
                                        required
                                        value={formData.carMake}
                                        onChange={handleMakeChange}
                                        disabled={loadingMakes}
                                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white [&>option]:bg-black"
                                    >
                                        <option value="">Seleccionar</option>
                                        {loadingMakes ? (
                                            <option>Cargando...</option>
                                        ) : (
                                            makes.map((make) => (
                                                <option key={make} value={make}>{make}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Modelo</label>
                                    <select
                                        required
                                        value={formData.carModel}
                                        onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                                        disabled={!formData.carMake || loadingModels}
                                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white [&>option]:bg-black disabled:opacity-50"
                                    >
                                        <option value="">Seleccionar</option>
                                         {loadingModels ? (
                                            <option>Cargando...</option>
                                        ) : (
                                            models.map((model) => (
                                                <option key={model} value={model}>{model}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Motorización (Detalles)</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.carEngine}
                                    onChange={(e) => setFormData({ ...formData, carEngine: e.target.value })}
                                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    placeholder="Ej. 3.0 Biturbo 431CV"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Combustible</label>
                                    <select
                                        value={formData.fuelType}
                                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white [&>option]:bg-black"
                                    >
                                        <option value="diesel">Diésel</option>
                                        <option value="gasolina">Gasolina</option>
                                        <option value="hibrido">Híbrido</option>
                                        <option value="electrico">Eléctrico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tipo de Servicio</label>
                                    <select
                                        value={formData.serviceType}
                                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white [&>option]:bg-black"
                                    >
                                        <option value="repro">Reprogramación</option>
                                        <option value="banco">Banco de Potencia</option>
                                        <option value="mecanica">Mecánica / Piezas</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tu Nombre</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>


                            <div className="mt-6 flex justify-between items-center">
                                <button type="button" onClick={() => setStep("time")} className="text-gray-400 hover:text-white uppercase font-bold text-sm">Atrás</button>
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-black transition-colors flex items-center gap-2 uppercase"
                                >
                                    Confirmar Cita
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === "confirmation" && (
                    <motion.div
                        key="confirmation"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center py-10"
                    >
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2 italic">¡CITA CONFIRMADA!</h2>
                        <p className="text-gray-400 max-w-md mb-8">
                            Te esperamos el
                            <span className="text-white font-bold"> {formData.date}</span> a las
                            <span className="text-white font-bold"> {formData.time}</span> para trabajar en tu
                            <span className="text-primary font-bold"> {formData.carMake} {formData.carModel}</span>.
                        </p>
                        <button
                            onClick={() => {
                                setStep("date");
                                setFormData({ ...formData, date: "", time: "" });
                            }}
                            className="text-primary hover:underline underline-offset-4 uppercase font-bold text-sm"
                        >
                            Reservar otra cita
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
