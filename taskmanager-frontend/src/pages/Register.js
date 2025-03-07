import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/Register.css"; // Import the CSS file

const Register = () => {
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("auth/register/", user);
            console.log("Response:", response.data); // Debugging
            navigate("/"); // Redirect on success
        } catch (error) {
            console.error("Error:", error.response?.data); // Log API error message
            alert(error.response?.data?.message || "Registration failed!");
        }
    };
    

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input 
                    type="text" 
                    placeholder="Username" 
                    onChange={(e) => setUser({ ...user, username: e.target.value })} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) => setUser({ ...user, email: e.target.value })} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setUser({ ...user, password: e.target.value })} 
                    required 
                />
                <button type="submit">Register</button>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
