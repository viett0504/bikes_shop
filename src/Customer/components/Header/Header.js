// src/Client/components/Header/Header.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "../../../assets/img/logo.png";
import { useCart } from "../../../utils/cart";

import ImgWait1 from "../../../assets/img/ImgWait_1.jpg";
import ImgWait2 from "../../../assets/img/ImgWait_2.jpg";
import ImgWait3 from "../../../assets/img/ImgWait_3.jpg";
import ImgWait4 from "../../../assets/img/ImgWait_4.jpg";

import {
  getAllProduct,
  getAllBikeTypes,
  getAllCategories,
  getProductsByBikeType,
  getProductsByCategory,
} from '../Product/fetchApi';

import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // ===== SEARCH STATE (FE) =====
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Lỗi parse user từ localStorage", e);
      return null;
    }
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = !!token && !!currentUser;

  const username =
    currentUser?.name || currentUser?.email?.split("@")[0] || "Người dùng";

  const userRole = currentUser?.userRole ?? currentUser?.role ?? null;

  const isActive = (path) => location.pathname === path;
  const isProductActive = () => location.pathname.startsWith("/product");

  // ===== STATE từ BE =====
  const [bikeTypes, setBikeTypes] = useState([]);
  const [brands, setBrands] = useState([]);

  // context đang hover trong mega menu
  const [activeContext, setActiveContext] = useState(null); // {mode: 'type'|'brand', id, name}
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  // dropdown user
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- helper đổi ảnh IPFS/Filebase ---
  const getImageSrc = (img) => {
    if (!img) return "https://placehold.co/400x300?text=No+Image";

    if (img.startsWith("http")) {
      const idx = img.indexOf("filebase.io/ipfs/");
      if (idx !== -1) {
        const cid = img.substring(idx + "filebase.io/ipfs/".length);
        return `https://ipfs.filebase.io/ipfs/${cid}`;
      }
      return img;
    }

    if (img.startsWith("Qm")) {
      return `https://ipfs.filebase.io/ipfs/${img}`;
    }

    return img;
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "";
    return Number(price).toLocaleString("vi-VN") + " ₫";
  };

  // ====== load tất cả sản phẩm cho search FE ======
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const list = await getAllProduct();
        setAllProducts(list || []);
      } catch (err) {
        console.error("Lỗi load allProduct cho search:", err);
      }
    };
    loadAllProducts();
  }, []);

  // ====== load Loại xe & Thương hiệu ======
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [types, cats] = await Promise.all([
          getAllBikeTypes(),
          getAllCategories(),
        ]);
        setBikeTypes(types || []);
        setBrands(cats || []);
      } catch (err) {
        console.error("Lỗi load bikeTypes / categories cho Header:", err);
      }
    };
    fetchFilters();
  }, []);

  // Lọc chỉ những loại/brand Active
  const activeBikeTypes = useMemo(
    () => bikeTypes.filter((t) => t.tStatus === "Active"),
    [bikeTypes]
  );

  const activeBrands = useMemo(
    () => brands.filter((c) => c.cStatus === "Active"),
    [brands]
  );

  // ====== khi hover 1 item bên trái → load 3 sản phẩm nổi bật ======
  useEffect(() => {
    const loadFeatured = async () => {
      if (!activeContext || !activeContext.id) {
        setFeaturedProducts([]);
        return;
      }

      try {
        setLoadingFeatured(true);
        let data = [];

        if (activeContext.mode === "type") {
          data = await getProductsByBikeType(activeContext.id, 3);
        } else if (activeContext.mode === "brand") {
          data = await getProductsByCategory(activeContext.id, 3);
        }

        const mapped = (data || []).map((p) => {
          const price = p.pPrice || 0;
          const offer = Number(p.pOffer || 0);
          const finalPrice = offer
            ? Math.round((price * (100 - offer)) / 100)
            : price;

          return {
            id: p._id,
            name: p.pName,
            brand: p.pCategory?.cName || "Không rõ",
            description: p.pDescription?.slice(0, 80) + "...",
            image: getImageSrc(p.pImages?.[0]),
            price: finalPrice,
          };
        });

        setFeaturedProducts(mapped);
      } catch (err) {
        console.error("Lỗi load featuredProducts:", err);
        setFeaturedProducts([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeatured();
  }, [activeContext]);

  // ====== FILTER SEARCH RESULT FE ======
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      return;
    }

    const matched = allProducts.filter((p) =>
      (p.pName || "").toLowerCase().includes(term)
    );

    setSearchResults(matched);
  }, [searchTerm, allProducts]);

  // ====== CLICK OUTSIDE ĐỂ ĐÓNG DROPDOWN ======
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  // ====== SUBMIT TÌM KIẾM (FE ONLY) ======
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    navigate(`/product?search=${encodeURIComponent(query)}`);
    setShowDropdown(false);
  };

  const handleSelectProduct = (id) => {
    setShowDropdown(false);
    setSearchTerm("");
    navigate(`/productDetail/${id}`);
  };

  const handleViewAllResults = () => {
    const query = searchTerm.trim();
    if (!query) return;
    setShowDropdown(false);
    navigate(`/product?search=${encodeURIComponent(query)}`);
  };

  return (
    <header>
      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        {/* Nút Hamburger cho Mobile */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FaBars />
        </button>

        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className="search-bar" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchTerm.trim()) setShowDropdown(true);
              }}
            />
          </form>

          {/* DROPDOWN GỢI Ý SẢN PHẨM */}
          {showDropdown && searchTerm.trim() && (
            <div className="search-dropdown">
              {searchResults.length === 0 ? (
                <div className="search-dropdown-empty">
                  Không tìm thấy sản phẩm phù hợp
                </div>
              ) : (
                <>
                  <div className="search-dropdown-header">
                    Sản phẩm gợi ý
                  </div>
                  <ul className="search-dropdown-list">
                    {searchResults.slice(0, 8).map((p) => (
                      <li
                        key={p._id}
                        className="search-dropdown-item"
                        onClick={() => handleSelectProduct(p._id)}
                      >
                        <div className="search-dropdown-thumb">
                          <img
                            src={getImageSrc(p.pImages?.[0])}
                            alt={p.pName}
                          />
                        </div>
                        <div className="search-dropdown-info">
                          <div className="search-dropdown-name">
                            {p.pName}
                          </div>
                          <div className="search-dropdown-meta">
                            <span className="search-dropdown-price">
                              {formatPrice(p.pPrice)}
                            </span>
                            {p.pCategory?.cName && (
                              <span className="search-dropdown-category">
                                {p.pCategory.cName}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="search-dropdown-view-all"
                    onClick={handleViewAllResults}
                  >
                    Xem tất cả kết quả cho “{searchTerm.trim()}”
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="user-actions">
          {!isLoggedIn ? (
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
                <span className="user-name-text">
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

                  {userRole !== 0 && userRole != null && (
                    <Link
                      to="/admin/dashboard"
                      className="user-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Trang admin
                    </Link>
                  )}

                  <Link
                    to="/account/change-password"
                    className="user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Đổi mật khẩu
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

          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ===== BOTTOM MENU (DESKTOP) ===== */}
      <nav className="bottom-nav desktop-only">
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

          {/* ===== MENU SẢN PHẨM ===== */}
          <li
            className={`dropdown center ${isProductActive() ? "active" : ""}`}
          >
            <Link to="/product" className="drop-btn">
              Sản phẩm
            </Link>

            <div
              className="mega-menu"
              onMouseLeave={() => {
                setActiveContext(null);
                setFeaturedProducts([]);
              }}
            >
              {/* CỘT TRÁI: LOẠI XE + THƯƠNG HIỆU */}
              <div className="column">
                {/* LOẠI XE */}
                <div className="side-group">
                  <h4>LOẠI XE</h4>
                  <ul>
                    {activeBikeTypes.map((t) => (
                      <li
                        key={t._id}
                        onMouseEnter={() =>
                          setActiveContext({
                            mode: "type",
                            id: t._id,
                            name: t.tName,
                          })
                        }
                      >
                        <span>{t.tName}</span>
                        <span>{">"}</span>
                      </li>
                    ))}
                    {activeBikeTypes.length === 0 && (
                      <li>
                        <span>Chưa có loại xe Active</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* THƯƠNG HIỆU */}
                <div className="side-group">
                  <h4>THƯƠNG HIỆU</h4>
                  <ul>
                    {activeBrands.map((c) => (
                      <li
                        key={c._id}
                        onMouseEnter={() =>
                          setActiveContext({
                            mode: "brand",
                            id: c._id,
                            name: c.cName,
                          })
                        }
                      >
                        <span>{c.cName}</span>
                        <span>{">"}</span>
                      </li>
                    ))}
                    {activeBrands.length === 0 && (
                      <li>
                        <span>Chưa có thương hiệu Active</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* CỘT PHẢI: 3 SẢN PHẨM NỔI BẬT */}
              <div className="column">
                <div className="product-row">
                  {loadingFeatured && (
                    <div className="placeholder-text">
                      <p>Đang tải sản phẩm...</p>
                    </div>
                  )}

                  {!loadingFeatured && featuredProducts.length === 0 && (
                    <div className="wait-grid">
                      <div className="wait-item">
                        <img src={ImgWait1} alt="Hình chờ sản phẩm 1" />
                      </div>
                      <div className="wait-item">
                        <img src={ImgWait2} alt="Hình chờ sản phẩm 2" />
                      </div>
                      <div className="wait-item">
                        <img src={ImgWait3} alt="Hình chờ sản phẩm 3" />
                      </div>
                      <div className="wait-item">
                        <img src={ImgWait4} alt="Hình chờ sản phẩm 4" />
                      </div>
                    </div>
                  )}

                  {!loadingFeatured &&
                    featuredProducts.map((item) => (
                      <Link
                        key={item.id}
                        to={`/productDetail/${item.id}`}
                        className="product-card"
                      >
                        <img src={item.image} alt={item.name} />
                        <div className="product-card-title">{item.name}</div>
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

      {/* ===== MOBILE MENU DRAWER ===== */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="mobile-menu-content">
          <Link
            to="/"
            className="mobile-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trang chủ
          </Link>
          <Link
            to="/product"
            className="mobile-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sản phẩm
          </Link>
          <Link
            to="/about"
            className="mobile-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Về chúng tôi
          </Link>
          <Link
            to="/contact"
            className="mobile-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Liên hệ
          </Link>

          <div className="mobile-divider"></div>

          {/* LOẠI XE */}
          <div className="mobile-section-title">Loại xe</div>
          {activeBikeTypes.length === 0 && (
            <div className="mobile-sub-link">Chưa có loại xe</div>
          )}
          {activeBikeTypes.map((t) => (
            <Link
              key={t._id}
              to={`/product?type=${t._id}`}
              className="mobile-sub-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.tName}
            </Link>
          ))}

          {/* THƯƠNG HIỆU */}
          <div className="mobile-section-title" style={{ marginTop: 8 }}>
            Thương hiệu
          </div>
          {activeBrands.length === 0 && (
            <div className="mobile-sub-link">Chưa có thương hiệu</div>
          )}
          {activeBrands.map((c) => (
            <Link
              key={c._id}
              to={`/product?brand=${c._id}`}
              className="mobile-sub-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {c.cName}
            </Link>
          ))}
        </div>

      </div>
    </header>
  );
};

export default Header;
