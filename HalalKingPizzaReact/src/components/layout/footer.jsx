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
    <footer style={styles.footer} className="footer-container">
      <div style={styles.shell}>
        <div style={styles.card} className="footer-card">
          {/* TOP ROW */}
          <div style={styles.topRow} className="footer-top-row">
            {/* LOGO */}
            <Link to="/" style={styles.logoLink} className="footer-logo">
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <strong style={{ fontSize: 16 }}>Halal King Pizza</strong>
                <span style={{ fontSize: 11, opacity: 0.7 }}>Fresh • Halal • NYC</span>
              </div>
            </Link>

            {/* LINKS */}
            <div style={styles.linksWrap} className="footer-links">
              <NavLink to="/" style={footerLinkStyle}>Home</NavLink>
              <NavLink to="/menu" style={footerLinkStyle}>Menu</NavLink>

              {!loading && user && isAdmin && (
                <NavLink to="/admin/dashboard" style={footerLinkStyle}>Dashboard</NavLink>
              )}

              {!loading && user ? (
                <button type="button" onClick={onLogout} style={styles.smallBtn}>
                  Sign out
                </button>
              ) : (
                <NavLink to="/admin" style={footerLinkStyle}>Admin</NavLink>
              )}
            </div>

            {/* ORDER ONLINE BUTTON */}
            <div className="footer-button-wrapper">
              <button
                type="button"
                onClick={() => setOrderOpen(true)}
                style={styles.orderBtn}
                className="footer-order-btn"
              >
                Order online ›
              </button>
            </div>
          </div>

          <div style={styles.divider} />

          {/* BOTTOM ROW */}
          <div style={styles.bottomRow}>
            <span style={styles.bottomLink}>
              © 2026 Halal King Pizza. All rights reserved.
            </span>
          </div>
        </div>
      </div>

      <OrderOptionsModal open={orderOpen} onClose={() => setOrderOpen(false)} />

      {/* MEDIA QUERIES FOR MOBILE OVERFLOW */}
      <style>{`
        @media (max-width: 850px) {
          .footer-top-row {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
          }
          
          .footer-links {
            width: 100%;
            justify-content: flex-start !important;
          }

          .footer-button-wrapper {
            width: 100%;
          }

          .footer-order-btn {
            width: 100%; /* Makes button easy to tap on mobile */
            padding: 14px !important;
            font-size: 14px !important;
          }
          
          .footer-card {
            padding: 20px !important;
            margin: 0 8px; /* Keeps it from touching screen edges */
          }
        }
      `}</style>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#fff",
    padding: "40px 16px 40px",
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
    padding: "9px 18px",
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