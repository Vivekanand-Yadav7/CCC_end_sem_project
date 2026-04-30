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
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
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
