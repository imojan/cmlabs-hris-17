import { http, setToken, clearToken } from "@/lib/http";

// ↓↓↓ UBAH DI SINI SAJA JIKA PATH BERBEDA ↓↓↓
// src/app/config/services/auth.api.js
const PATH = {
  login:          "/api/auth/signin",
  register:       "/api/auth/signup",
  me:             "/api/auth/me",
  logout:         "/api/auth/logout",
  google:         "/api/auth/google",   // ← backend-mu ada r.post('/google', ...)
  forgotPassword: "/api/auth/forgot-password",
  resetPassword:  "/api/auth/reset-password",
};

export const authService = {
  async signIn({ identifier, password }) {
    const body = { identifier, password };     // backend-mu menerima "identifier"
    const res  = await http(PATH.login, { method: "POST", body });
    const token = res?.token || res?.accessToken || res?.data?.token;
    if (token) setToken(token);
    return res;
  },

  async signUp(payload) {
    return http(PATH.register, { method: "POST", body: payload });
  },

  async googleSignIn(credential) {
    // credential = JWT dari Google (GIS callback)
    const res  = await http(PATH.google, { method: "POST", body: { credential } });
    const token = res?.token || res?.accessToken || res?.data?.token;
    if (token) setToken(token);
    return res;
  },

  async me() {
    return http(PATH.me, { method: "GET" });
  },

  async signOut() {
    clearToken();
    try { await http(PATH.logout, { method: "POST" }); } catch {/* ignore */}
  },

  async forgotPassword({ email }) {
    return http(PATH.forgotPassword, { method: "POST", body: { email } });
  },

  async resetPassword({ token, password }) {
    return http(PATH.resetPassword, { method: "POST", body: { token, password } });
  },
};