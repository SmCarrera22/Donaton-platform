"use client";

import {
    LayoutDashboard,
    HeartHandshake,
    HandCoins,
    User,
} from "lucide-react";

import MenuItem from "./MenuItem";

export default function Sidebar() {
    return (
        <aside className="w-64 border-r bg-white h-screen sticky top-0 flex flex-col">

            <div className="border-b p-6">

                <h1 className="text-2xl font-bold text-sky-700">
                    Donaton
                </h1>

                <p className="text-sm text-slate-500">
                    Panel de usuario
                </p>

            </div>

            <nav className="flex-1 space-y-2 p-4">

                <MenuItem
                    href="/dashboard"
                    icon={<LayoutDashboard size={20} />}
                >
                    Dashboard
                </MenuItem>

                <MenuItem
                    href="/campaigns"
                    icon={<HeartHandshake size={20} />}
                >
                    Campañas
                </MenuItem>

                <MenuItem
                    href="/donations"
                    icon={<HandCoins size={20} />}
                >
                    Mis Donaciones
                </MenuItem>

                <MenuItem
                    href="/profile"
                    icon={<User size={20} />}
                >
                    Mi Perfil
                </MenuItem>

            </nav>

        </aside>
    );
}