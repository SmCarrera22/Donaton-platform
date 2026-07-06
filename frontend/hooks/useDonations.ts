"use client";

import { useEffect, useState } from "react";
import { donationService } from "@/services/donationService";
import { extractErrorMessage } from "@/lib/bff";
import type { Donation } from "@/types/donation";

export function useDonations() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadDonations = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await donationService.getAll();

            if (!response.ok) {
                setErrorMessage(
                    extractErrorMessage(
                        response.body,
                        `No se pudieron cargar las donaciones (${response.status}).`
                    )
                );
                return;
            }

            if (Array.isArray(response.body)) {
                setDonations(response.body);
            } else {
                setDonations([]);
            }
        } catch {
            setErrorMessage("No fue posible conectar con el servicio de donaciones.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDonations();
    }, []);

    return {
        donations,
        isLoading,
        errorMessage,
        reloadDonations: loadDonations,
    };
}