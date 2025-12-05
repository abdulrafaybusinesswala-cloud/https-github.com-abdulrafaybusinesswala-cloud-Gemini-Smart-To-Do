export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subtasks?: Subtask[];
  isExpanding?: boolean; // Loading state for AI expansion
}

export type FilterType = 'all' | 'active' | 'completed';
