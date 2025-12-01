// src/Admin/pagesAD/Accounts/AddAccountModal.js
import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "./index";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";
import { addUser, editUser } from "./FetchApi";
import { useNotification } from "../../../Customer/components/Noti/notification";

export default function AddAccountModal() {
  const { data, dispatch } = useContext(AccountContext);
  const { addAccountModal, editAccountModal, accounts = [] } = data;

  const { showNotification } = useNotification();

  const isEditMode = !!editAccountModal?.modal && !addAccountModal;
  const isOpen = addAccountModal || isEditMode;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPosition("");
    setPassword("");
    setPhoneNumber("");
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const close = () => {
    if (isEditMode) {
      dispatch({ type: "editAccountModalClose" });
    } else {
      dispatch({ type: "addAccountModal", payload: false });
    }
    resetForm();
  };

  // log account action
  const logAccountAction = async (action, extra = {}) => {
    try {
      await fetch("/logs/activity/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
    } catch (err) {
      console.error("Log account error:", err);
    }
  };

  // Fill data khi sửa / reset khi thêm
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editAccountModal) {
      setName(editAccountModal.name || "");
      setEmail(editAccountModal.email || "");
      setPosition(editAccountModal.position || "");
      setPhoneNumber(editAccountModal.phoneNumber || "");
      setPassword("");
      setAvatarFile(null);
      setAvatarPreview("");
    } else {
      resetForm();
    }
  }, [isOpen, isEditMode, editAccountModal]);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showNotification("Vui lòng nhập tên tài khoản", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }
    if (!email.trim()) {
      showNotification("Vui lòng nhập email", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }
    if (!isEditMode && !password.trim()) {
      showNotification("Vui lòng nhập mật khẩu", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        const res = await editUser({
          uId: editAccountModal.aId,
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          position: position.trim(),
          password: password.trim(), // nếu rỗng thì BE không đổi password
          imageFile: avatarFile,
        });

        if (res?.error) {
          showNotification(res.error, "error", { title: "Cập nhật thất bại" });
          return;
        }

        if (res?.success) {
          showNotification("Cập nhật tài khoản thành công!", "success", {
            title: "Thao tác thành công",
          });

          await logAccountAction("ADMIN_EDIT_ACCOUNT", {
            id: res?.user?._id || editAccountModal.aId,
            name: name.trim(),
            email: email.trim(),
            position: position.trim(),
          });

          if (res.user) {
            const newList = accounts.map((u) =>
              u._id === res.user._id ? res.user : u
            );
            dispatch({
              type: "fetchAccountsAndChangeState",
              payload: newList,
            });
          }
        }
      } else {
        const res = await addUser({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          phoneNumber: phoneNumber.trim(),
          position: position.trim(),
          imageFile: avatarFile,
        });

        if (res?.error) {
          showNotification(res.error, "error", { title: "Thêm tài khoản thất bại" });
          return;
        }

        if (res?.success) {
          showNotification("Thêm tài khoản thành công!", "success", {
            title: "Thao tác thành công",
          });

          await logAccountAction("ADMIN_ADD_ACCOUNT", {
            id: res?.user?._id,
            name: name.trim(),
            email: email.trim(),
            position: position.trim(),
          });

          if (res.user) {
            dispatch({
              type: "fetchAccountsAndChangeState",
              payload: [...accounts, res.user],
            });
          }
        }
      }

      close();
    } catch (err) {
      console.error(err);
      showNotification("Có lỗi xảy ra khi lưu tài khoản", "error", {
        title: "Lỗi server",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========== IMPORT EXCEL ===========
  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rows.length) {
        showNotification("File Excel không có dữ liệu!", "warning", {
          title: "Không có dữ liệu",
        });
        return;
      }

      const first = rows[0];

      setName(first["Tên"] || first["Họ tên"] || first["Name"] || "");
      setEmail(first["Email"] || first["Mail"] || "");
      setPassword(first["Mật khẩu"] || first["Password"] || "");
      setPosition(first["Chức vụ"] || first["Role"] || "");
      setPhoneNumber(first["Số điện thoại"] || first["Phone"] || "");

      console.log("Import Excel:", first);
    } catch (err) {
      console.error(err);
      showNotification(
        "Không đọc được file Excel. Vui lòng kiểm tra lại.",
        "error",
        { title: "Lỗi import" }
      );
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
        {/* HEADER + Excel */}
        <div className="ad-form-header">
          <h2 className="ad-form-title">
            {isEditMode ? "Sửa tài khoản" : "Thêm tài khoản"}
          </h2>

          <div className="ad-form-tools">
            <input
              id="excel-upload-account"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelImport}
              style={{ display: "none" }}
            />

            <label
              htmlFor="excel-upload-account"
              className="ad-btn secondary small"
            >
              <FiUpload size={16} style={{ marginRight: 6 }} />
              Nhập từ Excel
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ad-form-row">
            <div className="ad-form-group">
              <label>Tên tài khoản</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div className="ad-form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </div>

            <div className="ad-form-group">
              <label>Chức vụ</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value=""> Chọn chức vụ </option>
                <option value="Khách hàng">Khách hàng</option>
                <option value="Nhân viên">Nhân viên</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="ad-form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="ad-form-group">
              <label>Mật khẩu {isEditMode && "(bỏ trống nếu không đổi)"}</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isEditMode
                    ? "Nhập mật khẩu mới (hoặc để trống)"
                    : "Nhập mật khẩu"
                }
              />
            </div>

            <div className="ad-form-group">
              <label>Ảnh đại diện (không bắt buộc)</label>
              <input type="file" accept="image/*" onChange={onAvatarChange} />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="preview"
                  style={{
                    marginTop: 8,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </div>

          <div className="ad-form-actions">
            <button
              type="button"
              className="ad-btn"
              onClick={close}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="ad-btn success"
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Đang lưu..."
                  : "Đang thêm..."
                : isEditMode
                ? "Lưu thay đổi"
                : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
