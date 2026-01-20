import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";

export default function ProtectedRoute() {
  const token = useAuth((s) => s.token);
  
  // TEMPORARY: Bypass auth for testing - REMOVE IN PRODUCTION
  // if (!token) return <Navigate to="/auth/sign-in" replace />;

  return <Outlet />;
}
