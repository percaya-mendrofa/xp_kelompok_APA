import { TaskService } from "../taskService"
import type { Task, TaskFormData } from "../types"

describe("TaskService", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe("getTasks", () => {
    it("should return empty array when no tasks stored", () => {
      const tasks = TaskService.getTasks()
      expect(tasks).toEqual([])
    })

    it("should return stored tasks", () => {
      const mockTasks = [
        {
          id: 1,
          title: "Test Task",
          description: "Test Description",
          priority: "high" as const,
          status: "to-do" as const,
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
      ]
      localStorage.setItem("taskeasy.tasks", JSON.stringify(mockTasks))

      const tasks = TaskService.getTasks()
      expect(tasks).toEqual(mockTasks)
    })

    it("should handle invalid JSON gracefully", () => {
      localStorage.setItem("taskeasy.tasks", "invalid json")
      const tasks = TaskService.getTasks()
      expect(tasks).toEqual([])
    })
  })

  describe("saveTasks", () => {
    it("should save tasks to localStorage", () => {
      const tasks: Task[] = [
        {
          id: 1,
          title: "Test Task",
          description: "Test Description",
          priority: "high",
          status: "to-do",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
      ]

      TaskService.saveTasks(tasks)
      expect(localStorage.setItem).toHaveBeenCalledWith("taskeasy.tasks", JSON.stringify(tasks))
    })
  })

  describe("createTask", () => {
    it("should create a new task with generated id and timestamps", () => {
      const taskData: TaskFormData = {
        title: "New Task",
        description: "New Description",
        priority: "medium",
        status: "to-do",
      }

      const task = TaskService.createTask(taskData)

      expect(task).toMatchObject(taskData)
      expect(task.id).toBeDefined()
      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
    })
  })

  describe("updateTask", () => {
    it("should update task with new data and timestamp", () => {
      const existingTask: Task = {
        id: 1,
        title: "Old Title",
        description: "Old Description",
        priority: "low",
        status: "to-do",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
      }

      const updates = {
        title: "New Title",
        priority: "high" as const,
      }

      const updatedTask = TaskService.updateTask(existingTask, updates)

      expect(updatedTask.title).toBe("New Title")
      expect(updatedTask.priority).toBe("high")
      expect(updatedTask.description).toBe("Old Description")
      expect(updatedTask.updatedAt).not.toBe("2023-01-01")
    })
  })

  describe("sortTasksByPriority", () => {
    it("should sort tasks by priority (high, medium, low)", () => {
      const tasks: Task[] = [
        {
          id: 1,
          title: "Low Priority",
          description: "",
          priority: "low",
          status: "to-do",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
        {
          id: 2,
          title: "High Priority",
          description: "",
          priority: "high",
          status: "to-do",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
        {
          id: 3,
          title: "Medium Priority",
          description: "",
          priority: "medium",
          status: "to-do",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
      ]

      const sorted = TaskService.sortTasksByPriority(tasks)

      expect(sorted[0].priority).toBe("high")
      expect(sorted[1].priority).toBe("medium")
      expect(sorted[2].priority).toBe("low")
    })
  })

  describe("getTaskStats", () => {
    it("should return correct task statistics", () => {
      const tasks: Task[] = [
        {
          id: 1,
          title: "Task 1",
          description: "",
          priority: "high",
          status: "to-do",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
        {
          id: 2,
          title: "Task 2",
          description: "",
          priority: "medium",
          status: "in-progress",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
        {
          id: 3,
          title: "Task 3",
          description: "",
          priority: "low",
          status: "done",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
      ]

      const stats = TaskService.getTaskStats(tasks)

      expect(stats).toEqual({
        total: 3,
        todo: 1,
        inProgress: 1,
        done: 1,
      })
    })
  })
})
