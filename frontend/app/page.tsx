// app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { UserCircle, LogIn, LogOut, Heart } from "lucide-react";
import { useHomeSession } from "@/hooks/useHomeSession";

export default function HomePage() {
    const { loggedInUser, handleLogout } = useHomeSession();

    return (
        <main className="min-h-screen bg-white">
            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-8 py-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                        D
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-800">Donaton</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden gap-6 text-sm font-medium text-gray-600 md:flex">
                        <a href="/about-us" className="transition hover:text-blue-600">
                            Acerca de Nosotros
                        </a>
                    </div>

                    <div className="flex items-center gap-3 border-l pl-6">
                        {!loggedInUser ? (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                >
                                    <LogIn size={18} />
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                >
                                    <UserCircle size={18} />
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">
                                    Hola, {loggedInUser.fullName}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                                >
                                    <LogOut size={18} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            {loggedInUser ? (
                /* HERO USUARIO LOGUEADO */
                <section className="relative bg-blue-600 px-6 py-20 text-white">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Heart
                                className="text-yellow-400"
                                size={32}
                                fill="currentColor"
                                aria-hidden="true"
                            />
                        </div>
                        <h1 className="mb-4 text-4xl font-extrabold">¡Hola de nuevo, Donante!</h1>
                        <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
                            Tu compromiso hace la diferencia. Estas son las campañas activas donde tu ayuda es
                            vital hoy mismo.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="rounded-xl bg-yellow-400 px-8 py-3 font-bold text-blue-900 shadow-lg transition hover:bg-yellow-300">
                                Gestionar Donación
                            </button>
                            <button className="rounded-xl border-2 border-white/40 px-8 py-3 font-bold transition hover:bg-white/10">
                                Mi Impacto Social
                            </button>
                        </div>
                    </div>
                </section>
            ) : (
                /* HERO USUARIO VISITANTE */
                <section className="relative bg-blue-600 px-6 py-24 text-white">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="mb-4 text-5xl font-extrabold leading-tight">
                            Transforma tu intención <br /> en ayuda real
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
                            Únete a la red de Donaton. Regístrate para gestionar tus donaciones y hacer
                            seguimiento del impacto de tu ayuda.
                        </p>
                        <Link
                            href="/register"
                            className="inline-block rounded-full bg-yellow-400 px-10 py-4 text-lg font-bold text-blue-900 shadow-xl transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                        >
                            Comenzar a ayudar
                        </Link>
                    </div>
                </section>
            )}

            {/* SECCIÓN DE CATEGORÍAS */}
            <section className="mx-auto max-w-6xl px-6 py-16">
                <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">¿Cómo puedes ayudar?</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="rounded-xl border p-6 text-center transition hover:shadow-lg">
                        <div className="mb-4 text-4xl">🍎</div>
                        <h3 className="mb-2 text-xl font-bold text-black">Alimentos</h3>
                        <p className="text-gray-950">Productos no perecederos y canastas básicas.</p>
                    </div>
                    <div className="rounded-xl border p-6 text-center transition hover:shadow-lg">
                        <div className="mb-4 text-4xl">👕</div>
                        <h3 className="mb-2 text-xl font-bold text-black">Ropa y Abrigo</h3>
                        <p className="text-gray-950">Prendas en buen estado para zonas vulnerables.</p>
                    </div>
                    <div className="rounded-xl border p-6 text-center transition hover:shadow-lg">
                        <div className="mb-4 text-4xl">⚕️</div>
                        <h3 className="mb-2 text-xl font-bold text-black">Insumos Médicos</h3>
                        <p className="text-gray-950">Medicinas y equipos de salud.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}