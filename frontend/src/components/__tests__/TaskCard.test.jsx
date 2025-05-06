import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../TaskCard";

describe("TaskCard", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    completed: false,
  };

  const mockToggleComplete = vi.fn();

  // eslint-disable-next-line no-undef
  beforeEach(() => {
    mockToggleComplete.mockClear();
  });

  it("renders task details correctly", () => {
    render(<TaskCard task={mockTask} onToggleComplete={mockToggleComplete} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
  });

  it("calls onToggleComplete when Done button is clicked", () => {
    render(<TaskCard task={mockTask} onToggleComplete={mockToggleComplete} />);

    const doneButton = screen.getByRole("button", { name: "Done" });
    fireEvent.click(doneButton);

    expect(mockToggleComplete).toHaveBeenCalledWith(mockTask.id);
  });
});
