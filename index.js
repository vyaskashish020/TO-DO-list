const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));
  const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
  });
  const Task = mongoose.model('Task', taskSchema);
  app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });
  app.post('/api/tasks', async (req, res) => {
    const { task } = req.body;
    try {
      const newTask = new Task({ task });
      await newTask.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create task' });
    }
  });
  app.put('/api/tasks/:id', async (req, res) => {
    const { task } = req.body;
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, { task }, { new: true });
      res.json(updatedTask);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update task' });
    }
  });
  app.put('/api/tasks/:id/toggle', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      task.completed = !task.completed;
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: 'Failed to toggle task' });
    }
  });
  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: 'Failed to delete task' });
    }
  });
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  