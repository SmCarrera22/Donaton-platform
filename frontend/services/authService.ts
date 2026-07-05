// services/authService.ts
import { postToBff } from "@/lib/bff";

// ==========================================
// 1. TIPOS DE DATOS (MOLDE DE ENTRADA Y SALIDA)
// ==========================================

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
    success: boolean;
    mensaje: string;
};

// ==========================================
// 2. SERVICIO CENTRALIZADO DE AUTENTICACIÓN
// ==========================================

export const authService = {
    /**
     * Envía los datos transformándolos al formato exacto del DTO UserCreateRequest de Java
     */
    register: async (formData: Omit<RegisterFormData, "confirmPassword" | "acceptTerms">) => {
        // Mapeo Espejo hacia el DTO de Spring Boot
        const userCreateRequest = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            region: formData.region,
            comuna: formData.comuna
        };

        return await postToBff<RegisterResponse>("/api/register", userCreateRequest);
    },

    /**
     * Envía las credenciales directamente hacia el BFF para iniciar sesión
     */
    login: async (credentials: LoginCredentials) => {
        return await postToBff<LoginResponse>("/api/login", credentials);
    }
};