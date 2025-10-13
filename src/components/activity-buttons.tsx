"use client"

import { Button } from "@/components/ui/button"
import type { Activity } from "@/types/activity"
import { Clock, Play, Square } from "lucide-react"

interface ActivityButtonsProps {
  activities: Activity[]
  activeActivity: string | null
  onActivityClick: (name: string) => void
}

export function ActivityButtons({ activities, activeActivity, onActivityClick }: ActivityButtonsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getActivityColor = (index: number) => {
    const colors = [
      "from-primary to-accent",
      "from-secondary to-chart-5",
      "from-accent to-chart-3",
      "from-chart-4 to-primary",
      "from-chart-5 to-secondary",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map((activity, index) => {
        const isActive = activeActivity === activity.name

        return (
          <Button
            key={activity.name}
            onClick={() => onActivityClick(activity.name)}
            variant={isActive ? "default" : "outline"}
            className={`h-auto p-6 flex flex-col items-start gap-3 relative overflow-hidden group transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-br ${getActivityColor(index)} text-white border-0 shadow-xl shadow-primary/30 scale-105`
                : "hover:shadow-lg hover:scale-102 hover:border-primary/50"
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
            )}
            <div className="flex items-center gap-2 w-full relative z-10">
              {isActive ? (
                <Square className="h-5 w-5 fill-current animate-pulse" />
              ) : (
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-semibold text-lg">{activity.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm relative z-10 opacity-90">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-medium">{formatDuration(activity.totalSeconds)}</span>
            </div>
            {isActive && (
              <div className="text-xs font-bold uppercase tracking-wider relative z-10 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
                Active
              </div>
            )}
          </Button>
        )
      })}
    </div>
  )
}
