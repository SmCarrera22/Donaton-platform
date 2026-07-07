import type { Donation } from "@/types/donation";

type Props = {
    donation: Donation;
};

function formatDate(value?: string | null) {
    if (!value) return "Sin fecha";
    return value.split("T")[0];
}

export default function DonationItem({ donation }: Props) {
    const resourceName = donation.description ?? "Recurso no informado";

    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {resourceName}
                    </h3>

                    <p className="mt-2 text-sm text-slate-700">
                        Tipo de recurso: {donation.resourceType}
                    </p>
                </div>

                <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                    {donation.status}
                </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <DonationMetric
                    label="Cantidad"
                    value={String(donation.quantity)}
                />

                <DonationMetric
                    label="Tipo de donante"
                    value={donation.donorType}
                />

                <DonationMetric
                    label="Fecha"
                    value={formatDate(donation.createdAt)}
                />
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
