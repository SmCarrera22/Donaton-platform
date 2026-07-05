"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-2xl font-bold text-green-700"
                >
                    Donaton
                </Link>
                <nav className="flex gap-6">
                    <Link href="/">
                        Inicio
                    </Link>
                    <Link href="/about-us">
                        Nosotros
                    </Link>
                    <Link href="/login">
                        Iniciar sesión
                    </Link>
                    <Link href="/register">
                        Registrarse
                    </Link>
                </nav>
            </div>
        </header>
    );
}