import type { Donation } from "@/types/donation";

type Props = {
    donations: Donation[];
};

const resourceLabels: Record<string, string> = {
    ALIMENTOS: "Alimentos",
    ROPA: "Ropa",
    INSUMOS_MEDICOS: "Insumos médicos",
};

export default function ResourceSummary({ donations }: Props) {
    const totals = donations.reduce<Record<string, number>>((accumulator, donation) => {
        const key = donation.resourceType ?? "OTROS";
        accumulator[key] = (accumulator[key] ?? 0) + Number(donation.quantity ?? 0);
        return accumulator;
    }, {});

    const entries = Object.entries(totals);
    const maxValue = Math.max(...entries.map(([, value]) => value), 1);

    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
                Donaciones por tipo de recurso
            </h2>

            <p className="mt-2 text-sm text-slate-700">
                Distribución acumulada de los recursos registrados en la plataforma.
            </p>

            <div className="mt-6 space-y-4">
                {entries.length === 0 ? (
                    <p className="text-sm text-slate-700">
                        No hay donaciones registradas todavía.
                    </p>
                ) : (
                    entries.map(([resourceType, total]) => {
                        const percentage = Math.round((total / maxValue) * 100);

                        return (
                            <div key={resourceType}>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-slate-800">
                                        {resourceLabels[resourceType] ?? resourceType}
                                    </span>

                                    <span className="font-bold text-sky-700">
                                        {total}
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-sky-600"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}