import apiClient from "./httpClient.js";

// Orchid Service - Abstract API calls for orchids
class OrchidService {
  // Get all orchids
  async getAllOrchids() {
    try {
      const response = await apiClient.get("/Orchid");
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch orchids: ${error.message}`);
    }
  }

  // Get orchid by ID
  async getOrchidById(id) {
    try {
      const response = await apiClient.get(`/Orchid/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch orchid ${id}: ${error.message}`);
    }
  }

  // Search orchids
  async searchOrchids(searchTerm) {
    try {
      const response = await apiClient.get("/Orchid", {
        search: searchTerm,
      });
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to search orchids: ${error.message}`);
    }
  }

  // Get orchids by category
  async getOrchidsByCategory(categoryName) {
    try {
      const response = await apiClient.get("/Orchid", {
        category: categoryName,
      });
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch orchids by category: ${error.message}`);
    }
  }

  // Create new orchid
  async createOrchid(orchidData) {
    try {
      // Transform data to match API format
      const apiData = {
        orchidName: orchidData.orchidName,
        orchidDescription: orchidData.orchidDescription,
        orchidUrl: orchidData.orchidUrl || "",
        price: Number(orchidData.price),
        categoryId: Number(orchidData.categoryId),
        isNatural: Boolean(orchidData.isNatural),
      };

      const response = await apiClient.post("/Orchid", apiData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create orchid: ${error.message}`);
    }
  }

  // Update orchid
  async updateOrchid(id, orchidData) {
    try {
      // Transform data to match API format
      const apiData = {
        orchidName: orchidData.orchidName,
        orchidDescription: orchidData.orchidDescription,
        orchidUrl: orchidData.orchidUrl || "",
        price: Number(orchidData.price),
        categoryId: Number(orchidData.categoryId),
        isNatural: Boolean(orchidData.isNatural),
      };

      const response = await apiClient.put(`/Orchid/${id}`, apiData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update orchid ${id}: ${error.message}`);
    }
  }

  // Delete orchid
  async deleteOrchid(id) {
    try {
      await apiClient.delete(`/Orchid/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete orchid ${id}: ${error.message}`);
    }
  }
}

// Export singleton instance
const orchidService = new OrchidService();
export default orchidService;
