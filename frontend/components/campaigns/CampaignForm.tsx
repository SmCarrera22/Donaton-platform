"use client";

import { FormEvent, useState } from "react";
import { campaignService } from "@/services/campaignService";
import { extractErrorMessage } from "@/lib/bff";

interface Props {
    onCampaignCreated: () => void;
}

export default function CampaignForm({ onCampaignCreated }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalAmount, setGoalAmount] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await campaignService.create({
                title,
                description,
                goalAmount: Number(goalAmount),
                endDate: endDate ? `${endDate}T23:59:59` : null,
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

            setTitle("");
            setDescription("");
            setGoalAmount("");
            setEndDate("");
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
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Título de la campaña"
                    className="rounded-lg border px-4 py-3 text-slate-800 placeholder:text-slate-500"
                    required
                />

                <input
                    value={goalAmount}
                    onChange={(event) => setGoalAmount(event.target.value)}
                    placeholder="Meta de recaudación"
                    type="number"
                    min="1"
                    className="rounded-lg border px-4 py-3 text-slate-800 placeholder:text-slate-500"
                    required
                />

                <input
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    type="date"
                    className="rounded-lg border px-4 py-3 text-slate-800 placeholder:text-slate-500"
                />

                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descripción de la campaña"
                    className="rounded-lg border px-4 py-3 text-slate-800 placeholder:text-slate-500 md:col-span-2"
                    required
                />

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