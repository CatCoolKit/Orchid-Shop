import apiClient from "./httpClient.js";
import authService from "./authService.js";

// Category Service - Abstract API calls for categories
class CategoryService {
  // Get all categories
  async getAllCategories() {
    try {
      const token = authService.getToken();
      const response = await apiClient.get("/Category");
      const categories = response.data || [];

      // Add "All" option at the beginning for public view
      // For admin, return raw data without "All" option
      if (token) {
        return categories;
      }
      return [{ categoryId: "all", categoryName: "Tất cả" }, ...categories];
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await apiClient.get(`/Category/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch category ${id}: ${error.message}`);
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      // Transform data to match API format
      const apiData = {
        categoryName: categoryData.categoryName.trim(),
      };

      const response = await apiClient.post("/Category", apiData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  // Update category
  async updateCategory(categoryId, categoryData) {
    try {
      // Transform data to match API format
      const apiData = {
        categoryName: categoryData.categoryName.trim(),
      };

      const response = await apiClient.put(`/Category/${categoryId}`, apiData);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to update category ${categoryId}: ${error.message}`
      );
    }
  }

  // Delete category
  async deleteCategory(categoryId) {
    try {
      await apiClient.delete(`/Category/${categoryId}`);
      return true;
    } catch (error) {
      throw new Error(
        `Failed to delete category ${categoryId}: ${error.message}`
      );
    }
  }

  // Get categories with orchid count (for future use)
  async getCategoriesWithCount() {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập để xem thống kê danh mục");
      }

      const response = await apiClient.get("/Category?includeCount=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data || [];
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      }
      throw new Error(
        error.response?.data?.message || "Không thể tải thống kê danh mục"
      );
    }
  }
}

// Export singleton instance
const categoryService = new CategoryService();
export default categoryService;
