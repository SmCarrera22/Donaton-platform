import Link from "next/link";

export default function QuickActions() {
    return (
        <section className="mt-8 rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Acciones rápidas
            </h2>

            <div className="flex flex-wrap gap-4">

                <Link
                    href="/campaigns"
                    className="rounded-lg bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 transition"
                >
                    Nueva campaña
                </Link>

                <Link
                    href="/donations"
                    className="rounded-lg border px-5 py-3 hover:bg-slate-100 transition"
                >
                    Ver donaciones
                </Link>

                <Link
                    href="/profile"
                    className="rounded-lg border px-5 py-3 hover:bg-slate-100 transition"
                >
                    Editar perfil
                </Link>

            </div>

        </section>
    );
}