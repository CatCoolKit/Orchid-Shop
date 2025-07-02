import React from "react";
import "./ProductDetail.css";
import cartService from "../services/cartService.js";
import authService from "../services/authService.js";

function ProductDetail({
  orchid,
  isOpen,
  onClose,
  onAddToCart,
  onNavigateToLogin,
}) {
  if (!isOpen || !orchid) return null;

  const handleAddToCart = () => {
    // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    if (!authService.isAuthenticated()) {
      onNavigateToLogin();
      return;
    }

    try {
      cartService.addToCart(orchid, 1);
      onAddToCart(`✅ Đã thêm "${orchid.orchidName}" vào giỏ hàng!`);
      onClose();
    } catch (error) {
      onAddToCart(`❌ Lỗi: ${error.message}`);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContactAdvice = () => {
    // Scroll to contact section or navigate to contact page
    onClose();
    // You can add navigation logic here if needed
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="product-detail-overlay" onClick={handleOverlayClick}>
      <div className="product-detail-modal">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          <span className="close-icon">✕</span>
        </button>

        {/* Modal Header */}
        <div className="product-detail-header">
          <div className="header-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
          <div className="header-content">
            <div className="header-icon">🌺</div>
            <h2 className="product-title">Chi tiết sản phẩm</h2>
            <p className="product-subtitle">Khám phá vẻ đẹp thiên nhiên</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="product-detail-body">
          {/* Image Section */}
          <div className="product-image-section">
            <div className="image-wrapper">
              <div className="image-container">
                <img
                  src={
                    orchid.orchidUrl ||
                    "https://via.placeholder.com/500x400/f0f0f0/cccccc?text=Orchid"
                  }
                  alt={orchid.orchidName}
                  className="product-image"
                />
                <div className="image-overlay">
                  <div className="zoom-indicator">
                    <span>🔍</span>
                  </div>
                </div>
              </div>
              <div className="image-badges">
                <div className="nature-badge">
                  {orchid.isNatural ? "🌿 Tự nhiên" : "🔬 Nuôi trồng"}
                </div>
                <div className="quality-badge">⭐ Chất lượng cao</div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="product-info-section">
            {/* Product Header */}
            <div className="product-header">
              <div className="product-name-wrapper">
                <h1 className="product-name">{orchid.orchidName}</h1>
                <div className="category-tag">
                  <span className="tag-icon">🏷️</span>
                  <span className="tag-text">{orchid.categoryName}</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="product-description">
              <h3 className="section-title">
                <span className="title-icon">📋</span>
                Mô tả sản phẩm
              </h3>
              <p className="description-text">{orchid.orchidDescription}</p>
            </div>

            {/* Product Details Grid */}
            <div className="product-details">
              <h3 className="section-title">
                <span className="title-icon">ℹ️</span>
                Thông tin chi tiết
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">🏷️</div>
                  <div className="detail-content">
                    <span className="detail-label">Danh mục</span>
                    <span className="detail-value">{orchid.categoryName}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">🌱</div>
                  <div className="detail-content">
                    <span className="detail-label">Nguồn gốc</span>
                    <span className="detail-value">
                      {orchid.isNatural ? "Tự nhiên" : "Nuôi trồng"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">📦</div>
                  <div className="detail-content">
                    <span className="detail-label">Tình trạng</span>
                    <span className="detail-value status-available">
                      Có sẵn
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">🚚</div>
                  <div className="detail-content">
                    <span className="detail-label">Giao hàng</span>
                    <span className="detail-value">2-3 ngày</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="care-instructions">
              <h3 className="section-title">
                <span className="title-icon">🌿</span>
                Hướng dẫn chăm sóc
              </h3>
              <div className="care-tips-grid">
                <div className="care-tip">
                  <div className="tip-icon">☀️</div>
                  <div className="tip-content">
                    <h4>Ánh sáng</h4>
                    <p>Ánh sáng gián tiếp, tránh ánh nắng trực tiếp</p>
                  </div>
                </div>
                <div className="care-tip">
                  <div className="tip-icon">💧</div>
                  <div className="tip-content">
                    <h4>Tưới nước</h4>
                    <p>2-3 lần/tuần, giữ ẩm nhẹ cho đất</p>
                  </div>
                </div>
                <div className="care-tip">
                  <div className="tip-icon">🌡️</div>
                  <div className="tip-content">
                    <h4>Nhiệt độ</h4>
                    <p>18-28°C, tránh nhiệt độ quá thấp</p>
                  </div>
                </div>
                <div className="care-tip">
                  <div className="tip-icon">💨</div>
                  <div className="tip-content">
                    <h4>Độ ẩm</h4>
                    <p>60-80%, tạo độ ẩm bằng khay nước</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="product-actions">
              <div className="price-section">
                <div className="price-display">
                  <span className="current-price">
                    {orchid.price.toLocaleString("vi-VN")} ₫
                  </span>
                  <span className="price-note">* Giá đã bao gồm VAT</span>
                </div>
              </div>
              <div className="action-buttons">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <span className="btn-icon">🛒</span>
                  <span className="btn-text">Thêm vào giỏ hàng</span>
                </button>
                <button className="contact-btn" onClick={handleContactAdvice}>
                  <span className="btn-icon">💬</span>
                  <span className="btn-text">Tư vấn miễn phí</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
