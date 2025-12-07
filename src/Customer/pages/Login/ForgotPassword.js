// src/Customer/pages/Login/ForgotPassword.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./ForgotPassword.css";

import {
  requestResetCodeApi,
  verifyResetCodeApi,
  resetPasswordApi,
} from "./fetchApi";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // form state
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // trạng thái flow
  const [codeSent, setCodeSent] = useState(false);     // đã gửi mã lần đầu
  const [codeVerified, setCodeVerified] = useState(false); // mã đã xác thực ok
  const [countdown, setCountdown] = useState(0);       // 60 → 0 giây

  // error / message
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // dùng để disable nút "Lấy mã" trong 60s khi sai mã
  const canResend = countdown === 0;

  // ====== Đếm ngược 60s ======
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // ====== VALIDATE EMAIL ======
  const validateEmail = (value) => {
    if (!value.trim()) return "Vui lòng nhập email.";
    const re =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!re.test(value.trim())) return "Email không hợp lệ.";
    return "";
  };

  // ====== ĐỘ MẠNH MẬT KHẨU (reuse logic ChangePassword) ======
  const passwordStrength = useMemo(() => {
    const pwd = password;
    if (!pwd) return { label: "Chưa nhập", level: 0 };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: "Yếu", level: 1 };
    if (score === 3) return { label: "Trung bình", level: 2 };
    if (score === 4) return { label: "Khá tốt", level: 3 };
    return { label: "Rất mạnh", level: 4 };
  }, [password]);

  // ====== VALIDATE PASSWORD FORM ======
  const passwordErrors = useMemo(() => {
    const errs = {};
    if (!password.trim()) {
      errs.password = "Vui lòng nhập mật khẩu mới.";
    } else {
      if (password.length < 8) {
        errs.password = "Mật khẩu mới phải từ 8 ký tự trở lên.";
      } else {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasUpper || !hasLower || !hasNumber) {
          errs.password =
            "Mật khẩu cần có chữ hoa, chữ thường và số.";
        }
      }
    }

    if (!confirmPassword.trim()) {
      errs.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
    } else if (confirmPassword !== password) {
      errs.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    return errs;
  }, [password, confirmPassword]);

  // ====== Gửi mã (Lấy mã) ======
  const handleSendCode = async () => {
  setGlobalError("");
  setGlobalSuccess("");
  setCodeError("");

  // Validate email
  const eErr = validateEmail(email);
  setEmailError(eErr);
  if (eErr) return;

  if (!canResend) return;

    try {
      setSubmitting(true);
      const data = await requestResetCodeApi(email.trim());
      setCodeSent(true);
      setCodeVerified(false);
      setCountdown(60); // bắt đầu 60 giây
      setGlobalSuccess(
        data.success || "Đã gửi mã xác thực đến email của bạn."
      );
    } catch (err) {
      setGlobalError(err.message || "Không gửi được mã, thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLeak = () => {
  window.location.href =
    `http://localhost:8000/api/user/forgot-password/demo-jwt?email=${encodeURIComponent(email || "test@gmail.com")}`;
};


  // ====== Nhập mã (Kiểm tra mã) ======
  const handleVerifyCode = async () => {
    setGlobalError("");
    setGlobalSuccess("");
    setCodeError("");

    if (!code.trim()) {
      setCodeError("Vui lòng nhập mã xác thực.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await verifyResetCodeApi(email.trim(), code.trim());
      setCodeVerified(true);
      setGlobalSuccess(
        data.success || "Mã xác thực đúng. Hãy nhập mật khẩu mới."
      );
    } catch (err) {
      // theo yêu cầu:
      // 1. hiển thị dòng chữ nhỏ đỏ "Mã xác thực không đúng"
      // 2. nút đổi lại thành "Lấy mã", countdown 60s
      setCodeError("Mã xác thực không đúng");
      setCodeSent(false);
      setCodeVerified(false);
      setCountdown(60);
      setGlobalError("");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== Submit đặt lại mật khẩu ======
  const handleSubmitReset = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setGlobalSuccess("");

    if (!codeVerified) {
      setGlobalError("Bạn cần xác thực mã trước khi đặt mật khẩu mới.");
      return;
    }

    const eErr = validateEmail(email);
    setEmailError(eErr);
    if (eErr) return;

    if (Object.keys(passwordErrors).length > 0) {
      setGlobalError("Vui lòng kiểm tra lại mật khẩu mới.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await resetPasswordApi(
        email.trim(),
        code.trim(),
        password.trim()
      );
      setGlobalSuccess(
        data.success || "Đặt lại mật khẩu thành công, hãy đăng nhập lại."
      );

      // clear form
      setPassword("");
      setConfirmPassword("");
      setCode("");
      setCodeVerified(false);
      setCodeSent(false);
      setCountdown(0);

      // sau 1–2s có thể navigate về login nếu muốn
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setGlobalError(err.message || "Không đặt lại được mật khẩu.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== RENDER ======
  const mainButtonLabel = codeSent ? "Nhập mã" : "Lấy mã";

  const handleBackToLogin = () => {
    navigate("/login");
    };

  return (
    <div className="fp-page">
        <button className="fp-close-btn" onClick={handleBackToLogin}>✕</button>
        
      <div className="fp-card">
        {/* Cột trái: info / tips */}
        <div className="fp-left">
          <div className="fp-left-icon">
            <FaLock />
          </div>
          <h1 className="fp-title">Quên mật khẩu</h1>
          <p className="fp-subtitle">
            Nhập email để nhận mã xác thực. Mỗi mã có hiệu lực trong 60
            giây. Sau khi xác thực đúng, bạn có thể đặt mật khẩu mới.
          </p>

          <ul className="fp-tips">
            <li>• Đảm bảo email đã được đăng ký tài khoản.</li>
            <li>• Không chia sẻ mã xác thực cho người khác.</li>
            <li>• Mật khẩu mới nên đủ mạnh và khó đoán.</li>
          </ul>

          <div className="fp-security-note">
            <FaCheckCircle className="fp-security-icon" />
            <span>
              Chúng tôi chỉ dùng email của bạn để gửi mã khôi phục mật khẩu.
            </span>
          </div>
        </div>

        {/* Cột phải: form */}
        <div className="fp-right">
          <form className="fp-form" onSubmit={handleSubmitReset}>
            {/* Email */}
            <div className="fp-field">
              <label htmlFor="email">Email đăng ký</label>
              <input
                id="email"
                type="email"
                className={`fp-input ${emailError ? "fp-input-error" : ""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                  setGlobalError("");
                  setGlobalSuccess("");
                }}
                placeholder="Nhập email bạn đã đăng ký"
              />
              {emailError && (
                <div className="fp-error-text">
                  <FaExclamationCircle /> {emailError}
                </div>
              )}
            </div>

            {/* Mã xác thực + nút Lấy mã / Nhập mã */}
            <div className="fp-field">
              <label htmlFor="code">Mã xác thực</label>
              <div className="fp-code-row">
                <input
                  id="code"
                  type="text"
                  className={`fp-input ${codeError ? "fp-input-error" : ""}`}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeError("");
                    setGlobalError("");
                    setGlobalSuccess("");
                  }}
                  placeholder="Nhập mã 6 số được gửi qua email"
                />
                <button
                  type="button"
                  className="fp-code-btn"
                  disabled={submitting || (!codeSent && !canResend)}
                  onClick={codeSent ? handleVerifyCode : handleSendCode}
                >
                  {mainButtonLabel}
                </button>
              </div>
              {/* Trường hợp mã sai → dòng chữ đỏ nhỏ xinh */}
              {codeError && (
                <div className="fp-error-text">
                  <FaExclamationCircle /> {codeError}
                </div>
              )}

              {/* Countdown hiển thị khi không được lấy mã mới */}
              {countdown > 0 && (
                <div className="fp-countdown">
                  Bạn có thể lấy mã mới sau {countdown}s
                </div>
              )}
            </div>

            {/* Mật khẩu mới (chỉ enable khi mã đã xác thực) */}
            <div className="fp-field">
              <label htmlFor="password">Mật khẩu mới</label>
              <input
                id="password"
                type="password"
                className={`fp-input ${
                  passwordErrors.password ? "fp-input-error" : ""
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setGlobalError("");
                  setGlobalSuccess("");
                }}
                placeholder="Nhập mật khẩu mới"
                disabled={!codeVerified}
              />
              {passwordErrors.password && codeVerified && (
                <div className="fp-error-text">
                  <FaExclamationCircle /> {passwordErrors.password}
                </div>
              )}

              {/* strength meter giống ChangePassword */}
              <div className="fp-strength">
                <div
                  className={`fp-strength-bar level-${passwordStrength.level}`}
                >
                  <span />
                </div>
                <span className="fp-strength-label">
                  Độ mạnh: {passwordStrength.label}
                </span>
              </div>
            </div>

            {/* Nhập lại mật khẩu mới */}
            <div className="fp-field">
              <label htmlFor="confirmPassword">
                Nhập lại mật khẩu mới
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`fp-input ${
                  passwordErrors.confirmPassword ? "fp-input-error" : ""
                }`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setGlobalError("");
                  setGlobalSuccess("");
                }}
                placeholder="Nhập lại mật khẩu mới"
                disabled={!codeVerified}
              />
              {passwordErrors.confirmPassword && codeVerified && (
                <div className="fp-error-text">
                  <FaExclamationCircle />{" "}
                  {passwordErrors.confirmPassword}
                </div>
              )}
            </div>

            {/* Thông báo chung */}
            {globalError && (
              <div className="fp-global fp-global-error">
                <FaExclamationCircle /> {globalError}
              </div>
            )}
            {globalSuccess && (
              <div className="fp-global fp-global-success">
                <FaCheckCircle /> {globalSuccess}
              </div>
            )}
            {/* Nút nhỏ để demo leak JWT */}
<div style={{ marginTop: "10px", textAlign: "right" }}>
  <button
    type="button"
    style={{
      background: "transparent",
      border: "none",
      color: "#007bff",
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: "13px"
    }}
    onClick={handleDemoLeak}
  >
    🔐 Demo leak JWT
  </button>
</div>


            {/* Nút xác nhận */}
            <button
              type="submit"
              className="fp-submit-btn"
              disabled={submitting || !codeVerified}
            >
              {submitting ? "Đang xử lý..." : "Xác nhận đặt lại mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
