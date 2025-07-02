import React, { useState, useEffect } from "react";
import userService from "../../services/userService";
import { authService } from "../../services";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminUsers.css";

function AdminUsers({
  currentPage,
  onNavigateToHome,
  onNavigateToOrders,
  onNavigateToProducts,
  onNavigateToRoles,
  onNavigateToCategories,
  onLogout,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    password: "",
    roleId: 2,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Pagination states
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 5;

  const roles = [
    { roleId: 1, roleName: "Admin" },
    { roleId: 2, roleName: "Customer" },
    { roleId: 3, roleName: "Staff" },
    { roleId: 4, roleName: "Delivery" },
  ];

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, selectedRole]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
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
      case "accountName":
        if (!value.trim()) {
          errors.accountName = "Tên người dùng là bắt buộc";
        } else if (value.trim().length < 3) {
          errors.accountName = "Tên người dùng phải có ít nhất 3 ký tự";
        } else if (value.trim().length > 50) {
          errors.accountName = "Tên người dùng không được quá 50 ký tự";
        }
        break;

      case "email":
        if (!value.trim()) {
          errors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Email không hợp lệ";
        }
        break;

      case "password":
        if (!editingUser && !value) {
          errors.password = "Mật khẩu là bắt buộc";
        } else if (value && value.length < 6) {
          errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        } else if (value && value.length > 100) {
          errors.password = "Mật khẩu không được quá 100 ký tự";
        }
        break;

      case "roleId":
        if (
          !value ||
          value === "" ||
          !roles.find((r) => r.roleId === Number(value))
        ) {
          errors.roleId = "Vui lòng chọn vai trò hợp lệ";
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" || user.role.roleName === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPageNum - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageUsers = filteredUsers.slice(startIndex, endIndex);

  // Get visible page numbers for pagination
  const getVisiblePageNumbers = () => {
    const delta = 2;
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
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots.filter(
      (item, index, arr) =>
        arr.indexOf(item) === index && item !== currentPageNum
    );
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageNum(page);
    }
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "roleId" ? parseInt(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation
    const fieldValidationErrors = validateField(name, newValue);
    setFieldErrors((prev) => ({
      ...prev,
      ...fieldValidationErrors,
      [name]: fieldValidationErrors[name] || undefined, // Remove error if field is valid
    }));
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        accountName: user.accountName,
        email: user.email,
        password: "",
        roleId: user.roleId,
      });
    } else {
      setEditingUser(null);
      setFormData({
        accountName: "",
        email: "",
        password: "",
        roleId: 2,
      });
    }
    setFieldErrors({}); // Clear all validation errors
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      accountName: "",
      email: "",
      password: "",
      roleId: 2,
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

      const userData = {
        accountName: formData.accountName.trim(),
        email: formData.email.trim(),
        roleId: formData.roleId,
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        await userService.updateUser(editingUser.accountId, userData);
        showNotification("✅ Cập nhật người dùng thành công!");
      } else {
        userData.password = formData.password; // Required for new users
        await userService.createUser(userData);
        showNotification("✅ Thêm người dùng thành công!");
      }

      closeModal();
      await fetchData();
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    const currentUser = authService.getCurrentUser();
    if (user.accountId === currentUser?.accountId) {
      showNotification("❌ Bạn không thể xóa tài khoản của chính mình!");
      return;
    }

    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      await userService.deleteUser(userToDelete.accountId);
      showNotification("✅ Xóa người dùng thành công!");
      setShowDeleteModal(false);
      setUserToDelete(null);
      await fetchData();
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
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
        return "role-customer";
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
      onNavigateToUsers={() => {}}
      onNavigateToRoles={onNavigateToRoles}
      onNavigateToCategories={onNavigateToCategories}
      onLogout={onLogout}
    >
      <div className="admin-users">
        <div className="admin-users-header">
          <div className="header-left">
            <h1>👥 Quản lý người dùng</h1>
            <p>Quản lý toàn bộ tài khoản người dùng trong hệ thống</p>
          </div>
          <button className="btn-primary" onClick={() => openModal()}>
            ➕ Thêm người dùng
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{filteredUsers.length}</div>
              <div className="stat-label">Người dùng hiển thị</div>
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
            <div className="stat-icon">🔑</div>
            <div className="stat-content">
              <div className="stat-number">
                {users.filter((u) => u.role.roleName === "Admin").length}
              </div>
              <div className="stat-label">Quản trị viên</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-content">
              <div className="stat-number">
                {users.filter((u) => u.role.roleName === "Customer").length}
              </div>
              <div className="stat-label">Khách hàng</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-content">
              <div className="stat-number">
                {users.filter((u) => u.role.roleName === "Staff").length}
              </div>
              <div className="stat-label">Nhân viên</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚚</div>
            <div className="stat-content">
              <div className="stat-number">
                {users.filter((u) => u.role.roleName === "Delivery").length}
              </div>
              <div className="stat-label">Giao hàng</div>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Admin">Quản trị viên</option>
            <option value="Customer">Khách hàng</option>
            <option value="Staff">Nhân viên</option>
            <option value="Delivery">Giao hàng</option>
          </select>
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
          <div className="users-table">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-name">Tên người dùng</div>
              <div className="col-email">Email</div>
              <div className="col-role">Vai trò</div>
              <div className="col-actions">Thao tác</div>
            </div>

            {currentPageUsers.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy người dùng nào</p>
              </div>
            ) : (
              currentPageUsers.map((user) => (
                <div key={user.accountId} className="table-row">
                  <div className="col-id">#{user.accountId}</div>
                  <div className="col-name">
                    <div className="user-name">{user.accountName}</div>
                  </div>
                  <div className="col-email">
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div className="col-role">
                    <span
                      className={`role-badge ${getRoleColor(
                        user.role.roleName
                      )}`}
                    >
                      {user.role.roleName === "Admin"
                        ? "🔑 Quản trị viên"
                        : user.role.roleName === "Customer"
                        ? "🛍️ Khách hàng"
                        : user.role.roleName === "Staff"
                        ? "👨‍💼 Nhân viên"
                        : user.role.roleName === "Delivery"
                        ? "🚚 Giao hàng"
                        : "👤 Khác"}
                    </span>
                  </div>
                  <div className="col-actions">
                    <button
                      className="btn-edit"
                      onClick={() => openModal(user)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user)}
                      disabled={user.accountId === currentUser?.accountId}
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
        {filteredUsers.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Hiển thị {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredUsers.length)} của{" "}
                {filteredUsers.length} người dùng
                {searchTerm || selectedRole !== "all"
                  ? ` (lọc từ ${users.length} tổng cộng)`
                  : ""}
              </span>
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="page-btn prev-btn"
                  onClick={handlePrevPage}
                  disabled={currentPageNum === 1}
                >
                  ‹ Trước
                </button>

                <div className="page-numbers">
                  {currentPageNum > 1 && (
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  )}

                  {getVisiblePageNumbers().map((pageNum, index) => (
                    <span key={index}>
                      {pageNum === "..." ? (
                        <span className="page-dots">...</span>
                      ) : (
                        <button
                          className="page-btn"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )}
                    </span>
                  ))}

                  <button className="page-btn current-page">
                    {currentPageNum}
                  </button>

                  {currentPageNum < totalPages && (
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  className="page-btn next-btn"
                  onClick={handleNextPage}
                  disabled={currentPageNum === totalPages}
                >
                  Sau ›
                </button>
              </div>
            )}
          </div>
        )}

        {showModal && (
          <div className="user-modal-overlay">
            <div className="user-modal">
              <div className="user-modal-header">
                <div className="modal-title-section">
                  <div className="modal-icon">👤</div>
                  <div className="modal-title-text">
                    <h2>
                      {editingUser
                        ? "Chỉnh sửa người dùng"
                        : "Thêm người dùng mới"}
                    </h2>
                    <p>
                      {editingUser
                        ? "Cập nhật thông tin tài khoản người dùng"
                        : "Tạo tài khoản mới cho hệ thống"}
                    </p>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="user-modal-body">
                <form onSubmit={handleSubmit} className="user-form">
                  <div className="user-form-grid">
                    {/* Left Column - Personal Info */}
                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>👤 Thông tin cá nhân</h3>
                          <p>Thông tin cơ bản của người dùng</p>
                        </div>
                        <div className="card-content">
                          <div className="form-group">
                            <label>Tên người dùng *</label>
                            <input
                              type="text"
                              name="accountName"
                              value={formData.accountName}
                              onChange={handleFormChange}
                              required
                              placeholder="Nhập tên người dùng"
                              className={fieldErrors.accountName ? "error" : ""}
                            />
                            {fieldErrors.accountName && (
                              <span className="field-error">
                                ❌ {fieldErrors.accountName}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <label>Email *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              required
                              placeholder="Nhập địa chỉ email"
                              className={fieldErrors.email ? "error" : ""}
                            />
                            {fieldErrors.email && (
                              <span className="field-error">
                                ❌ {fieldErrors.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Account Settings */}
                    <div className="form-column">
                      <div className="form-card">
                        <div className="card-header">
                          <h3>🔐 Cài đặt tài khoản</h3>
                          <p>Mật khẩu và quyền truy cập</p>
                        </div>
                        <div className="card-content">
                          <div className="form-group">
                            <label>
                              Mật khẩu{" "}
                              {editingUser ? "(để trống nếu không đổi)" : "*"}
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleFormChange}
                              required={!editingUser}
                              placeholder={
                                editingUser
                                  ? "Nhập mật khẩu mới (tùy chọn)"
                                  : "Nhập mật khẩu"
                              }
                              className={fieldErrors.password ? "error" : ""}
                            />
                            {fieldErrors.password && (
                              <span className="field-error">
                                ❌ {fieldErrors.password}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <label>Vai trò *</label>
                            <select
                              name="roleId"
                              value={formData.roleId}
                              onChange={handleFormChange}
                              required
                              className={fieldErrors.roleId ? "error" : ""}
                            >
                              {roles.map((role) => (
                                <option key={role.roleId} value={role.roleId}>
                                  {role.roleName === "Admin"
                                    ? "🔑 Quản trị viên"
                                    : role.roleName === "Customer"
                                    ? "🛍️ Khách hàng"
                                    : role.roleName === "Staff"
                                    ? "👨‍💼 Nhân viên"
                                    : role.roleName === "Delivery"
                                    ? "🚚 Giao hàng"
                                    : "👤 Khác"}
                                </option>
                              ))}
                            </select>
                            {fieldErrors.roleId && (
                              <span className="field-error">
                                ❌ {fieldErrors.roleId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="user-modal-footer">
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
                  ) : editingUser ? (
                    <>
                      <span className="btn-icon">💾</span>
                      Cập nhật người dùng
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">➕</span>
                      Thêm người dùng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <div className="delete-modal-header">
                <div className="delete-icon">🗑️</div>
                <h3>Xác nhận xóa người dùng</h3>
              </div>

              <div className="delete-modal-body">
                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
                <div className="user-info-preview">
                  <div className="preview-item">
                    <span className="preview-label">👤 Tên:</span>
                    <span className="preview-value">
                      {userToDelete.accountName}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">📧 Email:</span>
                    <span className="preview-value">{userToDelete.email}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">🔑 Vai trò:</span>
                    <span
                      className={`preview-role ${getRoleColor(
                        userToDelete.role.roleName
                      )}`}
                    >
                      {userToDelete.role.roleName === "Admin"
                        ? "🔑 Quản trị viên"
                        : userToDelete.role.roleName === "Customer"
                        ? "🛍️ Khách hàng"
                        : userToDelete.role.roleName === "Staff"
                        ? "👨‍💼 Nhân viên"
                        : userToDelete.role.roleName === "Delivery"
                        ? "🚚 Giao hàng"
                        : "👤 Khác"}
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

export default AdminUsers;
