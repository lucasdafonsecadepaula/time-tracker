"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useState } from "react"

interface AddDailyTodoProps {
  onAddTodo: (name: string) => void
}

export function AddDailyTodo({ onAddTodo }: AddDailyTodoProps) {
  const [todoName, setTodoName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (todoName.trim()) {
      onAddTodo(todoName.trim())
      setTodoName("")
    }
  }

  return (
    <Card className="border-2 border-dashed border-primary/30 shadow-lg hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add Daily Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="text"
            placeholder="e.g., Drink 8 glasses of water"
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
            className="flex-1 border-2 focus-visible:ring-primary"
          />
          <Button type="submit" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
            <Plus className="h-5 w-5 mr-2" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
