// src/Admin/componentsAD/Sidebar.js
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "./fetchApi";

export default function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const user = getCurrentUser();

  // Mặc định: không có user => không phải admin
  const role = user?.role ?? 0;     // 0: Khách, 1: Nhân viên, 2: Admin
  const isAdmin = role === 2;
  // const isStaff = role === 1; // dùng nếu sau này cần xử lý thêm cho nhân viên

  const Item = ({ to, label }) => (
    <Link
      className={`ad-link ${pathname.startsWith(to) ? "active" : ""}`}
      to={to}
      onClick={() => {
        // Trên mobile, click link thì đóng sidebar
        if (window.innerWidth < 1024 && onClose) onClose();
      }}
    >
      {label}
    </Link>
  );

  return (
    <aside className={`ad-sidebar ${isOpen ? "open" : ""}`}>
      <div className="ad-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Trang quản lý</span>
        {/* Nút đóng sidebar trên mobile */}
        <button className="ad-close-sidebar-btn" onClick={onClose}>
          ✕
        </button>
      </div>
      <nav>
        <Item to="/admin/dashboard" label="Tổng quan" />
        <Item to="/admin/products" label="Sản phẩm" />
        <Item to="/admin/orders" label="Đơn hàng" />
        <Item to="/admin/categories" label="Thương hiệu" />
        <Item to="/admin/bikeTypes" label="Loại sản phẩm" />

        {/* Chỉ Admin mới thấy tab Tài khoản */}
        {isAdmin && <Item to="/admin/accounts" label="Tài khoản" />}

        <Item to="/admin/banners" label="Banner" />
      </nav>

      <div className="ad-sidebar-bottom-actions">
        <Link className="ad-link return-btn" to="/">
          ← Quay lại Trang sản phẩm
        </Link>
      </div>
    </aside>
  );
}
