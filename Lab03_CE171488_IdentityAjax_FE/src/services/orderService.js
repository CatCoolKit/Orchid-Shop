import apiClient from "./httpClient";
import authService from "./authService";

const orderService = {
  async getMyOrders() {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập để xem đơn hàng");
      }

      const response = await apiClient.get(
        "/Order/my-details",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      }
      throw new Error(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng"
      );
    }
  },

  async createOrder(cartItems) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập để đặt hàng");
      }

      const accountId = authService.getAccountId();
      if (!accountId) {
        throw new Error("Không thể xác định tài khoản, vui lòng đăng nhập lại");
      }

      // Transform cart items to API format
      const orderDetails = cartItems.map((item) => ({
        orchidId: item.orchid.orchidId,
        quantity: item.quantity,
      }));

      const orderData = {
        accountId: parseInt(accountId),
        orderDetails: orderDetails,
      };

      const response = await apiClient.post("/Order", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      }
      throw new Error(
        error.response?.data?.message || "Không thể tạo đơn hàng"
      );
    }
  },

  // Admin method to get all orders
  async getAllOrders() {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập để xem danh sách đơn hàng");
      }

      // Check if user is admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "Admin") {
        throw new Error("Bạn không có quyền truy cập tính năng này");
      }

      const response = await apiClient.get(
        "/Order",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data || response.data; // Handle different response formats
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      }
      if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền truy cập tính năng này");
      }
      throw new Error(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng"
      );
    }
  },

  // Admin method to update order status
  async updateOrderStatus(orderId, orderStatus) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập để cập nhật đơn hàng");
      }

      // Check if user is admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "Admin") {
        throw new Error("Bạn không có quyền thực hiện thao tác này");
      }

      const response = await apiClient.put(
        `/Order/${orderId}`,
        { orderStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      }
      if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền thực hiện thao tác này");
      }
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      throw new Error(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái đơn hàng"
      );
    }
  },

  // User method to cancel order
  async cancelOrder(orderId) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập để hủy đơn hàng");
      }

      const response = await apiClient.put(
        `/Order/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      }
      if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền hủy đơn hàng này");
      }
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      if (error.response?.status === 400) {
        throw new Error("Không thể hủy đơn hàng ở trạng thái này");
      }
      throw new Error(
        error.response?.data?.message || "Không thể hủy đơn hàng"
      );
    }
  },
};

export default orderService;
