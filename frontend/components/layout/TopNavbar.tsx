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
                <h2 className="text-xl font-semibold">
                    Panel de Control
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="rounded-lg p-2 hover:bg-slate-100">
                    <Bell size={20} />
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-100"
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}