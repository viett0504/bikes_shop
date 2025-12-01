// src/Customer/pages/Register/RegisterPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import "./RegisterPage.css";

const API_BASE = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");   // Tên
  const [lastName, setLastName] = useState("");    // Họ
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: "", success: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ error: "", success: "" });

    const name = `${lastName.trim()} ${firstName.trim()}`.trim();

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          password,
          cPassword,
        }),
      });

      const data = await res.json();

      if (data.error) {
        // error là object nhiều field => gom text lại
        const errorText =
          typeof data.error === "string"
            ? data.error
            : Object.values(data.error).filter(Boolean).join(" | ");
        setMsg({ error: errorText, success: "" });
      } else if (data.success) {
        setMsg({ error: "", success: data.success });
        // Đợi 1 chút rồi chuyển sang login
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setMsg({ error: "Có lỗi mạng, thử lại sau.", success: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <GoogleLogin
              type="icon"
              shape="circle"
              size="large"
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await fetch(`${API_BASE}/api/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      credential: credentialResponse.credential,
                    }),
                  });

                  const data = await res.json();

                  if (data.token && data.user) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    // Đăng ký/đăng nhập xong cho vào trang chủ
                    navigate("/");
                  } else {
                    alert(data.error || "Google login thất bại");
                  }
                } catch (err) {
                  console.error(err);
                  alert("Có lỗi khi đăng nhập Google");
                }
              }}
              onError={() => {
                alert("Google Login Error");
              }}
            />
            {/* <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/452210/apple.svg"
                alt="Apple"
              />
            </button> */}
            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                alt="Facebook"
              />
            </button>
          </div>

          <div className="or">HOẶC</div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="field-group">
              <label className="section-label">Tên của bạn</label>
              <div className="grid-2">
                <input
                  className="input"
                  placeholder="Họ"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Tên"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            {/* Login details */}
            <div className="field-group">
              <label className="section-label">Thông tin đăng nhập</label>
              <input
                className="input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="input"
                placeholder="Số điện thoại"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                className="input"
                placeholder="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="input"
                placeholder="Nhập lại mật khẩu"
                type="password"
                value={cPassword}
                onChange={(e) => setCPassword(e.target.value)}
              />

              <p className="hint">
                Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, ký tự đặc biệt và số.
              </p>
            </div>

            {/* Thông báo lỗi / thành công */}
            {msg.error && (
              <p style={{ color: "red", marginTop: 4, marginBottom: 8 }}>
                {msg.error}
              </p>
            )}
            {msg.success && (
              <p style={{ color: "green", marginTop: 4, marginBottom: 8 }}>
                {msg.success}
              </p>
            )}

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

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"} <span className="arrow">→</span>
            </button>
          </form>

          {/* 🔥 Đăng nhập */}
          <p className="login-redirect">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
