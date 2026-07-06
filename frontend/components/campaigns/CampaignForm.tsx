"use client";

import { FormEvent, useState } from "react";
import { campaignService } from "@/services/campaignService";
import { extractErrorMessage } from "@/lib/bff";

interface Props {
    onCampaignCreated: () => void;
}

export default function CampaignForm({ onCampaignCreated }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [status, setStatus] = useState("ACTIVA");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await campaignService.create({
                name,
                description,
                targetAmount: Number(targetAmount),
                status,
            });

            if (!response.ok) {
                setMessage(
                    extractErrorMessage(
                        response.body,
                        `No se pudo crear la campaña (${response.status}).`
                    )
                );
                return;
            }

            setName("");
            setDescription("");
            setTargetAmount("");
            setStatus("ACTIVA");
            setMessage("Campaña creada correctamente.");
            onCampaignCreated();
        } catch {
            setMessage("No fue posible conectar con el servicio de campañas.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
                Crear nueva campaña
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nombre de la campaña"
                    className="rounded-lg border px-4 py-3 text-slate-800 placeholder:text-slate-500"
                    required
                />

                <input
                    value={targetAmount}
                    onChange={(event) => setTargetAmount(event.target.value)}
                    placeholder="Meta de recaudación"
                    type="number"
                    min="1"
                    className="rounded-lg border px-4 py-3 text-slate-800 placeholder:text-slate-500"
                    required
                />

                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descripción de la campaña"
                    className="rounded-lg border px-4 py-3 text-slate-800 placeholder:text-slate-500 md:col-span-2"
                    required
                />

                <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="rounded-lg border px-4 py-3 text-slate-800"
                >
                    <option value="ACTIVA">Activa</option>
                    <option value="FINALIZADA">Finalizada</option>
                </select>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                >
                    {isSubmitting ? "Creando..." : "Crear campaña"}
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