import { useEffect, useState } from "react";
import { clearSession, getSession } from "@/lib/session";

export function useHomeSession() {
    const [loggedInUser, setLoggedInUser] = useState(getSession());

    useEffect(() => {
        setLoggedInUser(getSession());
    }, []);

    const handleLogout = () => {
        clearSession();
        setLoggedInUser(null);
    };

    return {
        loggedInUser,
        handleLogout,
    };
}