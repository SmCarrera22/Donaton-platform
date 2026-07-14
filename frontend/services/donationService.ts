import { getFromBff, postToBff } from "@/lib/bff";
import type { Donation, DonationCreateRequest } from "@/types/donation";

export const donationService = {
    getAll: () => {
        return getFromBff<Donation[]>("/api/donations");
    },

    create: (payload: DonationCreateRequest) => {
        return postToBff<Donation>("/api/donations", payload);
    },
};