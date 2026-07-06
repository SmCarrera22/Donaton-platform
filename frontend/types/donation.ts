export interface Donation {
    id: number;
    donorId?: number;
    description?: string;
    resourceName?: string;
    quantity?: number;
    resourceType?: string;
    donorType?: string;
    status: string;
    createdAt?: string;
}