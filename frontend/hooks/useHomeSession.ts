import { useState, useEffect } from "react";
import { clearCurrentSessionUser, getCurrentSessionUser } from "@/lib/session";

export type LoggedInUser = {
    fullName: string;
    email: string;
    createdAt: string;
};

export function useHomeSession() {
    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);

    useEffect(() => {
        const currentSession = getCurrentSessionUser();
        if (currentSession) {
            setLoggedInUser(currentSession);
        }
    }, []);

    const handleLogout = () => {
        clearCurrentSessionUser();
        setLoggedInUser(null);
    };

    return {
        loggedInUser,
        handleLogout
    };
}