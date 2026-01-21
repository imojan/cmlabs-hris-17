// src/app/services/schedule.api.js
import { http } from '../../lib/http';

/**
 * Schedule API Service
 */
const scheduleService = {
  /**
   * Get all employee schedules
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search query
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   */
  getSchedules: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    
    const query = searchParams.toString();
    const url = `/api/schedules${query ? `?${query}` : ''}`;
    return await http(url);
  },

  /**
   * Get schedule statistics
   */
  getStats: async () => {
    return await http('/api/schedules/stats');
  },

  /**
   * Get all shift types
   */
  getShiftTypes: async () => {
    return await http('/api/schedules/shift-types');
  },

  /**
   * Create new shift type
   * @param {Object} data - Shift type data
   * @param {string} data.name - Shift type name
   * @param {string} data.type - Shift type (regular/shift)
   * @param {Object} data.schedules - Weekly schedule
   */
  createShiftType: async (data) => {
    return await http('/api/schedules/shift-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Assign schedule to employee
   * @param {Object} data - Assignment data
   * @param {number} data.employeeId - Employee ID
   * @param {number} data.settingId - Shift setting ID
   * @param {string} data.effectiveFrom - Effective date
   */
  assignSchedule: async (data) => {
    return await http('/api/schedules/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update employee schedule
   * @param {number} employeeId - Employee ID
   * @param {Object} data - Schedule data
   * @param {string} data.shiftType - Shift type name
   * @param {Object} data.schedules - Weekly schedule
   */
  updateSchedule: async (employeeId, data) => {
    return await http(`/api/schedules/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Remove schedule from employee
   * @param {number} employeeId - Employee ID
   */
  deleteSchedule: async (employeeId) => {
    return await http(`/api/schedules/${employeeId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get employees without schedules
   */
  getUnassignedEmployees: async () => {
    return await http('/api/schedules/unassigned-employees');
  },
};

export default scheduleService;
