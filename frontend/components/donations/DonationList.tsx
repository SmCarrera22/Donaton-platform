"use client";

import DonationItem from "./DonationItem";
import DonationForm from "./DonationForm";
import { useDonations } from "@/hooks/useDonations";

export default function DonationList() {
    const {
        donations,
        isLoading,
        errorMessage,
        reloadDonations,
    } = useDonations();

    return (
        <>
            <DonationForm onDonationCreated={reloadDonations} />

            {isLoading && (
                <section className="rounded-xl border bg-white p-6 text-slate-600">
                    Cargando donaciones...
                </section>
            )}

            {errorMessage && (
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
            )}

            {!isLoading && !errorMessage && donations.length === 0 && (
                <section className="rounded-xl border bg-white p-6 text-slate-600">
                    No hay donaciones registradas.
                </section>
            )}

            {!isLoading && !errorMessage && donations.length > 0 && (
                <section className="space-y-5">
                    {donations.map((donation) => (
                        <DonationItem
                            key={donation.id}
                            donation={donation}
                        />
                    ))}
                </section>
            )}
        </>
    );
}