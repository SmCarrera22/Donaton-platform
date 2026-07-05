export interface Campaign {
    id: number;
    title: string;
    description: string;
    goal: number;
    collected: number;
    status: "ACTIVE" | "FINISHED";
}