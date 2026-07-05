import StatsCard from "@/components/cards/StatsCard";

export default function StatisticsGrid() {
    return (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatsCard
                title="Campañas"
                value="12"
                subtitle="2 activas"
            />

            <StatsCard
                title="Donaciones"
                value="53"
                subtitle="Este mes"
            />

            <StatsCard
                title="Monto donado"
                value="$1.250.000"
                subtitle="Histórico"
            />

            <StatsCard
                title="Impacto"
                value="98%"
                subtitle="Transparencia"
            />

        </section>
    );
}