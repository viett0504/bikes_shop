// src/Customer/pages/Account/ChangePassword.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

import { changePasswordApi } from "./fetchApi";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // ====== Lấy user + token từ localStorage ======
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      const tk = localStorage.getItem("token");

      setCurrentUser(parsed);
      setToken(tk);

      // Nếu chưa đăng nhập → đá về login
      if (!parsed || !tk) {
        navigate("/login");
      }
    } catch (e) {
      console.error("Lỗi đọc user từ localStorage:", e);
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userId = currentUser?._id || currentUser?.uId || null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setGlobalError("");
    setGlobalSuccess("");
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // ====== VALIDATION ======
  const errors = useMemo(() => {
    const errs = {};

    if (!form.currentPassword.trim()) {
      errs.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }

    if (!form.newPassword.trim()) {
      errs.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else {
      if (form.newPassword.length < 8) {
        errs.newPassword = "Mật khẩu mới phải từ 8 ký tự trở lên.";
      } else {
        const hasUpper = /[A-Z]/.test(form.newPassword);
        const hasLower = /[a-z]/.test(form.newPassword);
        const hasNumber = /[0-9]/.test(form.newPassword);
        if (!hasUpper || !hasLower || !hasNumber) {
          errs.newPassword =
            "Mật khẩu cần có chữ hoa, chữ thường và số.";
        }
      }
    }

    if (!form.confirmPassword.trim()) {
      errs.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
    } else if (form.confirmPassword !== form.newPassword) {
      errs.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    return errs;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  // ====== ĐỘ MẠNH MẬT KHẨU ======
  const passwordStrength = useMemo(() => {
    const pwd = form.newPassword;
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
  }, [form.newPassword]);

  // ====== SUBMIT: Gọi API /users/change-password ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });
    setGlobalError("");
    setGlobalSuccess("");

    if (!isValid) return;

    if (!userId || !token) {
      setGlobalError("Bạn cần đăng nhập lại để đổi mật khẩu.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);

      const data = await changePasswordApi({
        token,
        userId,
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setGlobalSuccess(data.success || "Đổi mật khẩu thành công.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTouched({});
    } catch (err) {
      console.error("Lỗi gọi API đổi mật khẩu:", err);
      setGlobalError(
        err.message || "Có lỗi kết nối server, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cp-page">
      <div className="cp-card">
        {/* Cột trái: thông tin */}
        <div className="cp-left">
          <div className="cp-left-icon">
            <FaLock />
          </div>
          <h1 className="cp-title">Đổi mật khẩu</h1>
          <p className="cp-subtitle">
            Tăng cường bảo mật cho tài khoản bằng cách thường xuyên đổi
            mật khẩu. Hãy chọn mật khẩu đủ mạnh và không dùng chung với
            các dịch vụ khác.
          </p>

          <ul className="cp-tips">
            <li>• Tối thiểu 8 ký tự.</li>
            <li>• Có chữ hoa, chữ thường và số.</li>
            <li>
              • Hạn chế dùng thông tin dễ đoán (ngày sinh, số điện thoại...).
            </li>
          </ul>

          <div className="cp-security-note">
            <FaCheckCircle className="cp-security-icon" />
            <span>Mật khẩu của bạn được mã hóa và bảo mật an toàn.</span>
          </div>
        </div>

        {/* Cột phải: form */}
        <div className="cp-right">
          <form className="cp-form" onSubmit={handleSubmit}>
            {/* Mật khẩu hiện tại */}
            <div className="cp-field">
              <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  touched.currentPassword && errors.currentPassword
                    ? "cp-input cp-input-error"
                    : "cp-input"
                }
                placeholder="Nhập mật khẩu đang sử dụng"
              />
              {touched.currentPassword && errors.currentPassword && (
                <div className="cp-error-text">
                  <FaExclamationCircle /> {errors.currentPassword}
                </div>
              )}
            </div>

            {/* Mật khẩu mới */}
            <div className="cp-field">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  touched.newPassword && errors.newPassword
                    ? "cp-input cp-input-error"
                    : "cp-input"
                }
                placeholder="Nhập mật khẩu mới"
              />
              {touched.newPassword && errors.newPassword && (
                <div className="cp-error-text">
                  <FaExclamationCircle /> {errors.newPassword}
                </div>
              )}

              {/* Strength meter */}
              <div className="cp-strength">
                <div
                  className={`cp-strength-bar level-${passwordStrength.level}`}
                >
                  <span />
                </div>
                <span className="cp-strength-label">
                  Độ mạnh: {passwordStrength.label}
                </span>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="cp-field">
              <label htmlFor="confirmPassword">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  touched.confirmPassword && errors.confirmPassword
                    ? "cp-input cp-input-error"
                    : "cp-input"
                }
                placeholder="Nhập lại mật khẩu mới"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="cp-error-text">
                  <FaExclamationCircle /> {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Thông báo chung */}
            {globalError && (
              <div className="cp-global cp-global-error">
                <FaExclamationCircle /> {globalError}
              </div>
            )}
            {globalSuccess && (
              <div className="cp-global cp-global-success">
                <FaCheckCircle /> {globalSuccess}
              </div>
            )}

            <button
              type="submit"
              className="cp-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
