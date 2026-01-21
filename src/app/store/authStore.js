import { create } from "zustand";
import { authService } from "@/app/services/auth.api";
import { getToken, setToken, clearToken } from "@/lib/http";

// Helper untuk persist user ke localStorage
const USER_STORAGE_KEY = "hris_user";

const persistUser = (user) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const useAuth = create((set, get) => ({
  user: getStoredUser(),
  token: getToken() || null,
  loading: false,
  error: null,

  // Computed getters
  isAuthenticated: () => !!get().token && !!get().user,
  isAdmin: () => get().user?.role === "admin",
  isEmployee: () => get().user?.role === "employee" || get().user?.role === "user",

  async login({ identifier, password }) {
    set({ loading: true, error: null });
    try {
      const res = await authService.signIn({ identifier, password });

      // Ambil token (sudah disimpan di http.js via setToken)
      const token = getToken() || res?.token || res?.accessToken || null;
      
      // Ambil user data dari response
      const user = res?.user || res?.data?.user || null;
      
      // Persist user ke localStorage
      persistUser(user);
      
      set({ token, user, loading: false });
      
      // Return dengan user data untuk redirect logic
      return { ok: true, user };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { ok: false, error: err.message, status: err.status };
    }
  },

  async loginWithGoogle(credential) {
    set({ loading: true, error: null });
    try {
      const res = await authService.googleSignIn(credential);
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;
      
      if (token) setToken(token);
      persistUser(user);
      
      set({ token, user, loading: false });
      return { ok: true, user };
    } catch (err) {
      console.error("Google login failed:", err);
      set({ error: err.message, loading: false });
      return { ok: false, error: err.message };
    }
  },

  // Login untuk Employee dengan Employee ID
  async loginEmployee({ companyUser, employeeId, password }) {
    set({ loading: true, error: null });
    try {
      const res = await authService.employeeSignIn({ companyUser, employeeId, password });
      
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;
      
      if (token) setToken(token);
      persistUser(user);
      
      set({ token, user, loading: false });
      return { ok: true, user };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { ok: false, error: err.message, status: err.status };
    }
  },

  logout(clearRememberMe = false) {
    authService.signOut().catch(() => {});
    clearToken();
    persistUser(null);
    set({ token: null, user: null });
    
    // Clear remember me credentials if explicitly requested
    if (clearRememberMe) {
      localStorage.removeItem("hris_remember_signin");
      localStorage.removeItem("hris_remember_signin_id");
    }
  },

  async fetchMe() {
    if (!get().token) return;
    try {
      const me = await authService.me();
      const currentUser = get().user;
      const newUser = me?.data || me?.user || me || null;

      // Gabungkan, jadi field yang sudah ada tidak hilang
      const mergedUser = {
        ...(currentUser || {}),
        ...(newUser || {}),
      };
      
      persistUser(mergedUser);
      set({ user: mergedUser });
    } catch (err) {
      // Hanya logout jika error 401 (token invalid/expired)
      // Jangan logout untuk error lain (network error, server error, dll)
      if (err?.status === 401) {
        console.warn("Token invalid/expired, logging out...");
        get().logout();
      } else {
        console.error("fetchMe error (not logging out):", err?.message || err);
        // Tetap gunakan user data yang sudah ada dari localStorage
      }
    }
  },

  // Update user data (untuk profile update, etc.)
  setUser(userData) {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, ...userData };
    persistUser(updatedUser);
    set({ user: updatedUser });
  },
}));
