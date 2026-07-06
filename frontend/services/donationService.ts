import { getFromBff, postToBff } from "@/lib/bff";
import type { Donation } from "@/types/donation";

export type DonationRequest = {
    campaignId: number;
    amount: number;
};

export const donationService = {
    getAll: () => {
        return getFromBff<Donation[]>("/api/donations");
    },

    create: (payload: DonationRequest) => {
        return postToBff<Donation>("/api/donations", payload);
    },
};