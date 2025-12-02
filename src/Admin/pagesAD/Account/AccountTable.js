// src/Admin/pagesAD/Accounts/AccountTable.js
import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "./index";
import { getAllUsers, deleteUser } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const getAvatarSrc = (img) => {
  if (!img) return "";

  // URL bucket Filebase -> chuyển sang ipfs.filebase.io để tránh lỗi SSL
  if (img.startsWith("http") && img.includes("/ipfs/")) {
    const cid = img.split("/ipfs/")[1];
    if (cid) return `https://ipfs.filebase.io/ipfs/${cid}`;
  }

  // Nếu BE chỉ lưu CID
  if (!img.startsWith("http") && img.startsWith("Qm")) {
    return `https://ipfs.filebase.io/ipfs/${img}`;
  }

  // Local cũ: /uploads/users/user.png
  if (!img.startsWith("http")) {
    return `${apiURL}/uploads/users/${img}`;
  }

  return img;
};

const getRoleLabel = (role) => {
  switch (role) {
    case 2:
      return "Quản lý";
    case 1:
      return "Nhân viên";
    default:
      return "Khách hàng";
  }
};

export default function AccountTable() {
  const { data, dispatch } = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const accounts = data?.accounts || [];
  const searchText = data?.searching || "";


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getAllUsers();
    dispatch({
      type: "fetchAccountsAndChangeState",
      payload: res?.Users || [],
    });
    setLoading(false);
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn xóa tài khoản này?");
    if (!ok) return;

    const r = await deleteUser(id);

    if (r?.success) {
      alert(r.success);
      fetchData();
    } else if (r?.error) {
      alert(r.error);
    }
  };

  const onEdit = (u) => {
    dispatch({ type: "addAccountModal", payload: false });
    dispatch({
      type: "editAccountModalOpen",
      account: u,
    });
  };

  if (loading) {
    return (
      <div className="ad-card">
        <div className="ad-body">Đang tải…</div>
      </div>
    );
  }

  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredAccounts = normalizedSearch
    ? accounts.filter((a) => {
      const name = (a.name || "").toLowerCase();
      const email = (a.email || "").toLowerCase();
      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch)
      );
    })
    : accounts;


  return (
    <div className="ad-card">
      <div className="ad-body">
        <div className="ad-table-responsive">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Ảnh</th>
                <th>Email</th>
                <th>Chức vụ</th>
                <th>Mật khẩu</th>
                <th>Số điện thoại</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length ? (
                filteredAccounts.map((u) => (
                  <tr key={u._id}>
                    <td className="text-left">{u.name}</td>

                    <td className="text-left">
                      {u.userImage ? (
                        <img
                          src={getAvatarSrc(u.userImage)}
                          alt={u.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="text-left">{u.email || "—"}</td>

                    <td className="text-left">
                      {getRoleLabel(u.userRole)}
                    </td>

                    {/* Không show password thật, chỉ hiển thị placeholder */}
                    <td className="text-left">********</td>

                    <td className="text-left">
                      {u.phoneNumber ? u.phoneNumber : "—"}
                    </td>

                    <td className="text-center">
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="ad-btn left"
                          onClick={() => onEdit(u)}
                        >
                          Sửa
                        </button>
                        <button
                          className="ad-btn danger"
                          onClick={() => onDelete(u._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Chưa có tài khoản
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ad-muted" style={{ marginTop: 8 }}>
          Tổng: {accounts.length} tài khoản
        </div>
      </div>
    </div>
  );
}
