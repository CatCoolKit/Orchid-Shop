import React, { useState, useEffect } from "react";
import roleService from "../../services/roleService";
import { authService } from "../../services";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminRoles.css";

function AdminRoles({
  currentPage,
  onNavigateToHome,
  onNavigateToOrders,
  onNavigateToProducts,
  onNavigateToUsers,
  onNavigateToCategories,
  onLogout,
}) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    roleName: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

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
      const rolesData = await roleService.getAllRoles();
      setRoles(rolesData);
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
      case "roleName":
        if (!value.trim()) {
          errors.roleName = "Tên vai trò là bắt buộc";
        } else if (value.trim().length < 3) {
          errors.roleName = "Tên vai trò phải có ít nhất 3 ký tự";
        } else if (value.trim().length > 50) {
          errors.roleName = "Tên vai trò không được quá 50 ký tự";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) {
          errors.roleName = "Tên vai trò chỉ được chứa chữ cái và khoảng trắng";
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

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        roleName: role.roleName,
      });
    } else {
      setEditingRole(null);
      setFormData({
        roleName: "",
      });
    }
    setFieldErrors({}); // Clear all validation errors
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({
      roleName: "",
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

      const roleData = {
        roleName: formData.roleName.trim(),
      };

      if (editingRole) {
        await roleService.updateRole(editingRole.roleId, roleData);
        showNotification("✅ Cập nhật vai trò thành công!");
      } else {
        await roleService.createRole(roleData);
        showNotification("✅ Thêm vai trò thành công!");
      }

      closeModal();
      await fetchData();
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (role) => {
    // Protect critical roles
    if (role.roleName === "Admin") {
      alert("Không thể xóa vai trò Admin!");
      return;
    }

    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setLoading(true);
      await roleService.deleteRole(roleToDelete.roleId);
      showNotification("✅ Xóa vai trò thành công!");
      await fetchData();
      setShowDeleteModal(false);
      setRoleToDelete(null);
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case "Admin":
        return "🔑";
      case "Customer":
        return "🛍️";
      case "Staff":
        return "👨‍💼";
      case "Delivery":
        return "🚚";
      default:
        return "👤";
    }
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case "Admin":
        return "role-admin";
      case "Customer":
        return "role-customer";
      case "Staff":
        return "role-staff";
      case "Delivery":
        return "role-delivery";
      default:
        return "role-default";
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
      onNavigateToRoles={() => {}}
      onNavigateToCategories={onNavigateToCategories}
      onLogout={onLogout}
    >
      <div className="admin-roles">
        <div className="admin-roles-header">
          <div className="header-left">
            <h1>🎭 Quản lý vai trò</h1>
            <p>Quản lý toàn bộ vai trò và quyền hạn trong hệ thống</p>
          </div>
          <button className="btn-primary" onClick={() => openModal()}>
            ➕ Thêm vai trò
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎭</div>
            <div className="stat-content">
              <div className="stat-number">{roles.length}</div>
              <div className="stat-label">Tổng vai trò</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔑</div>
            <div className="stat-content">
              <div className="stat-number">
                {roles.filter((r) => r.roleName === "Admin").length}
              </div>
              <div className="stat-label">Quản trị</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-content">
              <div className="stat-number">
                {roles.filter((r) => r.roleName === "Staff").length}
              </div>
              <div className="stat-label">Nhân viên</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚚</div>
            <div className="stat-content">
              <div className="stat-number">
                {roles.filter((r) => r.roleName === "Delivery").length}
              </div>
              <div className="stat-label">Giao hàng</div>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên vai trò..."
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
          <div className="roles-table">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-name">Tên vai trò</div>
              <div className="col-icon">Icon</div>
              <div className="col-description">Mô tả</div>
              <div className="col-actions">Thao tác</div>
            </div>

            {filteredRoles.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy vai trò nào</p>
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div key={role.roleId} className="table-row">
                  <div className="col-id">#{role.roleId}</div>
                  <div className="col-name">
                    <span
                      className={`role-badge ${getRoleColor(role.roleName)}`}
                    >
                      {role.roleName}
                    </span>
                  </div>
                  <div className="col-icon">
                    <span className="role-icon">
                      {getRoleIcon(role.roleName)}
                    </span>
                  </div>
                  <div className="col-description">
                    <span className="role-description">
                      {role.roleName === "Admin"
                        ? "Quản trị viên hệ thống"
                        : role.roleName === "Customer"
                        ? "Khách hàng của cửa hàng"
                        : role.roleName === "Staff"
                        ? "Nhân viên cửa hàng"
                        : role.roleName === "Delivery"
                        ? "Nhân viên giao hàng"
                        : "Vai trò tùy chỉnh"}
                    </span>
                  </div>
                  <div className="col-actions">
                    <button
                      className="btn-edit"
                      onClick={() => openModal(role)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(role)}
                      disabled={role.roleName === "Admin"}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add/Edit Role Modal */}
        {showModal && (
          <div className="role-modal-overlay">
            <div className="role-modal">
              <div className="role-modal-header">
                <div className="modal-title-section">
                  <div className="modal-icon">🎭</div>
                  <div className="modal-title-text">
                    <h2>
                      {editingRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
                    </h2>
                    <p>
                      {editingRole
                        ? "Cập nhật thông tin vai trò"
                        : "Tạo vai trò mới cho hệ thống"}
                    </p>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="role-modal-body">
                <form onSubmit={handleSubmit} className="role-form">
                  <div className="role-form-grid">
                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>🎭 Thông tin vai trò</h3>
                          <p>Nhập tên và mô tả cho vai trò</p>
                        </div>
                        <div className="card-content">
                          <div className="form-group">
                            <label>Tên vai trò *</label>
                            <input
                              type="text"
                              name="roleName"
                              value={formData.roleName}
                              onChange={handleFormChange}
                              required
                              placeholder="Nhập tên vai trò (VD: Manager, Editor...)"
                              className={`form-input ${
                                fieldErrors.roleName
                                  ? "error"
                                  : formData.roleName.trim() &&
                                    !fieldErrors.roleName
                                  ? "success"
                                  : ""
                              }`}
                            />
                            {fieldErrors.roleName && (
                              <div className="error-message">
                                <i className="error-icon">⚠️</i>
                                {fieldErrors.roleName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>📋 Hướng dẫn</h3>
                          <p>Thông tin về các vai trò</p>
                        </div>
                        <div className="card-content">
                          <div className="role-examples">
                            <div className="role-example">
                              <span className="example-icon">🔑</span>
                              <div>
                                <strong>Admin</strong>
                                <p>Quản trị viên hệ thống</p>
                              </div>
                            </div>
                            <div className="role-example">
                              <span className="example-icon">👨‍💼</span>
                              <div>
                                <strong>Staff</strong>
                                <p>Nhân viên cửa hàng</p>
                              </div>
                            </div>
                            <div className="role-example">
                              <span className="example-icon">🚚</span>
                              <div>
                                <strong>Delivery</strong>
                                <p>Nhân viên giao hàng</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="role-modal-footer">
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
                  ) : editingRole ? (
                    <>
                      <span className="btn-icon">💾</span>
                      Cập nhật vai trò
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">➕</span>
                      Thêm vai trò
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Beautiful Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="beautiful-delete-modal-overlay">
            <div className="beautiful-delete-modal">
              {/* Header with animated trash icon */}
              <div className="beautiful-delete-header">
                <div className="delete-icon-container">
                  <div className="delete-icon-circle">
                    <i className="delete-icon-trash">🗑️</i>
                  </div>
                </div>
                <h2 className="delete-title">Xóa vai trò</h2>
                <p className="delete-subtitle">
                  Bạn có chắc chắn muốn thực hiện hành động này?
                </p>
              </div>

              {/* Role Preview */}
              <div className="role-delete-preview">
                <div className="preview-header">
                  <span className="preview-label">Vai trò sẽ bị xóa:</span>
                </div>
                <div className="preview-content">
                  <div className="preview-item">
                    <span className="preview-icon">🎭</span>
                    <div className="preview-details">
                      <span className="preview-name">
                        {roleToDelete?.roleName}
                      </span>
                      <span className="preview-description">
                        {roleToDelete?.roleName === "Admin"
                          ? "Quản trị viên hệ thống"
                          : roleToDelete?.roleName === "Customer"
                          ? "Khách hàng của cửa hàng"
                          : roleToDelete?.roleName === "Staff"
                          ? "Nhân viên cửa hàng"
                          : roleToDelete?.roleName === "Delivery"
                          ? "Nhân viên giao hàng"
                          : "Vai trò tùy chỉnh"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-content">
                  <p className="warning-title">Cảnh báo quan trọng!</p>
                  <p className="warning-message">
                    Hành động này sẽ xóa vĩnh viễn vai trò khỏi hệ thống và{" "}
                    <strong>không thể hoàn tác</strong>. Tất cả dữ liệu liên
                    quan sẽ bị mất.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="beautiful-delete-actions">
                <button
                  type="button"
                  className="cancel-delete-btn"
                  onClick={cancelDelete}
                  disabled={loading}
                >
                  <span className="btn-icon">✕</span>
                  <span className="btn-text">Hủy bỏ</span>
                </button>
                <button
                  type="button"
                  className="confirm-delete-btn"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner-delete"></span>
                      <span className="btn-text">Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🗑️</span>
                      <span className="btn-text">Xác nhận xóa</span>
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

export default AdminRoles;
