export default function RecentActivity() {
    const activities = [
        "Donaste recursos a una campaña activa.",
        "Se actualizó el listado de campañas disponibles.",
        "Tu sesión fue iniciada correctamente.",
    ];

    return (
        <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
                Actividad reciente
            </h2>

            <ul className="space-y-3">
                {activities.map((activity) => (
                    <li
                        key={activity}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800"
                    >
                        {activity}
                    </li>
                ))}
            </ul>
        </section>
    );
}