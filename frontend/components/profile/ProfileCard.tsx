export default function ProfileCard() {
    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-2xl font-bold text-white">
                    S
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Usuario Donaton
                    </h2>

                    <p className="text-sm text-slate-500">
                        usuario@donaton.cl
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <ProfileField label="Rol" value="USER" />
                <ProfileField label="Teléfono" value="+56 9 1234 5678" />
                <ProfileField label="Región" value="Metropolitana" />
                <ProfileField label="Comuna" value="Santiago" />
                <ProfileField label="Dirección" value="Av. Siempre Viva 742" />
            </div>
        </section>
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
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-1 rounded-lg border bg-slate-50 px-4 py-3 text-slate-800">
                {value}
            </p>
        </div>
    );
}