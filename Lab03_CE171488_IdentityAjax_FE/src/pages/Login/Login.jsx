import React, { useState } from "react";
import { authService } from "../../services";
import "./Login.css";

function Login({
  onLoginSuccess,
  onNavigateToHome,
  onNavigateToRegister,
  onNavigateToAdmin,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case "email":
        if (!value.trim()) {
          errors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Email không hợp lệ";
        }
        break;

      case "password":
        if (!value.trim()) {
          errors.password = "Mật khẩu là bắt buộc";
        } else if (value.length < 6) {
          errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldErrors);
    });

    return errors;
  };

  const handleInputChange = (e) => {
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

    // Clear global error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate entire form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Vui lòng sửa các lỗi trong form!");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await authService.login(
        formData.email.trim(),
        formData.password
      );

      // Success - call parent callback
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }

      // Check if user is Admin and navigate accordingly
      if (response.role === "Admin" && onNavigateToAdmin) {
        onNavigateToAdmin();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo" onClick={onNavigateToHome}>
            🌺 Orchid Shop
          </div>
          <h1 className="login-title">Đăng nhập</h1>
          <p className="login-subtitle">
            Chào mừng bạn trở lại! Đăng nhập để tiếp tục mua sắm.
          </p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ email"
              required
              autoComplete="email"
              className={fieldErrors.email ? "error" : ""}
            />
            {fieldErrors.email && (
              <span className="field-error">❌ {fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              required
              autoComplete="current-password"
              className={fieldErrors.password ? "error" : ""}
            />
            {fieldErrors.password && (
              <span className="field-error">❌ {fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập 🌸"
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>🎯 Tài khoản demo:</h4>
          <p>
            <strong>Email:</strong> alice@example.com
          </p>
          <p>
            <strong>Mật khẩu:</strong> password123
          </p>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>Chưa có tài khoản?</p>
          <button className="register-link-btn" onClick={onNavigateToRegister}>
            Đăng ký ngay
          </button>
          <button className="back-home-btn" onClick={onNavigateToHome}>
            ← Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
