import React from "react";
import "./PaymentPage.css";
import { Link, useLocation } from "react-router-dom";
import qrDemo from "../../../assets/img/qr.jpg";

export default function PaymentPage() {
  const location = useLocation();
  const data = location.state || {};

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1 className="payment-title">Thanh Toán Đơn Hàng</h1>
        <p className="payment-subtitle">
          Quét mã QR để hoàn tất thanh toán
        </p>

        {/* QR Code */}
        <div className="qr-wrapper">
          <img
            src={
              data.qr || qrDemo
            }
            alt="QR Code"
            className="qr-image"
          />
        </div>

        {/* Order Info */}
        <div className="payment-info">
          <p><strong>Mã đơn hàng:</strong> {data.orderId || "Đang xử lý..."}</p>
          <p><strong>Số tiền:</strong> {data.total || "0 đ"}</p>
          <p><strong>Hình thức:</strong> QR Banking</p>
        </div>

        {/* Buttons */}
        <div className="payment-buttons">
          <Link to="/" className="btn-home">← Về trang chủ</Link>
          <Link to="/account" className="btn-orders">Xem đơn hàng →</Link>
        </div>
      </div>
    </div>
  );
}
