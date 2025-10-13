"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { DailyTodo, DailyTodoCompletion } from "@/types/activity"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface DailyTodosProps {
  todos: DailyTodo[]
  completions: DailyTodoCompletion[]
  onToggle: (todoId: string, date: string) => void
  getTodoCompletion: (todoId: string, date: string) => boolean
}

export function DailyTodos({ todos, completions, onToggle, getTodoCompletion }: DailyTodosProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(["today"]))

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  // Get unique dates from completions and add today
  const dates = Array.from(new Set([todayStr, ...completions.map((c) => c.date)])).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateToCompare = new Date(date)
    dateToCompare.setHours(0, 0, 0, 0)

    if (dateToCompare.getTime() === today.getTime()) {
      return "Today"
    } else if (dateToCompare.getTime() === yesterday.getTime()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(date)) {
        newSet.delete(date)
      } else {
        newSet.add(date)
      }
      return newSet
    })
  }

  const getCompletionStats = (date: string) => {
    const completed = todos.filter((todo) => getTodoCompletion(todo.id, date)).length
    return { completed, total: todos.length }
  }

  if (todos.length === 0) {
    return (
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Daily Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No daily todos yet. Add one below!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Daily Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dates.map((date) => {
          const isExpanded = expandedDays.has(date)
          const stats = getCompletionStats(date)
          const isToday = date === todayStr

          return (
            <div key={date} className="border-2 border-border/50 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-accent/50"
                onClick={() => toggleDay(date)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <div className="text-left">
                    <div className="font-semibold text-lg">{formatDate(date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.completed} of {stats.total} completed
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{Math.round((stats.completed / stats.total) * 100)}%</div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                      style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </Button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-2 bg-accent/5">
                  {todos.map((todo) => {
                    const isCompleted = getTodoCompletion(todo.id, date)
                    return (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <Checkbox
                          id={`${todo.id}-${date}`}
                          checked={isCompleted}
                          onCheckedChange={() => onToggle(todo.id, date)}
                          disabled={!isToday}
                          className="h-5 w-5"
                        />
                        <label
                          htmlFor={`${todo.id}-${date}`}
                          className={`flex-1 cursor-pointer text-base ${
                            isCompleted ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {todo.name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
