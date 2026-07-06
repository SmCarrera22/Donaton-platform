"use client";

import { FormEvent, useState } from "react";
import { donationService } from "@/services/donationService";
import { extractErrorMessage } from "@/lib/bff";

interface Props {
    onDonationCreated: () => void;
}

export default function DonationForm({ onDonationCreated }: Props) {
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [amount, setAmount] = useState("");
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
                donorName,
                donorEmail,
                amount: Number(amount),
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

            setDonorName("");
            setDonorEmail("");
            setAmount("");
            setResourceType("MONEY");
            setDonorType("PERSON");
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
                    value={donorName}
                    onChange={(event) => setDonorName(event.target.value)}
                    placeholder="Nombre del donante"
                    className="rounded-lg border px-4 py-3"
                    required
                />

                <input
                    value={donorEmail}
                    onChange={(event) => setDonorEmail(event.target.value)}
                    placeholder="Correo del donante"
                    type="email"
                    className="rounded-lg border px-4 py-3"
                    required
                />

                <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Monto"
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