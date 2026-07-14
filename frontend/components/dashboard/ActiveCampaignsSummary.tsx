import type { Campaign } from "@/types/campaign";

type Props = {
    campaigns: Campaign[];
};

function formatAmount(value: number) {
    return new Intl.NumberFormat("es-CL").format(value);
}

function calculateProgress(collectedAmount: number, goalAmount: number) {
    if (!goalAmount || goalAmount <= 0) return 0;
    return Math.min(Math.round((collectedAmount / goalAmount) * 100), 100);
}

export default function ActiveCampaignsSummary({ campaigns }: Props) {
    const activeCampaigns = campaigns
        .filter((campaign) => campaign.status === "ACTIVA")
        .slice(0, 4);

    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
                Campañas activas
            </h2>

            <p className="mt-2 text-sm text-slate-700">
                Principales campañas disponibles para recibir apoyo.
            </p>

            <div className="mt-6 space-y-4">
                {activeCampaigns.length === 0 ? (
                    <p className="text-sm text-slate-700">
                        No hay campañas activas registradas.
                    </p>
                ) : (
                    activeCampaigns.map((campaign) => {
                        const progress = calculateProgress(
                            Number(campaign.collectedAmount ?? 0),
                            Number(campaign.goalAmount ?? 0)
                        );

                        return (
                            <article
                                key={campaign.id}
                                className="rounded-lg border bg-slate-50 p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {campaign.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-700">
                                            Meta: ${formatAmount(campaign.goalAmount)}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                                        {progress}%
                                    </span>
                                </div>

                                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-sky-600"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}