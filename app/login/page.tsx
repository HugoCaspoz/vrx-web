"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result?.error) {
            setError("Credenciales inválidas");
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-md p-8 rounded-lg border border-white/10 bg-zinc-900">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">VRX Admin</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Usuario</label>
                        <input name="username" type="text" className="w-full bg-black border border-white/10 rounded p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
                        <input name="password" type="password" className="w-full bg-black border border-white/10 rounded p-2 text-white" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-primary text-black font-bold py-2 rounded hover:bg-white transition-colors">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
