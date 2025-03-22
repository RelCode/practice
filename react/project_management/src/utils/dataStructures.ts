export interface Project {
	projectId: number,
	name: string;
	description: string;
	ownerId: string;
}

export interface TaskItem {
    taskItemId: number;
    title: string;
    description: string;
    isCompleted: boolean;
    dueDate: string;
    status: string;
    taskPriority: TaskPriority;
    projectId: number;
}

export const TaskStatus: Record<string, string> = {
    "Ready": "Ready",
    "InProgress": "In Progress",
    "Completed": "Completed",
    "OnHold": "On Hold"
}

export enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}