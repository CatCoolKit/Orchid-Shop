import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import HomePage from "./pages/Home/HomePage";
import ProductCatalog from "./components/ProductCatalog";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import Cart from "./pages/Cart/Cart";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminRoles from "./pages/Admin/AdminRoles";
import AdminCategories from "./pages/Admin/AdminCategories";
import { authService } from "./services";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  // Get initial page from URL hash or localStorage, fallback to home
  const getInitialPage = () => {
    const hash = window.location.hash.slice(1); // Remove #
    if (
      hash &&
      [
        "home",
        "products",
        "about",
        "contact",
        "login",
        "register",
        "orders",
        "cart",
        "admin",
        "admin-products",
        "admin-users",
        "admin-roles",
        "admin-categories",
      ].includes(hash)
    ) {
      return hash;
    }
    return localStorage.getItem("currentPage") || "home";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      if (
        hash &&
        [
          "home",
          "products",
          "about",
          "contact",
          "login",
          "register",
          "orders",
          "cart",
          "admin",
          "admin-products",
          "admin-users",
          "admin-roles",
          "admin-categories",
        ].includes(hash)
      ) {
        setCurrentPage(hash);
        localStorage.setItem("currentPage", hash);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL and localStorage when page changes
  const updatePage = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
    window.history.pushState(null, null, `#${page}`);
  };

  const navigateToHome = () => {
    updatePage("home");
  };

  const navigateToProducts = () => {
    updatePage("products");
  };

  const navigateToAbout = () => {
    updatePage("about");
  };

  const navigateToContact = () => {
    updatePage("contact");
  };

  const navigateToLogin = () => {
    updatePage("login");
  };

  const navigateToOrders = () => {
    updatePage("orders");
  };

  const navigateToCart = () => {
    updatePage("cart");
  };

  const navigateToRegister = () => {
    updatePage("register");
  };

  const navigateToAdmin = () => {
    updatePage("admin");
  };

  const navigateToAdminProducts = () => {
    updatePage("admin-products");
  };

  const navigateToUsers = () => {
    updatePage("admin-users");
  };

  const navigateToRoles = () => {
    updatePage("admin-roles");
  };

  const navigateToCategories = () => {
    updatePage("admin-categories");
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Don't automatically navigate to home if Admin will be redirected to admin page
    if (userData.role !== "Admin") {
      updatePage("home");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    updatePage("home");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onNavigateToProducts={navigateToProducts}
            onNavigateToAbout={navigateToAbout}
            onNavigateToContact={navigateToContact}
          />
        );
      case "products":
        return <ProductCatalog onNavigateToLogin={navigateToLogin} />;
      case "about":
        return (
          <About
            onNavigateToProducts={navigateToProducts}
            onNavigateToContact={navigateToContact}
          />
        );
      case "contact":
        return <Contact />;
      case "login":
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToRegister={navigateToRegister}
            onNavigateToAdmin={navigateToAdmin}
          />
        );
      case "orders":
        return (
          <OrderHistory
            onNavigateToHome={navigateToHome}
            onNavigateToLogin={navigateToLogin}
          />
        );
      case "cart":
        return (
          <Cart
            onNavigateToHome={navigateToHome}
            onNavigateToProducts={navigateToProducts}
            onNavigateToLogin={navigateToLogin}
          />
        );
      case "register":
        return (
          <Register
            onNavigateToLogin={navigateToLogin}
            onNavigateToHome={navigateToHome}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToAdmin={navigateToAdmin}
          />
        );
      case "admin":
        return (
          <AdminOrders
            currentPage={currentPage}
            onNavigateToHome={navigateToHome}
            onNavigateToProducts={navigateToAdminProducts}
            onNavigateToUsers={navigateToUsers}
            onNavigateToRoles={navigateToRoles}
            onNavigateToCategories={navigateToCategories}
            onLogout={handleLogout}
          />
        );
      case "admin-products":
        return (
          <AdminProducts
            currentPage={currentPage}
            onNavigateToHome={navigateToHome}
            onNavigateToOrders={navigateToAdmin}
            onNavigateToUsers={navigateToUsers}
            onNavigateToRoles={navigateToRoles}
            onNavigateToCategories={navigateToCategories}
            onLogout={handleLogout}
          />
        );
      case "admin-users":
        return (
          <AdminUsers
            currentPage={currentPage}
            onNavigateToHome={navigateToHome}
            onNavigateToOrders={navigateToAdmin}
            onNavigateToProducts={navigateToAdminProducts}
            onNavigateToRoles={navigateToRoles}
            onNavigateToCategories={navigateToCategories}
            onLogout={handleLogout}
          />
        );
      case "admin-roles":
        return (
          <AdminRoles
            currentPage={currentPage}
            onNavigateToHome={navigateToHome}
            onNavigateToOrders={navigateToAdmin}
            onNavigateToProducts={navigateToAdminProducts}
            onNavigateToUsers={navigateToUsers}
            onNavigateToCategories={navigateToCategories}
            onLogout={handleLogout}
          />
        );
      case "admin-categories":
        return (
          <AdminCategories
            currentPage={currentPage}
            onNavigateToHome={navigateToHome}
            onNavigateToOrders={navigateToAdmin}
            onNavigateToProducts={navigateToAdminProducts}
            onNavigateToUsers={navigateToUsers}
            onNavigateToRoles={navigateToRoles}
            onNavigateToCategories={navigateToCategories}
            onLogout={handleLogout}
          />
        );
      default:
        return <HomePage onNavigateToProducts={navigateToProducts} />;
    }
  };

  // Check if current page is admin - render without Header/Footer
  if (
    currentPage === "admin" ||
    currentPage === "admin-products" ||
    currentPage === "admin-users" ||
    currentPage === "admin-roles" ||
    currentPage === "admin-categories"
  ) {
    return <div className="App">{renderCurrentPage()}</div>;
  }

  // Normal pages with Header/Footer
  return (
    <div className="App">
      <Header
        currentPage={currentPage}
        user={user}
        onNavigateToHome={navigateToHome}
        onNavigateToProducts={navigateToProducts}
        onNavigateToAbout={navigateToAbout}
        onNavigateToContact={navigateToContact}
        onNavigateToLogin={navigateToLogin}
        onNavigateToOrders={navigateToOrders}
        onNavigateToCart={navigateToCart}
        onNavigateToAdmin={navigateToAdmin}
        onLogout={handleLogout}
      />
      <main className="main-content">{renderCurrentPage()}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;
