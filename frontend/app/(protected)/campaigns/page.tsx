"use client";

import CampaignHeader from "@/components/campaigns/CampaignHeader";
import CampaignList from "@/components/campaigns/CampaignList";
import { useCampaigns } from "@/hooks/useCampaigns";

export default function CampaignsPage() {
    const {
        campaigns,
        isLoading,
        errorMessage,
    } = useCampaigns();

    if (isLoading) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-700">
                Cargando campañas...
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
            <CampaignHeader />
            <CampaignList campaigns={campaigns} />
        </div>
    );
}