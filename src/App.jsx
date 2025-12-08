// src/App.jsx
import { useEffect } from "react";
import AppRouter from "@/app/routes/AppRouter.jsx";
import { useAuth } from "@/app/store/authStore";

export default function App() {
  const token   = useAuth((s) => s.token);
  const fetchMe = useAuth((s) => s.fetchMe);

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return <AppRouter />;
}
