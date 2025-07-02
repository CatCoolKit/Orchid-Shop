import React, { useState, useEffect } from "react";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import authService from "../../services/authService";
import "./Cart.css";

const Cart = ({
  onNavigateToHome,
  onNavigateToProducts,
  onNavigateToLogin,
}) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = cartService.getCartItems();
    setCartItems(items);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleQuantityChange = async (orchidId, newQuantity) => {
    try {
      setLoading(true);
      const updatedItems = cartService.updateQuantity(orchidId, newQuantity);
      setCartItems(updatedItems);

      if (newQuantity === 0) {
        showNotification("Đã xóa sản phẩm khỏi giỏ hàng");
      } else {
        showNotification("Đã cập nhật số lượng");
      }
    } catch (error) {
      showNotification("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (orchidId) => {
    try {
      setLoading(true);
      const updatedItems = cartService.removeFromCart(orchidId);
      setCartItems(updatedItems);
      showNotification("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      showNotification("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      try {
        setLoading(true);
        cartService.clearCart();
        setCartItems([]);
        showNotification("Đã xóa toàn bộ giỏ hàng");
      } catch (error) {
        showNotification("Lỗi: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckout = async () => {
    try {
      // Check if user is logged in
      if (!authService.isAuthenticated()) {
        setShowLoginPrompt(true);
        return;
      }

      // Check if cart is empty
      if (cartItems.length === 0) {
        showNotification("Giỏ hàng trống");
        return;
      }

      setCheckoutLoading(true);

      // Create order
      const result = await orderService.createOrder(cartItems);

      // Clear cart after successful order
      cartService.clearCart();
      setCartItems([]);

      showNotification(
        `✅ Đặt hàng thành công! Mã đơn hàng: ${result.orderId || "N/A"}`
      );

      // Navigate to home after a short delay
      setTimeout(() => {
        onNavigateToHome();
      }, 2000);
    } catch (error) {
      showNotification(`❌ ${error.message}`);

      // If authentication error, redirect to login
      if (error.message.includes("đăng nhập")) {
        setTimeout(() => {
          onNavigateToLogin();
        }, 2000);
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalAmount = cartService.getCartTotal();
  const totalItems = cartService.getCartCount(); // Total quantity for summary
  const uniqueProducts = cartService.getUniqueProductsCount(); // Number of unique products

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="page-header">
            <h1 className="page-title">🛒 Giỏ hàng</h1>
            <button className="back-btn" onClick={onNavigateToHome}>
              ← Về trang chủ
            </button>
          </div>

          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy khám phá các loại hoa lan đẹp để thêm vào giỏ hàng!</p>
            <button className="shop-now-btn" onClick={onNavigateToProducts}>
              Mua sắm ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="page-header">
          <h1 className="page-title">
            🛒 Giỏ hàng ({uniqueProducts} sản phẩm)
          </h1>
          <div className="header-actions">
            <button className="clear-cart-btn" onClick={handleClearCart}>
              🗑️ Xóa tất cả
            </button>
            <button className="back-btn" onClick={onNavigateToHome}>
              ← Về trang chủ
            </button>
          </div>
        </div>

        {notification && (
          <div className="notification">
            <span className="notification-icon">✅</span>
            {notification}
          </div>
        )}

        {showLoginPrompt && (
          <div className="login-prompt-overlay">
            <div className="login-prompt">
              <div className="login-prompt-icon">🔐</div>
              <h3>Cần đăng nhập</h3>
              <p>Hãy đăng nhập để có trải nghiệm mua hàng tốt nhất!</p>
              <div className="login-prompt-actions">
                <button
                  className="login-prompt-btn primary"
                  onClick={() => {
                    setShowLoginPrompt(false);
                    onNavigateToLogin();
                  }}
                >
                  Đăng nhập ngay
                </button>
                <button
                  className="login-prompt-btn secondary"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Để sau
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.orchid.orchidUrl}
                  alt={item.orchid.orchidName}
                  className="item-image"
                />

                <div className="item-info">
                  <h3 className="item-name">{item.orchid.orchidName}</h3>
                  <p className="item-description">
                    {item.orchid.orchidDescription}
                  </p>
                  <div className="item-price">
                    {formatCurrency(item.orchid.price)} / cây
                  </div>
                  <span
                    className={`natural-badge ${
                      item.orchid.isNatural ? "natural" : "cultivated"
                    }`}
                  >
                    {item.orchid.isNatural ? "🌿 Tự nhiên" : "🧪 Nhân tạo"}
                  </span>
                </div>

                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(
                          item.orchid.orchidId,
                          item.quantity - 1
                        )
                      }
                      disabled={loading}
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(
                          item.orchid.orchidId,
                          item.quantity + 1
                        )
                      }
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    {formatCurrency(item.orchid.price * item.quantity)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.orchid.orchidId)}
                    disabled={loading}
                    title="Xóa sản phẩm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h3>Tổng kết đơn hàng</h3>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Số lượng sản phẩm:</span>
                <span>{totalItems} cây</span>
              </div>
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span className="total-amount">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="checkout-actions">
              <button
                className="checkout-btn"
                disabled={loading || checkoutLoading}
                onClick={handleCheckout}
              >
                {checkoutLoading ? "Đang đặt hàng..." : "Tiến hành thanh toán"}
              </button>
              <button
                className="continue-shopping-btn"
                onClick={onNavigateToProducts}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
