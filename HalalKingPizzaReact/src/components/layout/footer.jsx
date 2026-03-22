import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { signOut } from "../../services/auth-service";
import OrderOptionsModal from "../OrderOptionsModal";

const footerLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: "#111",
  fontWeight: 700,
  fontSize: 12,
  opacity: isActive ? 1 : 0.85,
});

export default function Footer() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [orderOpen, setOrderOpen] = useState(false);

  async function onLogout() {
    await signOut();
    nav("/", { replace: true });
  }

  return (
    <footer style={styles.footer}>
      <div style={styles.shell}>
        <div style={styles.card}>
          {/* TOP ROW */}
          <div style={styles.topRow}>
            {/* LOGO */}
            <Link to="/" style={styles.logoLink}>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <strong style={{ fontSize: 16 }}>Halal King Pizza</strong>
                <span style={{ fontSize: 11, opacity: 0.7 }}>Fresh • Halal • NYC</span>
              </div>
            </Link>

            {/* LINKS (same as navbar) */}
            <div style={styles.linksWrap}>
              <NavLink to="/" style={footerLinkStyle}>
                Home
              </NavLink>

              <NavLink to="/menu" style={footerLinkStyle}>
                Menu
              </NavLink>

              {!loading && user && isAdmin && (
                <NavLink to="/admin/dashboard" style={footerLinkStyle}>
                  Dashboard
                </NavLink>
              )}

              {!loading && user ? (
                <button type="button" onClick={onLogout} style={styles.smallBtn}>
                  Sign out
                </button>
              ) : (
                <NavLink to="/admin" style={footerLinkStyle}>
                  Admin
                </NavLink>
              )}
            </div>

            {/* ORDER ONLINE BUTTON */}
            <button
              type="button"
              onClick={() => setOrderOpen(true)}
              style={styles.orderBtn}
            >
              Order online ›
            </button>
          </div>

          {/* DIVIDER */}
          <div style={styles.divider} />

          {/* BOTTOM ROW */}
          <div style={styles.bottomRow}>
            <a href="#" style={styles.bottomLink}>
              © 2026 Halal King Pizza. All rights reserved.
            </a>
          </div>
        </div>
      </div>

      <OrderOptionsModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </footer>
  );
}

const styles = {
  footer: {
    background: "#fff",
    padding: "56px 16px 70px",
    marginTop: 60,
  },
  shell: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  card: {
    background: "#f6f6f6",
    border: "1px solid #ededed",
    borderRadius: 18,
    padding: 22,
  },
  topRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 18,
  },
  logoLink: {
    textDecoration: "none",
    color: "#111",
    minWidth: 170,
  },
  linksWrap: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  orderBtn: {
    padding: "9px 14px",
    borderRadius: 999,
    background: "#d20b0b",
    color: "white",
    fontWeight: 900,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    boxShadow: "0 6px 18px rgba(210,11,11,0.18)",
    whiteSpace: "nowrap",
  },
  divider: {
    marginTop: 18,
    borderTop: "1px solid #e7e7e7",
  },
  bottomRow: {
    marginTop: 14,
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
  },
  bottomLink: {
    textDecoration: "none",
    color: "#111",
    fontSize: 11,
    fontWeight: 700,
    opacity: 0.7,
  },
  smallBtn: {
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.9,
  },
};