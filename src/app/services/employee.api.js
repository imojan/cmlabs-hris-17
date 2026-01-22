import { http } from "@/lib/http";

const PATH = {
  employees: "/api/employees",
  stats: "/api/employees/stats",
};

export const employeeService = {
  /**
   * Get all employees with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (optional)
   * @param {number} params.limit - Records per page (optional)
   * @param {string} params.search - Search term (optional)
   * @param {number} params.month - Filter by month (optional)
   * @param {number} params.year - Filter by year (optional)
   */
  async getAll(params = {}) {
    const query = new URLSearchParams();
    
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);
    if (params.month) query.append("month", params.month);
    if (params.year) query.append("year", params.year);
    
    const queryString = query.toString();
    const url = queryString ? `${PATH.employees}?${queryString}` : PATH.employees;
    
    return http(url, { method: "GET" });
  },

  /**
   * Get employee by ID
   * @param {number|string} id - Employee ID
   */
  async getById(id) {
    return http(`${PATH.employees}/${id}`, { method: "GET" });
  },

  /**
   * Create new employee
   * @param {FormData|Object} data - Employee data (use FormData for avatar upload)
   */
  async create(data) {
    // Jika data adalah FormData (ada file upload), jangan set Content-Type
    if (data instanceof FormData) {
      const token = localStorage.getItem("hris_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}${PATH.employees}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      
      const json = await res.json();
      if (!res.ok) {
        const err = new Error(json?.message || "Failed to create employee");
        err.status = res.status;
        err.data = json;
        throw err;
      }
      return json;
    }
    
    return http(PATH.employees, { method: "POST", body: data });
  },

  /**
   * Update employee
   * @param {number|string} id - Employee ID
   * @param {FormData|Object} data - Employee data (use FormData for avatar upload)
   */
  async update(id, data) {
    // Jika data adalah FormData (ada file upload), jangan set Content-Type
    if (data instanceof FormData) {
      const token = localStorage.getItem("hris_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}${PATH.employees}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      
      const json = await res.json();
      if (!res.ok) {
        const err = new Error(json?.message || "Failed to update employee");
        err.status = res.status;
        err.data = json;
        throw err;
      }
      return json;
    }
    
    return http(`${PATH.employees}/${id}`, { method: "PUT", body: data });
  },

  /**
   * Delete employee
   * @param {number|string} id - Employee ID
   */
  async delete(id) {
    return http(`${PATH.employees}/${id}`, { method: "DELETE" });
  },

  /**
   * Get employee statistics
   */
  async getStats(params = {}) {
    const query = new URLSearchParams();
    if (params.month) query.append("month", params.month);
    if (params.year) query.append("year", params.year);
    
    const queryString = query.toString();
    const url = queryString ? `${PATH.stats}?${queryString}` : PATH.stats;
    
    return http(url, { method: "GET" });
  },

  /**
   * Update employee avatar
   * @param {number|string} id - Employee ID
   * @param {File} file - Avatar file
   */
  async updateAvatar(id, file) {
    const formData = new FormData();
    formData.append("avatar", file);
    
    const token = localStorage.getItem("hris_token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}${PATH.employees}/${id}/avatar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    const json = await res.json();
    if (!res.ok) {
      const err = new Error(json?.message || "Failed to update avatar");
      err.status = res.status;
      err.data = json;
      throw err;
    }
    return json;
  },

  /**
   * Toggle employee active status (nonaktifkan sementara)
   * @param {number|string} id - Employee ID
   */
  async toggleStatus(id) {
    return http(`${PATH.employees}/${id}/toggle-status`, { method: "PATCH" });
  },

  /**
   * Terminate employee (resign / PHK)
   * @param {number|string} id - Employee ID
   * @param {string} type - 'resign' | 'terminated'
   */
  async terminate(id, type) {
    return http(`${PATH.employees}/${id}/terminate`, { 
      method: "PATCH", 
      body: { type } 
    });
  },
};
