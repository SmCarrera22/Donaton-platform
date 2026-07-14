import type { Campaign } from "@/types/campaign";
import type { Donation } from "@/types/donation";

type Props = {
    campaigns: Campaign[];
    donations: Donation[];
};

function formatDate(value?: string | null) {
    if (!value) return "Sin fecha";

    return value.split("T")[0];
}

export default function RecentActivity({
                                           campaigns,
                                           donations,
                                       }: Props) {
    const latestCampaigns = campaigns.slice(0, 3);
    const latestDonations = donations.slice(0, 3);

    return (
        <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                    Campañas recientes
                </h2>

                <div className="mt-4 space-y-3">
                    {latestCampaigns.length === 0 ? (
                        <p className="text-sm text-slate-700">
                            No hay campañas registradas.
                        </p>
                    ) : (
                        latestCampaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="rounded-lg border bg-slate-50 p-4"
                            >
                                <p className="font-semibold text-slate-900">
                                    {campaign.title}
                                </p>
                                <p className="text-sm text-slate-700">
                                    Estado: {campaign.status}
                                </p>
                                <p className="text-sm text-slate-700">
                                    Cierre: {formatDate(campaign.endDate)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                    Donaciones recientes
                </h2>

                <div className="mt-4 space-y-3">
                    {latestDonations.length === 0 ? (
                        <p className="text-sm text-slate-700">
                            No hay donaciones registradas.
                        </p>
                    ) : (
                        latestDonations.map((donation) => (
                            <div
                                key={donation.id}
                                className="rounded-lg border bg-slate-50 p-4"
                            >
                                <p className="font-semibold text-slate-900">
                                    {donation.description}
                                </p>
                                <p className="text-sm text-slate-700">
                                    Cantidad: {donation.quantity}
                                </p>
                                <p className="text-sm text-slate-700">
                                    Fecha: {formatDate(donation.createdAt)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}