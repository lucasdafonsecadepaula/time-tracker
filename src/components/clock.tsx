"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="p-10 text-center bg-gradient-to-br from-primary via-accent to-secondary shadow-2xl shadow-primary/20 border-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/95 to-white/90 dark:from-black/80 dark:via-black/85 dark:to-black/80" />
      <div className="space-y-3 relative z-10">
        <div className="text-6xl font-mono font-bold tracking-wider bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          {formatTime(time)}
        </div>
        <div className="text-xl text-foreground/80 font-medium">{formatDate(time)}</div>
      </div>
    </Card>
  )
}
