import { http, setToken, clearToken } from "@/lib/http";

// ↓↓↓ UBAH DI SINI SAJA JIKA PATH BERBEDA ↓↓↓
const PATH = {
  login:   "/auth/login",     // atau "/api/login"
  register:"/auth/register",  // opsional
  me:      "/auth/me",
  logout:  "/auth/logout",    // opsional
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
    return http(PATH.register, { method: "POST", body: payload });
  },

  async me() {
    return http(PATH.me, { method: "GET" });
  },

  async signOut() {
    clearToken();
    try { await http(PATH.logout, { method: "POST" }); } catch {/* ignore */}
  },
};
