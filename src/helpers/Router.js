import React from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";

// ---------- CUSTOMER ----------
import Header from "../Customer/components/Header/Header";
import HomePage from "../Customer/pages/Home/HomePage";
import ProductPage from "../Customer/pages/Products/ProductPage";
import ProductDetailPage from "../Customer/pages/Products/ProductDetailPage";
import Contact from "../Customer/pages/Contact/Contact";
import About from "../Customer/pages/About/About";
import RegisterPage from "../Customer/pages/Register/RegisterPage";
import LoginPage from "../Customer/pages/Login/Login";

// ---------- ADMIN ----------
import AdminLayout from "../Admin/componentsAD/AdminLayout";
import Dashboard from "../Admin/pagesAD/Dashboard/Dashboard";
import Orders from "../Admin/pagesAD/Orders";
import Products from "../Admin/pagesAD/Products";
import Categories from "../Admin/pagesAD/Categories";   // <-- THÊM DÒNG NÀY
import AccountPage from "../Customer/pages/Account/AccountPage";
import Account from "../Admin/pagesAD/Account";
import Banner from "../Admin/pagesAD/Banner";

function CustomerShell() {
  const { pathname } = useLocation();
  const hideHeaderPaths = ["/login", "/register", "/admin", "/account"];

  const shouldShowHeader = !hideHeaderPaths.includes(pathname);
  return (
    <>
      <div className="customer-scope">
      {shouldShowHeader && <Header />}
      <Outlet />
    </div>

    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- CUSTOMER -------- */}
        <Route element={<CustomerShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AccountPage   />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/productDetail" element={<ProductDetailPage />} />
        </Route>

                {/* -------- Login -------- */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* -------- ADMIN -------- */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} /> 
          <Route path="accounts" element={<Account />} /> 
          <Route path="banners" element={<Banner />} /> 
        </Route>

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 16 }}>404 – Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
