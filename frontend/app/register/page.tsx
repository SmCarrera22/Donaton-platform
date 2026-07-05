"use client";

import Link from "next/link";
import { Heart, UserCircle } from "lucide-react";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export default function RegisterPage() {
    const { formData, errors, statusMessage, isSubmitted, handleChange, handleSubmit } = useRegisterForm();

    return (
        <main className="min-h-screen bg-white">
            <a
                href="#register-form"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-blue-700 focus:outline focus:outline-2 focus:outline-blue-700"
            >
                Saltar al formulario de registro
            </a>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-8 py-4">
                <Link href="/" className="flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700" aria-label="Ir al inicio de Donaton">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">D</div>
                    <span className="text-xl font-bold tracking-tight text-gray-800">Donaton</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden gap-6 text-sm font-medium text-gray-600 md:flex">
                        <a href="/about-us" className="transition hover:text-blue-600">Acerca de Nosotros</a>
                    </div>
                    <div className="flex items-center gap-3 border-l pl-6">
                        <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-blue-600">
                            Iniciar sesión
                        </Link>
                        <span className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm" aria-current="page">
                            <UserCircle size={18} aria-hidden="true" />
                            Registrarse
                        </span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-blue-600 px-6 py-16 text-white">
                <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start">
                    <div className="max-w-2xl pt-2 lg:w-1/2">
                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Heart className="text-yellow-400" size={28} fill="currentColor" aria-hidden="true" />
                        </div>
                        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Crea tu cuenta en Donaton</h1>
                        <p className="mt-5 max-w-xl text-lg opacity-95">
                            Completa el registro para gestionar tus donaciones, seguir campañas y ver el impacto de tu ayuda en tiempo real.
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="lg:w-1/2">
                        <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-2xl md:p-8">
                            <h2 className="text-2xl font-bold">Registro de usuario</h2>
                            <p className="mt-2 text-sm text-gray-600">Todos los campos son obligatorios exceptuando los campos de contacto y ubicación.</p>

                            <p
                                role="status"
                                aria-live="polite"
                                className={`mt-4 rounded-md border px-3 py-2 text-sm ${
                                    statusMessage ? (isSubmitted ? "border-green-300 bg-green-50 text-green-800" : "border-red-300 bg-red-50 text-red-800") : "sr-only"
                                }`}
                            >
                                {statusMessage}
                            </p>

                            <form id="register-form" className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                                {/* Nombre Completo */}
                                <div>
                                    <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold">Nombre completo</label>
                                    <input
                                        id="fullName" type="text" autoComplete="name" value={formData.fullName}
                                        onChange={(e) => handleChange("fullName", e.target.value)}
                                        aria-invalid={Boolean(errors.fullName)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                        placeholder="Ej: Laura Martínez" required
                                    />
                                    {errors.fullName && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.fullName}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Correo electrónico</label>
                                    <input
                                        id="email" type="email" autoComplete="email" value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        aria-invalid={Boolean(errors.email)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                        placeholder="tu.correo@ejemplo.com" required
                                    />
                                    {errors.email && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.email}</p>}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">Teléfono</label>
                                    <input
                                        id="phone" type="tel" autoComplete="tel" value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        aria-invalid={Boolean(errors.phone)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                        placeholder="Ej: +56912345678" required
                                    />
                                    {errors.phone && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.phone}</p>}
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label htmlFor="address" className="mb-1.5 block text-sm font-semibold">Dirección</label>
                                    <input
                                        id="address" type="text" value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        aria-invalid={Boolean(errors.address)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                        placeholder="Ej: Av. Siempreviva 742" required
                                    />
                                    {errors.address && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.address}</p>}
                                </div>

                                {/* Región y Comuna en Grid */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="region" className="mb-1.5 block text-sm font-semibold">Región</label>
                                        <input
                                            id="region" type="text" value={formData.region}
                                            onChange={(e) => handleChange("region", e.target.value)}
                                            aria-invalid={Boolean(errors.region)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                            placeholder="Región" required
                                        />
                                        {errors.region && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.region}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="comuna" className="mb-1.5 block text-sm font-semibold">Comuna</label>
                                        <input
                                            id="comuna" type="text" value={formData.comuna}
                                            onChange={(e) => handleChange("comuna", e.target.value)}
                                            aria-invalid={Boolean(errors.comuna)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                            placeholder="Comuna" required
                                        />
                                        {errors.comuna && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.comuna}</p>}
                                    </div>
                                </div>

                                {/* Contraseña */}
                                <div>
                                    <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Contraseña</label>
                                    <input
                                        id="password" type="password" autoComplete="new-password" value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        aria-invalid={Boolean(errors.password)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                        placeholder="Mínimo 8 caracteres" required
                                    />
                                    {errors.password && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.password}</p>}
                                </div>

                                {/* Confirmar Contraseña */}
                                <div>
                                    <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold">Confirmar contraseña</label>
                                    <input
                                        id="confirmPassword" type="password" autoComplete="new-password" value={formData.confirmPassword}
                                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                        aria-invalid={Boolean(errors.confirmPassword)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus-visible:outline-blue-700"
                                        placeholder="Repite tu contraseña" required
                                    />
                                    {errors.confirmPassword && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.confirmPassword}</p>}
                                </div>

                                {/* Checkbox Términos */}
                                <div>
                                    <div className="flex items-start gap-3">
                                        <input
                                            id="acceptTerms" type="checkbox" checked={formData.acceptTerms}
                                            onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                                            aria-invalid={Boolean(errors.acceptTerms)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-700 focus-visible:outline-blue-700" required
                                        />
                                        <div>
                                            <label htmlFor="acceptTerms" className="text-sm text-gray-800">Acepto los términos y condiciones de Donaton.</label>
                                        </div>
                                    </div>
                                    {errors.acceptTerms && <p className="mt-1.5 text-sm font-medium text-red-700">{errors.acceptTerms}</p>}
                                </div>

                                <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                                    Crear cuenta
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}