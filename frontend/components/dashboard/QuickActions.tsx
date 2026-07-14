import Link from "next/link";

export default function QuickActions() {
    return (
        <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
                Acciones rápidas
            </h2>

            <div className="flex flex-wrap gap-4">
                <Link
                    href="/campaigns"
                    className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
                >
                    Ver campañas
                </Link>

                <Link
                    href="/donations"
                    className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                    Ver donaciones
                </Link>

                <Link
                    href="/profile"
                    className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                    Editar perfil
                </Link>
            </div>
        </section>
    );
}