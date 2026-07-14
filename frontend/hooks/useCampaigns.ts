"use client";

import { useCallback, useEffect, useState } from "react";
import { campaignService } from "@/services/campaignService";
import type { Campaign } from "@/types/campaign";
import { extractErrorMessage } from "@/lib/bff";

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loadCampaigns = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await campaignService.getAll();

            if (!response.ok) {
                setErrorMessage(
                    extractErrorMessage(
                        response.body,
                        `No se pudieron cargar las campañas (${response.status}).`
                    )
                );
                return;
            }

            if (Array.isArray(response.body)) {
                setCampaigns(response.body);
                return;
            }

            setCampaigns([]);
        } catch {
            setErrorMessage("No fue posible conectar con el servicio de campañas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadCampaigns();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [loadCampaigns]);

    return {
        campaigns,
        isLoading,
        errorMessage,
        reloadCampaigns: loadCampaigns,
    };
}