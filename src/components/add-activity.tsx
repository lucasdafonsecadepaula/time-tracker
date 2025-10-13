"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface AddActivityProps {
  onAddActivity: (name: string) => void
}

export function AddActivity({ onAddActivity }: AddActivityProps) {
  const [newActivity, setNewActivity] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newActivity.trim()) {
      onAddActivity(newActivity.trim())
      setNewActivity("")
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">Add Custom Activity</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter activity name..."
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
