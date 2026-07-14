"use client";

import { FormEvent, useState } from "react";
import { donationService } from "@/services/donationService";
import { extractErrorMessage } from "@/lib/bff";

interface Props {
    onDonationCreated: () => void;
}

export default function DonationForm({ onDonationCreated }: Props) {
    const [resourceName, setResourceName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [resourceType, setResourceType] = useState("ALIMENTOS");
    const [donorType, setDonorType] = useState("PERSONA");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await donationService.create({
                resourceName,
                quantity: Number(quantity),
                resourceType,
                donorType,
            });

            if (!response.ok) {
                setMessage(
                    extractErrorMessage(
                        response.body,
                        `No se pudo crear la donación (${response.status}).`
                    )
                );
                return;
            }

            setResourceName("");
            setQuantity("");
            setResourceType("ALIMENTOS");
            setDonorType("PERSONA");

            setMessage("Donación registrada correctamente.");
            onDonationCreated();
        } catch {
            setMessage("No fue posible conectar con el servicio de donaciones.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
                Registrar nueva donación
            </h2>

            <p className="mt-2 text-sm text-slate-700">
                Esta donación quedará asociada automáticamente a tu cuenta.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-800">
                        Nombre del recurso
                    </label>
                    <input
                        value={resourceName}
                        onChange={(event) => setResourceName(event.target.value)}
                        placeholder="Ej: Arroz, frazadas, medicamentos"
                        className="w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-800">
                        Cantidad
                    </label>
                    <input
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        placeholder="Ej: 10"
                        type="number"
                        min="1"
                        className="w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-800">
                        Tipo de recurso
                    </label>
                    <select
                        value={resourceType}
                        onChange={(event) => setResourceType(event.target.value)}
                        className="w-full rounded-lg border px-4 py-3 text-slate-900"
                    >
                        <option value="ALIMENTOS">Alimentos</option>
                        <option value="ROPA">Ropa</option>
                        <option value="INSUMOS_MEDICOS">Insumos médicos</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-800">
                        Tipo de donante
                    </label>
                    <select
                        value={donorType}
                        onChange={(event) => setDonorType(event.target.value)}
                        className="w-full rounded-lg border px-4 py-3 text-slate-900"
                    >
                        <option value="PERSONA">Persona</option>
                        <option value="EMPRESA">Empresa</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                    >
                        {isSubmitting ? "Registrando..." : "Registrar donación"}
                    </button>
                </div>
            </form>

            {message && (
                <p className="mt-4 text-sm font-semibold text-slate-700">
                    {message}
                </p>
            )}
        </section>
    );
}