import React, { useState, useEffect } from "react";
import { categoryService, authService } from "../../services";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminCategories.css";

function AdminCategories({
  currentPage,
  onNavigateToHome,
  onNavigateToOrders,
  onNavigateToProducts,
  onNavigateToUsers,
  onNavigateToRoles,
  onNavigateToCategories,
  onLogout,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "Admin") {
      setTimeout(() => {
        onNavigateToHome();
      }, 1000);
      return;
    }

    fetchData();
  }, [onNavigateToHome]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryService.getAllCategories();
      // Filter out categories without proper structure and remove orchids field
      const cleanCategories = categoriesData
        .filter((cat) => cat.categoryId && cat.categoryName)
        .map((cat) => ({
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
        }));
      setCategories(cleanCategories);
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

  // Validation functions
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case "categoryName":
        if (!value.trim()) {
          errors.categoryName = "Tên danh mục là bắt buộc";
        } else if (value.trim().length < 2) {
          errors.categoryName = "Tên danh mục phải có ít nhất 2 ký tự";
        } else if (value.trim().length > 100) {
          errors.categoryName = "Tên danh mục không được quá 100 ký tự";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) {
          errors.categoryName =
            "Tên danh mục chỉ được chứa chữ cái và khoảng trắng";
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      const fieldValidationErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldValidationErrors);
    });

    return errors;
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    const fieldValidationErrors = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      ...fieldValidationErrors,
      [name]: fieldValidationErrors[name] || undefined, // Remove error if field is valid
    }));
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        categoryName: category.categoryName,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        categoryName: "",
      });
    }
    setFieldErrors({}); // Clear all validation errors
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      categoryName: "",
    });
    setFieldErrors({}); // Clear all validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate entire form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showNotification("❌ Vui lòng sửa các lỗi trong form!");
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      const categoryData = {
        categoryName: formData.categoryName.trim(),
      };

      if (editingCategory) {
        await categoryService.updateCategory(
          editingCategory.categoryId,
          categoryData
        );
        showNotification("✅ Cập nhật danh mục thành công!");
      } else {
        await categoryService.createCategory(categoryData);
        showNotification("✅ Thêm danh mục thành công!");
      }

      closeModal();
      await fetchData();
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryToDelete.categoryId);
      showNotification("✅ Xóa danh mục thành công!");
      await fetchData();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "phalaenopsis":
        return "🦋";
      case "cattleya":
        return "🌺";
      case "dendrobium":
        return "🌸";
      case "vanda":
        return "💜";
      case "oncidium":
        return "🌼";
      default:
        return "🌿";
    }
  };

  const getCategoryColor = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "phalaenopsis":
        return "category-phalaenopsis";
      case "cattleya":
        return "category-cattleya";
      case "dendrobium":
        return "category-dendrobium";
      case "vanda":
        return "category-vanda";
      case "oncidium":
        return "category-oncidium";
      default:
        return "category-default";
    }
  };

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
      onNavigateToOrders={onNavigateToOrders}
      onNavigateToProducts={onNavigateToProducts}
      onNavigateToUsers={onNavigateToUsers}
      onNavigateToRoles={onNavigateToRoles}
      onNavigateToCategories={onNavigateToCategories}
      onLogout={onLogout}
    >
      <div className="admin-categories">
        <div className="admin-categories-header">
          <div className="header-left">
            <h1>🏷️ Quản lý danh mục</h1>
            <p>Quản lý toàn bộ danh mục hoa lan trong hệ thống</p>
          </div>
          <button className="btn-primary" onClick={() => openModal()}>
            ➕ Thêm danh mục
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <div className="stat-number">{categories.length}</div>
              <div className="stat-label">Tổng danh mục</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🦋</div>
            <div className="stat-content">
              <div className="stat-number">
                {
                  categories.filter(
                    (c) => c.categoryName.toLowerCase() === "phalaenopsis"
                  ).length
                }
              </div>
              <div className="stat-label">Phalaenopsis</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌺</div>
            <div className="stat-content">
              <div className="stat-number">
                {
                  categories.filter(
                    (c) => c.categoryName.toLowerCase() === "cattleya"
                  ).length
                }
              </div>
              <div className="stat-label">Cattleya</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌸</div>
            <div className="stat-content">
              <div className="stat-number">
                {
                  categories.filter(
                    (c) => c.categoryName.toLowerCase() === "dendrobium"
                  ).length
                }
              </div>
              <div className="stat-label">Dendrobium</div>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {notification && <div className="notification">{notification}</div>}

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
          <div className="categories-table">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-name">Tên danh mục</div>
              <div className="col-icon">Icon</div>
              <div className="col-description">Mô tả</div>
              <div className="col-actions">Thao tác</div>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy danh mục nào</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.categoryId} className="table-row">
                  <div className="col-id">#{category.categoryId}</div>
                  <div className="col-name">
                    <span
                      className={`category-badge ${getCategoryColor(
                        category.categoryName
                      )}`}
                    >
                      {category.categoryName}
                    </span>
                  </div>
                  <div className="col-icon">
                    <span className="category-icon">
                      {getCategoryIcon(category.categoryName)}
                    </span>
                  </div>
                  <div className="col-description">
                    <span className="category-description">
                      Danh mục hoa lan {category.categoryName.toLowerCase()}
                    </span>
                  </div>
                  <div className="col-actions">
                    <button
                      className="btn-edit"
                      onClick={() => openModal(category)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(category)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {showModal && (
          <div className="category-modal-overlay">
            <div className="category-modal">
              <div className="category-modal-header">
                <div className="modal-title-section">
                  <div className="modal-icon">🏷️</div>
                  <div className="modal-title-text">
                    <h2>
                      {editingCategory
                        ? "Chỉnh sửa danh mục"
                        : "Thêm danh mục mới"}
                    </h2>
                    <p>
                      {editingCategory
                        ? "Cập nhật thông tin danh mục hoa lan"
                        : "Tạo danh mục mới cho hệ thống"}
                    </p>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="category-modal-body">
                <form onSubmit={handleSubmit} className="category-form">
                  <div className="category-form-grid">
                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>🏷️ Thông tin danh mục</h3>
                          <p>Nhập tên cho danh mục hoa lan</p>
                        </div>
                        <div className="card-content">
                          <div className="form-group">
                            <label>Tên danh mục *</label>
                            <input
                              type="text"
                              name="categoryName"
                              value={formData.categoryName}
                              onChange={handleFormChange}
                              required
                              placeholder="Nhập tên danh mục (VD: Cattleya, Dendrobium...)"
                              className={
                                fieldErrors.categoryName ? "error" : ""
                              }
                            />
                            {fieldErrors.categoryName && (
                              <span className="field-error">
                                ❌ {fieldErrors.categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>🌺 Ví dụ danh mục</h3>
                          <p>Các loại hoa lan phổ biến</p>
                        </div>
                        <div className="card-content">
                          <div className="category-examples">
                            <div className="category-example">
                              <span className="example-icon">🦋</span>
                              <div>
                                <strong>Phalaenopsis</strong>
                                <p>Hoa lan bướm</p>
                              </div>
                            </div>
                            <div className="category-example">
                              <span className="example-icon">🌺</span>
                              <div>
                                <strong>Cattleya</strong>
                                <p>Hoa lan quý tộc</p>
                              </div>
                            </div>
                            <div className="category-example">
                              <span className="example-icon">🌸</span>
                              <div>
                                <strong>Dendrobium</strong>
                                <p>Hoa lan cây sống</p>
                              </div>
                            </div>
                            <div className="category-example">
                              <span className="example-icon">💜</span>
                              <div>
                                <strong>Vanda</strong>
                                <p>Hoa lan màu tím</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="category-modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Đang xử lý...
                    </>
                  ) : editingCategory ? (
                    <>
                      <span className="btn-icon">💾</span>
                      Cập nhật danh mục
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">➕</span>
                      Thêm danh mục
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && categoryToDelete && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <div className="delete-modal-header">
                <div className="delete-icon">🗑️</div>
                <h3>Xác nhận xóa danh mục</h3>
              </div>

              <div className="delete-modal-body">
                <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
                <div className="category-info-preview">
                  <div className="preview-item">
                    <span className="preview-label">🏷️ Tên:</span>
                    <span className="preview-value">
                      {categoryToDelete.categoryName}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">🔢 ID:</span>
                    <span className="preview-value">
                      #{categoryToDelete.categoryId}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">📊 Icon:</span>
                    <span className="preview-value">
                      {getCategoryIcon(categoryToDelete.categoryName)}
                    </span>
                  </div>
                </div>
                <div className="warning-message">
                  ⚠️ <strong>Cảnh báo:</strong> Hành động này không thể hoàn
                  tác!
                </div>
              </div>

              <div className="delete-modal-footer">
                <button
                  className="btn-cancel-delete"
                  onClick={cancelDelete}
                  disabled={loading}
                >
                  <span className="btn-icon">✕</span>
                  Hủy
                </button>
                <button
                  className="btn-confirm-delete"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Xóa...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🗑️</span>
                      Xóa
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCategories;
