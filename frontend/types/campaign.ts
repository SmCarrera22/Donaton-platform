export type Campaign = {
    id: number;
    title: string;
    description: string;
    goalAmount: number;
    collectedAmount: number;
    status: string;
    createdAt: string;
    endDate: string | null;
};

export type CampaignCreateRequest = {
    title: string;
    description: string;
    goalAmount: number;
    endDate: string | null;
};