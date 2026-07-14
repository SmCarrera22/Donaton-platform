import type { UserProfile } from "@/types/user";

type Props = {
    profile: UserProfile | null;
};

export default function DashboardWelcome({ profile }: Props) {
    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                Panel de control
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
                Bienvenido{profile?.name ? `, ${profile.name}` : " a Donaton"}
            </h1>

            <p className="mt-2 max-w-3xl text-slate-700">
                Desde este panel puedes revisar el estado general de campañas,
                donaciones registradas y actividad reciente de la plataforma.
            </p>
        </section>
    );
}