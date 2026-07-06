"use client";

import CampaignItem from "./CampaignItem";
import CampaignForm from "./CampaignForm";
import { useCampaigns } from "@/hooks/useCampaigns";

export default function CampaignList() {
    const {
        campaigns,
        isLoading,
        errorMessage,
        reloadCampaigns,
    } = useCampaigns();

    return (
        <>
            <CampaignForm onCampaignCreated={reloadCampaigns} />

            {isLoading && (
                <section className="mt-8 rounded-xl border bg-white p-6 text-slate-700">
                    Cargando campañas...
                </section>
            )}

            {errorMessage && (
                <section className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="font-medium text-red-700">
                        {errorMessage}
                    </p>

                    <button
                        onClick={reloadCampaigns}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        Reintentar
                    </button>
                </section>
            )}

            {!isLoading && !errorMessage && campaigns.length === 0 && (
                <section className="mt-8 rounded-xl border bg-white p-6 text-slate-700">
                    No hay campañas registradas.
                </section>
            )}

            {!isLoading && !errorMessage && campaigns.length > 0 && (
                <section className="mt-8 space-y-5">
                    {campaigns.map((campaign) => (
                        <CampaignItem
                            key={campaign.id}
                            campaign={campaign}
                        />
                    ))}
                </section>
            )}
        </>
    );
}