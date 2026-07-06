import type { Campaign } from "@/types/campaign";

interface Props {
    campaign: Campaign;
}

function formatCurrency(value?: number) {
    if (value === undefined || value === null) return "$0";

    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function CampaignItem({ campaign }: Props) {
    const title = campaign.title ?? campaign.name ?? "Campaña sin nombre";
    const goal = campaign.goal ?? campaign.targetAmount ?? 0;
    const collected = campaign.collected ?? campaign.currentAmount ?? 0;

    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {campaign.description}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Estado:
                        <span className="ml-2 font-medium text-sky-700">
                            {campaign.status}
                        </span>
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-slate-500">
                        Recaudado
                    </p>

                    <p className="text-xl font-bold text-slate-800">
                        {formatCurrency(collected)}
                    </p>

                    <p className="text-sm text-slate-500">
                        Meta: {formatCurrency(goal)}
                    </p>
                </div>
            </div>
        </div>
    );
}