const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
