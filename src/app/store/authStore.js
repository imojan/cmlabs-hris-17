import { create } from "zustand";
import { authService } from "@/app/services/auth.api";
import { getToken, setToken } from "@/lib/http";

export const useAuth = create((set, get) => ({
  user: null,
  token: getToken() || null,
  loading: false,
  error: null,

  async login({ identifier, password }) {
    set({ loading: true, error: null });
    try {
      const res   = await authService.signIn({ identifier, password });

      const token = getToken() || res?.token || res?.accessToken || null;
      const user  = res?.user || res?.data?.user || null;
      set({ token, user, loading: false });
      return { ok: true };
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
      const user  = res?.user || res?.data?.user;
      if (token) setToken(token);
      set({ token, user, loading: false });
      return { ok: true };
    } catch (err) {
      console.error("Google login failed:", err);
      set({ error: err.message, loading: false });
      return { ok: false };
    }
  },

  logout() {
    authService.signOut().catch(() => {});
    set({ token: null, user: null });
  },

  async fetchMe() {
    if (!get().token) return;
    try {
      const me = await authService.me();
      set({ user: me?.data || me || null });
    } catch {
      get().logout();
    }
  },
}));
