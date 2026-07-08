import StatsCard from "@/components/cards/StatsCard";

type Props = {
    totalCampaigns: number;
    activeCampaigns: number;
    totalDonations: number;
    pendingDonations: number;
    totalDonationQuantity: number;
};

export default function StatisticsGrid({
                                           totalCampaigns,
                                           activeCampaigns,
                                           totalDonations,
                                           pendingDonations,
                                           totalDonationQuantity,
                                       }: Props) {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Campañas"
                value={totalCampaigns}
                description={`${activeCampaigns} activas`}
            />

            <StatsCard
                title="Donaciones"
                value={totalDonations}
                description={`${pendingDonations} pendientes`}
            />

            <StatsCard
                title="Recursos aportados"
                value={totalDonationQuantity}
                description="Cantidad total registrada"
            />

            <StatsCard
                title="Estado general"
                value="Activo"
                description="Sistema operativo"
            />
        </section>
    );
}