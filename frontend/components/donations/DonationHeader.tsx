type Props = {
    totalUserDonations: number;
    pendingDonations: number;
    totalQuantity: number;
};

export default function DonationHeader({
                                           totalUserDonations,
                                           pendingDonations,
                                           totalQuantity,
                                       }: Props) {
    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                Mis donaciones
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
                Historial de aportes
            </h1>

            <p className="mt-2 max-w-3xl text-slate-700">
                Revisa las donaciones asociadas a tu cuenta y registra nuevos aportes
                para apoyar campañas activas.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <DonationSummaryCard
                    label="Donaciones realizadas"
                    value={totalUserDonations}
                />

                <DonationSummaryCard
                    label="Pendientes"
                    value={pendingDonations}
                />

                <DonationSummaryCard
                    label="Recursos aportados"
                    value={totalQuantity}
                />
            </div>
        </section>
    );
}

function DonationSummaryCard({
                                 label,
                                 value,
                             }: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {label}
            </p>

            <p className="mt-1 text-2xl font-bold text-sky-700">
                {value}
            </p>
        </div>
    );
}