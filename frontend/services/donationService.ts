import { getFromBff, postToBff } from "@/lib/bff";
import type { Donation } from "@/types/donation";

export type DonationRequest = {
    donorId: number;
    resourceName: string;
    quantity: number;
    resourceType: string;
    donorType: string;
};

export const donationService = {
    getAll: () => {
        return getFromBff<Donation[]>("/api/donations");
    },

    create: (payload: DonationRequest) => {
        return postToBff<Donation>("/api/donations", payload);
    },
};