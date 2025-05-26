"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Plus } from "lucide-react"

interface Task {
  id?: number
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
}

interface TaskFormProps {
  task?: Task
  isOpen: boolean
  onSave: (task: Task) => void
  onCancel: () => void
  mode: "add" | "edit"
}

export default function TaskForm({ task, isOpen, onSave, onCancel, mode }: TaskFormProps) {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    priority: "medium",
    status: "to-do",
  })

  const [errors, setErrors] = useState<{
    title?: string
    description?: string
  }>({})

  // Reset form when task prop changes or when opening for add mode
  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData(task)
    } else if (mode === "add") {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "to-do",
      })
    }
    setErrors({})
  }, [task, mode, isOpen])

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave({
        ...formData,
        id: mode === "edit" ? task?.id : Date.now(),
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "to-do",
    })
    setErrors({})
    onCancel()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {mode === "add" ? (
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Task
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Edit Task
              </div>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={errors.title ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter task description..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "to-do" | "in-progress" | "done") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-do">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      To Do
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="done">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Done
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {mode === "add" ? "Add Task" : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
