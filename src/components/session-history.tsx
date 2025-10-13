"use client"

import { Card } from "@/components/ui/card"
import { Calendar, ChevronDown, ChevronRight, Clock } from "lucide-react"
import { useState } from "react"
import { Session } from "../types/activity"

interface SessionHistoryProps {
  history: Session[]
}

function groupSessionsByDay(sessions: Session[]) {
  const groups = new Map<string, Session[]>()

  sessions.forEach((session) => {
    const dateKey = new Date(session.startTime).toDateString()
    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(session)
  })

  return Array.from(groups.entries()).map(([dateKey, sessions]) => ({
    dateKey,
    date: new Date(dateKey),
    sessions,
  }))
}

function formatDateLabel(date: Date) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateStr = date.toDateString()
  const todayStr = today.toDateString()
  const yesterdayStr = yesterday.toDateString()

  if (dateStr === todayStr) return "Today"
  if (dateStr === yesterdayStr) return "Yesterday"

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  })
}

export function SessionHistory({ history }: SessionHistoryProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set([new Date().toDateString()]))

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

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

  const toggleDay = (dateKey: string) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey)
      } else {
        newSet.add(dateKey)
      }
      return newSet
    })
  }

  const groupedSessions = groupSessionsByDay(history)

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Session History</h2>
      {history.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No sessions recorded yet. Start tracking an activity!</p>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {groupedSessions.map(({ dateKey, date, sessions }) => {
            const isExpanded = expandedDays.has(dateKey)
            const totalSeconds = sessions.reduce((sum, session) => sum + session.durationSeconds, 0)

            return (
              <div key={dateKey} className="border rounded-lg overflow-hidden">
                {/* Day header */}
                <button
                  onClick={() => toggleDay(dateKey)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-lg">{formatDateLabel(date)}</div>
                      <div className="text-sm text-muted-foreground">
                        {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono font-semibold text-primary">
                    <Clock className="h-4 w-4" />
                    {formatDuration(totalSeconds)}
                  </div>
                </button>

                {/* Sessions list */}
                {isExpanded && (
                  <div className="p-2 space-y-2 bg-card">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/10 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold">{session.activityName}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatTime(session.startTime)}</span>
                            </div>
                            <span>→</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatTime(session.endTime)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 font-mono font-semibold">
                          <Clock className="h-4 w-4" />
                          {formatDuration(session.durationSeconds)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
