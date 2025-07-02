import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import { orchidService, categoryService } from "../../services";
import authService from "../../services/authService";
import "./AdminProducts.css";

function AdminProducts({
  currentPage,
  onNavigateToHome,
  onNavigateToOrders,
  onNavigateToUsers,
  onNavigateToRoles,
  onNavigateToCategories,
  onLogout,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState("");

  // Pagination state
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [itemsPerPage] = useState(10);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form data for create/edit
  const [formData, setFormData] = useState({
    orchidName: "",
    orchidDescription: "",
    price: "",
    categoryName: "",
    isNatural: true,
    orchidUrl: "",
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Check admin role
    const user = authService.getCurrentUser();
    if (!user || user.role !== "Admin") {
      alert("Bạn không có quyền truy cập trang này!");
      onNavigateToHome();
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        orchidService.getAllOrchids(),
        categoryService.getAllCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData.filter((cat) => cat.categoryId !== "all"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.orchidName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPageNum - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

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
  }, [searchTerm, selectedCategory]);

  // Validation functions
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case "orchidName":
        if (!value.trim()) {
          errors.orchidName = "Tên sản phẩm là bắt buộc";
        } else if (value.trim().length < 3) {
          errors.orchidName = "Tên sản phẩm phải có ít nhất 3 ký tự";
        } else if (value.trim().length > 100) {
          errors.orchidName = "Tên sản phẩm không được quá 100 ký tự";
        }
        break;

      case "orchidDescription":
        if (value.trim().length > 500) {
          errors.orchidDescription = "Mô tả không được quá 500 ký tự";
        }
        break;

      case "price":
        if (!value.trim()) {
          errors.price = "Giá sản phẩm là bắt buộc";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          errors.price = "Giá phải là số dương lớn hơn 0";
        } else if (parseFloat(value) > 1000000000) {
          errors.price = "Giá không được quá 1 tỷ VNĐ";
        }
        break;

      case "categoryName":
        if (!value.trim()) {
          errors.categoryName = "Danh mục là bắt buộc";
        }
        break;

      case "orchidUrl":
        if (value.trim() && !isValidUrl(value.trim())) {
          errors.orchidUrl = "URL hình ảnh không hợp lệ";
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldErrors);
    });

    return errors;
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation
    const fieldErrors = validateField(name, newValue);
    setFormErrors((prev) => ({
      ...prev,
      ...fieldErrors,
      [name]: fieldErrors[name] || undefined, // Remove error if field is valid
    }));
  };

  // Open modal for create/edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        orchidName: product.orchidName,
        orchidDescription: product.orchidDescription,
        price: product.price.toString(),
        categoryName: product.categoryName,
        isNatural: product.isNatural,
        orchidUrl: product.orchidUrl || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        orchidName: "",
        orchidDescription: "",
        price: "",
        categoryName: categories[0]?.categoryName || "",
        isNatural: true,
        orchidUrl: "",
      });
    }
    setFormErrors({}); // Clear all validation errors
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      orchidName: "",
      orchidDescription: "",
      price: "",
      categoryName: "",
      isNatural: true,
      orchidUrl: "",
    });
    setFormErrors({}); // Clear all validation errors
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate entire form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification("❌ Vui lòng sửa các lỗi trong form!");
      return;
    }

    try {
      setLoading(true);

      // Find category ID from category name
      const selectedCategory = categories.find(
        (cat) => cat.categoryName === formData.categoryName
      );

      if (!selectedCategory) {
        showNotification("❌ Danh mục không hợp lệ!");
        return;
      }

      const productData = {
        orchidName: formData.orchidName.trim(),
        orchidDescription: formData.orchidDescription.trim(),
        orchidUrl: formData.orchidUrl.trim(),
        price: parseFloat(formData.price),
        categoryId: selectedCategory.categoryId,
        isNatural: formData.isNatural,
      };

      if (editingProduct) {
        await orchidService.updateOrchid(editingProduct.orchidId, productData);
        showNotification("✅ Cập nhật sản phẩm thành công!");
      } else {
        await orchidService.createOrchid(productData);
        showNotification("✅ Thêm sản phẩm thành công!");
      }

      closeModal();
      await fetchData();
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete - show confirmation modal
  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      await orchidService.deleteOrchid(productToDelete.orchidId);
      showNotification("✅ Xóa sản phẩm thành công!");
      await fetchData();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigateToHome={onNavigateToHome}
      onNavigateToOrders={onNavigateToOrders}
      onNavigateToProducts={() => {}} // Already on products page
      onNavigateToUsers={onNavigateToUsers}
      onNavigateToRoles={onNavigateToRoles}
      onNavigateToCategories={onNavigateToCategories}
      onLogout={onLogout}
    >
      <div className="admin-products">
        {/* Header */}
        <div className="admin-products-header">
          <div className="header-left">
            <h1>🌺 Quản lý sản phẩm</h1>
            <p>Quản lý toàn bộ hoa lan trong cửa hàng</p>
          </div>
          <button className="btn-primary" onClick={() => openModal()}>
            ➕ Thêm sản phẩm
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">{filteredProducts.length}</div>
              <div className="stat-label">Sản phẩm tìm thấy</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <div className="stat-number">{totalPages}</div>
              <div className="stat-label">Tổng số trang</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌿</div>
            <div className="stat-content">
              <div className="stat-number">
                {filteredProducts.filter((p) => p.isNatural).length}
              </div>
              <div className="stat-label">Hoa lan tự nhiên</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧪</div>
            <div className="stat-content">
              <div className="stat-number">
                {filteredProducts.filter((p) => !p.isNatural).length}
              </div>
              <div className="stat-label">Hoa lan nhân tạo</div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Notification */}
        {notification && <div className="notification">{notification}</div>}

        {/* Products Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>❌ Lỗi: {error}</p>
            <button onClick={fetchData}>Thử lại</button>
          </div>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <div className="col-image">Hình ảnh</div>
              <div className="col-name">Tên sản phẩm</div>
              <div className="col-category">Danh mục</div>
              <div className="col-price">Giá</div>
              <div className="col-type">Loại</div>
              <div className="col-actions">Thao tác</div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              currentPageProducts.map((product) => (
                <div key={product.orchidId} className="table-row">
                  <div className="col-image">
                    <img
                      src={
                        product.orchidUrl || "https://via.placeholder.com/60x60"
                      }
                      alt={product.orchidName}
                      className="product-thumbnail"
                    />
                  </div>
                  <div className="col-name">
                    <div className="product-name">{product.orchidName}</div>
                    <div className="product-description">
                      {product.orchidDescription}
                    </div>
                  </div>
                  <div className="col-category">
                    <span className="category-tag">{product.categoryName}</span>
                  </div>
                  <div className="col-price">
                    <span className="price">
                      {product.price.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <div className="col-type">
                    <span
                      className={`type-tag ${
                        product.isNatural ? "natural" : "cultivated"
                      }`}
                    >
                      {product.isNatural ? "Tự nhiên" : "Nhân tạo"}
                    </span>
                  </div>
                  <div className="col-actions">
                    <button
                      className="btn-edit"
                      onClick={() => openModal(product)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Hiển thị {startIndex + 1}-
                {Math.min(endIndex, filteredProducts.length)} trong tổng số{" "}
                {filteredProducts.length} sản phẩm
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
                    <span key={`dots-${index}`} className="pagination-dots">
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <div className="delete-modal-content">
                <div className="delete-icon">🗑️</div>
                <h3>Xác nhận xóa sản phẩm</h3>
                <p>
                  Bạn có chắc chắn muốn xóa sản phẩm{" "}
                  <strong>"{productToDelete?.orchidName}"</strong>?
                </p>
                <p className="warning-text">
                  Hành động này không thể hoàn tác!
                </p>
                <div className="delete-modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={cancelDelete}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn-confirm-delete"
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    {loading ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Product Modal */}
        {showModal && (
          <div className="product-modal-overlay">
            <div className="product-modal">
              <div className="product-modal-header">
                <div className="modal-title-section">
                  <div className="modal-icon">
                    {editingProduct ? "✏️" : "➕"}
                  </div>
                  <div className="modal-title-text">
                    <h2>
                      {editingProduct
                        ? "Chỉnh sửa sản phẩm"
                        : "Thêm sản phẩm mới"}
                    </h2>
                    <p>
                      {editingProduct
                        ? "Cập nhật thông tin sản phẩm hoa lan"
                        : "Tạo mới sản phẩm hoa lan cho cửa hàng"}
                    </p>
                  </div>
                </div>
                <button className="product-modal-close" onClick={closeModal}>
                  <span>✕</span>
                </button>
              </div>

              <div className="product-modal-body">
                <form onSubmit={handleSubmit} className="product-form">
                  <div className="product-form-grid">
                    {/* Left Column */}
                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>📝 Thông tin chính</h3>
                        </div>
                        <div className="card-body">
                          <div className="input-group">
                            <label>Tên sản phẩm *</label>
                            <input
                              type="text"
                              name="orchidName"
                              value={formData.orchidName}
                              onChange={handleFormChange}
                              required
                              placeholder="Nhập tên hoa lan..."
                              className={`form-input ${
                                formErrors.orchidName ? "error" : ""
                              }`}
                            />
                            {formErrors.orchidName && (
                              <span className="error-message">
                                ❌ {formErrors.orchidName}
                              </span>
                            )}
                          </div>

                          <div className="input-group">
                            <label>Mô tả sản phẩm</label>
                            <textarea
                              name="orchidDescription"
                              value={formData.orchidDescription}
                              onChange={handleFormChange}
                              placeholder="Mô tả chi tiết về sản phẩm..."
                              rows="4"
                              className={`form-textarea ${
                                formErrors.orchidDescription ? "error" : ""
                              }`}
                            />
                            {formErrors.orchidDescription && (
                              <span className="error-message">
                                ❌ {formErrors.orchidDescription}
                              </span>
                            )}
                          </div>

                          <div className="input-group">
                            <label>URL hình ảnh</label>
                            <input
                              type="url"
                              name="orchidUrl"
                              value={formData.orchidUrl}
                              onChange={handleFormChange}
                              placeholder="https://example.com/image.jpg"
                              className={`form-input ${
                                formErrors.orchidUrl ? "error" : ""
                              }`}
                            />
                            {formErrors.orchidUrl && (
                              <span className="error-message">
                                ❌ {formErrors.orchidUrl}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>💰 Thông tin bán hàng</h3>
                        </div>
                        <div className="card-body">
                          <div className="input-row">
                            <div className="input-group">
                              <label>Giá bán (VNĐ) *</label>
                              <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleFormChange}
                                required
                                min="0"
                                placeholder="0"
                                className={`form-input ${
                                  formErrors.price ? "error" : ""
                                }`}
                              />
                              {formErrors.price && (
                                <span className="error-message">
                                  ❌ {formErrors.price}
                                </span>
                              )}
                            </div>
                            <div className="input-group">
                              <label>Danh mục *</label>
                              <select
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleFormChange}
                                required
                                className={`form-select ${
                                  formErrors.categoryName ? "error" : ""
                                }`}
                              >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                  <option
                                    key={category.categoryId}
                                    value={category.categoryName}
                                  >
                                    {category.categoryName}
                                  </option>
                                ))}
                              </select>
                              {formErrors.categoryName && (
                                <span className="error-message">
                                  ❌ {formErrors.categoryName}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="input-group">
                            <label>Trạng thái</label>
                            <select
                              name="status"
                              value={formData.status || "active"}
                              onChange={handleFormChange}
                              className="form-select"
                            >
                              <option value="active">🟢 Đang bán</option>
                              <option value="inactive">🔴 Ngừng bán</option>
                              <option value="draft">📝 Nháp</option>
                            </select>
                          </div>

                          <div className="checkbox-group">
                            <label className="modern-checkbox">
                              <input
                                type="checkbox"
                                name="isNatural"
                                checked={formData.isNatural}
                                onChange={handleFormChange}
                              />
                              <span className="checkmark"></span>
                              <div className="checkbox-content">
                                <span className="checkbox-title">
                                  🌿 Hoa lan tự nhiên
                                </span>
                                <span className="checkbox-subtitle">
                                  Sản phẩm được trồng tự nhiên, không qua biến
                                  đổi gene
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="product-modal-footer">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={closeModal}
                    >
                      <span>❌</span>
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      <span>{editingProduct ? "💾" : "➕"}</span>
                      {loading
                        ? "Đang xử lý..."
                        : editingProduct
                        ? "Cập nhật"
                        : "Thêm mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
