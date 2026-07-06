"use client";

import DonationItem from "./DonationItem";
import { useDonations } from "@/hooks/useDonations";

export default function DonationList() {
    const {
        donations,
        isLoading,
        errorMessage,
        reloadDonations,
    } = useDonations();

    if (isLoading) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-600">
                Cargando donaciones...
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-700">
                    {errorMessage}
                </p>

                <button
                    onClick={reloadDonations}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Reintentar
                </button>
            </section>
        );
    }

    if (donations.length === 0) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-600">
                No hay donaciones registradas.
            </section>
        );
    }

    return (
        <section className="space-y-5">
            {donations.map((donation) => (
                <DonationItem
                    key={donation.id}
                    donation={donation}
                />
            ))}
        </section>
    );
}