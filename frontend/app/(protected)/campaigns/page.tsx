import CampaignHeader from "@/components/campaigns/CampaignHeader";
import CampaignActions from "@/components/campaigns/CampaignActions";
import CampaignList from "@/components/campaigns/CampaignList";

export default function CampaignsPage() {
    return (
        <>
            <CampaignHeader />
            <CampaignActions />
            <CampaignList />
        </>
    );
}