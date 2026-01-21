import { http } from "@/lib/http";

const PATH = {
  adminCheckclock: "/api/admin/checkclock",
  userCheckclock: "/api/user",
};

export const attendanceService = {
  /**
   * Get all attendance records (admin)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (optional)
   * @param {number} params.limit - Records per page (optional)
   * @param {string} params.status - Filter by status (optional)
   * @param {string} params.type - Filter by attendance type (optional)
   * @param {number} params.employeeId - Filter by employee (optional)
   */
  async getAll(params = {}) {
    const query = new URLSearchParams();
    
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.status) query.append("status", params.status);
    if (params.type) query.append("type", params.type);
    if (params.employeeId) query.append("employeeId", params.employeeId);
    if (params.month) query.append("month", params.month);
    if (params.year) query.append("year", params.year);
    
    const queryString = query.toString();
    const url = queryString ? `${PATH.adminCheckclock}?${queryString}` : PATH.adminCheckclock;
    
    return http(url, { method: "GET" });
  },

  /**
   * Get attendance detail by ID (admin)
   * @param {number|string} id - Attendance ID
   */
  async getById(id) {
    return http(`${PATH.adminCheckclock}/${id}`, { method: "GET" });
  },

  /**
   * Create attendance record (admin)
   * @param {FormData|Object} data - Attendance data (use FormData for proof upload)
   */
  async create(data) {
    // Jika data adalah FormData (ada file upload), jangan set Content-Type
    if (data instanceof FormData) {
      const token = localStorage.getItem("hris_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}${PATH.adminCheckclock}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      
      const json = await res.json();
      if (!res.ok) {
        const err = new Error(json?.message || "Failed to create attendance");
        err.status = res.status;
        err.data = json;
        throw err;
      }
      return json;
    }
    
    return http(PATH.adminCheckclock, { method: "POST", body: data });
  },

  /**
   * Approve or reject attendance (admin)
   * @param {number|string} id - Attendance ID
   * @param {string} action - "APPROVED" or "REJECTED"
   */
  async approve(id, action) {
    // Backend expects { approved: true/false }
    const approved = action === "APPROVED";
    return http(`${PATH.adminCheckclock}/${id}/approve`, {
      method: "PATCH",
      body: { approved },
    });
  },

  /**
   * Get attendance statistics (admin)
   * @param {Object} params - Query parameters
   * @param {number} params.month - Month (optional)
   * @param {number} params.year - Year (optional)
   */
  async getStats(params = {}) {
    const query = new URLSearchParams();
    if (params.month) query.append("month", params.month);
    if (params.year) query.append("year", params.year);
    
    const queryString = query.toString();
    const url = queryString 
      ? `${PATH.adminCheckclock}/attendance/stats?${queryString}` 
      : `${PATH.adminCheckclock}/attendance/stats`;
    
    return http(url, { method: "GET" });
  },

  /**
   * Get attendance table data (admin)
   * @param {Object} params - Query parameters
   */
  async getTable(params = {}) {
    const query = new URLSearchParams();
    if (params.month) query.append("month", params.month);
    if (params.year) query.append("year", params.year);
    
    const queryString = query.toString();
    const url = queryString 
      ? `${PATH.adminCheckclock}/attendance/table?${queryString}` 
      : `${PATH.adminCheckclock}/attendance/table`;
    
    return http(url, { method: "GET" });
  },

  // ============ USER ENDPOINTS ============

  /**
   * Get user's own attendance records
   */
  async getUserAttendance() {
    return http(`${PATH.userCheckclock}/check-clocks/me`, { method: "GET" });
  },

  /**
   * Create user checkclock (clock in, clock out, absent, leave)
   * @param {FormData|Object} data - Checkclock data
   */
  async createUserCheckclock(data) {
    if (data instanceof FormData) {
      const token = localStorage.getItem("hris_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}${PATH.userCheckclock}/check-clocks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      
      const json = await res.json();
      if (!res.ok) {
        const err = new Error(json?.message || "Failed to submit attendance");
        err.status = res.status;
        err.data = json;
        throw err;
      }
      return json;
    }
    
    return http(`${PATH.userCheckclock}/check-clocks`, { method: "POST", body: data });
  },

  /**
   * Get user attendance summary
   * @param {string} month - Month in format YYYY-MM
   */
  async getUserAttendanceSummary(month) {
    return http(`${PATH.userCheckclock}/check-clocks/summary?month=${month}`, { method: "GET" });
  },

  /**
   * Get user work hours summary
   * @param {string} month - Month in format YYYY-MM
   */
  async getUserWorkHours(month) {
    return http(`${PATH.userCheckclock}/work-hours?month=${month}`, { method: "GET" });
  },

  /**
   * Get user leave summary
   * @param {string} month - Month in format YYYY-MM
   */
  async getUserLeaveSummary(month) {
    return http(`${PATH.userCheckclock}/leave/summary?month=${month}`, { method: "GET" });
  },
};
