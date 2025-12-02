// src/Admin/componentsAD/Topbar.js
import { getCurrentUser } from "./fetchApi";

export default function Topbar({ onToggleSidebar }) {
  const user = getCurrentUser();

  // Nếu chưa có user (chưa login) thì vẫn hiển thị 1 cái gì đó
  if (!user) {
    return (
      <header className="ad-topbar">
        <div>Chưa đăng nhập</div>
        <div className="ad-muted" style={{ fontSize: 14 }}>
          Vui lòng đăng nhập
        </div>
      </header>
    );
  }

  return (
    <header className="ad-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Nút menu trên mobile */}
        <button className="ad-menu-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <div>{user.name}</div>
      </div>
      <div className="ad-muted" style={{ fontSize: 14 }}>
        {user.email} · {user.roleLabel}
      </div>
    </header>
  );
}
