
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id:string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string; // ISO string date
  dueDate?: string; // ISO string date, optional
  priority?: TaskPriority; // Optional
  subtasks: Subtask[];
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate?: string;
  priority?: TaskPriority;
}

export type Locale = 'en' | 'hi';

export interface Translations {
  appTitle: string;
  createTaskButton: string;
  noTasksYetHeading: string;
  noTasksYetDescription: string;
  switchToHindi: string;
  switchToEnglish: string;
  siteDescription: string;
  footerText: string;
}

export type TranslationKeys = keyof Translations;
