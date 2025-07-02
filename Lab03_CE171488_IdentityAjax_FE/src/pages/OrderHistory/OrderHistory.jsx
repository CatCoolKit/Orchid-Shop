import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import "./OrderHistory.css";

const OrderHistory = ({ onNavigateToHome, onNavigateToLogin }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Cancel order states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await orderService.getMyOrders();
      // Sort orders by orderDate (newest first)
      const sortedOrders = (response || []).sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sortedOrders);
    } catch (error) {
      setError(error.message);
      if (error.message.includes("đăng nhập")) {
        setTimeout(() => {
          onNavigateToLogin();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: { text: "Chờ xử lý", class: "status-pending" },
      Processing: { text: "Đang xử lý", class: "status-processing" },
      Confirmed: { text: "Đã xác nhận", class: "status-confirmed" },
      Shipping: { text: "Đang giao", class: "status-shipping" },
      Delivered: { text: "Đã giao", class: "status-delivered" },
      Cancelled: { text: "Đã hủy", class: "status-cancelled" },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      class: "status-default",
    };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(""), 5000);
  };

  const canCancelOrder = (orderStatus) => {
    return orderStatus === "Pending" || orderStatus === "Processing";
  };

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      setCancelLoading(true);
      await orderService.cancelOrder(orderToCancel.id);

      // Update order status in local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderToCancel.id
            ? { ...order, orderStatus: "Cancelled" }
            : order
        )
      );

      showNotification(`Đã hủy đơn hàng #${orderToCancel.id} thành công`);
      closeCancelModal();
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
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

        <div className="page-header">
          <h1 className="page-title">📋 Lịch sử đơn hàng</h1>
          <button className="back-btn" onClick={onNavigateToHome}>
            ← Về trang chủ
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-icon">🛒</div>
            <h3>Bạn chưa có đơn hàng nào</h3>
            <p>Hãy khám phá các loại hoa lan đẹp của chúng tôi!</p>
            <button className="explore-btn" onClick={onNavigateToHome}>
              Khám phá ngay
            </button>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div
                  className="order-header"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div className="order-info">
                    <div className="order-title">
                      <h3>Đơn hàng #{order.id}</h3>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <div className="order-meta">
                      <span className="order-date">
                        📅 {formatDate(order.orderDate)}
                      </span>
                      <span className="order-total">
                        💰 {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="expand-icon">
                    {expandedOrders.has(order.id) ? "▼" : "▶"}
                  </div>
                </div>

                {expandedOrders.has(order.id) && (
                  <div className="order-details">
                    <div className="order-details-header">
                      <h4>Chi tiết đơn hàng:</h4>
                      {canCancelOrder(order.orderStatus) && (
                        <button
                          className="cancel-order-btn"
                          onClick={() => openCancelModal(order)}
                          disabled={cancelLoading}
                        >
                          {cancelLoading && orderToCancel?.id === order.id ? (
                            <>
                              <span className="loading-spinner-small"></span>
                              Đang hủy...
                            </>
                          ) : (
                            <>❌ Hủy đơn hàng</>
                          )}
                        </button>
                      )}
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
                            <h5 className="item-name">
                              {detail.orchid.orchidName}
                            </h5>
                            <p className="item-description">
                              {detail.orchid.orchidDescription}
                            </p>
                            <div className="item-details">
                              <span className="item-quantity">
                                Số lượng: {detail.quantity}
                              </span>
                              <span className="item-price">
                                Đơn giá: {formatCurrency(detail.price)}
                              </span>
                              <span className="item-total">
                                Thành tiền:{" "}
                                {formatCurrency(detail.price * detail.quantity)}
                              </span>
                            </div>
                            {detail.orchid.isNatural && (
                              <span className="natural-badge">🌿 Tự nhiên</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Tổng cộng:</span>
                        <span className="total-amount">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cancel Order Confirmation Modal */}
        {showCancelModal && orderToCancel && (
          <div className="cancel-modal-overlay">
            <div className="cancel-modal">
              <div className="cancel-modal-header">
                <h3>Xác nhận hủy đơn hàng</h3>
                <button className="modal-close" onClick={closeCancelModal}>
                  ✕
                </button>
              </div>

              <div className="cancel-modal-body">
                <div className="warning-icon">⚠️</div>
                <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>

                <div className="order-info-preview">
                  <p>
                    <strong>Đơn hàng:</strong> #{orderToCancel.id}
                  </p>
                  <p>
                    <strong>Ngày đặt:</strong>{" "}
                    {formatDate(orderToCancel.orderDate)}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {formatCurrency(orderToCancel.totalAmount)}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {getStatusBadge(orderToCancel.orderStatus)}
                  </p>
                </div>

                <div className="warning-message">
                  <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Đơn
                  hàng sẽ được hủy ngay lập tức.
                </div>
              </div>

              <div className="cancel-modal-footer">
                <button
                  className="btn-cancel-action"
                  onClick={closeCancelModal}
                  disabled={cancelLoading}
                >
                  Không hủy
                </button>
                <button
                  className="btn-confirm-cancel"
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Đang hủy...
                    </>
                  ) : (
                    <>❌ Xác nhận hủy</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
