import apiClient from "./httpClient";
import authService from "./authService";

const userService = {
  // Get all users (Admin only)
  async getAllUsers() {
    try {
      // Check if user is admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "Admin") {
        throw new Error("Bạn không có quyền truy cập tính năng này");
      }

      const response = await apiClient.get("/Account");
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  // Create new user (Admin only)
  async createUser(userData) {
    try {
      // Transform data to match API format
      const apiData = {
        accountName: userData.accountName,
        email: userData.email,
        password: userData.password,
        roleId: Number(userData.roleId),
      };

      const response = await apiClient.post("/Account", apiData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // Update user (Admin only)
  async updateUser(accountId, userData) {
    try {
      // Transform data to match API format (no password in update)
      const apiData = {
        accountName: userData.accountName,
        email: userData.email,
        roleId: Number(userData.roleId),
      };

      const response = await apiClient.put(`/Account/${accountId}`, apiData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user ${accountId}: ${error.message}`);
    }
  },

  // Delete user (Admin only)
  async deleteUser(accountId) {
    try {
      await apiClient.delete(`/Account/${accountId}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user ${accountId}: ${error.message}`);
    }
  },
};

export default userService;
