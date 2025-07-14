# 🌺 Orchid Shop - Fullstack Project

Orchid Shop là hệ thống bán hoa lan trực tuyến gồm **Backend (ASP.NET Core Web API)** và **Frontend (React + Vite)**, hỗ trợ quản lý sản phẩm, đơn hàng, người dùng, phân quyền, xác thực JWT, và tích hợp ChatBot AI.

## 📦 Cấu trúc dự án

```
Orchid-Shop/
├── Lab03_CE171488_IdentityAjax_FE/           # Frontend (React + Vite)
│   └── README.md                             # Hướng dẫn chi tiết FE
├── Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI/ # Backend (ASP.NET Core Web API)
│   └── ReadMe.md                             # Hướng dẫn chi tiết BE
└── README.md                                 # File này
```

## ✨ Tính năng nổi bật

- Quản lý sản phẩm, danh mục, đơn hàng, người dùng, vai trò
- Xác thực & phân quyền JWT (Admin/Customer)
- Giao diện hiện đại, responsive, trải nghiệm mượt mà
- ChatBot AI tư vấn sản phẩm (Google Gemini API)
- Email thông báo (đăng ký, xác nhận đơn hàng)
- API RESTful, tài liệu Swagger

## 🚀 Công nghệ sử dụng

- **Backend:** .NET 8, ASP.NET Core Web API, Entity Framework Core, SQL Server, JWT, Swagger, MailKit
- **Frontend:** React 19, Vite, CSS3, Google Gemini API

## ⚡ Hướng dẫn cài đặt nhanh

### 1. Clone repository

```bash
git clone <repository-url>
cd Orchid-Shop
```

### 2. Cài đặt Backend

```bash
cd Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI
# Cấu hình DB, JWT, SMTP trong appsettings.json
# Khởi tạo database:
dotnet restore
dotnet build
# Tạo migration và update database nếu cần
# dotnet ef migrations add InitialCreate -p DataAccess
# dotnet ef database update -p DataAccess
dotnet run
```

### 3. Cài đặt Frontend

```bash
cd ../Lab03_CE171488_IdentityAjax_FE
npm install
# Tạo file .env từ env.template và cấu hình API URL, Gemini API key nếu dùng ChatBot
npm run dev
```

## 📚 Tài liệu chi tiết

- [Frontend README](./Lab03_CE171488_IdentityAjax_FE/README.md)
- [Backend README](./Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI/ReadMe.md)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit & push
4. Tạo Pull Request

## 📄 License

MIT License. Xem file LICENSE để biết thêm chi tiết.

---

⭐ Nếu project hữu ích, hãy cho một star nhé!
