const request = require("supertest");
const express = require("express");
const taskRoutes = require("../../routes/taskRoutes");
const db = require("../../db");

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Mock the database module
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

describe("Task API Integration Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      // Mock data
      const mockTasks = [
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
          completed: true,
        },
      ];

      // Mock database response
      db.query.mockResolvedValue({ rows: mockTasks });

      // Make request
      const response = await request(app).get("/api/tasks");

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM task ORDER BY id");
    });

    it("should handle errors", async () => {
      // Mock database error
      db.query.mockRejectedValue(new Error("Database error"));

      // Make request
      const response = await request(app).get("/api/tasks");

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Server error" });
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      // Mock data
      const newTask = { title: "New Task", description: "New Description" };
      const createdTask = { id: 3, ...newTask, completed: false };

      // Mock database response
      db.query.mockResolvedValue({ rows: [createdTask] });

      // Make request
      const response = await request(app).post("/api/tasks").send(newTask);

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdTask);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO task (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
        [newTask.title, newTask.description, false]
      );
    });

    it("should validate required fields", async () => {
      // Make request with missing title
      const response = await request(app)
        .post("/api/tasks")
        .send({ description: "Description without title" });

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Title is required" });
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe("PUT /api/tasks/:id/complete", () => {
    it("should mark a task as complete", async () => {
      // Mock data
      const taskId = "5";
      const updatedTask = { id: 5, title: "Task 5", completed: true };

      // Mock database response
      db.query.mockResolvedValue({ rows: [updatedTask] });

      // Make request
      const response = await request(app).put(`/api/tasks/${taskId}/complete`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(db.query).toHaveBeenCalledWith(
        "UPDATE task SET completed = true WHERE id = $1 RETURNING *",
        [taskId]
      );
    });

    it("should handle non-existent task", async () => {
      // Mock database response for non-existent task
      db.query.mockResolvedValue({ rows: [] });

      // Make request
      const response = await request(app).put("/api/tasks/999/complete");

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Task not found" });
    });
  });
});
