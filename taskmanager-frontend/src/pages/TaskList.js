import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/AuthContext";
import "../styles/TaskList.css";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchCompleted, setSearchCompleted] = useState("");
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [searchTitle, searchCompleted]);

    const fetchTasks = async () => {
        try {
            let query = "tasks/";
            if (searchTitle || searchCompleted) {
                query += `?title=${searchTitle}&completed=${searchCompleted}`;
            }
            const response = await api.get(query, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`tasks/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="task-container">
            <h2>Task List</h2>

            {/* Search Bar below title */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                <select value={searchCompleted} onChange={(e) => setSearchCompleted(e.target.value)}>
                    <option value="">All</option>
                    <option value="true">Completed</option>
                    <option value="false">Not Completed</option>
                </select>
                <button onClick={fetchTasks}>Search</button>
            </div>

            {/* Table */}
            <table className="task-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Completed</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.completed ? "✅" : "❌"}</td>
                                <td>
                                    <button onClick={() => navigate(`/task/${task.id}`)} className="btn-edit">Edit</button>
                                    <button onClick={() => deleteTask(task.id)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5">No tasks available</td></tr>
                    )}
                </tbody>
            </table>

            {/* Add Task and Logout Buttons at the Bottom Left */}
            <div className="task-buttons">
                <button onClick={() => navigate("/task/new")} className="btn-add">Add Task</button>
                <button onClick={() => logout(navigate)} className="btn-logout">Logout</button>
            </div>
        </div>
    );
};

export default TaskList;
