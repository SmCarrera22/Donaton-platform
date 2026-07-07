import { getFromBff, putToBff } from "@/lib/bff";
import type { UserProfile } from "@/types/user";

export type UserUpdateRequest = {
    name: string;
    phone: string;
    address: string;
    region: string;
    comuna: string;
};

export const userService = {
    getCurrentProfile: () => {
        return getFromBff<UserProfile>("/api/users/me");
    },

    updateProfile: (id: number, payload: UserUpdateRequest) => {
        return putToBff<UserProfile>(`/api/users/${id}`, payload);
    },
};