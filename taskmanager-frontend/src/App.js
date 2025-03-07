import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/task/new" element={<TaskForm />} />
                    <Route path="/task/:id" element={<TaskForm />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
