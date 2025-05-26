"use client"

import { Edit, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "to-do":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id)
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6"
      data-testid="task-card"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900" data-testid="task-title">
          {task.title}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-blue-50 rounded"
            data-testid="edit-button"
            aria-label={`Edit ${task.title}`}
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-50 rounded"
            data-testid="delete-button"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4" data-testid="task-description">
        {task.description}
      </p>

      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}
          data-testid="task-priority"
        >
          {task.priority}
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}
          data-testid="task-status"
        >
          {task.status.replace("-", " ")}
        </span>
      </div>

      <p className="text-xs text-gray-400" data-testid="task-updated">
        Updated:{" "}
        {new Date(task.updatedAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  )
}
