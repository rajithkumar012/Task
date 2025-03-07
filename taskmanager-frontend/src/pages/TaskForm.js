import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/AuthContext";
import "../styles/TaskForm.css";

const TaskForm = () => {
    const [task, setTask] = useState({ title: "", description: "", completed: false });
    const [loading, setLoading] = useState(false); // State to track API request
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (id) {
            api.get(`tasks/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    setTask(response.data);
                })
                .catch((error) => console.error("Error fetching task:", error));
        }
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = id ? "put" : "post";
            const endpoint = id ? `tasks/${id}/` : "tasks/";

            await api[method](endpoint, task, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            navigate("/tasks");
        } catch (error) {
            console.error("Error submitting task:", error.response?.data || error.message);
        }
    };

    // Function to generate task description using LLM API
    const generateDescription = async () => {
        if (!task.title) {
            alert("Please enter a task title first!");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(
                "tasks/generate-task-description/", // Endpoint for LLM-based description generation
                { title: task.title },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setTask({ ...task, description: response.data.description });
        } catch (error) {
            console.error("Error generating task description:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>{id ? "Edit Task" : "Add Task"}</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={task.title} 
                    onChange={(e) => setTask({ ...task, title: e.target.value })} 
                    required 
                />
                <textarea 
                    placeholder="Description" 
                    value={task.description} 
                    onChange={(e) => setTask({ ...task, description: e.target.value })} 
                />
                
                <button 
                    type="button" 
                    className="btn-generate" 
                    onClick={generateDescription} 
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Description"}
                </button>

                <div className="checkbox-container">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={(e) => setTask({ ...task, completed: e.target.checked })} 
                        /> Completed
                    </label>
                </div>

                <div className="button-container">
                    <button type="submit" className="btn-save">Save</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/tasks")}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
