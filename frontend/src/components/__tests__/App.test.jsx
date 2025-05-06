import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../../App";

// Mock fetch API
// eslint-disable-next-line no-undef
global.fetch = vi.fn();

function mockFetch(data) {
  // eslint-disable-next-line no-undef
  global.fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );
}

describe("App", () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    global.fetch.mockClear();
    // Mock initial tasks data
    mockFetch([
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description 2",
        completed: false,
      },
    ]);
  });

  it("fetches and displays tasks on load", async () => {
    render(<App />);

    // Should show loading initially
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    });

    // eslint-disable-next-line no-undef
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/tasks")
    );
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    // Mock fetch error
    // eslint-disable-next-line no-undef
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    });
  });

  it("adds a new task", async () => {
    const newTask = {
      id: 3,
      title: "New Task",
      description: "New Description",
      completed: false,
    };

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    });

    // Setup mock for task creation
    mockFetch(newTask);

    // Fill and submit the form
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "New Description" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    // Check if the API was called
    await waitFor(() => {
      // eslint-disable-next-line no-undef
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            title: "New Task",
            description: "New Description",
          }),
        })
      );
    });
  });
});
