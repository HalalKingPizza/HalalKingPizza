// // src/components/layout/ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/authContext";

// export default function ProtectedRoute({ requireAdmin = false, children }) {
//   const { loading, user, isAdmin } = useAuth();

//   if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

//   // If no login, block
//   if (!user) return <Navigate to="/admin" replace />;

//   // If login but not admin, block
//   if (requireAdmin && !isAdmin) return <Navigate to="/unauthorized" replace />;

//   return children;
// }


// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function ProtectedRoute({ requireAdmin = false, children }) {
  const { loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  // ✅ If not signed in, send to sign in page (NOT back to /admin)
  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // ✅ If admin required and user isn't admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
