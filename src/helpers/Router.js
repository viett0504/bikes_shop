import React from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";

// ---------- CUSTOMER ----------
import Header from "../Customer/components/Header/Header";
import HomePage from "../Customer/pages/Home/HomePage";
import ProductPage from "../Customer/pages/Products/ProductPage";
import ProductDetailPage from "../Customer/pages/Products/ProductDetailPage";
import Contact from "../Customer/pages/Contact/Contact";
import About from "../Customer/pages/About/About";
import RegisterPage from "../Customer/pages/Register/RegisterPage";
import LoginPage from "../Customer/pages/Login/Login";
import ForgotPasswordPage from "../Customer/pages/Login/ForgotPassword";

// ---------- ADMIN ----------
import AdminLayout from "../Admin/componentsAD/AdminLayout";
import Dashboard from "../Admin/pagesAD/Dashboard/Dashboard";
import Orders from "../Admin/pagesAD/Orders";
import Products from "../Admin/pagesAD/Products";
import Categories from "../Admin/pagesAD/Categories";   
import AccountPage from "../Customer/pages/Account/AccountPage";
import Account from "../Admin/pagesAD/Account";
import Banner from "../Admin/pagesAD/Banner";
import BikeTypes from "../Admin/pagesAD/BikeType";
import Footer from "../Customer/components/Footer/Footer";
import ShoppingCart from "../Customer/pages/Cart/Cart";
import { CartProvider } from "../utils/cart";

import "../App.css";
import PaymentPage from "../Customer/pages/Payment/PaymentPage";
import ChangePassword from "../Customer/pages/Account/ChangePassword";
import ThirdPartyCollector from "../Customer/pages/Login/ThirdPartyCollector";


function CustomerShell() {
  const { pathname } = useLocation();
  
  const hideHeaderPaths = ["/login", "/register", "/admin"];
  const hideFooterPaths = ["/login", "/register", "/admin"];

  const shouldShowHeader = !hideHeaderPaths.includes(pathname);
  const shouldShowFooter = !hideFooterPaths.includes(pathname);

  return (
    <div className="customer-scope">
      {/* Header */}
      {shouldShowHeader && <Header />}

      {/* Nội dung */}
      <main className="customer-main">
        <Outlet />
      </main>

      {/* Footer */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function AdminProtectedRoute() {
  const location = useLocation();

  let storedUser = null;
  try {
    const str = localStorage.getItem("user");
    storedUser = str ? JSON.parse(str) : null;
  } catch (e) {
    storedUser = null;
  }

  const token = localStorage.getItem("token");
  const role = storedUser?.role ?? null;

  // Chưa đăng nhập → đá về /login
  if (!token || !storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Khách hàng (role = 0) → không cho vào admin, đá về trang chủ
  if (role === 0) {
    return <Navigate to="/" replace />;
  }

  // Nhân viên / Admin → cho vào layout admin
  return <AdminLayout />;
}


export default function AppRouter() {
  return (
    <CartProvider>
    <BrowserRouter>
      <Routes>
        {/* -------- CUSTOMER -------- */}
        <Route element={<CustomerShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AccountPage   />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/productDetail/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/account/change-password" element={<ChangePassword />} />

        </Route>

        {/* -------- Login -------- */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/collector" element={<ThirdPartyCollector />} />


        {/* -------- ADMIN -------- */}
        <Route path="/admin/*" element={<AdminProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} /> 
          <Route path="accounts" element={<Account />} /> 
          <Route path="banners" element={<Banner />} /> 
          <Route path="bikeTypes" element={<BikeTypes />} /> 
        </Route>


        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 16 }}>404 – Not found</div>} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}
