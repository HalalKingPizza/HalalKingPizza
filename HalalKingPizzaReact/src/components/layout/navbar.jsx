import { Link, NavLink } from "react-router-dom";
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
  const { user, isAdmin, loading } = useAuth();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
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
        {/* Left: Brand */}
        <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <strong style={{ fontSize: 18 }}>Halal King Pizza</strong>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Fresh • Halal • NYC</span>
          </div>
        </Link>

        {/* Right: Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NavLink to="/" style={linkStyle}>
            Menu
          </NavLink>

          {/* While loading auth state, keep UI simple */}
          {loading ? null : (
            <>
              {!user && (
                <NavLink to="/admin" style={linkStyle}>
                  Admin
                </NavLink>
              )}

              {user && isAdmin && (
                <NavLink to="/admin/dashboard" style={linkStyle}>
                  Dashboard
                </NavLink>
              )}

              {user && (
                <button
                  onClick={signOut}
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
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
