// src/components/layout/navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { signOut } from "../../services/auth-service";

const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: isActive ? "white" : "#111",
  background: isActive ? "#111" : "transparent",
});

export default function Navbar() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  async function onLogout() {
    await signOut();
    nav("/", { replace: true });
  }

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* LOGO */}
        <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <strong style={{ fontSize: 18 }}>Halal King Pizza</strong>
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              Fresh • Halal • NYC
            </span>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>

          <NavLink to="/menu" style={linkStyle}>
            Menu
          </NavLink>

          {/* ORDER ONLINE BUTTON */}
          <a
        href={import.meta.env.VITE_UBER_EATS_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
        padding: "8px 14px",
        borderRadius: 999,
        background: "#d20b0b",
        color: "white",
        fontWeight: 800,
        textDecoration: "none",
        fontSize: 14,
        boxShadow: "0 4px 12px rgba(210,11,11,0.35)",
        animation: "pulseGlow 2s infinite",
}}
    >
        Order Online ›
    </a>

          {!loading && user && isAdmin && (
            <NavLink to="/admin/dashboard" style={linkStyle}>
              Dashboard
            </NavLink>
          )}

          {!loading && user ? (
            <button
              onClick={onLogout}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          ) : (
            <NavLink to="/admin" style={linkStyle}>
              Admin
            </NavLink>
          )}
        </div>
        <style>{`
@keyframes pulseGlow {
    0% {
      box-shadow: 0 4px 12px rgba(210,11,11,0.35);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 6px 20px rgba(210,11,11,0.55);
      transform: scale(1.05);
    }
    100% {
      box-shadow: 0 4px 12px rgba(210,11,11,0.35);
      transform: scale(1);
    }
  }
`}</style>
      </nav>
    </header>
    
  );
}