# 🌸 Orchid Shop - Frontend

Một ứng dụng web frontend cho cửa hàng hoa lan, được xây dựng với React và Vite. Ứng dụng cung cấp giao diện người dùng hoàn chỉnh cho việc mua sắm hoa lan trực tuyến với tính năng chatbot AI thông minh.

## ✨ Tính năng chính

### 🛍️ Cho khách hàng

- **Trang chủ**: Hiển thị sản phẩm nổi bật và thông tin cửa hàng
- **Danh mục sản phẩm**: Duyệt và tìm kiếm hoa lan theo danh mục
- **Chi tiết sản phẩm**: Xem thông tin chi tiết và hình ảnh sản phẩm
- **Giỏ hàng**: Thêm, xóa và cập nhật sản phẩm trong giỏ hàng
- **Đặt hàng**: Thanh toán và theo dõi đơn hàng
- **Lịch sử đơn hàng**: Xem các đơn hàng đã đặt
- **ChatBot AI**: Tư vấn sản phẩm với Gemini AI

### 👨‍💼 Cho quản trị viên

- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm hoa lan
- **Quản lý danh mục**: Quản lý các danh mục sản phẩm
- **Quản lý đơn hàng**: Theo dõi và cập nhật trạng thái đơn hàng
- **Quản lý người dùng**: Quản lý tài khoản khách hàng
- **Quản lý vai trò**: Phân quyền người dùng

### 🔐 Xác thực và bảo mật

- **Đăng ký/Đăng nhập**: Hệ thống xác thực người dùng
- **Auto Login**: Tự động đăng nhập sau khi đăng ký thành công (nếu backend trả về đầy đủ thông tin)
- **Phân quyền**: Kiểm soát truy cập dựa trên vai trò
- **Bảo vệ route**: Bảo vệ các trang quan trọng

## 🚀 Công nghệ sử dụng

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.0
- **Code Quality**: ESLint
- **AI Integration**: Google Gemini API
- **CSS**: CSS3 với responsive design

## 📋 Yêu cầu hệ thống

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🛠️ Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd Lab03_CE171488_IdentityAjax_FE
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Environment Variables

Tạo file `.env` từ template:

```bash
# Copy file template
cp env.template .env
```

Cập nhật các giá trị trong file `.env`:

```env
# Gemini AI Configuration (Tùy chọn - cho ChatBot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# API Configuration (Bắt buộc)
VITE_API_BASE_URL=https://localhost:7168/api

# Environment
VITE_NODE_ENV=development
```

**Quan trọng**:

- `VITE_API_BASE_URL`: URL của backend API server (bắt buộc)
- `VITE_GEMINI_API_KEY`: API key cho tính năng ChatBot (tùy chọn)

**Các môi trường thường dùng:**

- **Development**: `https://localhost:7168/api`
- **Staging**: `https://your-staging-api.com/api`
- **Production**: `https://your-production-api.com/api`

📖 **Hướng dẫn chi tiết**: Xem file `ENVIRONMENT_SETUP.md` để có hướng dẫn đầy đủ về cấu hình environment variables.

### 4. Tích hợp Gemini AI (Tùy chọn)

Để sử dụng tính năng ChatBot AI:

```bash
# Cài đặt Gemini API
npm install @google/generative-ai
```

Xem file `GEMINI_INTEGRATION.md` để có hướng dẫn chi tiết về tích hợp Gemini AI.

### 5. Chạy ứng dụng

```bash
# Chạy môi trường development
npm run dev

# Build cho production
npm run build

# Preview bản build
npm run preview

# Kiểm tra linting
npm run lint
```

## 🌐 Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── AdminLayout/     # Layout cho trang admin
│   ├── ChatBot.jsx      # ChatBot với Gemini AI
│   ├── Footer.jsx       # Footer component
│   ├── Header.jsx       # Header và navigation
│   ├── ProductCatalog.jsx
│   └── ProductDetail.jsx
├── pages/               # Các trang chính
│   ├── Home/           # Trang chủ
│   ├── Login/          # Đăng nhập
│   ├── Register/       # Đăng ký
│   ├── Cart/           # Giỏ hàng
│   ├── OrderHistory/   # Lịch sử đơn hàng
│   ├── About/          # Giới thiệu
│   ├── Contact/        # Liên hệ
│   └── Admin/          # Các trang quản trị
│       ├── AdminProducts.jsx
│       ├── AdminCategories.jsx
│       ├── AdminOrders.jsx
│       ├── AdminUsers.jsx
│       └── AdminRoles.jsx
├── services/           # API services
│   ├── authService.js
│   ├── orchidService.js
│   ├── cartService.js
│   ├── orderService.js
│   ├── categoryService.js
│   ├── userService.js
│   ├── roleService.js
│   └── httpClient.js
├── config/             # Cấu hình
│   └── api.js
└── assets/            # Hình ảnh và tài nguyên
```

## 📱 Giao diện responsive

Ứng dụng được thiết kế responsive, tương thích với:

- Desktop (≥ 1024px)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔗 API Integration

Ứng dụng frontend này kết nối với backend API để:

- Xác thực người dùng
- Quản lý sản phẩm và danh mục
- Xử lý đơn hàng
- Quản lý giỏ hàng

API endpoints được cấu hình trong `src/config/api.js`.

## 🤖 ChatBot AI

Tính năng ChatBot sử dụng Google Gemini AI để:

- Tư vấn sản phẩm hoa lan
- Hướng dẫn chăm sóc
- Hỗ trợ khách hàng
- Giải đáp thắc mắc

## 🎨 Customization

### Thay đổi theme màu sắc

Chỉnh sửa file `src/index.css` để thay đổi CSS variables:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... */
}
```

### Thêm tính năng mới

1. Tạo component trong `src/components/`
2. Tạo service trong `src/services/` nếu cần API
3. Thêm route trong `App.jsx`

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Module not found**: Kiểm tra `node_modules` và chạy `npm install`
2. **API connection failed**:
   - Kiểm tra `VITE_API_BASE_URL` trong file `.env`
   - Đảm bảo backend server đang chạy
   - Kiểm tra CORS settings trên backend
3. **Environment variables not loaded**:
   - Đảm bảo file `.env` tồn tại trong root folder
   - Restart dev server sau khi thay đổi `.env`
   - Kiểm tra tên biến phải bắt đầu với `VITE_`
4. **Build failed**: Chạy `npm run lint` để kiểm tra lỗi code

### Performance Issues

- Sử dụng React DevTools để debug
- Kiểm tra Network tab trong Browser DevTools
- Optimize images trong thư mục assets

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Project**: Lab03 CE171488 Identity Ajax Frontend
- **Student**: CE171488
- **Course**: PRN231 - Lập trình .NET Nâng cao

---

⭐ Nếu project này hữu ích, hãy cho một star nhé!
