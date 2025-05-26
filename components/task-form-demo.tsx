"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Database } from "lucide-react"
import TaskForm from "./task-form"

interface Task {
  id?: number
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
  createdAt?: string
  updatedAt?: string
}

const STORAGE_KEY = "taskManager.tasks"

// Default tasks untuk demo pertama kali
const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Design Homepage",
    description: "Create wireframes and mockups for the new homepage layout",
    priority: "high",
    status: "in-progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Fix Login Bug",
    description: "Resolve authentication issue preventing users from logging in",
    priority: "high",
    status: "to-do",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function TaskFormDemo() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [isLoading, setIsLoading] = useState(true)

  // Fungsi untuk memuat data dari localStorage
  const loadTasksFromStorage = () => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY)
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks)
        setTasks(parsedTasks)
        console.log(`Loaded ${parsedTasks.length} tasks from localStorage`)
      } else {
        // Jika tidak ada data, gunakan default tasks dan simpan ke localStorage
        setTasks(defaultTasks)
        saveTasksToStorage(defaultTasks)
        console.log("No stored tasks found, using default tasks")
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error)
      // Jika error, gunakan default tasks
      setTasks(defaultTasks)
    } finally {
      setIsLoading(false)
    }
  }

  // Fungsi untuk menyimpan data ke localStorage
  const saveTasksToStorage = (tasksToSave: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave))
      console.log(`Saved ${tasksToSave.length} tasks to localStorage`)
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error)
    }
  }

  // Load data saat komponen pertama kali dimuat
  useEffect(() => {
    loadTasksFromStorage()
  }, [])

  // Simpan ke localStorage setiap kali tasks berubah
  useEffect(() => {
    if (!isLoading && tasks.length >= 0) {
      saveTasksToStorage(tasks)
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

  const handleSaveTask = (task: Task) => {
    const now = new Date().toISOString()

    if (formMode === "add") {
      const newTask = {
        ...task,
        id: Date.now(),
        createdAt: now,
        updatedAt: now,
      }
      setTasks((prevTasks) => [...prevTasks, newTask])
    } else {
      const updatedTask = {
        ...task,
        updatedAt: now,
      }
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? updatedTask : t)))
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

  // Fungsi untuk menghapus semua data
  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to delete all tasks? This action cannot be undone.")) {
      setTasks([])
      localStorage.removeItem(STORAGE_KEY)
      console.log("All tasks cleared from localStorage")
    }
  }

  // Fungsi untuk reset ke default data
  const handleResetToDefault = () => {
    if (window.confirm("Reset to default tasks? This will replace all current tasks.")) {
      setTasks(defaultTasks)
      saveTasksToStorage(defaultTasks)
      console.log("Reset to default tasks")
    }
  }

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

  // Loading state
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600 mt-1">Data tersimpan otomatis di browser • {tasks.length} tasks</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Storage Info & Controls */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Local Storage Active</p>
                  <p className="text-sm text-blue-700">
                    Data tersimpan di browser dan akan tetap ada saat Anda kembali
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefault}
                  className="text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  Reset Default
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllData}
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Tasks List */}
        {tasks.length > 0 ? (
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
                        onClick={() => handleEditTask(task)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id!)}
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

                  {task.updatedAt && (
                    <p className="text-xs text-gray-400 mt-3">
                      Updated:{" "}
                      {new Date(task.updatedAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada task</h3>
              <p className="text-gray-600 mb-4">Mulai dengan membuat task pertama Anda</p>
              <Button onClick={handleAddTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
            </CardContent>
          </Card>
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
