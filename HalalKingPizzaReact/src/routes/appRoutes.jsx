// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MenuPage from "../pages/customer/Menupage";
import AdminLogin from "../pages/admin/adminLogin";
import AdminDashboard from "./../pages/admin/adminDashbaord";
// import Unauthorized from "../pages/Unauthorized";
// import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/layout/protectedRoute";
import Layout from "../components/layout/layout";

export default function AppRoutes() {
  return (
    <Layout>
    <Routes>
      {/* Public */}
      <Route path="/" element={<MenuPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Other */}
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
//    </Layout>
  );
}
