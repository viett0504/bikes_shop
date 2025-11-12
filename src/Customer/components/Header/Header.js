import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../../../assets/img/logo.png";

import "./Header.css";  

const Header = () => {
  const location = useLocation(); // ← LẤY ĐƯỜNG DẪN HIỆN TẠI

  // Hàm kiểm tra xem có đang ở trang này không
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Hàm cho dropdown: kiểm tra xem có trong nhóm /product không
  const isProductActive = () => {
    return location.pathname.startsWith("/product") 
  };
  return (
    <header>
      {/* ===== HÀNG TRÊN ===== */}
      <div className="top-bar">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        {/* Thanh tìm kiếm */}
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        </div>

        {/* Khu vực đăng nhập + giỏ hàng */}
        <div className="user-actions">
          <Link to="/login" className="login-btn">
            Đăng nhập
          </Link>
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            <span className="cart-count">0</span>
          </Link>
        </div>
      </div>

      {/* ===== HÀNG DƯỚI (MENU) ===== */}
      <nav className="bottom-nav">
        <ul>
          <li><Link to="/" className={isActive("/") ? "active" : ""}>Trang chủ</Link></li>
          <li><Link to="/about" className={isActive("/about") ? "active" : ""}>Về chúng tôi</Link></li>

          {/* Dropdown sản phẩm */}
          <li className={`dropdown center ${isProductActive() ? "active" : ""}`}>
            <Link to="/product" className="drop-btn " >Sản phẩm</Link>
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
}

export default Header;

