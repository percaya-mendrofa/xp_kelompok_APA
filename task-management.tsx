"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
}

export default function Component() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Design Homepage",
      description: "Create wireframes and mockups for the new homepage layout",
      priority: "high",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Fix Login Bug",
      description: "Resolve authentication issue preventing users from logging in",
      priority: "high",
      status: "to-do",
    },
    {
      id: 3,
      title: "Update Documentation",
      description: "Review and update API documentation for the latest version",
      priority: "medium",
      status: "done",
    },
    {
      id: 4,
      title: "Optimize Database",
      description: "Improve query performance and add necessary indexes",
      priority: "medium",
      status: "to-do",
    },
    {
      id: 5,
      title: "Team Meeting",
      description: "Weekly standup meeting to discuss project progress",
      priority: "low",
      status: "done",
    },
    {
      id: 6,
      title: "Code Review",
      description: "Review pull requests from team members",
      priority: "medium",
      status: "in-progress",
    },
  ])

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

  const handleEdit = (taskId: number) => {
    console.log("Edit task:", taskId)
    // Add edit functionality here
  }

  const handleDelete = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="text-gray-600 mt-1">Manage and track your tasks efficiently</p>
            </div>
            <Button className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">
                {tasks.filter((task) => task.status === "to-do").length}
              </div>
              <p className="text-gray-600">To Do</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((task) => task.status === "in-progress").length}
              </div>
              <p className="text-gray-600">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter((task) => task.status === "done").length}
              </div>
              <p className="text-gray-600">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{task.title}</CardTitle>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(task.id)}
                      className="h-8 w-8 p-0 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</span>
                    <Badge variant="outline" className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                    <Badge variant="outline" className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first task</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
