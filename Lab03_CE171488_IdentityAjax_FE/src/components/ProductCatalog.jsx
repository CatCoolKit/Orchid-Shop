import React, { useState, useEffect } from "react";
import "./ProductCatalog.css";
import { orchidService, categoryService } from "../services/index.js";
import cartService from "../services/cartService.js";
import authService from "../services/authService.js";
import ProductDetail from "./ProductDetail.jsx";

function ProductCatalog({ onNavigateToLogin }) {
  const [orchids, setOrchids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const itemsPerPage = 12; // 3 hàng x 4 cột = 12 sản phẩm/trang

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch orchids and categories using services
        const [orchidsData, categoriesData] = await Promise.all([
          orchidService.getAllOrchids(),
          categoryService.getAllCategories(),
        ]);

        // Set orchids data
        setOrchids(orchidsData);

        // Set categories data (getAllCategories already includes "Tất cả" option)
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOrchids = orchids.filter((orchid) => {
    const matchesSearch = orchid.orchidName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || orchid.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrchids.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrchids = filteredOrchids.slice(startIndex, endIndex);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAddToCart = (orchid) => {
    // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    if (!authService.isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      cartService.addToCart(orchid, 1);
      showNotification(`✅ Đã thêm "${orchid.orchidName}" vào giỏ hàng!`);
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    }
  };

  const handleViewDetails = (orchid) => {
    setSelectedOrchid(orchid);
    setShowProductDetail(true);
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedOrchid(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setCurrentPage(1); // Reset về trang đầu khi clear search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll lên đầu trang
  };

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="product-catalog-container">
      {/* Search & Filter Section */}
      <section className="search-filter-section">
        <div className="search-container">
          <div className="catalog-header">
            <h2 className="catalog-title">🌺 Danh mục hoa lan</h2>
            <p className="catalog-subtitle">
              Khám phá bộ sưu tập {orchids.length} loài hoa lan quý hiếm
            </p>
          </div>

          <div className="search-bar">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoa lan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.categoryId}
                className={`category-btn ${
                  selectedCategory ===
                  (category.categoryId === "all"
                    ? "all"
                    : category.categoryName)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    category.categoryId === "all"
                      ? "all"
                      : category.categoryName
                  )
                }
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>

        <div className="results-info">
          <p className="results-count">
            Tìm thấy <strong>{filteredOrchids.length}</strong> hoa lan
            {searchTerm && ` cho "${searchTerm}"`}
            {selectedCategory !== "all" &&
              ` trong danh mục "${selectedCategory}"`}
            {totalPages > 1 && (
              <span className="page-info">
                {" "}
                - Trang {currentPage} / {totalPages}
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Notification */}
      {notification && (
        <div className="notification">
          <span className="notification-message">{notification}</span>
        </div>
      )}

      {/* Login Prompt */}
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

      {/* Content Section */}
      <section className="content-section">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-message">
              Đang tải dữ liệu hoa lan và danh mục...
            </p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">Lỗi: {error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && filteredOrchids.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌸</div>
            <h3 className="empty-title">Không tìm thấy hoa lan nào</h3>
            <p className="empty-description">
              Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
            <button className="clear-filters-btn" onClick={clearSearch}>
              Xóa bộ lọc
            </button>
          </div>
        )}

        <div className="orchid-list">
          {!loading &&
            !error &&
            currentOrchids.map((orchid) => (
              <div key={orchid.orchidId} className="orchid-card">
                <div className="card-image-container">
                  <img
                    src={
                      orchid.orchidUrl ||
                      "https://via.placeholder.com/300x220/f0f0f0/cccccc?text=Orchid"
                    }
                    alt={orchid.orchidName}
                    className="orchid-image"
                  />
                  <div className="card-overlay">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(orchid)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="orchid-name">{orchid.orchidName}</h3>
                  <p className="orchid-description">
                    {orchid.orchidDescription}
                  </p>

                  <div className="orchid-details">
                    <div className="detail-item">
                      <span className="detail-label">Danh mục:</span>
                      <span className="detail-value category-tag">
                        {orchid.categoryName}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tự nhiên:</span>
                      <span
                        className={`detail-value natural-tag ${
                          orchid.isNatural ? "natural" : "cultivated"
                        }`}
                      >
                        {orchid.isNatural ? "Tự nhiên" : "Nhân tạo"}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="price-container">
                      <span className="price-label">Giá:</span>
                      <span className="orchid-price">
                        {orchid.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <button
                      className="catalog-add-to-cart-btn"
                      onClick={() => handleAddToCart(orchid)}
                    >
                      Thêm vào giỏ 🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {!loading && !error && filteredOrchids.length > 0 && (
          <div className="pagination-container">
            {totalPages > 1 && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>
            )}

            <div className="pagination-numbers">
              {totalPages > 1 ? (
                Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      className={`pagination-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })
              ) : (
                <div className="pagination-info">
                  <span className="page-info">
                    Trang {currentPage} / {totalPages} ({filteredOrchids.length}{" "}
                    kết quả)
                  </span>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            )}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <ProductDetail
        orchid={selectedOrchid}
        isOpen={showProductDetail}
        onClose={handleCloseProductDetail}
        onAddToCart={showNotification}
        onNavigateToLogin={onNavigateToLogin}
      />
    </div>
  );
}

export default ProductCatalog;
