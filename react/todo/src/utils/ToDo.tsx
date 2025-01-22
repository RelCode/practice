export interface ITodo {
    id: number;
    title: string;
    desc: string;
    priority: string;
    completed: boolean;
}

export enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}