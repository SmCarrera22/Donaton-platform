import { postToBff } from "@/lib/bff";

export type RegisterFormData = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    region: string;
    comuna: string;
    acceptTerms: boolean;
};

export type RegisterResponse = {
    id?: number;
    name?: string;
    email?: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};

export const authService = {
    register: async (
        formData: Omit<RegisterFormData, "confirmPassword" | "acceptTerms">
    ) => {
        const userCreateRequest = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            region: formData.region,
            comuna: formData.comuna,
        };

        return await postToBff<RegisterResponse>(
            "/api/register",
            userCreateRequest
        );
    },

    login: async (credentials: LoginCredentials) => {
        return await postToBff<LoginResponse>(
            "/api/login",
            credentials
        );
    },
};