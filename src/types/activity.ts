export interface Activity {
  name: string
  totalSeconds: number
}

export interface Session {
  activityName: string
  startTime: Date
  endTime: Date
  durationSeconds: number
}

export interface DailyTodo {
  id: string
  name: string
}

export interface DailyTodoCompletion {
  todoId: string
  date: string // YYYY-MM-DD format
  completed: boolean
}
