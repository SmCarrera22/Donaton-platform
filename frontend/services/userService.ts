import { getFromBff } from "@/lib/bff";
import type { UserProfile } from "@/types/user";

export const userService = {
    getCurrentProfile: () => {
        return getFromBff<UserProfile>("/api/users/me");
    },
};