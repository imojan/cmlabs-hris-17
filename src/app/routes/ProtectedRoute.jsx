import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";

export default function ProtectedRoute() {
  const token = useAuth((s) => s.token);
  
  if (!token) return <Navigate to="/auth/sign-in" replace />;

  return <Outlet />;
}
