import type { Donation } from "@/types/donation";

interface Props {
    donation: Donation;
}

function formatCurrency(value?: number) {
    if (value === undefined || value === null) return "$0";

    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function DonationItem({ donation }: Props) {
    const title =
        donation.campaignTitle ??
        `Campaña ID ${donation.campaignId ?? "sin asignar"}`;

    const amount = donation.amount ?? donation.quantity ?? 0;

    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Donante: {donation.donorName ?? donation.donorEmail ?? "No informado"}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Estado:
                        <span className="ml-2 font-medium text-sky-700">
                            {donation.status}
                        </span>
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-slate-500">
                        Aporte
                    </p>

                    <p className="text-xl font-bold text-slate-800">
                        {formatCurrency(amount)}
                    </p>

                    <p className="text-sm text-slate-500">
                        {donation.createdAt ?? "Fecha no disponible"}
                    </p>
                </div>
            </div>
        </div>
    );
}