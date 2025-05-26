import type { Task, TaskFormData } from "./types"

const STORAGE_KEY = "taskeasy.tasks"

export class TaskService {
  static getTasks(): Task[] {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - return empty array
        return []
      }
      
      const stored = localStorage.getItem(STORAGE_KEY)
      
      // Check if stored data exists and is valid
      if (!stored || stored.trim() === '' || stored === 'undefined' || stored === 'null') {
        return []
      }
      
      // Try to parse JSON
      const parsed = JSON.parse(stored)
      
      // Validate that parsed data is an array
      if (!Array.isArray(parsed)) {
        console.warn("Invalid data format in localStorage, resetting...")
        localStorage.removeItem(STORAGE_KEY)
        return []
      }
      
      return parsed
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error)
      // Clear corrupted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
      return []
    }
  }

  static saveTasks(tasks: Task[]): void {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - skip saving
        return
      }
      
      // Validate input
      if (!Array.isArray(tasks)) {
        console.error("Invalid tasks data - must be an array")
        return
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error)
    }
  }

  static createTask(taskData: TaskFormData): Task {
    const now = new Date().toISOString()
    return {
      id: Date.now() + Math.random(), // Ensure unique ID
      ...taskData,
      createdAt: now,
      updatedAt: now,
    }
  }

  static updateTask(existingTask: Task, updates: Partial<TaskFormData>): Task {
    return {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
  }

  static sortTasksByPriority(tasks: Task[]): Task[] {
    if (!Array.isArray(tasks)) {
      return []
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return [...tasks].sort((a, b) => {
      const aPriority = priorityOrder[a.priority] || 0
      const bPriority = priorityOrder[b.priority] || 0
      return bPriority - aPriority
    })
  }

  static getTaskStats(tasks: Task[]) {
    if (!Array.isArray(tasks)) {
      return { total: 0, todo: 0, inProgress: 0, done: 0 }
    }
    
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t?.status === "to-do").length,
      inProgress: tasks.filter((t) => t?.status === "in-progress").length,
      done: tasks.filter((t) => t?.status === "done").length,
    }
  }

  static clearAllTasks(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error("Error clearing tasks:", error)
    }
  }
}