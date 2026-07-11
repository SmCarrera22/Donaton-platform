"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    clearSession,
    getSession,
} from "@/lib/session";
import type { AuthSession } from "@/types/user";

export function useHomeSession() {
    const router = useRouter();

    const [loggedInUser, setLoggedInUser] =
        useState<AuthSession | null>(() => getSession());

    const handleLogout = () => {
        clearSession();
        setLoggedInUser(null);
        router.push("/login");
    };

    return {
        loggedInUser,
        handleLogout,
    };
}