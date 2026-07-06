export interface Donation {
    id: number;
    campaignId?: number;
    campaignTitle?: string;
    donorName?: string;
    donorEmail?: string;
    amount?: number;
    quantity?: number;
    resourceType?: string;
    donorType?: string;
    status: string;
    createdAt?: string;
}