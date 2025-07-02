import { getBaseUrl, API_CONFIG } from "../config/api.js";

// HttpClient Service - Centralized API management
class HttpClient {
  constructor(baseURL = getBaseUrl()) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Get token from localStorage and add to headers if available
    const token = localStorage.getItem("authToken");
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Debug: Log token status
    if (
      endpoint.includes("/Orchid") &&
      options.method &&
      ["POST", "PUT", "DELETE"].includes(options.method)
    ) {
      console.log("🔐 API Request Debug:", {
        endpoint,
        method: options.method,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
        authHeader: authHeaders.Authorization ? "Present" : "Missing",
      });
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Use predefined error messages based on status code
        let errorMessage;
        switch (response.status) {
          case API_CONFIG.STATUS_CODES.UNAUTHORIZED:
            errorMessage = API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case API_CONFIG.STATUS_CODES.FORBIDDEN:
            errorMessage = API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case API_CONFIG.STATUS_CODES.NOT_FOUND:
            errorMessage = API_CONFIG.ERROR_MESSAGES.NOT_FOUND;
            break;
          case API_CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR:
            errorMessage = API_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
            break;
          default:
            errorMessage =
              errorData.message ||
              errorData.Message ||
              `HTTP Error: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Handle API response format
      if (data.status && data.status === API_CONFIG.STATUS_CODES.OK) {
        return {
          success: true,
          data: data.data,
          message: data.message,
        };
      }

      return {
        success: true,
        data: data,
        message: "Success",
      };
    } catch (error) {
      if (error.name === "TypeError") {
        throw new Error(API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw new Error(error.message || API_CONFIG.ERROR_MESSAGES.SERVER_ERROR);
    }
  }

  // GET request
  async get(endpoint, params = {}, options = {}) {
    const queryString = Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";

    return this.request(`${endpoint}${queryString}`, {
      method: "GET",
      ...options,
    });
  }

  // POST request
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

// Create and export singleton instance
const apiClient = new HttpClient(); // Uses getBaseUrl() by default

export default apiClient;
