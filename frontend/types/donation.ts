export type Donation = {
    id: number;
    donorId: number;
    donorType: string;
    resourceType: string;
    quantity: number;
    description: string;
    status: string;
    createdAt: string;
};

export type DonationCreateRequest = {
    resourceName: string;
    resourceType: string;
    donorType: string;
    quantity: number;
};