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
        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
                Registrar nueva donación
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                    value={resourceName}
                    onChange={(event) => setResourceName(event.target.value)}
                    placeholder="Nombre del recurso"
                    className="rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                    required
                />

                <input
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="Cantidad"
                    type="number"
                    min="1"
                    className="rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                    required
                />

                <select
                    value={resourceType}
                    onChange={(event) => setResourceType(event.target.value)}
                    className="rounded-lg border px-4 py-3 text-slate-900"
                >
                    <option value="ALIMENTOS">Alimentos</option>
                    <option value="ROPA">Ropa</option>
                    <option value="INSUMOS_MEDICOS">Insumos Médicos</option>
                </select>

                <select
                    value={donorType}
                    onChange={(event) => setDonorType(event.target.value)}
                    className="rounded-lg border px-4 py-3 text-slate-900"
                >
                    <option value="PERSONA">Persona</option>
                    <option value="EMPRESA">Empresa</option>
                </select>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                >
                    {isSubmitting ? "Registrando..." : "Registrar donación"}
                </button>
            </form>

            {message && (
                <p className="mt-4 text-sm font-medium text-slate-700">
                    {message}
                </p>
            )}
        </section>
    );
}