export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Bienvenido a Donaton
                </h1>

                <p className="mt-2 text-gray-600">
                    Este será tu panel principal.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold">
                        Donaciones
                    </h2>

                    <p className="mt-4 text-4xl font-bold text-sky-700">
                        18
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold">
                        Campañas
                    </h2>

                    <p className="mt-4 text-4xl font-bold text-sky-700">
                        6
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold">
                        Impacto
                    </h2>

                    <p className="mt-4 text-4xl font-bold text-sky-700">
                        92%
                    </p>
                </div>

            </div>
        </div>
    );
}