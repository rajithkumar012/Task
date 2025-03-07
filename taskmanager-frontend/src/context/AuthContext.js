import { createContext, useState, useEffect } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token") || null);

    useEffect(() => {
        if (token) {
            setUser(jwtDecode(token));
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await api.post("auth/token/", credentials);
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        setToken(response.data.access);
        setUser(jwtDecode(response.data.access));
    };

    const logout = (navigate) => {
        localStorage.removeItem("access_token"); // Fix incorrect key name
        localStorage.removeItem("refresh_token");
        setToken(null);
        setUser(null);
        navigate("/"); // Use navigate from the component
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
