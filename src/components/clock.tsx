import { useState, useEffect } from 'react'

const MOTIVATIONAL_MESSAGES = [
  'Stay focused!',
  "You're doing great!",
  'Keep up the momentum!',
  'Time well spent is life well lived!',
  'Focus on what matters!',
  'Every second counts!',
]

interface ClockProps {
  totalTimeToday: number
}

export const Clock = ({ totalTimeToday }: ClockProps) => {
  const [time, setTime] = useState(new Date())
  const [message] = useState(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold md:text-4xl">{formatTime(time)}</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">{formatDate(time)}</p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-muted-foreground text-sm">{message}</p>
            <p className="text-primary mt-1 text-lg font-semibold">Today: {formatDuration(totalTimeToday)}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
