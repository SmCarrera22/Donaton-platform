export default function RecentActivity() {

    const activities = [
        "Donaste $15.000 a Fundación Esperanza.",
        "Tu campaña 'Ayuda Escolar' recibió una nueva donación.",
        "Actualizaste tu información personal."
    ];

    return (
        <section className="mt-8 rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Actividad reciente
            </h2>

            <ul className="space-y-3">

                {activities.map((activity) => (

                    <li
                        key={activity}
                        className="rounded-lg border p-3 text-slate-700"
                    >
                        {activity}
                    </li>

                ))}

            </ul>

        </section>
    );
}