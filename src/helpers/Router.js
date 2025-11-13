import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// ---------- CUSTOMER ----------
import Header from "../Customer/components/Header/Header";
import HomePage from "../Customer/pages/Home/HomePage";
import ProductPage from "../Customer/pages/Products/ProductPage";
import ProductDetailPage from "../Customer/pages/Products/ProductDetailPage";
import Contact from "../Customer/pages/Contact/Contact";
import About from "../Customer/pages/About/About";

// ---------- ADMIN ----------
import AdminLayout from "../Admin/componentsAD/AdminLayout";
import Dashboard from "../Admin/pagesAD/Dashboard/Dashboard";
import Orders from "../Admin/pagesAD/Orders";
import Products from "../Admin/pagesAD/Products";
import Categories from "../Admin/pagesAD/Categories";   // <-- THÊM DÒNG NÀY

function CustomerShell() {
  return (
    <>
      <Header />
      <Outlet />
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/productDetail" element={<ProductDetailPage />} />
        </Route>

        {/* -------- ADMIN -------- */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} /> {/* <-- THÊM ROUTE */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 16 }}>404 – Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
