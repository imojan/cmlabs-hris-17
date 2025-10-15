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

/**
 * Wrapper fetch:
 * - auto JSON
 * - auto inject Authorization
 * - auto throw error kalau status bukan 2xx
 */
export async function http(path, { method = "GET", body, headers, useCookie } = {}) {
  const url = `${BASE_URL}${path}`;
  const h = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  // tambahkan Bearer token kalau ada
  const token = getToken();
  if (!useCookie && token) h.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
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
    throw err;
  }

  return data;
}
