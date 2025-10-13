"use client"
import { Clock } from "@/components/clock"
import { ActivityButtons } from "@/components/activity-buttons"
import { AddActivity } from "@/components/add-activity"
import { SessionHistory } from "@/components/session-history"
import { DailySummary } from "@/components/daily-summary"
import { useTimeTracker } from "@/hooks/use-time-tracker"

export default function TimeTrackerPage() {
  const { activities, activeActivity, sessionHistory, addActivity, startActivity, stopActivity } = useTimeTracker()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Time Tracker
            </h1>
            <p className="text-lg text-muted-foreground">Monitor how you spend your time throughout the day</p>
          </div>

          {/* Live Clock */}
          <Clock />

          {/* Activity Buttons */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Activities</h2>
            <ActivityButtons activities={activities} activeActivity={activeActivity} onActivityClick={startActivity} />
          </div>

          {/* Add Custom Activity */}
          <AddActivity onAddActivity={addActivity} />

          {/* Daily Summary */}
          <DailySummary activities={activities} />

          {/* Session History */}
          <SessionHistory history={sessionHistory} />
        </div>
      </div>
    </div>
  )
}
