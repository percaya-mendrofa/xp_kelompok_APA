"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, Plus } from "lucide-react"
import type { Task, TaskFormData } from "@/lib/types"

interface TaskFormProps {
  task?: Task
  isOpen: boolean
  onSave: (taskData: TaskFormData) => void
  onCancel: () => void
  mode: "add" | "edit"
}

export default function TaskForm({ task, isOpen, onSave, onCancel, mode }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    status: "to-do",
  })

  const [errors, setErrors] = useState<{
    title?: string
    description?: string
  }>({})

  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
      })
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

  const validateForm = (): boolean => {
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
      onSave(formData)
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      data-testid="task-form-modal"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {mode === "add" ? (
              <>
                <Plus className="w-5 h-5" />
                Add New Task
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Edit Task
              </>
            )}
          </h2>
          <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded" data-testid="close-button">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.title ? "border-red-500" : "border-gray-300"}`}
              data-testid="title-input"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1" data-testid="title-error">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter task description..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              data-testid="description-input"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1" data-testid="description-error">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                data-testid="priority-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                data-testid="status-select"
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              data-testid="save-button"
            >
              <Save className="w-4 h-4" />
              {mode === "add" ? "Add Task" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
              data-testid="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
