"use client";

import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="w-72 bg-green-800 text-white min-h-screen">
            <div className="p-6 text-2xl font-bold">
                Donaton
            </div>
            <nav className="flex flex-col">
                <Link
                    className="px-6 py-4 hover:bg-green-700"
                    href="/dashboard"
                >
                    Dashboard
                </Link>
                <Link
                    className="px-6 py-4 hover:bg-green-700"
                    href="/campaigns"
                >
                    Campañas
                </Link>
                <Link
                    className="px-6 py-4 hover:bg-green-700"
                    href="/donations"
                >
                    Mis Donaciones
                </Link>
                <Link
                    className="px-6 py-4 hover:bg-green-700"
                    href="/profile"
                >
                    Mi Perfil
                </Link>
            </nav>
        </aside>
    );
}