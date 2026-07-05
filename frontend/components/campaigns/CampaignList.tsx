import CampaignItem from "./CampaignItem";

const campaigns = [
    {
        title: "Ayuda Escolar",
        status: "Activa",
        amount: "$580.000"
    },
    {
        title: "Comedor Solidario",
        status: "Finalizada",
        amount: "$1.320.000"
    },
    {
        title: "Mascotas Abandonadas",
        status: "Activa",
        amount: "$220.000"
    }
];
export default function CampaignList() {
    return (
        <section className="mt-8 space-y-5">
            {campaigns.map((campaign) => (
                <CampaignItem
                    key={campaign.title}
                    title={campaign.title}
                    status={campaign.status}
                    amount={campaign.amount}
                />
            ))}
        </section>
    );
}