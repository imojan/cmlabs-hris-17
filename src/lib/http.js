const BASE_URL = import.meta.env.VITE_API_URL;

// Simpan & ambil token dari localStorage
export function getToken() {
  return localStorage.getItem("hris_token");
}
export function setToken(t) {
  if (t) localStorage.setItem("hris_token", t);
}
export function clearToken() {
  localStorage.removeItem("hris_token");
}

// ============================================
// Global Auth Event Handler
// Komponen lain bisa listen event ini untuk handle 401
// ============================================
const AUTH_EVENTS = {
  UNAUTHORIZED: 'auth:unauthorized',
  TOKEN_EXPIRED: 'auth:token_expired',
};

export function onUnauthorized(callback) {
  window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, callback);
  return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, callback);
}

function emitUnauthorized() {
  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.UNAUTHORIZED));
}

/**
 * Wrapper fetch:
 * - auto JSON
 * - auto inject Authorization
 * - auto throw error kalau status bukan 2xx
 * - emit event jika 401 (token expired/invalid)
 */
export async function http(path, { method = "GET", body, headers, useCookie, isFormData = false } = {}) {
  const url = new URL(path, BASE_URL).toString();
  const h = {
    ...(headers || {}),
  };

  // Hanya set Content-Type jika bukan FormData
  if (!isFormData) {
    h["Content-Type"] = "application/json";
  }

  // tambahkan Bearer token kalau ada
  const token = getToken();
  if (!useCookie && token) h.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers: h,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    credentials: useCookie ? "include" : "same-origin",
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    
    // Handle 401 Unauthorized - token expired/invalid
    if (res.status === 401) {
      emitUnauthorized();
    }
    
    throw err;
  }

  return data;
}
