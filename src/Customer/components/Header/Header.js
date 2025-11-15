import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/img/logo.png";

import "./Header.css";

const Header = () => {
  const location = useLocation();

  // Lấy thông tin user từ localStorage
  // const user = JSON.parse(localStorage.getItem("user"));
  // const username = user?.username || null;

  const username = "Việt"; 
  // Kiểm tra route active
  const isActive = (path) => location.pathname === path;
  const isProductActive = () => location.pathname.startsWith("/product");

  return (
    <header>
      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        {/* Search */}
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        </div>

        {/* ==== USER ACTIONS ==== */}
        <div className="user-actions">

          {/* Nếu chưa đăng nhập → hiện nút đăng nhập */}
          {!username ? (
            <Link to="/login" className="login-btn">
              Đăng nhập
            </Link>
          ) : (
            /* Nếu đã đăng nhập → hiện avatar + xin chào */
            <Link to="/account" className="user-box">
              <FaUserCircle className="user-icon" />
              <span>Xin chào, <strong>{username}</strong></span>
            </Link>
          )}

          {/* Giỏ hàng */}
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            <span className="cart-count">0</span>
          </Link>
        </div>
      </div>

      {/* ===== BOTTOM MENU ===== */}
      <nav className="bottom-nav">
        <ul>
          <li><Link to="/" className={isActive("/") ? "active" : ""}>Trang chủ</Link></li>
          <li><Link to="/about" className={isActive("/about") ? "active" : ""}>Về chúng tôi</Link></li>

          {/* ===== DROPDOWN SẢN PHẨM ===== */}
          <li className={`dropdown center ${isProductActive() ? "active" : ""}`}>
            <Link to="/product" className="drop-btn">Sản phẩm</Link>

            <div className="mega-menu">
              <div className="column">
                <h4>Xe đạp</h4>
                <Link to="/products/road">Xe đạp đường trường</Link>
                <Link to="/products/mountain">Xe đạp địa hình</Link>
                <Link to="/products/folding">Xe gấp</Link>
              </div>

              <div className="column">
                <h4>Phụ kiện</h4>
                <Link to="/products/helmets">Mũ bảo hiểm</Link>
                <Link to="/products/lights">Đèn xe</Link>
                <Link to="/products/locks">Khóa xe</Link>
              </div>

              <div className="column">
                <h4>Dịch vụ</h4>
                <Link to="/services/maintenance">Bảo dưỡng</Link>
                <Link to="/services/custom">Độ xe</Link>
              </div>
            </div>
          </li>

          <li><Link to="/contact" className={isActive("/contact") ? "active" : ""}>Liên hệ</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
