# 🌺 Orchid Shop API

Một RESTful API được xây dựng bằng ASP.NET Core Web API để quản lý cửa hàng lan hồ điệp, triển khai Clean Architecture với Entity Framework Core, JWT Authentication và Swagger documentation.

## 📋 Mục lục

- [Tổng quan dự án](#-tổng-quan-dự-án)
- [Tính năng](#-tính-năng)
- [Kiến trúc dự án](#-kiến-trúc-dự-án)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Database Setup](#-database-setup)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
- [Cấu trúc Database](#-cấu-trúc-database)
- [Email Service chi tiết](#-email-service-chi-tiết)
- [Đóng góp](#-đóng-góp)

## 🎯 Tổng quan dự án

Orchid Shop API là một hệ thống backend toàn diện để quản lý cửa hàng bán lan hồ điệp trực tuyến. API cung cấp các chức năng quản lý sản phẩm, đơn hàng, người dùng và xác thực bảo mật với JWT tokens.

## ✨ Tính năng

### 🔐 Authentication & Authorization

- JWT Token-based Authentication
- Role-based Authorization (Admin, Customer)
- Secure password hashing
- Token refresh mechanism
- Email notification khi đăng ký tài khoản

### 🌸 Quản lý Orchid (Lan hồ điệp)

- CRUD operations cho sản phẩm lan
- Phân loại theo categories
- Quản lý thông tin chi tiết sản phẩm
- Lưu trữ link hình ảnh sản phẩm

### 👥 Quản lý người dùng

- Đăng ký và đăng nhập
- Quản lý profile người dùng
- Phân quyền và vai trò
- Đổi mật khẩu

### 🛒 Quản lý đơn hàng

- Tạo và theo dõi đơn hàng
- Quản lý chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng
- Lịch sử mua hàng
- Email xác nhận đơn hàng tự động

### 📊 Quản lý danh mục

- Phân loại sản phẩm
- Hierarchical categories
- Category-based filtering

### 📧 Email Service

- SMTP integration với Brevo
- Email templates với HTML/CSS styling
- Email chào mừng khi đăng ký
- Email xác nhận đơn hàng với chi tiết sản phẩm
- Error handling và logging cho email service

## 🏗️ Kiến trúc dự án

Dự án được thiết kế theo mô hình **Clean Architecture** với sự phân tách rõ ràng các layer:

```
📦 Solution Root
├── 📁 BusinessObjects/          # Entity Models & Data Models
│   └── 📁 Entities/
│       ├── Account.cs
│       ├── Category.cs
│       ├── Orchid.cs
│       ├── Order.cs
│       ├── OrderDetail.cs
│       └── Role.cs
│
├── 📁 DataAccess/               # Data Access Layer (Infrastructure)
│   ├── OrchidShopDbContext.cs   # EF DbContext
│   ├── AccountDAO.cs
│   ├── CategoryDAO.cs
│   ├── OrchidDAO.cs
│   ├── OrderDAO.cs
│   ├── OrderDetailDAO.cs
│   └── RoleDAO.cs
│
├── 📁 Repositories/             # Repository Pattern Implementation
│   ├── 📁 Interfaces/          # Repository Contracts
│   └── 📁 Implementations/     # Repository Implementations
│
├── 📁 Services/                 # Business Logic Layer
│   ├── 📁 DTOs/                # Data Transfer Objects
│   │   ├── 📁 Request/
│   │   └── 📁 Response/
│   ├── 📁 Interfaces/          # Service Contracts
│   └── 📁 Implementations/     # Service Implementations
│
└── 📁 Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI/  # Presentation Layer
    ├── 📁 Controllers/         # API Controllers
    ├── 📁 Extensions/          # Service Extensions
    ├── Program.cs              # Application Entry Point
    └── appsettings.json        # Configuration
```

### Layer Responsibilities:

- **BusinessObjects**: Chứa các entity models và data contracts
- **DataAccess**: Triển khai EF Core DbContext và Data Access Objects (DAO)
- **Repositories**: Triển khai Repository pattern để abstract data access
- **Services**: Chứa business logic và các DTOs
- **API Controllers**: Handle HTTP requests và responses

## 🛠️ Công nghệ sử dụng

- **.NET 8** - Framework chính
- **ASP.NET Core Web API** - Web API framework
- **Entity Framework Core** - ORM cho database access
- **SQL Server** - Database management system
- **JWT (JSON Web Tokens)** - Authentication mechanism
- **Swagger/OpenAPI** - API documentation
- **MailKit & MimeKit** - Email service và SMTP client
- **AutoMapper** - Object mapping
- **BCrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 💻 Yêu cầu hệ thống

- [Visual Studio 2022](https://visualstudio.microsoft.com/) hoặc [Visual Studio Code](https://code.visualstudio.com/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB, Express hoặc full version)
- [Git](https://git-scm.com/) (để clone repository)

## 🚀 Hướng dẫn cài đặt

### 1. Clone Repository

```bash
git clone https://github.com/your-username/orchid-shop-api.git
cd orchid-shop-api
```

### 2. Restore NuGet Packages

```bash
dotnet restore
```

### 3. Build Solution

```bash
dotnet build
```

## ⚙️ Cấu hình

### 1. Database Connection String

Cập nhật connection string trong `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnectionStringDB": "Data Source=(local);Initial Catalog=orchid_shop_db;User ID=sa;Password=YOUR_PASSWORD;Trusted_Connection=True;Trust Server Certificate=True"
  }
}
```

### 2. JWT Configuration

Cấu hình JWT settings trong `appsettings.json`:

```json
{
  "JWT": {
    "Secret": "your-super-secure-secret-key-minimum-32-characters",
    "Issuer": "OrchidShopAPI",
    "Audience": "OrchidShopClient",
    "ExpirationInMinutes": 60
  }
}
```

### 3. SMTP Email Configuration

Cấu hình SMTP settings trong `appsettings.json` để gửi email:

```json
{
  "SmtpSettings": {
    "Server": "smtp-relay.brevo.com",
    "Port": 587,
    "Username": "your-brevo-username",
    "Password": "your-brevo-password",
    "EnableSsl": true,
    "SenderName": "Orchid Shop"
  }
}
```

**Hướng dẫn cấu hình Brevo SMTP:**

1. Đăng ký tài khoản tại [Brevo](https://www.brevo.com/)
2. Vào phần SMTP & API > SMTP
3. Tạo SMTP key mới và copy thông tin username/password
4. Cập nhật thông tin vào `appsettings.json`

## 🗄️ Database Setup

### 1. Tạo Migration đầu tiên

Mở Package Manager Console trong Visual Studio:

```powershell
# Set DataAccess project as default
PM> Add-Migration InitialCreate -Project DataAccess
```

### 2. Cập nhật Database

```powershell
PM> Update-Database -Project DataAccess
```

### 3. Các lệnh Migration hữu ích

```powershell
# Xem danh sách migrations
PM> Get-Migration

# Tạo migration mới
PM> Add-Migration MigrationName -Project DataAccess

# Áp dụng migration cụ thể
PM> Update-Database MigrationName -Project DataAccess

# Rollback đến migration trước
PM> Update-Database PreviousMigrationName -Project DataAccess

# Xóa migration chưa áp dụng
PM> Remove-Migration -Project DataAccess
```

## ▶️ Chạy ứng dụng

### Chạy từ Visual Studio

- Nhấn `F5` hoặc `Ctrl + F5`

### Chạy từ Command Line

```bash
cd Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI
dotnet run
```

### Chạy với Watch Mode (tự động reload)

```bash
dotnet watch run
```

Ứng dụng sẽ chạy tại: `https://localhost:7xxx` và `http://localhost:5xxx`

## 📚 API Documentation

### Swagger UI

Truy cập Swagger UI tại: `https://localhost:7xxx/swagger`

Swagger UI cung cấp:

- 📖 Danh sách tất cả endpoints
- 🧪 Test API trực tiếp từ browser
- 📝 Xem request/response format
- 🔐 Authentication với JWT tokens

## 🔐 Authentication

### 1. Đăng ký tài khoản mới

```http
POST /api/Auth/register
Content-Type: application/json

{
  "accountName": "customer1",
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```

📧 **Email Notification**: Sau khi đăng ký thành công, hệ thống sẽ tự động gửi email chào mừng đến địa chỉ email đã đăng ký với template được thiết kế đẹp mắt.

### 2. Đăng nhập

```http
POST /api/Auth/login
Content-Type: application/json

{
  "username": "customer1",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires": "2024-01-01T12:00:00Z",
    "user": {
      "id": 1,
      "username": "customer1",
      "email": "customer@example.com",
      "role": "Customer"
    }
  }
}
```

### 3. Sử dụng JWT Token

Thêm token vào header cho các API cần authentication:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🌐 API Endpoints

### 🔐 Authentication

- `POST /api/Auth/register` - Đăng ký tài khoản mới
- `POST /api/Auth/login` - Đăng nhập
- `POST /api/Auth/change-password` - Đổi mật khẩu

### 👥 Account Management

- `GET /api/Account` - Lấy danh sách tài khoản (Admin only)
- `GET /api/Account/{id}` - Lấy thông tin tài khoản theo ID
- `PUT /api/Account/{id}` - Cập nhật thông tin tài khoản
- `DELETE /api/Account/{id}` - Xóa tài khoản (Admin only)

### 🌸 Orchid Management

- `GET /api/Orchid` - Lấy danh sách orchids
- `GET /api/Orchid/{id}` - Lấy thông tin orchid theo ID
- `POST /api/Orchid` - Tạo orchid mới (Admin only)
- `PUT /api/Orchid/{id}` - Cập nhật orchid (Admin only)
- `DELETE /api/Orchid/{id}` - Xóa orchid (Admin only)

### 📂 Category Management

- `GET /api/Category` - Lấy danh sách categories
- `GET /api/Category/{id}` - Lấy category theo ID
- `POST /api/Category` - Tạo category mới (Admin only)
- `PUT /api/Category/{id}` - Cập nhật category (Admin only)
- `DELETE /api/Category/{id}` - Xóa category (Admin only)

### 🛒 Order Management

- `GET /api/Order` - Lấy danh sách orders
- `GET /api/Order/{id}` - Lấy order theo ID
- `POST /api/Order` - Tạo order mới (📧 Tự động gửi email xác nhận)
- `PUT /api/Order/{id}` - Cập nhật order status
- `DELETE /api/Order/{id}` - Hủy order

### 👑 Role Management

- `GET /api/Role` - Lấy danh sách roles (Admin only)
- `POST /api/Role` - Tạo role mới (Admin only)
- `PUT /api/Role/{id}` - Cập nhật role (Admin only)
- `DELETE /api/Role/{id}` - Xóa role (Admin only)

## 🗃️ Cấu trúc Database

### Entities chính:

#### 👤 Account

- Quản lý thông tin người dùng
- Liên kết với Role để phân quyền
- Chứa thông tin đăng nhập và profile

#### 🌺 Orchid

- Thông tin sản phẩm lan hồ điệp
- Liên kết với Category
- Chứa giá, mô tả, link hình ảnh

#### 📂 Category

- Phân loại sản phẩm
- Hierarchical structure
- Metadata cho filtering

#### 🛒 Order & OrderDetail

- Quản lý đơn hàng
- Chi tiết từng item trong đơn hàng
- Tracking status và payment

#### 👑 Role

- Định nghĩa các vai trò trong hệ thống
- Role-based access control

## 📧 Email Service chi tiết

### 📬 Email Templates

Hệ thống sử dụng HTML email templates được thiết kế responsive với:

#### 🎨 Welcome Email (Email chào mừng)

- **Trigger**: Khi user đăng ký tài khoản mới
- **Nội dung**: Thông tin tài khoản, lời chào mừng, CTA button
- **Styling**: Professional design với Orchid Shop branding

#### 📦 Order Confirmation Email (Email xác nhận đơn hàng)

- **Trigger**: Khi tạo đơn hàng mới thành công
- **Nội dung**: Chi tiết đơn hàng, danh sách sản phẩm, tổng tiền
- **Styling**: Invoice-style với table layout cho chi tiết sản phẩm

### ⚙️ SMTP Configuration

- **Provider**: Brevo (SendinBlue) SMTP Relay
- **Security**: TLS/SSL encryption
- **Error Handling**: Comprehensive logging và error catching
- **Fallback**: Graceful degradation khi email service unavailable

### 🔧 Email Service Features

- **Async sending**: Non-blocking email delivery
- **HTML templates**: Rich formatting với CSS styling
- **Error logging**: Chi tiết lỗi trong console
- **Configuration**: Flexible SMTP settings via appsettings.json
- **Email validation**: Built-in email format validation

## 🤝 Đóng góp

1. Fork repository này
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📧 Liên hệ

- **Author**: CE171488
- **Email**: your-email@example.com
- **Project Link**: [https://github.com/your-username/orchid-shop-api](https://github.com/your-username/orchid-shop-api)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐ **Nếu project này hữu ích, hãy cho chúng tôi một star!** ⭐
