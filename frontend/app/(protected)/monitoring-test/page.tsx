"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function MonitoringTestPage() {
    const [message, setMessage] = useState("");

    const sendTestError = () => {
        try {
            throw new Error(
                "Donaton frontend monitoring test error"
            );
        } catch (error) {
            Sentry.captureException(error);
            setMessage(
                "El error de prueba fue enviado a GlitchTip."
            );
        }
    };

    return (
        <main className="p-8">
            <section className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">
                    Prueba de monitoreo
                </h1>

                <p className="mt-3 text-slate-600">
                    Esta página permite generar un error controlado
                    para validar la integración con GlitchTip.
                </p>

                <button
                    type="button"
                    onClick={sendTestError}
                    className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                >
                    Enviar error de prueba
                </button>

                {message && (
                    <p className="mt-4 text-sm font-medium text-green-700">
                        {message}
                    </p>
                )}
            </section>
        </main>
    );
}
