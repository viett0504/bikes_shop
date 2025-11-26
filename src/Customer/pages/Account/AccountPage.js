import React, { useEffect, useState } from "react";
import { Edit2, ShoppingBag, ArrowRight } from "lucide-react";
import "./AccountPage.css";

export default function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error("Lỗi parse user từ localStorage", e);
      setUser(null);
    }
  }, []);

  if (!user) {
    return (
      <div className="account-page">
        <div className="account-container">
          <h2 style={{ marginTop: "2rem" }}>
            Bạn cần đăng nhập để xem thông tin tài khoản.
          </h2>
        </div>
      </div>
    );
  }

  const avatarText =
    user.name?.split(" ")?.slice(-1)[0]?.substring(0, 2).toUpperCase() ||
    user.email?.substring(0, 2).toUpperCase();

  const tier =
    user.role === 2
      ? "Quản lý"
      : user.role === 1
      ? "Nhân viên"
      : "Khách hàng";

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Header */}
        <div className="account-header">
          <div>
            <h1>Hồ sơ khách hàng</h1>
            <p>Quản lý thông tin cá nhân và đơn hàng của bạn</p>
          </div>
          <span className="account-chip">{tier}</span>
        </div>

        <div className="account-layout">
          {/* ===== PROFILE CARD ===== */}
          <section className="account-card profile-card">
            <div className="profile-main">
              <div className="profile-avatar">
                <span>{avatarText}</span>
              </div>

              <div className="profile-info">
                <div className="profile-name-row">
                  <h2>{user.name}</h2>
                  <button className="icon-button">
                    <Edit2 size={16} />
                  </button>
                </div>

                <div className="profile-lines">
                  <span>{user.phoneNumber || "Chưa có số điện thoại"}</span>
                  <span>{user.email}</span>
                  <span>{user.address || "Chưa có địa chỉ"}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-label">Tổng đơn hàng</span>
                <span className="stat-value">0</span>
              </div>
              <div className="profile-stat">
                <span className="stat-label">Đã chi tiêu</span>
                <span className="stat-value">0₫</span>
              </div>
              <div className="profile-stat">
                <span className="stat-label">Hạng thành viên</span>
                <span className="stat-value">{tier}</span>
              </div>
            </div>
          </section>

          {/* ===== ORDERS ===== */}
          <section className="account-card orders-card">
            <div className="orders-header">
              <h2>Đơn hàng</h2>
              <p>Xem lịch sử mua hàng và trạng thái đơn</p>
            </div>

            <div className="orders-empty">
              <div className="empty-icon">
                <ShoppingBag size={32} />
              </div>
              <h3>Bạn chưa có đơn hàng nào</h3>
              <p>
                Khi mua sắm trên hệ thống, tất cả đơn hàng sẽ được hiển thị tại
                đây.
              </p>

              <button
                className="primary-button"
                onClick={() => (window.location.href = "/product")}
              >
                <span>Tiếp tục mua sắm</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
