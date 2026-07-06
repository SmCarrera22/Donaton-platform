"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { extractErrorMessage } from "@/lib/bff";
import type { UserProfile } from "@/types/user";

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadProfile = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await userService.getCurrentProfile();

            if (!response.ok) {
                setErrorMessage(
                    extractErrorMessage(
                        response.body,
                        `No se pudo cargar el perfil (${response.status}).`
                    )
                );
                return;
            }

            if (response.body && typeof response.body === "object") {
                setProfile(response.body as UserProfile);
            }
        } catch {
            setErrorMessage("No fue posible conectar con el servicio de usuarios.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return {
        profile,
        isLoading,
        errorMessage,
        reloadProfile: loadProfile,
    };
}