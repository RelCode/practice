export interface Project {
	projectId: number,
	name: string;
	description: string;
	ownerId: string;
	tasks: TaskItem[];
}

export interface TaskItem {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    dueDate: string;
    taskStatus: TaskStatus;
    taskPriority: TaskPriority;
    projectId: number;
}

export enum TaskStatus {
    Ready = "Ready",
    InProgress = "In Progress",
    Completed = "Completed",
    OnHold = "On Hold"
}

export enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}