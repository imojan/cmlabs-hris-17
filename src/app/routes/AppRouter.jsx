// src/app/routes/AppRouter.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import SignUp from "@/features/auth/pages/SignUp.jsx";
import SignIn from "@/features/auth/pages/SignIn.jsx";
import AdminDashboard from "@/features/dashboard/pages/AdminDashboard.jsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";

// Komponen kecil untuk update <title> tiap ganti halaman
function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "HRIS";

    if (path === "/auth/sign-up") {
      title = "Sign Up | HRIS";
    } else if (path === "/auth/sign-in") {
      title = "Sign In | HRIS";
    } else if (path.startsWith("/admin")) {
      // termasuk /admin/dashboard, /admin/checkclock, dll
      title = "Admin Dashboard | HRIS";
    }

    document.title = title;
  }, [location.pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <PageTitle />

      <Routes>
        {/* root diarahkan ke admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Public routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />

        {/* Protected routes - Admin Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees-database" element={<AdminDashboard />} />
          <Route path="/admin/checkclock" element={<AdminDashboard />} />
          <Route path="/admin/checkclock/add" element={<AdminDashboard />} />
          <Route path="/admin/work-schedule" element={<AdminDashboard />} />
        </Route>

        {/* Optional: fallback kalau path ga dikenal */}
        {/* <Route path="*" element={<Navigate to="/auth/sign-in" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
