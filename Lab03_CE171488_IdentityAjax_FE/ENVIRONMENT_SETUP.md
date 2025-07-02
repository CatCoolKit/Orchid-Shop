# 🔧 Hướng dẫn cấu hình Environment Variables

## 📋 Tổng quan

File này hướng dẫn chi tiết cách cấu hình các biến môi trường (environment variables) cho Orchid Shop Frontend.

## 🚀 Bước 1: Tạo file .env

```bash
# Copy template
cp env.template .env

# Hoặc tạo mới file .env
touch .env
```

## 📝 Bước 2: Cấu hình các biến môi trường

### 🔗 VITE_API_BASE_URL (Bắt buộc)

**Mô tả**: URL cơ sở của backend API server

**Cách hoạt động**:

- Frontend sẽ gọi API theo format: `${VITE_API_BASE_URL}/endpoint`
- Ví dụ: `https://localhost:7168/api/Orchid`

**Các môi trường:**

```env
# Development (local)
VITE_API_BASE_URL=https://localhost:7168/api

# Development (team server)
VITE_API_BASE_URL=http://192.168.1.100:7168/api

# Staging
VITE_API_BASE_URL=https://api-staging.orchidshop.com/api

# Production
VITE_API_BASE_URL=https://api.orchidshop.com/api
```

### 🤖 VITE_GEMINI_API_KEY (Tùy chọn)

**Mô tả**: API key cho Google Gemini AI (ChatBot)

**Cách lấy**:

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập tài khoản Google
3. Tạo API key mới
4. Copy và paste vào .env

```env
VITE_GEMINI_API_KEY=AIzaSyD...your_actual_key_here
```

### 🛠️ VITE_NODE_ENV (Tùy chọn)

**Mô tả**: Môi trường hiện tại

```env
VITE_NODE_ENV=development  # hoặc production
```

## 📁 Ví dụ file .env hoàn chỉnh

### Development (Local)

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:7168/api

# AI Configuration
VITE_GEMINI_API_KEY=AIzaSyD...your_key_here

# Environment
VITE_NODE_ENV=development
```

### Production

```env
# API Configuration
VITE_API_BASE_URL=https://api.orchidshop.com/api

# AI Configuration
VITE_GEMINI_API_KEY=AIzaSyD...your_production_key_here

# Environment
VITE_NODE_ENV=production
```

## 🔍 Cách kiểm tra cấu hình

### 1. Console Log (Development)

Thêm vào file `src/config/api.js`:

```javascript
console.log("🔧 Environment Variables:", {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.VITE_NODE_ENV,
  HAS_GEMINI_KEY: !!import.meta.env.VITE_GEMINI_API_KEY,
});
```

### 2. Network Tab

1. Mở Developer Tools (F12)
2. Vào tab Network
3. Thực hiện API call
4. Kiểm tra URL request có đúng không

## ⚠️ Lưu ý quan trọng

### Quy tắc đặt tên

- **PHẢI** bắt đầu với `VITE_` để Vite nhận diện
- **VD đúng**: `VITE_API_BASE_URL`
- **VD sai**: `API_BASE_URL`, `REACT_APP_API_URL`

### Bảo mật

- **KHÔNG** commit file `.env` lên Git
- **KHÔNG** chia sẻ API key công khai
- Sử dụng file `.env.local` cho cấu hình cá nhân

### Restart server

- **PHẢI** restart dev server sau khi thay đổi `.env`
- Dừng: `Ctrl + C`
- Chạy lại: `npm run dev`

## 🐛 Troubleshooting

### Lỗi: Environment variable không load

**Nguyên nhân**:

- File `.env` không có trong root folder
- Tên biến không bắt đầu với `VITE_`
- Chưa restart dev server

**Giải pháp**:

```bash
# Kiểm tra file .env có tồn tại
ls -la .env

# Kiểm tra nội dung
cat .env

# Restart dev server
npm run dev
```

### Lỗi: API connection failed

**Nguyên nhân**:

- URL API sai
- Backend server không chạy
- CORS policy

**Giải pháp**:

```bash
# Test API endpoint
curl https://localhost:7168/api/Orchid

# Kiểm tra backend logs
# Đảm bảo CORS được cấu hình đúng
```

### Lỗi: Gemini API không hoạt động

**Nguyên nhân**:

- API key sai
- Không có quyền truy cập
- Package chưa cài

**Giải pháp**:

```bash
# Cài package
npm install @google/generative-ai

# Test API key tại: https://makersuite.google.com/
```

## 📚 Tài liệu tham khảo

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Google Gemini API](https://ai.google.dev/docs)
- [Environment Variables Best Practices](https://12factor.net/config)

---

💡 **Tip**: Tạo nhiều file `.env` cho các môi trường khác nhau:

- `.env.development`
- `.env.staging`
- `.env.production`
