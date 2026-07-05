"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        errors,
        statusMessage,
        isSubmitted,
        handleSubmit
    } = useLoginForm();

    return (
        <main className="min-h-screen bg-white">
            <a
                href="#login-form"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-blue-700 focus:outline focus:outline-2 focus:outline-blue-700"
            >
                Saltar al formulario de inicio de sesión
            </a>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-8 py-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    aria-label="Ir al inicio de Donaton"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">D</div>
                    <span className="text-xl font-bold tracking-tight text-gray-800">Donaton</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden gap-6 text-sm font-medium text-gray-600 md:flex">
                        <a href="/about-us" className="transition hover:text-blue-600 focus-visible:text-blue-600">
                            Acerca de Nosotros
                        </a>
                    </div>

                    <div className="flex items-center gap-3 border-l pl-6">
                        <span className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm" aria-current="page">
                            Iniciar sesión
                        </span>
                        <Link
                            href="/register"
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                            Registrarse
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Form Section */}
            <section className="relative bg-blue-600 px-6 py-16 text-white">
                <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start">
                    <div className="max-w-2xl pt-2 lg:w-1/2">
                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Heart className="text-yellow-400" size={28} fill="currentColor" aria-hidden="true" />
                        </div>
                        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Bienvenido a Donaton</h1>
                        <p className="mt-5 max-w-xl text-lg opacity-95">
                            Inicia sesión para acceder a tu cuenta, gestionar tus donaciones y ver el impacto de tu ayuda.
                        </p>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-2xl md:p-8">
                            <h2 className="text-2xl font-bold">Iniciar sesión</h2>
                            <p className="mt-2 text-sm text-gray-600">Usa tus credenciales de registro.</p>

                            <p
                                role="status"
                                aria-live="polite"
                                className={`mt-4 rounded-md border px-3 py-2 text-sm ${
                                    statusMessage
                                        ? isSubmitted
                                            ? "border-green-300 bg-green-50 text-green-800"
                                            : "border-red-300 bg-red-50 text-red-800"
                                        : "sr-only"
                                }`}
                            >
                                {statusMessage}
                            </p>

                            <form id="login-form" className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Correo electrónico</label>
                                    <input
                                        id="email" name="email" type="email" autoComplete="email" value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                        placeholder="tu.correo@ejemplo.com" required
                                    />
                                    {errors.email && (
                                        <p id="email-error" className="mt-1.5 text-sm font-medium text-red-700">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Contraseña</label>
                                    <input
                                        id="password" name="password" type="password" autoComplete="current-password" value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        aria-invalid={Boolean(errors.password)}
                                        aria-describedby={errors.password ? "password-error" : undefined}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                        placeholder="Tu contraseña" required
                                    />
                                    {errors.password && (
                                        <p id="password-error" className="mt-1.5 text-sm font-medium text-red-700">{errors.password}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                                    Iniciar sesión
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-gray-600">
                                ¿No tienes cuenta?{" "}
                                <Link
                                    href="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                                >
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}