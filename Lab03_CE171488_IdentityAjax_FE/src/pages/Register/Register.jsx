import React, { useState } from "react";
import { authService } from "../../services";
import "./Register.css";

const Register = ({
  onNavigateToLogin,
  onNavigateToHome,
  onLoginSuccess,
  onNavigateToAdmin,
}) => {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case "accountName":
        if (!value.trim()) {
          errors.accountName = "Tên tài khoản là bắt buộc";
        } else if (value.trim().length < 3) {
          errors.accountName = "Tên tài khoản phải có ít nhất 3 ký tự";
        } else if (value.trim().length > 50) {
          errors.accountName = "Tên tài khoản không được quá 50 ký tự";
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
        if (!value) {
          errors.password = "Mật khẩu là bắt buộc";
        } else if (value.length < 6) {
          errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        } else if (value.length > 100) {
          errors.password = "Mật khẩu không được quá 100 ký tự";
        } else if (
          !/(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)/.test(
            value
          )
        ) {
          errors.password =
            "Mật khẩu phải chứa ít nhất 2 loại: chữ hoa, chữ thường, số";
        }
        break;

      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
        } else if (value !== formData.password) {
          errors.confirmPassword = "Mật khẩu xác nhận không khớp";
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

    try {
      setError("");
      setLoading(true);

      // Validate entire form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError("Vui lòng sửa các lỗi trong form!");
        return;
      }

      setFieldErrors({});

      const response = await authService.register(
        formData.accountName.trim(),
        formData.email.trim(),
        formData.password
      );

      setSuccess(true);

      // Check if auto login was successful
      if (response.autoLogin) {
        setAutoLogin(true);

        // Call login success callback
        if (onLoginSuccess) {
          onLoginSuccess(response);
        }

        // Navigate based on role after 2 seconds
        setTimeout(() => {
          if (response.role === "Admin" && onNavigateToAdmin) {
            onNavigateToAdmin();
          } else {
            onNavigateToHome();
          }
        }, 2000);
      } else {
        // Regular register flow - redirect to login
        setTimeout(() => {
          onNavigateToLogin();
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Đăng ký thành công!</h2>
            {autoLogin ? (
              <p>
                Tài khoản của bạn đã được tạo và đăng nhập tự động. Đang chuyển
                về trang chủ...
              </p>
            ) : (
              <p>
                Tài khoản của bạn đã được tạo. Đang chuyển đến trang đăng
                nhập...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="register-logo">🌺</div>
          <h2 className="register-title">Đăng ký tài khoản</h2>
          <p className="register-subtitle">
            Tạo tài khoản mới để khám phá thế giới hoa lan
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="accountName">Tên tài khoản</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
              placeholder="Nhập tên tài khoản"
              disabled={loading}
              className={fieldErrors.accountName ? "error" : ""}
            />
            {fieldErrors.accountName && (
              <span className="field-error">❌ {fieldErrors.accountName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ email"
              disabled={loading}
              className={fieldErrors.email ? "error" : ""}
            />
            {fieldErrors.email && (
              <span className="field-error">❌ {fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              disabled={loading}
              className={fieldErrors.password ? "error" : ""}
            />
            {fieldErrors.password && (
              <span className="field-error">❌ {fieldErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              disabled={loading}
              className={fieldErrors.confirmPassword ? "error" : ""}
            />
            {fieldErrors.confirmPassword && (
              <span className="field-error">
                ❌ {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Đã có tài khoản?</p>
          <button className="login-link-btn" onClick={onNavigateToLogin}>
            Đăng nhập ngay
          </button>
          <button className="back-home-btn" onClick={onNavigateToHome}>
            ← Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
