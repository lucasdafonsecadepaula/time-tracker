"use client"

import { Card } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { Activity } from "../../types/activity"

interface DailySummaryProps {
  activities: Activity[]
}

export function DailySummary({ activities }: DailySummaryProps) {
  const totalSeconds = activities.reduce((sum, activity) => sum + activity.totalSeconds, 0)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else {
      return `${seconds}s`
    }
  }

  const getPercentage = (seconds: number) => {
    if (totalSeconds === 0) return 0
    return Math.round((seconds / totalSeconds) * 100)
  }

  const getBarColor = (index: number) => {
    const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-chart-4", "bg-chart-5"]
    return colors[index % colors.length]
  }

  return (
    <Card className="p-6 shadow-lg border-primary/10">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-semibold">Daily Summary</h2>
      </div>
      {totalSeconds === 0 ? (
        <p className="text-muted-foreground text-center py-8">Start tracking to see your daily summary</p>
      ) : (
        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-xl border border-primary/20">
            <div className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Total Time Tracked
            </div>
            <div className="text-4xl font-bold font-mono bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {formatDuration(totalSeconds)}
            </div>
          </div>
          <div className="space-y-4">
            {activities
              .filter((activity) => activity.totalSeconds > 0)
              .sort((a, b) => b.totalSeconds - a.totalSeconds)
              .map((activity, index) => (
                <div key={activity.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{activity.name}</span>
                    <span className="font-mono text-muted-foreground font-medium">
                      {formatDuration(activity.totalSeconds)} ({getPercentage(activity.totalSeconds)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${getBarColor(index)} transition-all duration-500 rounded-full shadow-sm`}
                      style={{
                        width: `${getPercentage(activity.totalSeconds)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  )
}
