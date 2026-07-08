import type { Donation } from "@/types/donation";

type Props = {
    donation: Donation;
};

function formatDate(value?: string | null) {
    if (!value) return "Sin fecha";
    return value.split("T")[0];
}

function getStatusStyle(status: string) {
    if (status === "PENDIENTE") {
        return "bg-yellow-100 text-yellow-800";
    }

    if (status === "ENTREGADA" || status === "COMPLETADA") {
        return "bg-green-100 text-green-800";
    }

    return "bg-slate-100 text-slate-700";
}

export default function DonationItem({ donation }: Props) {
    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {donation.description}
                    </h3>

                    <p className="mt-1 text-sm text-slate-700">
                        Tipo de recurso: {donation.resourceType}
                    </p>
                </div>

                <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                        donation.status
                    )}`}
                >
                    {donation.status}
                </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <DonationMetric label="Cantidad" value={String(donation.quantity)} />
                <DonationMetric label="Tipo de donante" value={donation.donorType} />
                <DonationMetric label="Fecha" value={formatDate(donation.createdAt)} />
            </div>
        </article>
    );
}

function DonationMetric({
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