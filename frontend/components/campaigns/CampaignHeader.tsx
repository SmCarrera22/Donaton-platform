export default function CampaignHeader() {
    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                Gestión de campañas
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
                Campañas solidarias
            </h1>

            <p className="mt-2 max-w-3xl text-slate-700">
                Revisa las campañas disponibles, sus metas de recaudación,
                estado actual y avance registrado dentro de la plataforma.
            </p>
        </section>
    );
}