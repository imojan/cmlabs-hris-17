import { http, setToken, clearToken } from "@/lib/http";

// ↓↓↓ UBAH DI SINI SAJA JIKA PATH BERBEDA ↓↓↓
// src/app/config/services/auth.api.js
const PATH = {
  login:    "/api/auth/signin",
  register: "/api/auth/signup",   // ← samakan dengan Postman
  me:       "/api/auth/me",
  logout:   "/api/auth/logout",
};

// ↑↑↑

export const authService = {
  async signIn({ identifier, password }) {
    // banyak backend pakai "email" atau "username". Kamu bisa map di sini.
    const body = { identifier, password };
    const res = await http(PATH.login, { method: "POST", body });
    // Normalisasi bentuk response (sesuaikan server temanmu)
    const token = res?.token || res?.accessToken || res?.data?.token;
    if (token) setToken(token);
    return res;
  },

  async signUp(payload) {
    return http("/api/auth/signup", { method: "POST", body: payload });
  },

  async me() {
    return http("/api/auth/me", { method: "GET" });
  },

  async signOut() {
    clearToken();
    try { await http(PATH.logout, { method: "POST" }); } catch {/* ignore */}
  },
};
