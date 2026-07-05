import { getFromBff, postToBff } from "@/lib/bff";
import type { Campaign } from "@/types/campaign";

export type CampaignRequest = {
    title: string;
    description: string;
    goal: number;
};

export const campaignService = {
    getAll: () => {
        return getFromBff<Campaign[]>("/api/campaigns");
    },

    create: (payload: CampaignRequest) => {
        return postToBff<Campaign>("/api/campaigns", payload);
    },
};