"use client";

import DonationHeader from "@/components/donations/DonationHeader";
import DonationForm from "@/components/donations/DonationForm";
import DonationList from "@/components/donations/DonationList";
import { useDonations } from "@/hooks/useDonations";

export default function DonationsPage() {
    const {
        userDonations,
        isLoading,
        errorMessage,
        pendingDonations,
        totalQuantity,
        reloadDonations,
    } = useDonations();

    if (isLoading) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-700">
                Cargando donaciones...
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                {errorMessage}
            </section>
        );
    }

    return (
        <div className="space-y-6">
            <DonationHeader
                totalUserDonations={userDonations.length}
                pendingDonations={pendingDonations}
                totalQuantity={totalQuantity}
            />

            <DonationForm onDonationCreated={reloadDonations} />

            <DonationList donations={userDonations} />
        </div>
    );
}