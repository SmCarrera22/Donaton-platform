import type { Donation } from "@/types/donation";

interface Props {
    donation: Donation;
}

function formatDate(value?: string) {
    if (!value) return "Fecha no disponible";
    return value.split("T")[0];
}

export default function DonationItem({ donation }: Props) {
    const resourceName =
        donation.resourceName ??
        donation.description ??
        "Recurso no informado";

    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        {resourceName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Tipo de recurso: {donation.resourceType ?? "No informado"}
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
                        Cantidad
                    </p>

                    <p className="text-xl font-bold text-slate-800">
                        {donation.quantity ?? 0}
                    </p>

                    <p className="text-sm text-slate-500">
                        {formatDate(donation.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}