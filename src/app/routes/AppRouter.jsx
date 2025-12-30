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
import SignInIdEmployee from "@/features/auth/pages/SignInIdEmployee.jsx";
import AdminDashboard from "@/features/dashboard/pages/AdminDashboard.jsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";
import TestHMR from "@/components/debug/TestHMR.jsx";

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
    } else if (path === "/auth/sign-in-id") {
      title = "Sign In with ID Employee | HRIS";
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

        {/* Debug/Test routes - no auth required */}
        <Route path="/test-hmr" element={<TestHMR />} />

        {/* Public routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in-id" element={<SignInIdEmployee />} />

        {/* Protected routes - semua admin page dibungkus AdminDashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees-database" element={<AdminDashboard />} />
          <Route path="/admin/employees/add" element={<AdminDashboard />} />
          <Route path="/admin/employees/:id" element={<AdminDashboard />} />
          <Route path="/admin/employees/:id/edit" element={<AdminDashboard />} />
          <Route path="/admin/checkclock" element={<AdminDashboard />} />      {/* ⬅️ TAMBAHAN */}
          <Route path="/admin/checkclock/add" element={<AdminDashboard />} />
          <Route path="/admin/work-schedule" element={<AdminDashboard />} />
        </Route>

        {/* Optional fallback */}
        {/* <Route path="*" element={<Navigate to="/auth/sign-in" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
