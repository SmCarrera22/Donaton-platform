import Link from "next/link";

export default function CampaignActions() {
    return (
        <section className="mt-8 flex flex-wrap gap-4">
            <Link
                href="#"
                className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
                Nueva campaña
            </Link>
            <Link
                href="#"
                className="rounded-lg border px-5 py-3 transition hover:bg-slate-100"
            >
                Exportar
            </Link>
        </section>
    );
}