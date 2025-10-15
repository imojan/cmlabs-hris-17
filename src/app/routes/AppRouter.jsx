// src/app/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import SignUp from "@/features/auth/pages/SignUp.jsx";
import SignIn from "@/features/auth/pages/SignIn.jsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";

// (placeholder) Dashboard – nanti ganti dengan halaman benerannya
function Dashboard() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-brand">Dashboard</h1>
      <p className="mt-2 text-neutral-700">Welcome back 👋</p>
    </div>
  );
}

// Komponen kecil untuk update title tiap ganti halaman
function PageTitle() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    let title = "HRIS";
    if (path === "/auth/sign-up") title = "Sign Up | HRIS";
    else if (path === "/auth/sign-in") title = "Sign In | HRIS";
    else if (path.startsWith("/dashboard")) title = "Dashboard | HRIS";
    document.title = title;
  }, [location.pathname]);
  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <PageTitle />
      <Routes>
        {/* Akar diarahkan ke sign-in (atau sign-up kalau kamu mau) */}
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

        {/* Public routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* tambahkan rute lain yang butuh auth di sini */}
        </Route>

        {/* Fallback optional */}
        {/* <Route path="*" element={<Navigate to="/auth/sign-in" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
