import DonationItem from "./DonationItem";

const donations = [
    {
        campaignTitle: "Ayuda Escolar",
        amount: "$25.000",
        status: "Completada",
        createdAt: "12/07/2026",
    },
    {
        campaignTitle: "Comedor Solidario",
        amount: "$15.000",
        status: "Completada",
        createdAt: "18/07/2026",
    },
    {
        campaignTitle: "Mascotas Abandonadas",
        amount: "$10.000",
        status: "Pendiente",
        createdAt: "21/07/2026",
    },
];

export default function DonationList() {
    return (
        <section className="space-y-5">
            {donations.map((donation) => (
                <DonationItem
                    key={`${donation.campaignTitle}-${donation.createdAt}`}
                    campaignTitle={donation.campaignTitle}
                    amount={donation.amount}
                    status={donation.status}
                    createdAt={donation.createdAt}
                />
            ))}
        </section>
    );
}