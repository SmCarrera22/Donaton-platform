export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    region?: string;
    comuna?: string;
    role: "USER" | "ADMIN";
}

export interface AuthSession {
    token: string;
    email: string;
    role: string;
}