const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const cors = require('cors')

// Middleware

app.use(cors());
app.use(bodyParser.json());


// app.use(bodyParser.json(), (req, res) => {
//     console.log("SERVER SIGNAL");
//     next();
// });
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Ensure tasks file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper to read tasks
const readTasks = () => {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper to write tasks
const writeTasks = (tasks) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task content is required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(),
        task,
        completed: false,
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
});

// Toggle task completion
app.patch('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    const tasks = readTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = completed;
    writeTasks(tasks);

    res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    const tasks = readTasks();
    const updatedTasks = tasks.filter((task) => task.id !== id);

    if (tasks.length === updatedTasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }

    writeTasks(updatedTasks);

    res.status(204).end();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
