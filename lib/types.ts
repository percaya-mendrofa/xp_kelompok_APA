export interface Task {
  id: number
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
}
