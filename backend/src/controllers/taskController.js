const db = require('../db');

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM task ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO task (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, description, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark task as complete
const completeTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'UPDATE task SET completed = true WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error completing task:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  completeTask,
};