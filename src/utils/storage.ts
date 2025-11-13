export interface Task {
  id: string;
  name: string;
  timeSpent: number; // in seconds
}

export interface DayRecord {
  tasks: Task[];
}

export interface Reminder {
  id: string;
  name: string;
  type: 'interval' | 'daily';
  interval?: number; // in seconds (for interval type)
  dailyTime?: string; // HH:MM format (for daily type)
  lastTriggered: number; // timestamp
  checkedToday: boolean;
}

export interface ReminderHistory {
  reminderId: string;
  reminderName: string;
  completedAt: number; // timestamp
  date: string; // YYYY-MM-DD
}

export interface ActiveTask {
  id: string;
  startTime: number;
}

export interface AppData {
  days: Record<string, DayRecord>;
  reminders: Reminder[];
  reminderHistory: ReminderHistory[];
  activeTask: ActiveTask | null;
  theme: 'light' | 'dark';
}

const STORAGE_KEY = 'focusflow-data';

export const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    days: {},
    reminders: [],
    reminderHistory: [],
    activeTask: null,
    theme: 'light',
  };
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getTodayTasks = (): Task[] => {
  const data = loadData();
  const today = getToday();
  return data.days[today]?.tasks || [];
};

export const saveTodayTasks = (tasks: Task[]): void => {
  const data = loadData();
  const today = getToday();
  data.days[today] = { tasks };
  saveData(data);
};

export const getReminders = (): Reminder[] => {
  const data = loadData();
  return data.reminders || [];
};

export const saveReminders = (reminders: Reminder[]): void => {
  const data = loadData();
  data.reminders = reminders;
  saveData(data);
};

export const getTheme = (): 'light' | 'dark' => {
  const data = loadData();
  return data.theme;
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  const data = loadData();
  data.theme = theme;
  saveData(data);
};

export const exportData = (): string => {
  return JSON.stringify(loadData(), null, 2);
};

export const exportCSV = (): string => {
  const data = loadData();
  let csv = 'Date,Task,Time (hours)\n';
  
  Object.entries(data.days).forEach(([date, dayRecord]) => {
    dayRecord.tasks.forEach(task => {
      const hours = (task.timeSpent / 3600).toFixed(2);
      csv += `${date},${task.name},${hours}\n`;
    });
  });
  
  return csv;
};

export const getActiveTask = (): ActiveTask | null => {
  const data = loadData();
  return data.activeTask;
};

export const saveActiveTask = (activeTask: ActiveTask | null): void => {
  const data = loadData();
  data.activeTask = activeTask;
  saveData(data);
};

export const getReminderHistory = (): ReminderHistory[] => {
  const data = loadData();
  return data.reminderHistory || [];
};

export const addReminderHistory = (reminderId: string, reminderName: string): void => {
  const data = loadData();
  if (!data.reminderHistory) data.reminderHistory = [];
  data.reminderHistory.push({
    reminderId,
    reminderName,
    completedAt: Date.now(),
    date: getToday(),
  });
  saveData(data);
};
