"use client";

import { Bell, LogOut } from "lucide-react";

export default function TopNavbar() {
    return (
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-gray-800">
                    Panel de Control
                </h2>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative">
                    <Bell className="text-gray-600" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold">
                        S
                    </div>

                    <button className="flex items-center gap-2 text-red-600 hover:text-red-700">
                        <LogOut size={18} />
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
}