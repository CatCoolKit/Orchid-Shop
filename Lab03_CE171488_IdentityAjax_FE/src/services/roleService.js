import apiClient from "./httpClient";
import authService from "./authService";

const roleService = {
  // Get all roles
  async getAllRoles() {
    try {
      // Check if user is admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "Admin") {
        throw new Error("Bạn không có quyền truy cập tính năng này");
      }

      const response = await apiClient.get("/Role");
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch roles: ${error.message}`);
    }
  },

  // Create new role (Admin only)
  async createRole(roleData) {
    try {
      // Transform data to match API format
      const apiData = {
        roleName: roleData.roleName.trim(),
      };

      const response = await apiClient.post("/Role", apiData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create role: ${error.message}`);
    }
  },

  // Update role (Admin only)
  async updateRole(roleId, roleData) {
    try {
      // Transform data to match API format
      const apiData = {
        roleName: roleData.roleName.trim(),
      };

      const response = await apiClient.put(`/Role/${roleId}`, apiData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update role ${roleId}: ${error.message}`);
    }
  },

  // Delete role (Admin only)
  async deleteRole(roleId) {
    try {
      await apiClient.delete(`/Role/${roleId}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete role ${roleId}: ${error.message}`);
    }
  },
};

export default roleService;
