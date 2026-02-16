export interface Habit {
  id: string;
  name: string;
  icon: string;
  completedToday: boolean;
  rhythm: 'daily' | 'weekly';
  reminderTime?: string;
  weekDays?: number[]; // 0-6, Sunday to Saturday
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Supplement {
  id: string;
  name: string;
  icon: string;
  streak: number;
  takenToday: boolean;
}

export interface AppData {
  habits: Habit[];
  tasks: Task[];
  supplements: Supplement[];
  waterIntake: number;
  lastUpdated: string;
}
