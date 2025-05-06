const taskController = require("../../controllers/taskController");
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

describe("Task Controller Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTasks", () => {
    it("should get all tasks successfully", async () => {
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

      // Mock response
      db.query.mockResolvedValue({ rows: mockTasks });

      // Mock Express req and res
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      // Call the controller function
      await taskController.getAllTasks(req, res);

      // Assertions
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM task ORDER BY id");
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should handle database errors", async () => {
      // Mock database error
      db.query.mockRejectedValue(new Error("Database error"));

      // Mock Express req and res
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      // Call the controller function
      await taskController.getAllTasks(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      // Mock data
      const newTask = {
        title: "New Task",
        description: "New Description",
      };
      const createdTask = {
        id: 3,
        ...newTask,
        completed: false,
      };

      // Mock response
      db.query.mockResolvedValue({ rows: [createdTask] });

      // Mock Express req and res
      const req = { body: newTask };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      // Call the controller function
      await taskController.createTask(req, res);

      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO task (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
        [newTask.title, newTask.description, false]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });

    it("should validate title is required", async () => {
      // Mock Express req and res
      const req = { body: { description: "Description without title" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      // Call the controller function
      await taskController.createTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Title is required" });
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe("completeTask", () => {
    it("should mark a task as complete", async () => {
      // Mock data
      const taskId = "5";
      const updatedTask = {
        id: 5,
        title: "Task 5",
        completed: true,
      };

      // Mock response
      db.query.mockResolvedValue({ rows: [updatedTask] });

      // Mock Express req and res
      const req = { params: { id: taskId } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      // Call the controller function
      await taskController.completeTask(req, res);

      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        "UPDATE task SET completed = true WHERE id = $1 RETURNING *",
        [taskId]
      );
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it("should handle non-existent task", async () => {
      // Mock response for non-existent task
      db.query.mockResolvedValue({ rows: [] });

      // Mock Express req and res
      const req = { params: { id: "999" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      // Call the controller function
      await taskController.completeTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
    });
  });
});
