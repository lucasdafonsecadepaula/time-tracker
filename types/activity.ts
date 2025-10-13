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
