import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/customer/HomePage";
import MenuPage from "../pages/customer/Menupage";

import AdminLogin from "../pages/admin/adminLogin";
import AdminDashboard from "../pages/admin/adminDashbaord";

import Unauthorized from "../pages/customer/nofound";
// If you have a real NotFound page, use that instead
// import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/layout/protectedRoute";
import Layout from "../components/layout/layout";
import Footer from "../components/layout/footer";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* ========================
           PUBLIC ROUTES
        ======================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* ========================
           ADMIN ROUTES
        ======================== */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ========================
           OTHER
        ======================== */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch all route (recommended) */}
        <Route path="*" element={<Unauthorized />} />
        {/* Or use a real NotFound page if you have one */}
        {/* <Route path="*" element={<NotFound />} /> */}
        
      </Route>
    </Routes>
  );
}