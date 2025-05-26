import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TaskCard from "../TaskCard"
import type { Task } from "@/lib/types"

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  priority: "high",
  status: "in-progress",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
}

describe("TaskCard", () => {
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    mockOnEdit.mockClear()
    mockOnDelete.mockClear()
    global.confirm = jest.fn(() => true)
  })

  it("should render task information correctly", () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId("task-title")).toHaveTextContent("Test Task")
    expect(screen.getByTestId("task-description")).toHaveTextContent("Test Description")
    expect(screen.getByTestId("task-priority")).toHaveTextContent("high")
    expect(screen.getByTestId("task-status")).toHaveTextContent("in progress")
  })

  it("should call onEdit when edit button is clicked", async () => {
    const user = userEvent.setup()

    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    await user.click(screen.getByTestId("edit-button"))
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it("should call onDelete when delete button is clicked and confirmed", async () => {
    const user = userEvent.setup()

    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    await user.click(screen.getByTestId("delete-button"))
    expect(global.confirm).toHaveBeenCalledWith("Are you sure you want to delete this task?")
    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  it("should not call onDelete when delete is cancelled", async () => {
    const user = userEvent.setup()
    global.confirm = jest.fn(() => false)

    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    await user.click(screen.getByTestId("delete-button"))
    expect(global.confirm).toHaveBeenCalled()
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it("should display correct priority colors", () => {
    const highPriorityTask = { ...mockTask, priority: "high" as const }
    const { rerender } = render(<TaskCard task={highPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId("task-priority")).toHaveClass("bg-red-100", "text-red-800")

    const mediumPriorityTask = { ...mockTask, priority: "medium" as const }
    rerender(<TaskCard task={mediumPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId("task-priority")).toHaveClass("bg-yellow-100", "text-yellow-800")

    const lowPriorityTask = { ...mockTask, priority: "low" as const }
    rerender(<TaskCard task={lowPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId("task-priority")).toHaveClass("bg-green-100", "text-green-800")
  })

  it("should display correct status colors", () => {
    const todoTask = { ...mockTask, status: "to-do" as const }
    const { rerender } = render(<TaskCard task={todoTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId("task-status")).toHaveClass("bg-gray-100", "text-gray-800")

    const inProgressTask = { ...mockTask, status: "in-progress" as const }
    rerender(<TaskCard task={inProgressTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId("task-status")).toHaveClass("bg-blue-100", "text-blue-800")

    const doneTask = { ...mockTask, status: "done" as const }
    rerender(<TaskCard task={doneTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId("task-status")).toHaveClass("bg-green-100", "text-green-800")
  })
})
