"use client"

import { useState, useEffect } from "react"
import { Plus, Database } from "lucide-react"
import type { Task, TaskFormData } from "@/lib/types"
import { TaskService } from "@/lib/taskService"
import TaskForm from "@/components/TaskForm"
import TaskCard from "@/components/TaskCard"

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Design Homepage",
    description: "Create wireframes and mockups for the new homepage layout with modern UI/UX principles",
    priority: "high",
    status: "in-progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Fix Login Bug",
    description: "Resolve authentication issue preventing users from logging in to the application",
    priority: "high",
    status: "to-do",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Update Documentation",
    description: "Review and update API documentation for the latest version release",
    priority: "medium",
    status: "done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [formMode, setFormMode] = useState<"add" | "edit">("add")

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        const storedTasks = TaskService.getTasks()
        if (storedTasks.length === 0) {
          // Initialize with default tasks if none exist
          TaskService.saveTasks(defaultTasks)
          setTasks(defaultTasks)
        } else {
          setTasks(storedTasks)
        }
      } catch (error) {
        console.error("Error loading tasks:", error)
        setTasks(defaultTasks)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Save tasks whenever tasks change
  useEffect(() => {
    if (!isLoading && tasks.length >= 0) {
      TaskService.saveTasks(tasks)
    }
  }, [tasks, isLoading])

  const handleAddTask = () => {
    setFormMode("add")
    setEditingTask(undefined)
    setIsFormOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setFormMode("edit")
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleSaveTask = (taskData: TaskFormData) => {
    if (formMode === "add") {
      const newTask = TaskService.createTask(taskData)
      setTasks((prevTasks) => [...prevTasks, newTask])
    } else if (editingTask) {
      const updatedTask = TaskService.updateTask(editingTask, taskData)
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === editingTask.id ? updatedTask : task)))
    }
    setIsFormOpen(false)
    setEditingTask(undefined)
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingTask(undefined)
  }

  const handleClearAllTasks = () => {
    if (window.confirm("Are you sure you want to delete all tasks? This action cannot be undone.")) {
      setTasks([])
      localStorage.removeItem("taskeasy.tasks")
    }
  }

  const handleResetToDefault = () => {
    if (window.confirm("Reset to default tasks? This will replace all current tasks.")) {
      setTasks(defaultTasks)
      TaskService.saveTasks(defaultTasks)
    }
  }

  // Sort tasks by priority for display
  const sortedTasks = TaskService.sortTasksByPriority(tasks)
  const stats = TaskService.getTaskStats(tasks)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" data-testid="app-title">
                TaskEasy - Task Manager
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your tasks efficiently • {stats.total} tasks • Sorted by priority
              </p>
            </div>
            <button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              data-testid="add-task-button"
            >
              <Plus className="w-4 h-4" />
              Add New Task
            </button>
          </div>
        </div>

        {/* Storage Info */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Local Storage Active</p>
                <p className="text-sm text-blue-700">
                  Tasks are automatically saved to your browser and sorted by priority
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetToDefault}
                className="text-blue-700 border border-blue-300 hover:bg-blue-100 px-3 py-1 rounded text-sm"
                data-testid="reset-button"
              >
                Reset Default
              </button>
              <button
                onClick={handleClearAllTasks}
                className="text-red-700 border border-red-300 hover:bg-red-100 px-3 py-1 rounded text-sm"
                data-testid="clear-all-button"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-900" data-testid="total-tasks">
              {stats.total}
            </div>
            <p className="text-gray-600">Total Tasks</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-600" data-testid="todo-tasks">
              {stats.todo}
            </div>
            <p className="text-gray-600">To Do</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600" data-testid="inprogress-tasks">
              {stats.inProgress}
            </div>
            <p className="text-gray-600">In Progress</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600" data-testid="done-tasks">
              {stats.done}
            </div>
            <p className="text-gray-600">Completed</p>
          </div>
        </div>

        {/* Tasks Grid */}
        {sortedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="tasks-grid">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow" data-testid="empty-state">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first task</p>
            <button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add New Task
            </button>
          </div>
        )}

        {/* Task Form Modal */}
        <TaskForm
          task={editingTask}
          isOpen={isFormOpen}
          onSave={handleSaveTask}
          onCancel={handleCancel}
          mode={formMode}
        />
      </div>
    </div>
  )
}
