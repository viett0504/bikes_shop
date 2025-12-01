// src/Customer/pages/Login/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

const API_BASE = process.env.REACT_APP_API_URL

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
      const res = await fetch(`${API_BASE}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Nếu server trả 404/500... thì đọc text cho đỡ lỗi JSON
      if (!res.ok) {
        const text = await res.text();
        console.error("Server trả lỗi:", res.status, text);
        setMsg({ error: `Lỗi server: ${res.status}` });
        return;
      }

      const data = await res.json();

      if (data.error) {
        setMsg({ error: data.error });
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // data.user được backend trả ra từ jwt: {_id, role} :contentReference[oaicite:3]{index=3}
        if (data.user.role === 0) {
          navigate("/");
        } else {
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
            <GoogleLogin
              type="icon"          
              shape="circle"       
              size="large"         
              onSuccess={async (credentialResponse) => {
                const res = await fetch(`${API_BASE}/api/auth/google`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ credential: credentialResponse.credential }),
                });

                const data = await res.json();

                if (data.token && data.user) {
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));
                  navigate("/");
                } else {
                  alert("Google login thất bại");
                }
              }}
              onError={() => {
                alert("Google Login Error");
              }}
            />
            {/* <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/503173/apple-logo.svg"
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
        </div>
      </div>
    </div>
  );
}
