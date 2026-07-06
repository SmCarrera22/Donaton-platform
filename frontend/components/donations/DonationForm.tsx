"use client";

import { FormEvent, useState } from "react";
import { donationService } from "@/services/donationService";
import { extractErrorMessage } from "@/lib/bff";

interface Props {
    onDonationCreated: () => void;
}

export default function DonationForm({ onDonationCreated }: Props) {
    const [donorId, setDonorId] = useState("1");
    const [resourceName, setResourceName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [resourceType, setResourceType] = useState("MONEY");
    const [donorType, setDonorType] = useState("PERSON");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await donationService.create({
                donorId: Number(donorId),
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
            <h2 className="text-xl font-semibold text-slate-800">
                Registrar nueva donación
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                    value={donorId}
                    onChange={(event) => setDonorId(event.target.value)}
                    placeholder="ID del donante"
                    type="number"
                    min="1"
                    className="rounded-lg border px-4 py-3"
                    required
                />

                <input
                    value={resourceName}
                    onChange={(event) => setResourceName(event.target.value)}
                    placeholder="Nombre del recurso"
                    className="rounded-lg border px-4 py-3"
                    required
                />

                <input
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="Cantidad"
                    type="number"
                    min="1"
                    className="rounded-lg border px-4 py-3"
                    required
                />

                <select
                    value={resourceType}
                    onChange={(event) => setResourceType(event.target.value)}
                    className="rounded-lg border px-4 py-3"
                >
                    <option value="MONEY">Dinero</option>
                    <option value="FOOD">Alimentos</option>
                    <option value="CLOTHES">Ropa</option>
                    <option value="OTHER">Otro</option>
                </select>

                <select
                    value={donorType}
                    onChange={(event) => setDonorType(event.target.value)}
                    className="rounded-lg border px-4 py-3"
                >
                    <option value="PERSON">Persona</option>
                    <option value="COMPANY">Empresa</option>
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