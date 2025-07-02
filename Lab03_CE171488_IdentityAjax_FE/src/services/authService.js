import apiClient from "./httpClient";
import { API_CONFIG } from "../config/api.js";

const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
      });

      if (response.data) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            accountId: response.data.accountId,
            accountName: response.data.accountName,
            email: response.data.email,
            role: response.data.role,
          })
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  },

  /**
   * Register new user account
   * If backend returns full login info (AccountId, AccountName, Email, Role, Token),
   * automatically save auth data for immediate login
   * @param {string} accountName - User's account name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Object} Response with autoLogin flag indicating if user was logged in automatically
   */
  async register(accountName, email, password) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH_REGISTER,
        {
          accountName,
          email,
          password,
        }
      );

      // Check if response contains login information (auto login after register)
      const data = response.data;
      if (
        data &&
        data.accountId &&
        data.accountName &&
        data.email &&
        data.role &&
        data.token
      ) {
        // Save auth info like login
        localStorage.setItem("authToken", data.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            accountId: data.accountId,
            accountName: data.accountName,
            email: data.email,
            role: data.role,
          })
        );

        // Add autoLogin flag to indicate successful auto login
        return {
          ...data,
          autoLogin: true,
        };
      }

      // Return normal register response if no login info
      return {
        ...data,
        autoLogin: false,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  },

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
  },

  getCurrentUser() {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  },

  getToken() {
    return localStorage.getItem("authToken");
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  // Decode JWT token to get user info
  decodeToken(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  },

  // Get account ID from token
  getAccountId() {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return null;

    // Extract accountId from nameidentifier claim
    return decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  },
};

export default authService;
