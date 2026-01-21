// src/app/services/location.api.js
import { http } from "@/lib/http";

const PATH = {
  locations: "/api/locations",
  allLocations: "/api/locations/all",
};

export const locationService = {
  /**
   * Get all active locations for current company
   * Used by employee & admin for checkclock
   */
  async getLocations() {
    return http(PATH.locations, { method: "GET" });
  },

  /**
   * Get all locations (including inactive) - Admin only
   */
  async getAllLocations() {
    return http(PATH.allLocations, { method: "GET" });
  },

  /**
   * Get single location by ID
   */
  async getLocationById(id) {
    return http(`${PATH.locations}/${id}`, { method: "GET" });
  },

  /**
   * Create new location - Admin only
   * @param {Object} data - { name, address?, latitude, longitude }
   */
  async createLocation(data) {
    return http(PATH.locations, { method: "POST", body: data });
  },

  /**
   * Update location - Admin only
   * @param {number} id - Location ID
   * @param {Object} data - { name?, address?, latitude?, longitude?, isActive? }
   */
  async updateLocation(id, data) {
    return http(`${PATH.locations}/${id}`, { method: "PUT", body: data });
  },

  /**
   * Delete location - Admin only
   */
  async deleteLocation(id) {
    return http(`${PATH.locations}/${id}`, { method: "DELETE" });
  },
};
