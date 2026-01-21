import { http, setToken, clearToken } from "@/lib/http";

// ↓↓↓ PATH SESUAI BACKEND hris-api ↓↓↓
const PATH = {
  login:          "/api/auth/login",           // POST - user/admin login
  employeeLogin:  "/api/auth/employee/signin", // POST - employee login dengan ID
  register:       "/api/auth/signup",          // POST - register
  me:             "/api/auth/me",              // GET  - get current user
  logout:         "/api/auth/logout",          // POST - logout (optional)
  google:         "/api/auth/google",          // POST - Google OAuth
  forgotPassword: "/api/password/forgot-password",  // POST - request reset password
  resetPassword:  "/api/password/reset-password",   // POST - reset password dengan token
  // Profile endpoints
  profile:        "/api/profile",              // GET/PUT - profile
  avatar:         "/api/profile/avatar",       // PUT/DELETE - avatar
  changePassword: "/api/profile/change-password", // PUT - change password
};

export const authService = {
  // Login untuk User/Admin dengan email
  async signIn({ identifier, password }) {
    const body = { identifier, password };
    const res  = await http(PATH.login, { method: "POST", body });
    const token = res?.token || res?.accessToken || res?.data?.token;
    if (token) setToken(token);
    return res;
  },

  // Login untuk Employee dengan Employee ID
  async employeeSignIn({ companyUser, employeeId, password }) {
    const body = { companyUser, employeeId, password };
    const res  = await http(PATH.employeeLogin, { method: "POST", body });
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

  // ============================================
  // PROFILE API
  // ============================================
  
  async getProfile() {
    return http(PATH.profile, { method: "GET" });
  },

  async updateProfile(data) {
    return http(PATH.profile, { method: "PUT", body: data });
  },

  async updateAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return http(PATH.avatar, { method: "PUT", body: formData, isFormData: true });
  },

  async deleteAvatar() {
    return http(PATH.avatar, { method: "DELETE" });
  },

  async changePassword({ currentPassword, newPassword }) {
    return http(PATH.changePassword, { 
      method: "PUT", 
      body: { currentPassword, newPassword } 
    });
  },
};