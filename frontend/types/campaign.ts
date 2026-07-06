export interface Campaign {
    id: number;
    name?: string;
    title?: string;
    description: string;
    goal?: number;
    targetAmount?: number;
    collected?: number;
    currentAmount?: number;
    status: string;
}