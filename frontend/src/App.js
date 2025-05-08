import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const ToDoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);


    const addTask = async () => {
        if (!newTask.trim()) return;

        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: newTask }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTasks([...tasks, data]);
            setNewTask('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // const addTask = async () => {
    //     if (!newTask.trim()) return;

    //     try {
    //         const response = await axios.post('/api/tasks', { task: newTask });
    //         // const response = await fetch('http://localhost:5000/api/tasks', {
    //         //     method: "POST"
    //         //   });
    //         setTasks([...tasks, response.data]);
    //         setNewTask('');
    //     } catch (error) {
    //         console.error('Error adding task:', error);
    //     }
    // };

    const toggleTask = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/tasks/${id}`, { completed: !tasks.find(task => task.id === id).completed });
            setTasks(tasks.map(task => task.id === id ? response.data : task));
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="app-container">
            <h1 className="app-title">ToDo List</h1>

            <div className="task-input-container">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                    className="task-input"
                />
                <button
                    onClick={addTask}
                    className="add-button"
                >
                    Add
                </button>
            </div>

            <ul className="task-list">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                    >
                        <span
                            onClick={() => toggleTask(task.id)}
                            className="task-text"
                        >
                            {task.task}
                        </span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoApp;
