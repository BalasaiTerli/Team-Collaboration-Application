const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// ✅ Add a new task with validation
router.post("/add", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, userId } = req.body;

    // Validate required fields
    if (!title || !dueDate) {
      return res
        .status(400)
        .json({ error: "Title and Due Date are required!" });
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all tasks with filtering, sorting & user details
router.get("/", async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let sortOptions = {};
    if (sortBy === "dueDate") sortOptions.dueDate = 1;
    if (sortBy === "priority") sortOptions.priority = { low: 1, medium: 2, high: 3 };

    const tasks = await Task.find(filter).sort(sortOptions);

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get a single task by ID with user details
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });

    if (!tasks || tasks.length === 0) {
      console.log("No tasks found for user ID:", req.params.userId);
      return res.status(404).json({ error: "No tasks found for this user" });
    }

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks for user ID:", req.params.userId, err);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});


// ✅ Update a task by ID with validation
router.put("/:id", async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ error: "Title and Due Date are required!" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedTask) {
      console.log("Task not found for update:", req.params.id);
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Invalid task ID or data" });
  }
});

// ✅ Delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      console.log("Task not found for deletion:", req.params.id);
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Invalid task ID" });
  }
});

module.exports = router;