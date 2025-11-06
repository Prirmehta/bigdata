import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";


function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [name, setName] = useState(localStorage.getItem("name") || "");

  const handleLogin = (userRole, userName) => {
    setRole(userRole);
    setName(userName);
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setName("");
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  // show admin or student dashboard depending on role
  if (role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <StudentDashboard onLogout={handleLogout} name={name} />;
}

export default App;
