"use client";

import Link from "next/link";
import { Home, User, HeartHandshake, FolderKanban } from "lucide-react";

const links = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: Home,
    },
    {
        href: "/campaigns",
        label: "Campañas",
        icon: FolderKanban,
    },
    {
        href: "/donations",
        label: "Donaciones",
        icon: HeartHandshake,
    },
    {
        href: "/profile",
        label: "Mi Perfil",
        icon: User,
    },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-sky-700 text-white flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-sky-600">
                <h1 className="text-2xl font-bold">Donaton</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-sky-600 transition"
                    >
                        <Icon size={20} />
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}