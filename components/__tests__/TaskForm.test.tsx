import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TaskForm from "../TaskForm"
import type { Task } from "@/lib/types"

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  priority: "high",
  status: "in-progress",
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
}

describe("TaskForm", () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    mockOnSave.mockClear()
    mockOnCancel.mockClear()
  })

  it("should not render when isOpen is false", () => {
    render(<TaskForm isOpen={false} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    expect(screen.queryByTestId("task-form-modal")).not.toBeInTheDocument()
  })

  it("should render add form when mode is add", () => {
    render(<TaskForm isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    expect(screen.getByText("Add New Task")).toBeInTheDocument()
    expect(screen.getByTestId("title-input")).toHaveValue("")
    expect(screen.getByTestId("description-input")).toHaveValue("")
  })

  it("should render edit form with task data when mode is edit", () => {
    render(<TaskForm task={mockTask} isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="edit" />)

    expect(screen.getByText("Edit Task")).toBeInTheDocument()
    expect(screen.getByTestId("title-input")).toHaveValue("Test Task")
    expect(screen.getByTestId("description-input")).toHaveValue("Test Description")
    expect(screen.getByTestId("priority-select")).toHaveValue("high")
    expect(screen.getByTestId("status-select")).toHaveValue("in-progress")
  })

  it("should show validation errors for empty fields", async () => {
    const user = userEvent.setup()

    render(<TaskForm isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    await user.click(screen.getByTestId("save-button"))

    expect(screen.getByTestId("title-error")).toHaveTextContent("Title is required")
    expect(screen.getByTestId("description-error")).toHaveTextContent("Description is required")
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it("should show validation error for short title", async () => {
    const user = userEvent.setup()

    render(<TaskForm isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    await user.type(screen.getByTestId("title-input"), "ab")
    await user.click(screen.getByTestId("save-button"))

    expect(screen.getByTestId("title-error")).toHaveTextContent("Title must be at least 3 characters")
  })

  it("should show validation error for short description", async () => {
    const user = userEvent.setup()

    render(<TaskForm isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    await user.type(screen.getByTestId("title-input"), "Valid Title")
    await user.type(screen.getByTestId("description-input"), "short")
    await user.click(screen.getByTestId("save-button"))

    expect(screen.getByTestId("description-error")).toHaveTextContent("Description must be at least 10 characters")
  })

  it("should call onSave with valid data", async () => {
    const user = userEvent.setup()

    render(<TaskForm isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    await user.type(screen.getByTestId("title-input"), "New Task")
    await user.type(screen.getByTestId("description-input"), "This is a valid description")
    await user.selectOptions(screen.getByTestId("priority-select"), "high")
    await user.selectOptions(screen.getByTestId("status-select"), "in-progress")
    await user.click(screen.getByTestId("save-button"))

    expect(mockOnSave).toHaveBeenCalledWith({
      title: "New Task",
      description: "This is a valid description",
      priority: "high",
      status: "in-progress",
    })
  })

  it("should call onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup()

    render(<TaskForm isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    await user.click(screen.getByTestId("cancel-button"))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it("should call onCancel when close button is clicked", async () => {
    const user = userEvent.setup()

    render(<TaskForm isOpen={true} onSave={mockOnSave} onCancel={mockOnCancel} mode="add" />)

    await user.click(screen.getByTestId("close-button"))
    expect(mockOnCancel).toHaveBeenCalled()
  })
})
