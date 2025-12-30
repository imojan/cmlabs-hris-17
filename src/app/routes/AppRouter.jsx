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
import ForgotPassword from "@/features/auth/pages/ForgotPassword.jsx";
import CheckYourEmail from "@/features/auth/pages/CheckYourEmail.jsx";
import SetNewPassword from "@/features/auth/pages/SetNewPassword.jsx";
import SuccessChangePassword from "@/features/auth/pages/SuccessChangePassword.jsx";
import LinkExpired from "@/features/auth/pages/LinkExpired.jsx";
import LandingPage from "@/features/landing/pages/LandingPage.jsx";
import AdminDashboard from "@/features/dashboard/pages/AdminDashboard.jsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";
import TestHMR from "@/components/debug/TestHMR.jsx";

// Komponen kecil untuk update <title> tiap ganti halaman
function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "HRIS";

    if (path === "/" || path === "/landing") {
      title = "HRIS Online - Aplikasi HR Terbaik";
    } else if (path === "/auth/sign-up") {
      title = "Sign Up | HRIS";
    } else if (path === "/auth/sign-in") {
      title = "Sign In | HRIS";
    } else if (path === "/auth/sign-in-id") {
      title = "Sign In with ID Employee | HRIS";
    } else if (path === "/auth/forgot-password") {
      title = "Forgot Password | HRIS";
    } else if (path === "/auth/check-email") {
      title = "Check Your Email | HRIS";
    } else if (path === "/auth/set-new-password") {
      title = "Set New Password | HRIS";
    } else if (path === "/auth/success-change-password") {
      title = "Password Reset Success | HRIS";
    } else if (path === "/auth/link-expired") {
      title = "Link Expired | HRIS";
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
        {/* Landing Page - root */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Debug/Test routes - no auth required */}
        <Route path="/test-hmr" element={<TestHMR />} />

        {/* Public routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in-id" element={<SignInIdEmployee />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/check-email" element={<CheckYourEmail />} />
        <Route path="/auth/set-new-password" element={<SetNewPassword />} />
        <Route path="/auth/success-change-password" element={<SuccessChangePassword />} />
        <Route path="/auth/link-expired" element={<LinkExpired />} />

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
