// src/Customer/pages/Account/AccountPage.jsx
import React, { useEffect, useState } from "react";
import { Edit2, ShoppingBag, ArrowRight, Camera } from "lucide-react";
import "./AccountPage.css";

import { editUser, } from "../../../Admin/pagesAD/Account/FetchApi";
import { getOrdersByUser, updateOrderStatus } from "../../../Admin/pagesAD/Orders/FetchApi"; 
import { getAvatarSrc } from "./fetchApi";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const isPaidOrder = (order) => {
    if (!order) return false;

    // ✅ Backend trả về payStatus: "Chưa thanh toán" | "Đã thanh toán"
    const rawPayStatus = order.payStatus;

    const payRaw =
      rawPayStatus ??
      order.paymentStatus ??
      order.isPaid ??
      order.paid ??
      order.payment ??
      order.thanhtoan;

    const payStr =
      typeof payRaw === "string" ? payRaw.toLowerCase().trim() : "";

    const isPaid =
      payRaw === true ||
      payRaw === 1 ||
      payRaw === "1" ||
      payStr === "đã thanh toán" ||
      payStr === "da thanh toan" ||
      payStr.includes("đã thanh toán") ||
      payStr.includes("da thanh toan");

    const statusText = (
      order.status ||
      order.statusOrder ||
      order.orderStatus ||
      ""
    )
      .toLowerCase()
      .trim();

    const isCancelled =
      statusText.includes("hủy") ||
      statusText.includes("huy") ||
      statusText.includes("cancel");

    return isPaid && !isCancelled;
  };

