import CampaignItem from "@/components/campaigns/CampaignItem";
import type { Campaign } from "@/types/campaign";

type Props = {
    campaigns?: Campaign[];
};

export default function CampaignList({ campaigns = [] }: Props) {
    if (campaigns.length === 0) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-700">
                No hay campañas registradas todavía.
            </section>
        );
    }

    return (
        <section className="space-y-4">
            {campaigns.map((campaign) => (
                <CampaignItem
                    key={campaign.id}
                    campaign={campaign}
                />
            ))}
        </section>
    );
}
