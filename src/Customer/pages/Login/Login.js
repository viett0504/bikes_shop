// src/Customer/pages/Login/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";
import { useNotification } from "../../components/Noti/notification";

const API_BASE = process.env.REACT_APP_API_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [msg, setMsg] = useState({ error: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMsg({ error: "" });

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setMsg({ error: data.error });
        showNotification(data.error, "error", {
          title: "Đăng nhập thất bại",
        });
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Log login
        fetch(`${API_BASE}/logs/activity/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userId: data.user._id,
            role: data.user.role,
          }),
        });

        showNotification("Đăng nhập thành công!", "success", {
          title: "Thành công",
        });

        if (data.user.role === 0) navigate("/");
        else navigate("/admin");
      } else {
        setMsg({ error: "Phản hồi không hợp lệ từ server" });
        showNotification("Phản hồi không hợp lệ từ server", "error", {
          title: "Lỗi hệ thống",
        });
      }
    } catch (err) {
      console.error(err);
      setMsg({ error: "Có lỗi mạng, thử lại sau." });
      showNotification("Có lỗi mạng, thử lại sau", "error", {
        title: "Mất kết nối",
      });
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

          {/* nút X để quay lại */}
          <div className="close-btn" onClick={() => navigate(-1)}>
            ✕
          </div>

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
              Giữ tôi đăng nhập —{" "}
              <Link to="/info" className="underline">
                Xem thêm
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

          <div className="socials" style={{ width: "100%" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                width="100%"
                size="large"
                shape="pill"
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
                      showNotification("Đăng nhập Google thành công!", "success", {
                        title: "Thành công",
                      });
                      navigate("/");
                    } else {
                      showNotification(
                        data.error || "Google login thất bại",
                        "error",
                        { title: "Google Login Error" }
                      );
                    }
                  } catch (err) {
                    console.error(err);
                    showNotification("Có lỗi khi đăng nhập Google", "error", {
                      title: "Google Error",
                    });
                  }
                }}
                onError={() =>
                  showNotification("Đăng nhập Google thất bại", "error", {
                    title: "Google Login Error",
                  })
                }
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
