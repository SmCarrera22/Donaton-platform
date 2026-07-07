export type UserProfile = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    region: string | null;
    comuna: string | null;
    role: string;
};

export type AuthSession = {
    token: string;
    email: string;
    role: string;
};