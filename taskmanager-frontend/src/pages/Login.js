import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Login.css"; // Import the CSS file

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            navigate("/tasks"); // Navigate to Task List after login
        } catch (error) {
            alert("Invalid credentials!");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input 
                    type="text" 
                    placeholder="Username" 
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
                    required 
                />
                <button type="submit">Login</button>
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
