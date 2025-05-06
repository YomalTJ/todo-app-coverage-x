const express = require('express');
const { getAllTasks, createTask, completeTask } = require('../controllers/taskController');

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id/complete', completeTask);

module.exports = router;