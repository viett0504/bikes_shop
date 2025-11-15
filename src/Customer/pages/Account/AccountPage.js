import React from "react";
import { Edit2, ShoppingBag, ArrowRight } from "lucide-react";
import "./AccountPage.css";

const AccountPage = () => {
  // TODO: sau này bạn truyền thật từ BE / context vào
  const user = {
    name: "Hi, Name Surname",
    phone: "+1 912 35 456 458",
    email: "ms.sil3103@email.ru",
    address: "Washington street, 45 / 56",
    tier: "Member",
  };

  const hasOrders = false;         // giả lập chưa có đơn
  const orders = [];               // sau này thay bằng dữ liệu thật

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Title */}
        <div className="account-header">
          <div>
            <h1>Hồ sơ khách hàng</h1>
            <p>Quản lý thông tin cá nhân và đơn hàng của bạn</p>
          </div>
          <span className="account-chip">{user.tier}</span>
        </div>

        {/* Layout 2 cột */}
        <div className="account-layout">
          {/* ===== PROFILE CARD ===== */}
          <section className="account-card profile-card">
            <div className="profile-main">
              <div className="profile-avatar">
                <span>NS</span>
              </div>

              <div className="profile-info">
                <div className="profile-name-row">
                  <h2>{user.name}</h2>
                  <button className="icon-button" aria-label="Chỉnh sửa thông tin">
                    <Edit2 size={16} />
                  </button>
                </div>

                <div className="profile-lines">
                  <span>{user.phone}</span>
                  <span>{user.email}</span>
                  <span>{user.address}</span>
                </div>
              </div>
            </div>

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
                <span className="stat-value">{user.tier}</span>
              </div>
            </div>
          </section>

          {/* ===== ORDERS CARD ===== */}
          <section className="account-card orders-card">
            <div className="orders-header">
              <h2>Đơn hàng</h2>
              <p>Xem lịch sử mua hàng và trạng thái đơn</p>
            </div>

            {hasOrders ? (
              <div className="orders-list">
                {/* TODO: thay bằng table danh sách đơn thật */}
                {orders.map((order) => (
                  <div key={order.id} className="order-row">
                    {/* ví dụ mẫu */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="orders-empty">
                <div className="empty-icon">
                  <ShoppingBag size={32} />
                </div>
                <h3>Bạn chưa có đơn hàng nào</h3>
                <p>
                  Khi mua sắm trên hệ thống, tất cả đơn hàng sẽ được hiển thị tại đây
                  để bạn dễ dàng theo dõi.
                </p>
                <button
                  className="primary-button"
                  onClick={() => {
                    // điều hướng sang trang sản phẩm
                    window.location.href = "/product";
                  }}
                >
                  <span>Tiếp tục mua sắm</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
