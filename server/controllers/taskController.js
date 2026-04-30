const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, description, category, status, deadline } = req.body;
        const task = new Task({
            userId: req.user.id,
            title, description, category, status, deadline
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const { status, category, search } = req.query;
        let query = { userId: req.user.id };

        if (status) query.status = status;
        if (category) query.category = category;
        if (search) query.title = { $regex: search, $options: 'i' };

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTaskStats = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'Completed').length,
            pending: tasks.filter(t => t.status === 'Pending').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            overdue: tasks.filter(t => t.status !== 'Completed' && t.deadline && new Date(t.deadline) < new Date()).length
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
