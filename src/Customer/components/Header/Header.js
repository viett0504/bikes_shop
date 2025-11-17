// src/Client/components/Header/Header.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/img/logo.png";

import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("user"));
  // const username = user?.username || null;
  const username = "Việt";

  const isActive = (path) => location.pathname === path;
  const isProductActive = () => location.pathname.startsWith("/product");

  // ===== DATA MENU BIKES (giống style ảnh) =====
  const productGroups = [
    {
      key: "electric",
      label: "ELECTRIC",
      items: [
        {
          key: "e-mountain",
          name: "E-MOUNTAIN BIKE",
          description: "Explore further, ride stronger with electric MTBs.",
          to: "/products/e-mountain",
          image:
            "https://images.unsplash.com/photo-1593091860788-9369658f47cd?auto=format&fit=crop&w=1200&q=80",
        },
        {
          key: "e-commuter",
          name: "E-COMMUTER",
          description: "Electric urban bikes for everyday commuting.",
          to: "/products/e-commuter",
          image:
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        },
        {
          key: "e-gravel",
          name: "E-GRAVEL",
          description: "Electric gravel bikes for speed and versatility.",
          to: "/products/e-gravel",
          image:
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
        },
        {
          key: "e-road",
          name: "E-ROAD",
          description: "Electric road bikes built for power and precision.",
          to: "/products/e-road",
          image:
            "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    },
    {
      key: "mountain",
      label: "MOUNTAIN",
      items: [
        {
          key: "trail",
          name: "TRAIL BIKE",
          description: "Versatile trail bikes for mixed terrain.",
          to: "/products/trail",
          image:
            "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80",
        },
        {
          key: "enduro",
          name: "ENDURO BIKE",
          description: "Long-travel bikes for aggressive descents.",
          to: "/products/enduro",
          image:
            "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    },
    {
      key: "gravel",
      label: "GRAVEL",
      items: [
        {
          key: "all-road",
          name: "ALL-ROAD",
          description: "Fast on tarmac, confident on gravel.",
          to: "/products/all-road",
          image:
            "https://images.unsplash.com/photo-1541622783521-4c1c67c90ff2?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    },
    {
      key: "road",
      label: "ROAD",
      items: [
        {
          key: "race",
          name: "RACE BIKE",
          description: "Ultra-lightweight bikes built for pure speed.",
          to: "/products/race",
          image:
            "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    },
    {
      key: "city",
      label: "CITY & HYBRID",
      items: [
        {
          key: "city-bike",
          name: "CITY BIKE",
          description: "Comfortable bikes for everyday city riding.",
          to: "/products/city",
          image:
            "https://images.unsplash.com/photo-1529424301806-4be0bb154e3b?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    },
    {
      key: "kids",
      label: "KIDS",
      items: [
        {
          key: "kids",
          name: "KIDS BIKES",
          description: "Safe and colorful bikes for young riders.",
          to: "/products/kids",
          image:
            "https://images.unsplash.com/photo-1529424301806-4be0bb154e3b?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    },
  ];

  const [activeGroupKey, setActiveGroupKey] = useState(productGroups[0].key);
  const activeGroup =
    productGroups.find((g) => g.key === activeGroupKey) || productGroups[0];

  // ===== DROPDOWN USER =====
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Xóa thông tin user (tuỳ bạn lưu gì)
    localStorage.removeItem("user");
    setIsUserMenuOpen(false);
    navigate("/login");
  };

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
          {!username ? (
            <Link to="/login" className="login-btn">
              Đăng nhập
            </Link>
          ) : (
            <div className="user-menu-wrapper">
              <button
                type="button"
                className="user-box"
                onClick={handleToggleUserMenu}
              >
                <FaUserCircle className="user-icon" />
                <span>
                  Xin chào, <strong>{username}</strong>
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link
                    to="/account"
                    className="user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>

                  <Link
                    to="/admin"
                    className="user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Trang admin
                  </Link>

                  <button
                    type="button"
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
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
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive("/about") ? "active" : ""}>
              Về chúng tôi
            </Link>
          </li>

          {/* ===== DROPDOWN SẢN PHẨM GIỐNG ẢNH ===== */}
          <li
            className={`dropdown center ${
              isProductActive() ? "active" : ""
            }`}
          >
            <Link to="/product" className="drop-btn">
              Sản phẩm
            </Link>

            <div className="mega-menu">
              {/* Cột trái: sidebar category */}
              <div className="column">
                <h4>Danh mục</h4>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {productGroups.map((g) => (
                    <li
                      key={g.key}
                      onMouseEnter={() => setActiveGroupKey(g.key)}
                      className={
                        g.key === activeGroup.key ? "active" : ""
                      }
                    >
                      <span>{g.label}</span>
                      <span>{">"}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cột phải: hàng card xe */}
              <div className="column">
                <div className="product-row">
                  {activeGroup.items.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      className="product-card"
                    >
                      <img src={item.image} alt={item.name} />
                      <div className="product-card-title">
                        {item.name}
                      </div>
                      <div className="product-card-desc">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </li>

          <li>
            <Link
              to="/contact"
              className={isActive("/contact") ? "active" : ""}
            >
              Liên hệ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
