"use client";

import { useCallback, useEffect, useState } from "react";
import { donationService } from "@/services/donationService";
import { userService } from "@/services/userService";
import { extractErrorMessage } from "@/lib/bff";
import type { Donation } from "@/types/donation";
import type { UserProfile } from "@/types/user";

export function useDonations() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loadDonations = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const [donationResponse, profileResponse] = await Promise.all([
                donationService.getAll(),
                userService.getCurrentProfile(),
            ]);

            if (!donationResponse.ok) {
                setErrorMessage(
                    extractErrorMessage(
                        donationResponse.body,
                        `No se pudieron cargar las donaciones (${donationResponse.status}).`
                    )
                );
                return;
            }

            if (
                profileResponse.ok &&
                profileResponse.body &&
                typeof profileResponse.body === "object"
            ) {
                setCurrentUser(profileResponse.body as UserProfile);
            }

            if (Array.isArray(donationResponse.body)) {
                setDonations(donationResponse.body);
            } else {
                setDonations([]);
            }
        } catch {
            setErrorMessage("No fue posible conectar con el servicio de donaciones.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadDonations();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [loadDonations]);

    const userDonations = currentUser
        ? donations.filter((donation) => Number(donation.donorId) === Number(currentUser.id))
        : [];

    const pendingDonations = userDonations.filter(
        (donation) => donation.status === "PENDIENTE"
    ).length;

    const totalQuantity = userDonations.reduce(
        (total, donation) => total + Number(donation.quantity ?? 0),
        0
    );

    return {
        donations,
        userDonations,
        currentUser,
        isLoading,
        errorMessage,
        pendingDonations,
        totalQuantity,
        reloadDonations: loadDonations,
    };
}