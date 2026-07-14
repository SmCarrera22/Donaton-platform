"use client";

import { useProfile } from "@/hooks/useProfile";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default function ProfileCard() {
    const {
        profile,
        isLoading,
        errorMessage,
        reloadProfile,
    } = useProfile();

    if (isLoading) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-700">
                Cargando perfil...
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-700">
                    {errorMessage}
                </p>

                <button
                    onClick={reloadProfile}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Reintentar
                </button>
            </section>
        );
    }

    if (!profile) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-700">
                No se encontró información del usuario.
            </section>
        );
    }

    return (
        <>
            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-2xl font-bold text-white">
                        {profile.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {profile.name}
                        </h2>

                        <p className="text-sm text-slate-700">
                            {profile.email}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <ProfileField label="Teléfono" value={profile.phone ?? "No informado"} />
                    <ProfileField label="Región" value={profile.region ?? "No informada"} />
                    <ProfileField label="Comuna" value={profile.comuna ?? "No informada"} />
                    <ProfileField label="Dirección" value={profile.address ?? "No informada"} />
                </div>
            </section>

            <ProfileEditForm
                profile={profile}
                onProfileUpdated={reloadProfile}
            />
        </>
    );
}

function ProfileField({
                          label,
                          value,
                      }: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-sm font-semibold text-slate-700">
                {label}
            </p>

            <p className="mt-1 rounded-lg border bg-slate-50 px-4 py-3 text-slate-900">
                {value}
            </p>
        </div>
    );
}