import type { Campaign } from "@/types/campaign";

type Props = {
    campaign: Campaign;
};

function formatDate(value?: string | null) {
    if (!value) return "Sin fecha";
    return value.split("T")[0];
}

function formatAmount(value: number) {
    return new Intl.NumberFormat("es-CL").format(value);
}

function calculateProgress(collectedAmount: number, goalAmount: number) {
    if (!goalAmount || goalAmount <= 0) return 0;
    return Math.min(Math.round((collectedAmount / goalAmount) * 100), 100);
}

export default function CampaignItem({ campaign }: Props) {
    const progress = calculateProgress(
        Number(campaign.collectedAmount ?? 0),
        Number(campaign.goalAmount ?? 0)
    );

    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {campaign.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-700">
                        {campaign.description}
                    </p>
                </div>

                <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                    {campaign.status}
                </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <CampaignMetric
                    label="Meta"
                    value={`$${formatAmount(campaign.goalAmount)}`}
                />

                <CampaignMetric
                    label="Recaudado"
                    value={`$${formatAmount(campaign.collectedAmount)}`}
                />

                <CampaignMetric
                    label="Fecha cierre"
                    value={formatDate(campaign.endDate)}
                />
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">
                        Progreso
                    </span>

                    <span className="font-bold text-sky-700">
                        {progress}%
                    </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                        className="h-full rounded-full bg-sky-600"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </article>
    );
}

function CampaignMetric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {label}
            </p>

            <p className="mt-1 font-bold text-slate-900">
                {value}
            </p>
        </div>
    );
}
