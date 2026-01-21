import { http } from "@/lib/http";

const PATH = "/api/notifications";

export const notificationService = {
  /**
   * Get all notifications for current user
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Max notifications to fetch (default 20)
   * @param {boolean} params.unreadOnly - Only fetch unread notifications
   */
  async getAll(params = {}) {
    const query = new URLSearchParams();
    
    if (params.limit) query.append("limit", params.limit);
    if (params.unreadOnly) query.append("unreadOnly", "true");
    
    const queryString = query.toString();
    const url = queryString ? `${PATH}?${queryString}` : PATH;
    
    return http(url, { method: "GET" });
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount() {
    return http(`${PATH}/unread-count`, { method: "GET" });
  },

  /**
   * Mark single notification as read
   * @param {number|string} id - Notification ID
   */
  async markAsRead(id) {
    return http(`${PATH}/${id}/read`, { method: "PATCH" });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    return http(`${PATH}/read-all`, { method: "PATCH" });
  },

  /**
   * Delete a notification
   * @param {number|string} id - Notification ID
   */
  async delete(id) {
    return http(`${PATH}/${id}`, { method: "DELETE" });
  },
};
