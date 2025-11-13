import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "../Customer/components/Header/Header";
import HomePage from "../Customer/pages/Home/HomePage";
import ProductPage from "../Customer/pages/Products/ProductPage";
import ProductDetailPage from "../Customer/pages/Products/ProductDetailPage";
import Contact from "../Customer/pages/Contact/Contact";
import About from "../Customer/pages/About/About";
import RegisterPage from "../Customer/pages/Register/RegisterPage";
import LoginPage from "../Customer/pages/Login/Login";

// ⚠️ Import thêm các trang Admin khi có
// import AdminDashboard from "../Admin/pages/Dashboard";
// import AdminProducts from "../Admin/pages/Products";
// ...

// Component bọc logic ẩn Header
function Layout() {
  const location = useLocation();

  // Các route KHÔNG hiển thị Header
  const noHeaderRoutes = ["/register","/login", "/admin", "/admin/dashboard", "/admin/products"];

  // Kiểm tra nếu đường dẫn hiện tại khớp với một route bị loại
  const shouldHideHeader = noHeaderRoutes.some((path) => location.pathname.startsWith(path));

  return (
    <>
      {!shouldHideHeader && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/productDetail" element={<ProductDetailPage />} />

        {/* 🔹 Trang đăng ký */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔹 Admin pages */}
        {/* <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} /> */}
      </Routes>
    </>
  );
}

const AppRouter = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default AppRouter;
