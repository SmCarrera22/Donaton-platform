"use client";

import { FormEvent, useState } from "react";
import { userService } from "@/services/userService";
import { extractErrorMessage } from "@/lib/bff";
import type { UserProfile } from "@/types/user";

type Props = {
    profile: UserProfile;
    onProfileUpdated: () => void;
};

export default function ProfileEditForm({
                                            profile,
                                            onProfileUpdated,
                                        }: Props) {
    const [name, setName] = useState(() => profile.name ?? "");
    const [phone, setPhone] = useState(() => profile.phone ?? "");
    const [address, setAddress] = useState(() => profile.address ?? "");
    const [region, setRegion] = useState(() => profile.region ?? "");
    const [comuna, setComuna] = useState(() => profile.comuna ?? "");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await userService.updateProfile(
                profile.id,
                {
                    name,
                    phone,
                    address,
                    region,
                    comuna,
                }
            );

            if (!response.ok) {
                setMessage(
                    extractErrorMessage(
                        response.body,
                        `No se pudo actualizar el perfil (${response.status}).`
                    )
                );
                return;
            }

            setMessage("Perfil actualizado correctamente.");
            onProfileUpdated();
        } catch {
            setMessage(
                "No fue posible conectar con el servicio de usuarios."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
                Editar información personal
            </h2>

            <p className="mt-2 text-sm text-slate-700">
                Actualiza tus datos de contacto y ubicación asociados a tu cuenta.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 md:grid-cols-2"
            >
                <div>
                    <label
                        htmlFor="profile-name"
                        className="mb-1 block text-sm font-semibold text-slate-800"
                    >
                        Nombre
                    </label>

                    <input
                        id="profile-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        className="w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="profile-phone"
                        className="mb-1 block text-sm font-semibold text-slate-800"
                    >
                        Teléfono
                    </label>

                    <input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                            setPhone(event.target.value)
                        }
                        className="w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                        placeholder="+56912345678"
                    />
                </div>

                <div>
                    <label
                        htmlFor="profile-region"
                        className="mb-1 block text-sm font-semibold text-slate-800"
                    >
                        Región
                    </label>

                    <input
                        id="profile-region"
                        type="text"
                        value={region}
                        onChange={(event) =>
                            setRegion(event.target.value)
                        }
                        className="w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                        placeholder="Metropolitana"
                    />
                </div>

                <div>
                    <label
                        htmlFor="profile-comuna"
                        className="mb-1 block text-sm font-semibold text-slate-800"
                    >
                        Comuna
                    </label>

                    <input
                        id="profile-comuna"
                        type="text"
                        value={comuna}
                        onChange={(event) =>
                            setComuna(event.target.value)
                        }
                        className="w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                        placeholder="Santiago"
                    />
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="profile-address"
                        className="mb-1 block text-sm font-semibold text-slate-800"
                    >
                        Dirección
                    </label>

                    <input
                        id="profile-address"
                        type="text"
                        value={address}
                        onChange={(event) =>
                            setAddress(event.target.value)
                        }
                        className="w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-500"
                        placeholder="Av. Principal 123"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Guardando..."
                        : "Guardar cambios"}
                </button>
            </form>

            {message && (
                <p
                    role="status"
                    aria-live="polite"
                    className="mt-4 text-sm font-semibold text-slate-700"
                >
                    {message}
                </p>
            )}
        </section>
    );
}