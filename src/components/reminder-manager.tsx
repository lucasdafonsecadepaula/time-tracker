import { useState, useEffect } from 'react'
import { Bell, Trash2, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getReminders, saveReminders, Reminder, getReminderHistory, addReminderHistory } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'

export const ReminderManager = () => {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminderName, setNewReminderName] = useState('')
  const [reminderType, setReminderType] = useState<'interval' | 'daily'>('interval')
  const [newReminderInterval, setNewReminderInterval] = useState('')
  const [newReminderTime, setNewReminderTime] = useState('')
  const [history, setHistory] = useState(getReminderHistory())
  const { toast } = useToast()

  useEffect(() => {
    setReminders(getReminders())
  }, [])

  useEffect(() => {
    saveReminders(reminders)
  }, [reminders])

  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now()
      const currentTime = new Date()
      const currentHour = currentTime.getHours()
      const currentMinute = currentTime.getMinutes()

      reminders.forEach((reminder) => {
        let shouldTrigger = false

        if (reminder.type === 'interval' && reminder.interval) {
          if (!reminder.checkedToday && now - reminder.lastTriggered >= reminder.interval * 1000) {
            shouldTrigger = true
          }
        } else if (reminder.type === 'daily' && reminder.dailyTime) {
          const [targetHour, targetMinute] = reminder.dailyTime.split(':').map(Number)
          const lastTriggered = new Date(reminder.lastTriggered)
          const isToday = lastTriggered.toDateString() === currentTime.toDateString()

          if (!isToday && currentHour === targetHour && currentMinute === targetMinute) {
            shouldTrigger = true
          }
        }

        if (shouldTrigger) {
          toast({
            title: `⏰ ${reminder.name}`,
            description: 'Time for your reminder!',
          })

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(reminder.name, {
              body: 'Time for your reminder!',
              icon: '/placeholder.svg',
            })
          }

          setReminders((prev) => prev.map((r) => (r.id === reminder.id ? { ...r, lastTriggered: now } : r)))
        }
      })
    }

    const interval = setInterval(checkReminders, 60000)
    checkReminders() // Check immediately
    return () => clearInterval(interval)
  }, [reminders, toast])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const addReminder = () => {
    if (!newReminderName.trim()) return
    if (reminderType === 'interval' && !newReminderInterval) return
    if (reminderType === 'daily' && !newReminderTime) return

    const newReminder: Reminder = {
      id: Date.now().toString(),
      name: newReminderName,
      type: reminderType,
      interval: reminderType === 'interval' ? parseFloat(newReminderInterval) * 3600 : undefined,
      dailyTime: reminderType === 'daily' ? newReminderTime : undefined,
      lastTriggered: Date.now(),
      checkedToday: false,
    }

    setReminders([...reminders, newReminder])
    setNewReminderName('')
    setNewReminderInterval('')
    setNewReminderTime('')

    const description =
      reminderType === 'interval'
        ? `"${newReminderName}" will remind you every ${newReminderInterval} hours.`
        : `"${newReminderName}" will remind you daily at ${newReminderTime}.`

    toast({ title: 'Reminder added', description })
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id))
    toast({ title: 'Reminder deleted', variant: 'destructive' })
  }

  const toggleChecked = (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (reminder && !reminder.checkedToday) {
      addReminderHistory(id, reminder.name)
      setHistory(getReminderHistory())
    }
    setReminders(reminders.map((r) => (r.id === id ? { ...r, checkedToday: !r.checkedToday } : r)))
  }

  const formatNextReminder = (reminder: Reminder) => {
    if (reminder.type === 'interval' && reminder.interval) {
      const next = new Date(reminder.lastTriggered + reminder.interval * 1000)
      return next.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (reminder.type === 'daily' && reminder.dailyTime) {
      return reminder.dailyTime
    }
    return ''
  }

  const getTodayHistory = () => {
    const today = new Date().toISOString().split('T')[0]
    return history.filter((h) => h.date === today)
  }

  const getHistoryByDate = () => {
    const grouped: Record<string, typeof history> = {}
    history.forEach((h) => {
      if (!grouped[h.date]) grouped[h.date] = []
      grouped[h.date].push(h)
    })
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="reminders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reminders">Active Reminders</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="reminders" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Reminder name..."
                value={newReminderName}
                onChange={(e) => setNewReminderName(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Select value={reminderType} onValueChange={(v: 'interval' | 'daily') => setReminderType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interval">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Every X hours
                      </div>
                    </SelectItem>
                    <SelectItem value="daily">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Daily at time
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {reminderType === 'interval' ? (
                  <Input
                    type="number"
                    placeholder="Hours"
                    value={newReminderInterval}
                    onChange={(e) => setNewReminderInterval(e.target.value)}
                    min="0.1"
                    step="0.5"
                  />
                ) : (
                  <Input type="time" value={newReminderTime} onChange={(e) => setNewReminderTime(e.target.value)} />
                )}
              </div>

              <Button onClick={addReminder} className="w-full">
                Add Reminder
              </Button>
            </div>

            <div className="space-y-2">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Checkbox checked={reminder.checkedToday} onCheckedChange={() => toggleChecked(reminder.id)} />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold">{reminder.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            {reminder.type === 'interval' && reminder.interval ? (
                              <>
                                Every {(reminder.interval / 3600).toFixed(1)}h · Next: {formatNextReminder(reminder)}
                              </>
                            ) : (
                              <>Daily at {reminder.dailyTime}</>
                            )}
                          </p>
                        </div>
                      </div>

                      <Button size="icon" variant="outline" onClick={() => deleteReminder(reminder.id)}>
                        <Trash2 />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {reminders.length === 0 && (
                <p className="text-muted-foreground py-8 text-center">No reminders set. Add one to stay on track!</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Today's Completions ({getTodayHistory().length})</h3>
                <div className="space-y-2">
                  {getTodayHistory().map((h) => (
                    <Card key={h.completedAt} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{h.reminderName}</span>
                          <span className="text-muted-foreground text-sm">
                            {new Date(h.completedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {getTodayHistory().length === 0 && (
                    <p className="text-muted-foreground py-4 text-center">No completions today yet.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">All History</h3>
                <div className="space-y-3">
                  {getHistoryByDate().map(([date, items]) => (
                    <div key={date}>
                      <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </h4>
                      <div className="space-y-1">
                        {items.map((h) => (
                          <Card key={h.completedAt} className="border">
                            <CardContent className="p-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{h.reminderName}</span>
                                <span className="text-muted-foreground">
                                  {new Date(h.completedAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <p className="text-muted-foreground py-8 text-center">
                      No history yet. Complete some reminders to see them here!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
