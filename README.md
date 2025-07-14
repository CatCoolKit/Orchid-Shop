# 🌺 Orchid Shop - Fullstack Project

Orchid Shop is an online orchid flower sales system including **Backend (ASP.NET Core Web API)** and **Frontend (React + Vite)**, supporting product management, orders, users, roles, JWT authentication, and AI ChatBot integration.

## 📦 Project Structure

```
Orchid-Shop/
├── Lab03_CE171488_IdentityAjax_FE/           # Frontend (React + Vite)
│   └── README.md                             # Detailed FE guide
├── Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI/ # Backend (ASP.NET Core Web API)
│   └── ReadMe.md                             # Detailed BE guide
└── README.md                                 # This file
```

## ✨ Key Features

- Manage products, categories, orders, users, roles
- JWT authentication & authorization (Admin/Customer)
- Modern, responsive UI, smooth user experience
- AI ChatBot for product consultation (Google Gemini API)
- Email notifications (registration, order confirmation)
- RESTful API, Swagger documentation

## 🚀 Technologies Used

- **Backend:** .NET 8, ASP.NET Core Web API, Entity Framework Core, SQL Server, JWT, Swagger, MailKit
- **Frontend:** React 19, Vite, CSS3, Google Gemini API

## ⚡ Quick Setup Guide

### 1. Clone repository

```bash
git clone <repository-url>
cd Orchid-Shop
```

### 2. Setup Backend

```bash
cd Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI
# Configure DB, JWT, SMTP in appsettings.json
# Initialize database:
dotnet restore
dotnet build
# Create migration and update database if needed
# dotnet ef migrations add InitialCreate -p DataAccess
# dotnet ef database update -p DataAccess
dotnet run
```

### 3. Setup Frontend

```bash
cd ../Lab03_CE171488_IdentityAjax_FE
npm install
# Create .env file from env.template and configure API URL, Gemini API key if using ChatBot
npm run dev
```

## 📚 Detailed Documentation

- [Frontend README](./Lab03_CE171488_IdentityAjax_FE/README.md)
- [Backend README](./Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI/ReadMe.md)

## 🤝 Contribution

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit & push
4. Create a Pull Request

## 📄 License

MIT License. See LICENSE file for more details.

---

⭐ If you find this project useful, please give it a star!
