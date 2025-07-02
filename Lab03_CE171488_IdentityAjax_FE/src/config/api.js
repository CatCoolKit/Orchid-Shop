// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://localhost:7168/api",
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH_LOGIN: "/Auth/login",
    AUTH_REGISTER: "/Auth/register",

    // Other endpoints
    ORCHIDS: "/Orchid",
    CATEGORIES: "/Category",
    USERS: "/User",
    ORDERS: "/Order",
  },

  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.",
    SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
    UNAUTHORIZED: "Bạn không có quyền truy cập.",
    NOT_FOUND: "Không tìm thấy dữ liệu.",
    VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
    TIMEOUT: "Yêu cầu quá thời gian chờ.",
  },
};

// Development vs Production URLs
export const getBaseUrl = () => {
  // Always use environment variable if available, otherwise fallback to default
  return import.meta.env.VITE_API_BASE_URL || API_CONFIG.BASE_URL;
};

export default API_CONFIG;
