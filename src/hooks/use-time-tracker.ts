"use client"

import { useEffect, useRef, useState } from "react"
import { Activity, Session } from "../../types/activity"

const DEFAULT_ACTIVITIES = ["Doing Nothing", "Working", "Studying"]

export function useTimeTracker() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [sessionHistory, setSessionHistory] = useState<Session[]>([])
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem("activities")
    const savedHistory = localStorage.getItem("sessionHistory")

    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    } else {
      // Initialize with default activities
      const defaultActivities = DEFAULT_ACTIVITIES.map((name) => ({
        name,
        totalSeconds: 0,
      }))
      setActivities(defaultActivities)
    }

    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory)
      // Convert date strings back to Date objects
      const historyWithDates = parsedHistory.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
      }))
      setSessionHistory(historyWithDates)
    }
  }, [])

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem("activities", JSON.stringify(activities))
    }
  }, [activities])

  // Save session history to localStorage whenever it changes
  useEffect(() => {
    if (sessionHistory.length > 0) {
      localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory))
    }
  }, [sessionHistory])

  // Timer effect
  useEffect(() => {
    if (activeActivity) {
      intervalRef.current = setInterval(() => {
        setActivities((prev) =>
          prev.map((activity) =>
            activity.name === activeActivity ? { ...activity, totalSeconds: activity.totalSeconds + 1 } : activity,
          ),
        )
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activeActivity])

  const addActivity = (name: string) => {
    if (activities.some((activity) => activity.name === name)) {
      alert("Activity already exists!")
      return
    }

    const newActivity: Activity = {
      name,
      totalSeconds: 0,
    }

    setActivities((prev) => [...prev, newActivity])
  }

  const startActivity = (name: string) => {
    const now = new Date()

    // If there's an active activity, stop it and create a session
    if (activeActivity && sessionStartTime) {
      const session: Session = {
        activityName: activeActivity,
        startTime: sessionStartTime,
        endTime: now,
        durationSeconds: Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000),
      }
      setSessionHistory((prev) => [session, ...prev])
    }

    // If clicking the same activity, stop it
    if (activeActivity === name) {
      setActiveActivity(null)
      setSessionStartTime(null)
    } else {
      // Start the new activity
      setActiveActivity(name)
      setSessionStartTime(now)
    }
  }

  const stopActivity = () => {
    if (activeActivity && sessionStartTime) {
      const now = new Date()
      const session: Session = {
        activityName: activeActivity,
        startTime: sessionStartTime,
        endTime: now,
        durationSeconds: Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000),
      }
      setSessionHistory((prev) => [session, ...prev])
    }

    setActiveActivity(null)
    setSessionStartTime(null)
  }

  return {
    activities,
    activeActivity,
    sessionHistory,
    addActivity,
    startActivity,
    stopActivity,
  }
}
