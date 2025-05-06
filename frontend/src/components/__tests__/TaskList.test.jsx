import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskList from "../TaskList";

// Mock the TaskCard component
vi.mock("../TaskCard", () => ({
  default: ({ task, onToggleComplete }) => (
    <div data-testid={`task-card-${task.id}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => onToggleComplete(task.id)}>
        Mock Done Button
      </button>
    </div>
  ),
}));

describe("TaskList", () => {
  const mockTasks = [
    { id: 1, title: "Task 1", description: "Description 1", completed: false },
    { id: 2, title: "Task 2", description: "Description 2", completed: false },
  ];

  const mockToggleComplete = vi.fn();

  // eslint-disable-next-line no-undef
  beforeEach(() => {
    mockToggleComplete.mockClear();
  });

  it("renders task cards for each task", () => {
    render(
      <TaskList tasks={mockTasks} onToggleComplete={mockToggleComplete} />
    );

    expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("renders no task cards when tasks array is empty", () => {
    render(<TaskList tasks={[]} onToggleComplete={mockToggleComplete} />);

    expect(screen.queryByTestId(/task-card/)).not.toBeInTheDocument();
  });
});
