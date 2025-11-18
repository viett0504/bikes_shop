import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function LoginPage() {
  return (
    <div className="login-root">
      <div className="login-card">
        {/* Left visual - giữ nguyên */}
        <div className="visual">
          <div className="brand">BIKES</div>
          <img
            src="https://unsplash.com/photos/s6DiDMLK0jk/download?force=true&w=1800"
            alt="Bicycle"
          />
        </div>

        {/* Right form */}
        <div className="form">
          <h1 className="title">Đăng nhập</h1>

          <input className="input" type="email" placeholder="Email" />
          <input className="input" type="password" placeholder="Mật khẩu" />

          <label className="checkbox">
            <input type="checkbox" />
            <span>
              Giữ tôi đăng nhập — áp dụng cho tất cả các phương thức đăng nhập bên dưới.{" "}
              <Link to="/info" className="underline">Xem thêm thông tin</Link>
            </span>
          </label>

          <button className="primary-btn" type="button">
            ĐĂNG NHẬP <span className="arrow">→</span>
          </button>

          {/* 🔥 Thêm phần "Chưa có tài khoản? Đăng ký" */}
          <div className="top-links">
            <Link to="/forgot" className="muted underline">Quên mật khẩu?</Link>
          </div>
          <p className="no-account">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="underline">Đăng ký ngay</Link>
          </p>

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

          <p className="terms">
            Khi bấm “Đăng nhập”, bạn đồng ý với{" "}
            <Link to="/terms" className="underline">Điều Khoản & Điều Kiện</Link> của KicksClub,{" "}
            <Link to="/privacy" className="underline">Chính Sách Bảo Mật</Link> và{" "}
            <Link to="/terms" className="underline">Điều Khoản Sử Dụng</Link>.
          </p>

        </div>
      </div>
    </div>
  );
}
