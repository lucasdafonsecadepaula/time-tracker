'use client'
import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock } from '@/components/Clock'
import { TaskTracker } from '@/components/TaskTracker'
import { ReminderManager } from '@/components/ReminderManager'
import { HistoryView } from '@/components/HistoryView'
import { getTodayTasks, getTheme, saveTheme } from '@/lib/storage'

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme())
  const [totalTimeToday, setTotalTimeToday] = useState(0)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    saveTheme(theme)
  }, [theme])

  useEffect(() => {
    updateTotalTime()
  }, [])

  const updateTotalTime = () => {
    const tasks = getTodayTasks()
    const total = tasks.reduce((sum, task) => sum + task.timeSpent, 0)
    setTotalTimeToday(total)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="bg-background min-h-screen">
      <Clock totalTimeToday={totalTimeToday} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-bold">FocusFlow</h1>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TaskTracker onTimeUpdate={updateTotalTime} />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderManager />
          </TabsContent>

          <TabsContent value="history">
            <HistoryView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
