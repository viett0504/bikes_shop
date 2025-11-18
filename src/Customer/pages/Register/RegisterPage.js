import React from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  return (
    <>
      <div className="register-root">
        <div className="register-card">

          {/* Left visual */}
          <div className="visual">
            <div className="brand">BIKES</div>
            <img
              src="https://unsplash.com/photos/s6DiDMLK0jk/download?force=true&w=1800"
              alt="Sneakers on snow"
            />
          </div>

          {/* Right form */}
          <div className="form">
            <h1 className="title">Đăng ký</h1>
            <p className="subtitle">Đăng ký bằng</p>

            {/* Social */}
            <div className="socials">
              <button className="social-btn">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              </button>
              <button className="social-btn">
                <img src="https://www.svgrepo.com/show/452210/apple.svg" alt="Apple" />
              </button>
              <button className="social-btn">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
              </button>
            </div>

            <div className="or">HOẶC</div>

            {/* Name */}
            <div className="field-group">
              <label className="section-label">Tên của bạn</label>
              <div className="grid-2">
                <input className="input" placeholder="Họ" />
                <input className="input" placeholder="Tên" />
              </div>
            </div>

            {/* Login details */}
            <div className="field-group">
              <label className="section-label">Thông tin đăng nhập</label>
              <input className="input" placeholder="Email" type="email" />
              <input className="input" placeholder="Mật khẩu" type="password" />

              <p className="hint">
                Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, ký tự đặc biệt và số.
              </p>
            </div>

            <label className="checkbox">
              <input type="checkbox" />
              <span>
                Khi đăng ký, bạn đồng ý với{" "}
                <Link to="#">Điều khoản & Điều kiện</Link>,{" "}
                <Link to="/privacy">Chính sách bảo mật</Link> và{" "}
                <Link to="/terms">Điều khoản sử dụng</Link>.
              </span>
            </label>

            <label className="checkbox">
              <input type="checkbox" />
              <span>
                Giữ tôi đăng nhập — áp dụng cho tất cả các phương thức bên dưới.{" "}
                <Link to="#">Xem thêm</Link>
              </span>
            </label>

            <button className="primary-btn" type="button">
              ĐĂNG KÝ <span className="arrow">→</span>
            </button>

            {/* 🔥 Thêm đoạn Đăng nhập */}
            <p className="login-redirect">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="underline">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
