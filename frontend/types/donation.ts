export interface Donation {
    id: number;
    campaignTitle: string;
    amount: number;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    createdAt: string;
}