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
    <div className="loginPage">
      <div className="loginContainer">
        <h1 className="loginTitle">Admin Login</h1>

        {error ? <p className="errorMessage">{error}</p> : null}

        <form onSubmit={onSubmit} className="loginForm">
          <input
            className="loginInput"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="loginInput"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />
          <button type="submit" className="loginSubmitBtn">
            Sign in
          </button>
        </form>
      </div>

      {/* Footer Section - Fixed for Mobile Overflow */}
      <footer className="loginFooter">
        <div className="footerBrand">
          <h3>Halal King Pizza</h3>
          <p>Fresh • Halal • NYC</p>
        </div>
        
        <nav className="footerLinks">
          <a href="/">Home</a>
          <a href="/menu">Menu</a>
          <a href="/admin">Admin</a>
        </nav>

        <button className="footerOrderBtn">
          Order online ›
        </button>

        <div className="footerCopyright">
          © 2026 Halal King Pizza. All rights reserved.
        </div>
      </footer>

      <style>{`
        .loginPage {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #fff;
          font-family: system-ui, -apple-system, sans-serif;
          align-items: center;
          width: 100%;
          overflow-x: hidden; /* Prevents side-scrolling */
        }

        .loginContainer {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          max-width: 400px;
          padding: 40px 20px;
        }

        .loginTitle {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 24px;
          text-align: center;
        }

        .errorMessage {
          color: crimson;
          background: #fff5f5;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          text-align: center;
        }

        .loginForm {
          display: grid;
          gap: 12px;
        }

        .loginInput {
          padding: 14px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 16px; /* Prevents iPhone zoom-on-focus */
          outline: none;
        }

        .loginInput:focus {
          border-color: #007bff;
        }

        .loginSubmitBtn {
          background: #007bff;
          color: white;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          margin-top: 8px;
        }

        /* FOOTER STYLES */
        .loginFooter {
          width: 100%;
          background: #f9f9f9;
          padding: 40px 20px;
          display: flex;
          flex-wrap: wrap; /* Key fix: allows items to wrap instead of pushing out */
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          box-sizing: border-box;
          border-top: 1px solid #eee;
        }

        .footerBrand h3 { margin: 0; font-size: 18px; }
        .footerBrand p { margin: 4px 0 0; opacity: 0.6; font-size: 14px; }

        .footerLinks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footerLinks a {
          text-decoration: none;
          color: #111;
          font-weight: 600;
          font-size: 15px;
        }

        .footerOrderBtn {
          background: #d32323;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 99px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          max-width: 100%; /* Prevents sticking out */
        }

        .footerCopyright {
          width: 100%;
          font-size: 13px;
          opacity: 0.5;
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        /* MOBILE RESPONSIVENESS */
        @media (max-width: 600px) {
          .loginFooter {
            flex-direction: column; /* Stack elements vertically on phone */
            align-items: center;
            text-align: center;
            gap: 30px;
          }

          .footerLinks {
            align-items: center;
          }

          .footerOrderBtn {
            width: 80%; /* Give it a consistent look on mobile */
          }
        }
      `}</style>
    </div>
  );
}