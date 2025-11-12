import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../Customer/components/Header/Header";
import HomePage from "../Customer/pages/Home/HomePage";
import ProductPage from "../Customer/pages/Products/ProductPage";
import ProductDetailPage from "../Customer/pages/Products/ProductDetailPage";
import Contact from "../Customer/pages/Contact/Contact";
import About from "../Customer/pages/About/About";

// ⚠️ Import thêm các trang khác khi bạn tạo chúng:

const AppRouter = () => {
  return (
    <Router>
      {/* Header xuất hiện ở mọi trang */}
      <Header />

      {/* Vùng hiển thị nội dung từng trang */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
         <Route path="/product" element={<ProductPage />} />
         <Route path="/productDetail" element={<ProductDetailPage />} />
        
      </Routes>
    </Router>
  );
};

export default AppRouter;
