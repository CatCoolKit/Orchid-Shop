import React, { useState, useEffect } from "react";
import { orderService } from "../../services";
import { authService } from "../../services";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminOrders.css";

const AdminOrders = ({
  currentPage,
  onNavigateToHome,
  onNavigateToProducts,
  onNavigateToUsers,
  onNavigateToRoles,
  onNavigateToCategories,
  onLogout,
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [itemsPerPage] = useState(10);

  // Update status states
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [notification, setNotification] = useState("");

  // Order status options
  const statusOptions = [
    { value: "Pending", label: "Chờ xử lý", icon: "⏳" },
    { value: "Processing", label: "Đang xử lý", icon: "🔄" },
    { value: "Confirmed", label: "Đã xác nhận", icon: "✅" },
    { value: "Shipping", label: "Đang giao", icon: "🚛" },
    { value: "Delivered", label: "Đã giao", icon: "📦" },
    { value: "Cancelled", label: "Đã hủy", icon: "❌" },
  ];

  // Check if user is admin
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "Admin") {
      // Redirect non-admin users
      setTimeout(() => {
        onNavigateToHome();
      }, 1000);
      return;
    }

    fetchOrders();
  }, [onNavigateToHome]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getAllOrders();
      // Sort orders by orderDate (newest first)
      const sortedOrders = (ordersData || []).sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Processing: "status-processing",
      Confirmed: "status-confirmed",
      Shipping: "status-shipping",
      Delivered: "status-delivered",
      Cancelled: "status-cancelled",
      Pending: "status-pending",
    };

    const statusText = {
      Processing: "Đang xử lý",
      Confirmed: "Đã xác nhận",
      Shipping: "Đang giao",
      Delivered: "Đã giao",
      Cancelled: "Đã hủy",
      Pending: "Chờ xử lý",
    };

    return (
      <span
        className={`status-badge ${statusClasses[status] || "status-pending"}`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.orderStatus === selectedStatus;
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.accountId.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPageNum - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageOrders = filteredOrders.slice(startIndex, endIndex);

  // Calculate visible page numbers (show max 5 pages around current page)
  const getVisiblePageNumbers = () => {
    if (totalPages <= 1) return totalPages === 1 ? [1] : [];
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPageNum - delta);
      i <= Math.min(totalPages - 1, currentPageNum + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPageNum - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPageNum + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPageNum(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum(currentPageNum - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageNum < totalPages) {
      setCurrentPageNum(currentPageNum + 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, selectedStatus]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(""), 5000);
  };

  const openStatusModal = (order) => {
    setSelectedOrderForUpdate(order);
    setNewStatus(order.orderStatus);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrderForUpdate(null);
    setNewStatus("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderForUpdate || !newStatus) return;

    try {
      setUpdatingOrderId(selectedOrderForUpdate.id);
      await orderService.updateOrderStatus(
        selectedOrderForUpdate.id,
        newStatus
      );

      // Update the order in local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderForUpdate.id
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      showNotification(
        `Đã cập nhật trạng thái đơn hàng #${selectedOrderForUpdate.id} thành "${
          statusOptions.find((s) => s.value === newStatus)?.label
        }"`
      );
      closeStatusModal();
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Check if current user is admin
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== "Admin") {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🚫</div>
          <h2>Truy cập bị từ chối</h2>
          <p>
            Bạn không có quyền truy cập trang này. Chỉ Admin mới có thể xem.
          </p>
          <button className="back-home-btn" onClick={onNavigateToHome}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigateToHome={onNavigateToHome}
      onNavigateToOrders={() => {}} // Already on orders page
      onNavigateToProducts={onNavigateToProducts}
      onNavigateToUsers={onNavigateToUsers}
      onNavigateToRoles={onNavigateToRoles}
      onNavigateToCategories={onNavigateToCategories}
      onLogout={onLogout}
    >
      <div className="orders-management">
        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            <span className="notification-icon">
              {notification.type === "success" ? "✅" : "❌"}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => setNotification("")}
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{filteredOrders.length}</h3>
              <p>Đơn hàng tìm thấy</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <h3>{totalPages}</h3>
              <p>Tổng số trang</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>
                {
                  filteredOrders.filter(
                    (o) =>
                      o.orderStatus === "Pending" ||
                      o.orderStatus === "Processing"
                  ).length
                }
              </h3>
              <p>Chờ xử lý</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚛</div>
            <div className="stat-content">
              <h3>
                {
                  filteredOrders.filter(
                    (o) =>
                      o.orderStatus === "Confirmed" ||
                      o.orderStatus === "Shipping"
                  ).length
                }
              </h3>
              <p>Đang vận chuyển</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>
                {
                  filteredOrders.filter((o) => o.orderStatus === "Delivered")
                    .length
                }
              </h3>
              <p>Hoàn thành</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>
                {formatCurrency(
                  filteredOrders
                    .filter((o) => o.orderStatus === "Delivered")
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                )}
              </h3>
              <p>Doanh thu (filter)</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo ID đơn hàng hoặc ID khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="status-filters">
            {[
              "all",
              "Pending",
              "Processing",
              "Confirmed",
              "Shipping",
              "Delivered",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                className={`filter-btn ${
                  selectedStatus === status ? "active" : ""
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status === "all"
                  ? "Tất cả"
                  : status === "Pending"
                  ? "Chờ xử lý"
                  : status === "Processing"
                  ? "Đang xử lý"
                  : status === "Confirmed"
                  ? "Đã xác nhận"
                  : status === "Shipping"
                  ? "Đang giao"
                  : status === "Delivered"
                  ? "Đã giao"
                  : "Đã hủy"}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-section">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải danh sách đơn hàng...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p>Lỗi: {error}</p>
              <button className="retry-btn" onClick={fetchOrders}>
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="orders-table">
              <div className="table-header">
                <h3>Danh sách đơn hàng ({filteredOrders.length})</h3>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="empty-orders">
                  <div className="empty-icon">📦</div>
                  <h3>Không tìm thấy đơn hàng nào</h3>
                  <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                <div className="orders-list">
                  {currentPageOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div
                        className="order-main"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="order-info">
                          <div className="order-id">
                            <span className="label">Đơn hàng #</span>
                            <span className="value">{order.id}</span>
                          </div>
                          <div className="order-customer">
                            <span className="label">Khách hàng ID:</span>
                            <span className="value">{order.accountId}</span>
                          </div>
                          <div className="order-date">
                            <span className="label">Ngày đặt:</span>
                            <span className="value">
                              {formatDate(order.orderDate)}
                            </span>
                          </div>
                        </div>
                        <div className="order-status">
                          {getStatusBadge(order.orderStatus)}
                        </div>
                        <div className="order-total">
                          <span className="label">Tổng tiền:</span>
                          <span className="value">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                        <div className="expand-icon">
                          {expandedOrder === order.id ? "▼" : "▶"}
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="order-details">
                          <div className="order-details-header">
                            <h4>Chi tiết đơn hàng:</h4>
                            <button
                              className="update-status-btn"
                              onClick={() => openStatusModal(order)}
                              disabled={updatingOrderId === order.id}
                            >
                              {updatingOrderId === order.id ? (
                                <>
                                  <span className="loading-spinner-small"></span>
                                  Đang cập nhật...
                                </>
                              ) : (
                                <>🔄 Cập nhật trạng thái</>
                              )}
                            </button>
                          </div>
                          <div className="order-items">
                            {order.orderDetails.map((detail) => (
                              <div key={detail.id} className="order-item">
                                <img
                                  src={detail.orchid.orchidUrl}
                                  alt={detail.orchid.orchidName}
                                  className="item-image"
                                />
                                <div className="item-info">
                                  <h5>{detail.orchid.orchidName}</h5>
                                  <p>{detail.orchid.orchidDescription}</p>
                                  <div className="item-details">
                                    <span>Số lượng: {detail.quantity}</span>
                                    <span>
                                      Đơn giá: {formatCurrency(detail.price)}
                                    </span>
                                    <span>
                                      Thành tiền:{" "}
                                      {formatCurrency(
                                        detail.price * detail.quantity
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && filteredOrders.length > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    <span>
                      Hiển thị {startIndex + 1}-
                      {Math.min(endIndex, filteredOrders.length)} trong tổng số{" "}
                      {filteredOrders.length} đơn hàng
                    </span>
                  </div>

                  <div className="pagination-controls">
                    <button
                      className="pagination-btn prev"
                      onClick={handlePrevPage}
                      disabled={currentPageNum === 1}
                    >
                      ← Trước
                    </button>

                    <div className="pagination-numbers">
                      {getVisiblePageNumbers().map((pageNum, index) =>
                        pageNum === "..." ? (
                          <span
                            key={`dots-${index}`}
                            className="pagination-dots"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            className={`pagination-number ${
                              currentPageNum === pageNum ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      className="pagination-btn next"
                      onClick={handleNextPage}
                      disabled={currentPageNum === totalPages}
                    >
                      Sau →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusModal && selectedOrderForUpdate && (
          <div className="status-modal-overlay">
            <div className="status-modal">
              <div className="status-modal-header">
                <h3>Cập nhật trạng thái đơn hàng</h3>
                <button className="modal-close" onClick={closeStatusModal}>
                  ✕
                </button>
              </div>

              <div className="status-modal-body">
                <div className="order-info-summary">
                  <p>
                    <strong>Đơn hàng:</strong> #{selectedOrderForUpdate.id}
                  </p>
                  <p>
                    <strong>Khách hàng ID:</strong>{" "}
                    {selectedOrderForUpdate.accountId}
                  </p>
                  <p>
                    <strong>Trạng thái hiện tại:</strong>{" "}
                    {getStatusBadge(selectedOrderForUpdate.orderStatus)}
                  </p>
                </div>

                <div className="status-selection">
                  <label>Chọn trạng thái mới:</label>
                  <div className="status-options">
                    {statusOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`status-option ${
                          newStatus === option.value ? "selected" : ""
                        }`}
                        onClick={() => setNewStatus(option.value)}
                      >
                        <span className="status-icon">{option.icon}</span>
                        <span className="status-label">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="status-modal-footer">
                <button
                  className="btn-cancel"
                  onClick={closeStatusModal}
                  disabled={updatingOrderId === selectedOrderForUpdate.id}
                >
                  Hủy
                </button>
                <button
                  className="btn-update"
                  onClick={handleUpdateStatus}
                  disabled={
                    newStatus === selectedOrderForUpdate.orderStatus ||
                    updatingOrderId === selectedOrderForUpdate.id
                  }
                >
                  {updatingOrderId === selectedOrderForUpdate.id ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
