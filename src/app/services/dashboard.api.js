// src/app/services/dashboard.api.js
import { http } from '../../lib/http';

/**
 * Dashboard API Service
 */
const dashboardService = {
  /**
   * Get admin dashboard statistics
   * @param {string} month - Format: "2026-01" (optional)
   */
  getAdminStats: async (month) => {
    const params = month ? `?month=${month}` : '';
    const data = await http(`/api/dashboard/admin/stats${params}`);
    return data;
  },

  /**
   * Get employee chart data (monthly breakdown)
   * @param {number} year - Year to get data for (optional)
   */
  getEmployeeChart: async (year) => {
    const params = year ? `?year=${year}` : '';
    const data = await http(`/api/dashboard/admin/employee-chart${params}`);
    return data;
  },

  /**
   * Get employee status distribution for chart
   * @param {string} month - Format: "2026-01" (optional)
   */
  getStatusChart: async (month) => {
    const params = month ? `?month=${month}` : '';
    const data = await http(`/api/dashboard/admin/status-chart${params}`);
    return data;
  },

  /**
   * Get attendance chart data for a specific date
   * @param {string} date - Format: "2026-01-21" (optional, defaults to today)
   */
  getAttendanceChart: async (date) => {
    const params = date ? `?date=${date}` : '';
    const data = await http(`/api/dashboard/admin/attendance-chart${params}`);
    return data;
  },

  /**
   * Get user dashboard (personal stats)
   * @param {string} month - Format: "2026-01"
   */
  getUserDashboard: async (month) => {
    const params = `?month=${month}`;
    const data = await http(`/api/dashboard/me${params}`);
    return data;
  }
};

export default dashboardService;
