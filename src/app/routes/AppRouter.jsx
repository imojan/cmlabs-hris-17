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
import UserDashboard from "@/features/dashboard/pages/UserDashboard.jsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";
import TestHMR from "@/components/debug/TestHMR.jsx";
import PaymentInformation from "@/features/payment/pages/PaymentInformation.jsx";
import PaymentConfirmation from "@/features/payment/pages/PaymentConfirmation.jsx";
import PaymentSuccess from "@/features/payment/pages/PaymentSuccess.jsx";

// Komponen kecil untuk update <title> tiap ganti halaman
function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "HRIS";

    if (path === "/" || path === "/landing") {
      title = "HRIS by cmlabs - Aplikasi HR Terbaik";
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
    } else if (path === "/payment") {
      title = "Payment Information | HRIS";
    } else if (path === "/payment/confirmation") {
      title = "Payment Confirmation | HRIS";
    } else if (path === "/payment/success") {
      title = "Payment Success | HRIS";
    } else if (path.startsWith("/admin")) {
      title = "Admin Dashboard | HRIS";
    } else if (path.startsWith("/user")) {
      title = "Employee Dashboard | HRIS";
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

        {/* Payment page - public */}
        <Route path="/payment" element={<PaymentInformation />} />
        <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />

        {/* Public routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in-id" element={<SignInIdEmployee />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/check-email" element={<CheckYourEmail />} />
        <Route path="/auth/set-new-password" element={<SetNewPassword />} />
        <Route path="/auth/success-change-password" element={<SuccessChangePassword />} />
        <Route path="/auth/link-expired" element={<LinkExpired />} />

        {/* Protected routes - Admin pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees-database" element={<AdminDashboard />} />
          <Route path="/admin/employees/add" element={<AdminDashboard />} />
          <Route path="/admin/employees/:id" element={<AdminDashboard />} />
          <Route path="/admin/employees/:id/edit" element={<AdminDashboard />} />
          <Route path="/admin/checkclock" element={<AdminDashboard />} />
          <Route path="/admin/checkclock/add" element={<AdminDashboard />} />
          <Route path="/admin/work-schedule" element={<AdminDashboard />} />
          <Route path="/admin/faq-help" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          <Route path="/admin/settings/profile" element={<AdminDashboard />} />
        </Route>

        {/* Protected routes - User/Employee pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/checkclock" element={<UserDashboard />} />
          <Route path="/user/checkclock/add" element={<UserDashboard />} />
          <Route path="/user/faq-help" element={<UserDashboard />} />
          <Route path="/user/settings" element={<UserDashboard />} />
          <Route path="/user/settings/profile" element={<UserDashboard />} />
        </Route>

        {/* Optional fallback */}
        {/* <Route path="*" element={<Navigate to="/auth/sign-in" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
