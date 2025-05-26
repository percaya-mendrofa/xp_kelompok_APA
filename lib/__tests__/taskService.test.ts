import { TaskService } from "../taskService"
import type { Task, TaskFormData } from "../types"

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock window object
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe("TaskService", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  describe("getTasks", () => {
    it("should return empty array when no tasks stored", () => {
      localStorageMock.getItem.mockReturnValue(null)
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
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))

      const tasks = TaskService.getTasks()
      expect(tasks).toEqual(mockTasks)
    })

    it("should handle invalid JSON gracefully", () => {
      localStorageMock.getItem.mockReturnValue("invalid json")
      const tasks = TaskService.getTasks()
      expect(tasks).toEqual([])
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("taskeasy.tasks")
    })

    it("should handle empty string", () => {
      localStorageMock.getItem.mockReturnValue("")
      const tasks = TaskService.getTasks()
      expect(tasks).toEqual([])
    })

    it("should handle non-array data", () => {
      localStorageMock.getItem.mockReturnValue('{"not": "array"}')
      const tasks = TaskService.getTasks()
      expect(tasks).toEqual([])
      expect(localStorageMock.removeItem).toHaveBeenCalled()
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
      expect(localStorageMock.setItem).toHaveBeenCalledWith("taskeasy.tasks", JSON.stringify(tasks))
    })

    it("should handle invalid input gracefully", () => {
      TaskService.saveTasks(null as any)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
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
      expect(typeof task.id).toBe('number')
      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
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

    it("should handle invalid input", () => {
      const result = TaskService.sortTasksByPriority(null as any)
      expect(result).toEqual([])
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

    it("should handle invalid input", () => {
      const stats = TaskService.getTaskStats(null as any)
      expect(stats).toEqual({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
      })
    })
  })
})