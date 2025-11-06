import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
          role: "student",
        });

        alert("Registration successful! You can now log in.");
        setIsRegister(false);
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        const { token, role, name } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);

        onLogin(role, name);
      }
    } catch (err) {
      console.error("Error:", err?.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #b2dfdb, #90caf9)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          width: 460,
          maxWidth: "90%",
        }}
      >
        <h2
          style={{
            marginBottom: 10,
            textAlign: "center",
            color: "#29644D",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          Placement Portal
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#555",
            marginBottom: 25,
          }}
        >
          {isRegister ? "Student Registration" : "Admin & Student Login"}
        </p>

        <form onSubmit={handleSubmit} autoComplete="off">
          {isRegister && (
            <>
              <label style={{ fontSize: 14, color: "#333" }}>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 5,
                  marginBottom: 15,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 15,
                }}
              />
            </>
          )}

          <label style={{ fontSize: 14, color: "#333" }}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 15,
            }}
          />

          <label style={{ fontSize: 14, color: "#333" }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              marginBottom: isRegister ? 15 : 20,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 15,
            }}
          />

          {isRegister && (
            <>
              <label style={{ fontSize: 14, color: "#333" }}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 5,
                  marginBottom: 20,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 15,
                }}
              />
            </>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              backgroundColor: "#29644D",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s",
              fontSize: 15,
            }}
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 14 }}>
          {isRegister ? (
            <span style={{ color: "#333" }}>
              Already have an account?{" "}
              <span
                onClick={toggleForm}
                style={{
                  color: "#29644D",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Login
              </span>
            </span>
          ) : (
            <span style={{ color: "#333" }}>
              New Student?{" "}
              <span
                onClick={toggleForm}
                style={{
                  color: "#29644D",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Register here
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
