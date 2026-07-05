import { getFromBff } from "@/lib/bff";
import { getSession } from "@/lib/session";
import type { UserProfile } from "@/types/user";

export const userService = {
    getCurrentProfile: () => {
        const session = getSession();

        if (!session) {
            throw new Error("No hay sesión activa.");
        }

        /*
         * Por ahora el BFF solo tiene /api/users/{id}.
         * Más adelante conviene agregar /api/users/me en el BFF.
         * Dejaremos este método preparado para cuando tengamos ese endpoint.
         */
        return getFromBff<UserProfile>("/api/users/1");
    },
};