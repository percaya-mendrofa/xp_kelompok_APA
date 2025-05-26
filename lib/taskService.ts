import type { Task, TaskFormData } from "./types"

const STORAGE_KEY = "taskeasy.tasks"

export class TaskService {
  static getTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading tasks:", error)
      return []
    }
  }

  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks:", error)
    }
  }

  static createTask(taskData: TaskFormData): Task {
    const now = new Date().toISOString()
    return {
      id: Date.now(),
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
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return [...tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
  }

  static getTaskStats(tasks: Task[]) {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "to-do").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    }
  }
}