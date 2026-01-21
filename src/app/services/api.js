/**
 * API Service Configuration
 * Central HTTP client with interceptors for auth, error handling, etc.
 */

import { ENV } from '@/app/config/env';

// ============================================
// TOKEN MANAGEMENT
// ============================================

const TOKEN_KEY = 'hris_token';
const USER_KEY = 'hris_user';

export const tokenService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser: () => localStorage.removeItem(USER_KEY),
  
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ============================================
// HTTP CLIENT
// ============================================

/**
 * Base fetch wrapper with auth and error handling
 */
async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    isFormData = false,
    withCredentials = false,
  } = options;

  const url = `${ENV.API_URL}${endpoint}`;
  
  // Build headers
  const requestHeaders = {
    ...headers,
  };

  // Add Content-Type for JSON (not for FormData)
  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  // Add Authorization header if token exists
  const token = tokenService.getToken();
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Build request config
  const config = {
    method,
    headers: requestHeaders,
    credentials: withCredentials ? 'include' : 'same-origin',
  };

  // Add body
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    // Parse response
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    // Handle HTTP errors
    if (!response.ok) {
      const error = new Error(data?.message || data?.error || `HTTP Error ${response.status}`);
      error.status = response.status;
      error.data = data;
      
      // Handle 401 Unauthorized - clear token and redirect
      if (response.status === 401) {
        tokenService.clearAll();
        // Optionally redirect to login
        // window.location.href = '/signin';
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    // Network errors or other issues
    if (!error.status) {
      error.message = 'Network error. Please check your connection.';
    }
    throw error;
  }
}

// ============================================
// API METHODS
// ============================================

export const api = {
  get: (endpoint, options = {}) => 
    request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint, body, options = {}) => 
    request(endpoint, { ...options, method: 'POST', body }),
    
  put: (endpoint, body, options = {}) => 
    request(endpoint, { ...options, method: 'PUT', body }),
    
  patch: (endpoint, body, options = {}) => 
    request(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: (endpoint, options = {}) => 
    request(endpoint, { ...options, method: 'DELETE' }),

  // For file uploads (FormData)
  upload: (endpoint, formData, options = {}) =>
    request(endpoint, { 
      ...options, 
      method: 'POST', 
      body: formData, 
      isFormData: true 
    }),
    
  uploadPut: (endpoint, formData, options = {}) =>
    request(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: formData, 
      isFormData: true 
    }),
};

// ============================================
// API ENDPOINTS
// ============================================

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    EMPLOYEE_LOGIN: '/api/auth/employee/signin',
    GOOGLE: '/api/auth/google',
    ME: '/api/auth/me',
    FORGOT_PASSWORD: '/api/password/forgot',
    RESET_PASSWORD: '/api/password/reset',
  },
  
  // Employees
  EMPLOYEES: {
    LIST: '/api/employees',
    STATS: '/api/employees/stats',
    ME: '/api/employees/me',
    DETAIL: (id) => `/api/employees/${id}`,
    CREATE: '/api/employees',
    UPDATE: (id) => `/api/employees/${id}`,
    DELETE: (id) => `/api/employees/${id}`,
    AVATAR: (id) => `/api/employees/${id}/avatar`,
  },
  
  // Attendance (Admin)
  ADMIN_CHECKCLOCK: {
    LIST: '/api/admin/checkclock',
    STATS: '/api/admin/checkclock/attendance/stats',
    TABLE: '/api/admin/checkclock/attendance/table',
    DETAIL: (id) => `/api/admin/checkclock/${id}`,
    CREATE: '/api/admin/checkclock',
    APPROVE: (id) => `/api/admin/checkclock/${id}/approve`,
  },
  
  // Attendance (User)
  USER_CHECKCLOCK: {
    LIST: '/api/user/check-clocks/me',
    CREATE: '/api/user/check-clocks',
    SUMMARY: '/api/user/check-clocks/summary',
    WORK_HOURS: '/api/user/work-hours',
    LEAVE_SUMMARY: '/api/user/leave/summary',
  },
  
  // Dashboard
  DASHBOARD: {
    ME: '/api/dashboard/me',
  },
  
  // Leave
  LEAVES: {
    LIST: '/api/leaves',
    CREATE: '/api/leaves',
  },
  
  // Company
  COMPANY: {
    BASE: '/api/company',
  },
  
  // Salary
  SALARIES: {
    BASE: '/api/salaries',
  },
};

export default api;
