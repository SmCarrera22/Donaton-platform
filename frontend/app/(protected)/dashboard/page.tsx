import StatsCard from "@/components/cards/StatsCard";

export default function DashboardPage() {
    return (
        <section>
            <h1 className="mb-8 text-3xl font-bold">
                Dashboard
            </h1>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatsCard
                    title="Campañas activas"
                    value="12"
                />
                <StatsCard
                    title="Donaciones realizadas"
                    value="45"
                />
                <StatsCard
                    title="Total donado"
                    value="$1.250.000"
                />
                <StatsCard
                    title="Organizaciones"
                    value="18"
                />
            </div>
        </section>
    );
}