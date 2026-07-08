"use client";

import { useEffect, useState } from "react";
import { campaignService } from "@/services/campaignService";
import { donationService } from "@/services/donationService";
import { userService } from "@/services/userService";
import type { Campaign } from "@/types/campaign";
import type { Donation } from "@/types/donation";
import type { UserProfile } from "@/types/user";

export function useDashboard() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const [campaignResponse, donationResponse, profileResponse] =
                    await Promise.all([
                        campaignService.getAll(),
                        donationService.getAll(),
                        userService.getCurrentProfile(),
                    ]);

                if (campaignResponse.ok && Array.isArray(campaignResponse.body)) {
                    setCampaigns(campaignResponse.body);
                }

                if (donationResponse.ok && Array.isArray(donationResponse.body)) {
                    setDonations(donationResponse.body);
                }

                if (
                    profileResponse.ok &&
                    profileResponse.body &&
                    typeof profileResponse.body === "object"
                ) {
                    setProfile(profileResponse.body as UserProfile);
                }
            } catch {
                setErrorMessage("No fue posible cargar la información del dashboard.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadDashboard();
    }, []);

    const activeCampaigns = campaigns.filter(
        (campaign) => campaign.status === "ACTIVA"
    ).length;

    const pendingDonations = donations.filter(
        (donation) => donation.status === "PENDIENTE"
    ).length;

    const totalDonationQuantity = donations.reduce(
        (total, donation) => total + Number(donation.quantity ?? 0),
        0
    );

    return {
        campaigns,
        donations,
        profile,
        isLoading,
        errorMessage,
        totalCampaigns: campaigns.length,
        activeCampaigns,
        totalDonations: donations.length,
        pendingDonations,
        totalDonationQuantity,
    };
}