import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import cartService from "../services/cartService.js";

const Header = ({
  currentPage,
  user,
  onNavigateToHome,
  onNavigateToProducts,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToLogin,
  onNavigateToOrders,
  onNavigateToCart,
  onNavigateToAdmin,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);

  // Update cart count on component mount and when user changes
  useEffect(() => {
    const updateCartCount = () => {
      const count = cartService.getUniqueProductsCount(); // Show number of unique products
      setCartCount(count);
    };

    updateCartCount();

    // Listen to storage changes to update cart count when cart is modified
    const handleStorageChange = (e) => {
      if (e.key === "orchidShop_cart") {
        updateCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // For same-tab updates, set up a custom event listener
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getAvatarUrl = (name) => {
    // Use DiceBear API for beautiful random avatars
    const seed = name || "default";
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      seed
    )}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={onNavigateToHome}>
          <h1>🌺 Orchid Shop</h1>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <button
                className={`nav-link ${currentPage === "home" ? "active" : ""}`}
                onClick={onNavigateToHome}
              >
                Trang chủ
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${
                  currentPage === "products" ? "active" : ""
                }`}
                onClick={onNavigateToProducts}
              >
                Sản phẩm
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${
                  currentPage === "about" ? "active" : ""
                }`}
                onClick={onNavigateToAbout}
              >
                Giới thiệu
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${
                  currentPage === "contact" ? "active" : ""
                }`}
                onClick={onNavigateToContact}
              >
                Liên hệ
              </button>
            </li>
          </ul>
        </nav>

        {/* User Avatar & Cart */}
        <div className="header-actions">
          {user ? (
            <div className="user-avatar-container" ref={dropdownRef}>
              <div className="user-avatar" onClick={toggleDropdown}>
                <img
                  src={getAvatarUrl(user.accountName)}
                  alt={user.accountName}
                  className="avatar-img"
                />
              </div>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <img
                        src={getAvatarUrl(user.accountName)}
                        alt={user.accountName}
                        className="dropdown-avatar-img"
                      />
                    </div>
                    <div className="dropdown-info">
                      <div className="dropdown-name">{user.accountName}</div>
                      <div className="dropdown-email">{user.email}</div>
                      {user.role && (
                        <div className="dropdown-role">Role: {user.role}</div>
                      )}
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-menu-btn"
                    onClick={onNavigateToOrders}
                  >
                    📋 Lịch sử đơn hàng
                  </button>
                  {user.role === "Admin" && (
                    <button
                      className="dropdown-menu-btn"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigateToAdmin();
                      }}
                    >
                      🛒 Quản lý đơn hàng
                    </button>
                  )}
                  <button
                    className="dropdown-logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="header-login-btn" onClick={onNavigateToLogin}>
              👤 Đăng nhập
            </button>
          )}
          <button className="cart-btn" onClick={onNavigateToCart}>
            🛒 <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
