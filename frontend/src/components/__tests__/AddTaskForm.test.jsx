import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AddTaskForm from "../AddTaskForm";

describe("AddTaskForm", () => {
  const mockOnAddTask = vi.fn();

  // eslint-disable-next-line no-undef
  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  it("renders correctly", () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);

    expect(screen.getByText("Add a Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const submitButton = screen.getByRole("button", { name: "Add" });

    await userEvent.type(titleInput, "New Test Task");
    await userEvent.type(descriptionInput, "Test Description");
    fireEvent.click(submitButton);

    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: "New Test Task",
      description: "Test Description",
    });

    // Form should be cleared after submission
    expect(titleInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });

  it("does not submit when title is empty", async () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);

    const descriptionInput = screen.getByPlaceholderText("Description");
    const submitButton = screen.getByRole("button", { name: "Add" });

    await userEvent.type(descriptionInput, "Test Description");
    fireEvent.click(submitButton);

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });
});
