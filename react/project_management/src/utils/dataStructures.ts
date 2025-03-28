export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
}

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

export const TaskStatus: string[] = ["Ready", "In Progress", "Completed", "On Hold"];

export const ColorCodes: string[] = ["#1976d2", "#ff9800", "#4caf50", "#f44336"];

export enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}