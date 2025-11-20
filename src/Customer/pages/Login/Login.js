// src/Customer/pages/Login/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [msg, setMsg] = useState({ error: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMsg({ error: "" });

    if (!email || !password) {
      setMsg({ error: "Vui lòng nhập email và mật khẩu" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setMsg({ error: data.error });
        return;
      }

      if (data.token && data.user) {
        // Lưu token + user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (keepLogin) {
          // nếu muốn giữ đăng nhập lâu hơn có thể dùng localStorage/sessionStorage… tuỳ bạn
        }

        // Điều hướng theo role
        if (data.user.role === 0) {
          // Khách hàng
          navigate("/");
        } else {
          // Nhân viên / Admin
          navigate("/admin");
        }
      } else {
        setMsg({ error: "Phản hồi không hợp lệ từ server" });
      }
    } catch (err) {
      console.error(err);
      setMsg({ error: "Có lỗi mạng, thử lại sau." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        {/* Left visual */}
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

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {msg.error && (
            <p style={{ color: "red", marginTop: 4, marginBottom: 8 }}>
              {msg.error}
            </p>
          )}

          <label className="checkbox">
            <input
              type="checkbox"
              checked={keepLogin}
              onChange={(e) => setKeepLogin(e.target.checked)}
            />
            <span>
              Giữ tôi đăng nhập — áp dụng cho tất cả các phương thức đăng nhập bên dưới.{" "}
              <Link to="/info" className="underline">
                Xem thêm thông tin
              </Link>
            </span>
          </label>

          <button
            className="primary-btn"
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}{" "}
            <span className="arrow">→</span>
          </button>

          <div className="top-links">
            <Link to="/forgot" className="muted underline">
              Quên mật khẩu?
            </Link>
          </div>
          <p className="no-account">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="underline">
              Đăng ký ngay
            </Link>
          </p>

          <div className="socials">
            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
            </button>
            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/452210/apple.svg"
                alt="Apple"
              />
            </button>
            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                alt="Facebook"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
