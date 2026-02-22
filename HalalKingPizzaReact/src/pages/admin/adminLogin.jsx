// src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPassword } from "../../services/auth-service";
import { useAuth } from "../../context/authContext";

export default function AdminLogin() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user && isAdmin) {
      nav("/admin/dashboard", { replace: true });
    }
  }, [loading, user, isAdmin, nav]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await signInWithPassword(email, password);
      nav("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h1>Admin Login</h1>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
        />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
