// src/Customer/pages/Register/RegisterPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./RegisterPage.css";
import { useNotification } from "../../components/Noti/notification";

const API_BASE = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        headers: { "Content-Type": "application/json" },
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
        const errorText =
          typeof data.error === "string"
            ? data.error
            : Object.values(data.error).filter(Boolean).join(" | ");

        setMsg({ error: errorText });

      } else if (data.success) {
        setMsg({ success: data.success });
        showNotification("Đăng ký thành công!", "success", {
          title: "Thành công",
        });

        // Ghi log đăng ký
        fetch(`${API_BASE}/logs/activity/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            phoneNumber,
          }),
        });

        setTimeout(() => navigate("/login"), 1200);
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

            {/* nút X để quay lại */}
            <div className="close-btn" onClick={() => navigate(-1)}>
              ✕
            </div>

            <h1 className="title">Đăng ký</h1>

            <p className="subtitle">Đăng ký bằng</p>

          {/* Social */}
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


          <div className="or">HOẶC</div>

          <form onSubmit={handleSubmit}>
            {/* NAME */}
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

            {/* Thông báo */}
            {msg.error && (
              <p style={{ color: "red", marginTop: 4 }}>{msg.error}</p>
            )}
            {msg.success && (
              <p style={{ color: "green", marginTop: 4 }}>{msg.success}</p>
            )}

            <label className="checkbox">
              <input type="checkbox" />
              <span>
                Khi đăng ký, bạn đồng ý với{" "}
                <Link to="#">Điều khoản</Link> và{" "}
                <Link to="/privacy">Chính sách bảo mật</Link>.
              </span>
            </label>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"} <span className="arrow">→</span>
            </button>
          </form>

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
