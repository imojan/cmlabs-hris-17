// src/app/store/authStore.js
import { create } from "zustand";
import { authService } from "@/app/services/auth.api";
import { getToken } from "@/lib/http";

export const useAuth = create((set, get) => ({
  user: null,
  token: getToken() || null,   // ambil dari localStorage via http helper
  loading: false,
  error: null,

  async login({ identifier, password }) {
    set({ loading: true, error: null });
    try {
      const res = await authService.signIn({ identifier, password });

      // authService.signIn() sudah set token ke storage (via setToken di http.js)
      const token = getToken() || res?.token || res?.accessToken || null;
      const user  = res?.user || res?.data?.user || null; // kalau backend kirim user di response

      set({ token, user, loading: false });
      return { ok: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { ok: false, error: err.message, status: err.status };
    }
  },

  logout() {
    // authService.signOut() akan clearToken() di dalamnya (sesuai auth.api.js)
    try { authService.signOut().catch(() => {}); } catch {/* ignore */}
    set({ token: null, user: null });
  },

  async fetchMe() {
    // kalau belum ada token, tidak usah panggil
    if (!get().token) return;
    try {
      const me = await authService.me();
      // normalisasi, tergantung backend
      set({ user: me?.data || me || null });
    } catch {
      // token invalid/expired → paksa logout
      get().logout();
    }
  },
}));
