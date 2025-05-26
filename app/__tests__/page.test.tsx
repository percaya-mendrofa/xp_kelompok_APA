import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TaskManager from "../page"

// Mock the TaskService dengan relative path
jest.mock("../../lib/taskService", () => ({
  TaskService: {
    getTasks: jest.fn(() => []),
    saveTasks: jest.fn(),
    createTask: jest.fn((data) => ({
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateTask: jest.fn((task, updates) => ({
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    })),
    sortTasksByPriority: jest.fn((tasks) => tasks),
    getTaskStats: jest.fn((tasks) => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "to-do").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    })),
  },
}))

describe("TaskManager", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it("should render the application title", async () => {
    render(<TaskManager />)

    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toHaveTextContent("TaskEasy - Task Manager")
    })
  })

  it("should show empty state when no tasks exist", async () => {
    render(<TaskManager />)

    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeInTheDocument()
      expect(screen.getByText("No tasks yet")).toBeInTheDocument()
    })
  })
})