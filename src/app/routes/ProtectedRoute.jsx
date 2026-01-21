import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";
import { useEffect, useState } from "react";
import { onUnauthorized } from "@/lib/http";

/**
 * ProtectedRoute - Protects routes based on authentication and role
 * 
 * Props:
 * - allowedRoles: Array of roles allowed to access the route (optional)
 *   e.g., ["admin"] or ["employee", "user"]
 *   If not provided, any authenticated user can access
 */
export default function ProtectedRoute({ allowedRoles }) {
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const logout = useAuth((s) => s.logout);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Listen untuk global 401 event (token expired)
  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      console.warn("Received 401 unauthorized, logging out...");
      logout();
    });
    return unsubscribe;
  }, [logout]);
  
  // Tunggu sebentar untuk memastikan auth state sudah loaded dari localStorage
  useEffect(() => {
    const timer = setTimeout(() => setIsChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Tampilkan loading saat checking auth
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Jika tidak ada token, redirect ke sign in
  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location.pathname }} replace />;
  }

  // Jika ada allowedRoles, cek apakah user role sesuai
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || "admin";
    
    if (!allowedRoles.includes(userRole)) {
      // User tidak punya akses ke route ini
      // Redirect ke dashboard yang sesuai dengan role-nya
      if (userRole === "employee" || userRole === "user") {
        return <Navigate to="/user/dashboard" replace />;
      } else {
        return <Navigate to="/admin/dashboard" replace />;
      }
    }
  }

  return <Outlet />;
}

/**
 * GuestRoute - Routes that can ONLY be accessed when NOT logged in
 * If already logged in, redirect to appropriate dashboard
 * 
 * Use for: sign-in, sign-up, forgot-password, etc.
 */
export function GuestRoute() {
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  
  // Jika sudah login, redirect ke dashboard sesuai role
  if (token) {
    const userRole = user?.role || "admin";
    if (userRole === "employee" || userRole === "user") {
      return <Navigate to="/user/dashboard" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // Belum login, boleh akses halaman auth
  return <Outlet />;
}

// Shortcut components untuk kemudahan penggunaan
export function AdminRoute() {
  return <ProtectedRoute allowedRoles={["admin"]} />;
}

export function EmployeeRoute() {
  return <ProtectedRoute allowedRoles={["employee", "user"]} />;
}
