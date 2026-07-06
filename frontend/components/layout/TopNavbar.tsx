"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/session";

export default function TopNavbar() {
    const router = useRouter();

    const handleLogout = () => {
        clearSession();
        router.push("/login");
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900">
                    Panel de Control
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="rounded-lg border border-slate-300 p-2 text-slate-900 transition hover:bg-slate-100"
                    aria-label="Notificaciones"
                >
                    <Bell size={20} />
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700"
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}