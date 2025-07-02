import React, { useState } from "react";
import { authService } from "../../services";
import "./AdminLayout.css";

const AdminLayout = ({
  children,
  currentPage,
  onNavigateToHome,
  onNavigateToOrders,
  onNavigateToProducts,
  onNavigateToUsers,
  onNavigateToRoles,
  onNavigateToCategories,
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentUser = authService.getCurrentUser();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getAvatarUrl = (name) => {
    const seed = name || "admin";
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      seed
    )}`;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🌺</span>
            <span className="logo-text">Admin Panel</span>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li>
              <button
                className={`nav-item ${
                  currentPage === "admin" ? "active" : ""
                }`}
                onClick={() => {
                  if (onNavigateToOrders) {
                    onNavigateToOrders();
                  }
                }}
              >
                <span className="nav-icon">🛒</span>
                <span className="nav-text">Quản lý đơn hàng</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${
                  currentPage === "admin-products" ? "active" : ""
                }`}
                onClick={() => {
                  if (onNavigateToProducts) {
                    onNavigateToProducts();
                  }
                }}
              >
                <span className="nav-icon">🌸</span>
                <span className="nav-text">Quản lý sản phẩm</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${
                  currentPage === "admin-users" ? "active" : ""
                }`}
                onClick={() => {
                  if (onNavigateToUsers) {
                    onNavigateToUsers();
                  }
                }}
              >
                <span className="nav-icon">👥</span>
                <span className="nav-text">Quản lý người dùng</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${
                  currentPage === "admin-roles" ? "active" : ""
                }`}
                onClick={() => {
                  if (onNavigateToRoles) {
                    onNavigateToRoles();
                  }
                }}
              >
                <span className="nav-icon">🎭</span>
                <span className="nav-text">Quản lý vai trò</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${
                  currentPage === "admin-categories" ? "active" : ""
                }`}
                onClick={() => {
                  if (onNavigateToCategories) {
                    onNavigateToCategories();
                  }
                }}
              >
                <span className="nav-icon">🏷️</span>
                <span className="nav-text">Quản lý danh mục</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item back-to-site" onClick={onNavigateToHome}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Về trang chủ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <h1 className="page-title">Admin Dashboard</h1>
          </div>

          <div className="header-right">
            <div className="admin-user">
              <img
                src={getAvatarUrl(currentUser?.accountName)}
                alt="Admin Avatar"
                className="admin-avatar"
              />
              <div className="admin-info">
                <span className="admin-name">{currentUser?.accountName}</span>
                <span className="admin-role">Administrator</span>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
