// src/components/layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function ProtectedRoute({ requireAdmin = false, children }) {
  const { loading, user, isAdmin } = useAuth();

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  // If no login, block
  if (!user) return <Navigate to="/admin" replace />;

  // If login but not admin, block
  if (requireAdmin && !isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
}