// Lấy tổng tiền 1 đơn 
const getOrderTotal = (order) => {
  if (!order) return 0;
  const candidates = [
    order.totalPrice,
    order.totalAmount,
    order.amount,
    order.finalAmount,
    order.total,
    order.tongTien,
  ];
  for (const v of candidates) {
    const num = Number(v);
    if (!Number.isNaN(num)) return num;
  }
  return 0;
};


  // ===== ĐƠN HÀNG CỦA USER =====
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // format tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  // Tổng số đơn + tổng tiền đã chi
  const totalOrders = orders?.length || 0;

  const totalSpent = (orders || []).reduce(
    (sum, order) => (isPaidOrder(order) ? sum + getOrderTotal(order) : sum),
    0
  );


  // Lấy user từ localStorage + fetch đơn hàng
  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) return;

        const parsed = JSON.parse(stored);
        setUser(parsed);

        setForm({
          name: parsed.name || "",
          phoneNumber: parsed.phoneNumber || "",
        });

        const avatarUrl = parsed.userImage || parsed.image || null;
        setAvatarPreview(avatarUrl);

        // gọi API lấy đơn của user
        if (parsed._id) {
          setLoadingOrders(true);
          const userOrders = await getOrdersByUser(parsed._id);
          setOrders(userOrders);
          setLoadingOrders(false);
        }
      } catch (e) {
        console.error("Lỗi parse user từ localStorage", e);
        setUser(null);
        setOrders([]);
      }
    };

    init();
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

  const roleNum = user.userRole ?? user.role ?? 0;

  const tier =
    roleNum === 2
      ? "Quản lý"
      : roleNum === 1
      ? "Nhân viên"
      : "Khách hàng";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setIsEditing(true); // mở luôn form sửa
  };

  const handleCancelEdit = () => {
    setForm({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
    });

    const avatarUrl = user.userImage || user.image || null;
    setAvatarPreview(avatarUrl);
    setAvatarFile(null);

    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      alert("Không tìm thấy ID người dùng.");
      return;
    }

    const roleNum = user.userRole ?? user.role ?? 0;
    const positionLabel =
      roleNum === 2
        ? "Quản lý"
        : roleNum === 1
        ? "Nhân viên"
        : "Khách hàng";

    const payload = {
      uId: user._id,
      name: form.name.trim() || user.name,
      email: user.email,
      phoneNumber: form.phoneNumber.trim(),
      position: positionLabel,
      password: "",
      imageFile: avatarFile || null,
    };

    try {
      setSaving(true);
      const res = await editUser(payload);

      if (res?.error || res?.success === false) {
        console.error("editUser error:", res);
        alert(res?.message || res?.error || "Cập nhật thông tin thất bại!");
        return;
      }

      const updatedFromServer = res?.user;

      const updatedUser = updatedFromServer || {
        ...user,
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        userImage: user.userImage,
      };

      setUser(updatedUser);

      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Lỗi lưu user vào localStorage:", err);
      }

      const newAvatarUrl =
        updatedUser.userImage || updatedUser.image || avatarPreview;
      setAvatarPreview(newAvatarUrl);

      alert("Cập nhật thông tin thành công!");
      setAvatarFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi gọi editUser:", err);
      alert("Có lỗi xảy ra khi cập nhật thông tin.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async (orderId, currentStatus) => {
    if (
      currentStatus === "Giao hàng" ||
      currentStatus === "Đã giao" ||
      currentStatus === "Đơn hàng đã bị hủy"
    ) {
      alert("Đơn này đã được xử lý, không thể hủy.");
      return;
    }

    if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;

    const res = await updateOrderStatus({
      oId: orderId,
      status: "Đơn hàng đã bị hủy",
      cancelBy: "user",
    });

    if (res?.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Đơn hàng đã bị hủy" } : o
        )
      );
      alert("Hủy đơn hàng thành công.");
    } else {
      alert(res?.message || res?.error || "Hủy đơn thất bại.");
    }
  };


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
                {avatarPreview || user.userImage || user.image ? (
                  <img
                    src={getAvatarSrc(avatarPreview || user.userImage || user.image)}
                    alt={user.name}
                  />
                ) : (
                  <span>{avatarText}</span>
                )}

                <label className="avatar-edit-btn">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    hidden
                  />
                  <Camera size={14} />
                </label>
              </div>


              <div className="profile-info">
                <div className="profile-name-row">
                  <h2>{user.name}</h2>
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                <div className="profile-lines">
                  <span>{user.phoneNumber || "Chưa có số điện thoại"}</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Form sửa thông tin */}
            {isEditing && (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <div className="form-row">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                  />
                </div>

                <div className="form-row">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="edit-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            )}

            {/* Stats */}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-label">Tổng đơn hàng</span>
                <span className="stat-value">{totalOrders}</span>
              </div>
              <div className="profile-stat">
                <span className="stat-label">Đã chi tiêu</span>
                <span className="stat-value">{totalSpent.toLocaleString("vi-VN")} ₫</span>
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
              <h2>Đơn hàng của bạn</h2>
              <p>Xem lịch sử mua hàng và trạng thái đơn</p>
            </div>

            {loadingOrders ? (
              <p style={{ marginTop: "1rem" }}>Đang tải đơn hàng…</p>
            ) : orders.length === 0 ? (
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
            ) : (
              <div className="order-list">
                {orders.map((o) => (
                  <div className="order-row" key={o._id}>
                    <div className="order-row-main">
                      <div className="order-id">#{o._id}</div>
                      <div className="order-date">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleString("vi-VN")
                          : "—"}
                      </div>
                    </div>
                    <div className="order-row-meta">
                      <span className="order-status">
                        {o.status || "Chưa xử lý"}
                      </span>

                      {/* ✅ hiển thị trạng thái thanh toán */}
                      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {o.payStatus || "Chưa thanh toán"}
                      </span>

                      <span className="order-amount">
                        {formatPrice(o.amount)}
                      </span>

                      {(o.status === "Chưa xử lý" || o.status === "Xác nhận") && (
                        <button
                          className="btn-secondary"
                          style={{ marginTop: 4 }}
                          type="button"
                          onClick={() => handleCancelOrder(o._id, o.status)}
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
