// src/Admin/pagesAD/Accounts/AccountTable.js
import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "./index";
import { getAllUsers, deleteUser } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function AccountTable() {
  const { data, dispatch } = useContext(AccountContext);
  const { accounts } = data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      // BE trả về { Users: [...] }
      dispatch({
        type: "fetchAccountsAndChangeState",
        payload: res?.Users || [],
      });
    } catch (err) {
      console.log("Lỗi load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn xóa tài khoản này?");
    if (!ok) return;

    // gửi oId + status, tuỳ bạn muốn đặt status gì
    const r = await deleteUser({ oId: id, status: "DELETED" });

    if (r?.success) {
      alert(r.success);
      fetchData();
    } else if (r?.error) {
      alert(r.error);
    }
  };

  if (loading) {
    return (
      <div className="ad-card">
        <div className="ad-body">Đang tải…</div>
      </div>
    );
  }

  return (
    <div className="ad-card">
      <div className="ad-body" style={{ overflowX: "auto" }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Ảnh</th>
              <th>Chức vụ</th>
              <th>SĐT</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length ? (
              accounts.map((u) => (
                <tr key={u._id}>
                  <td className="text-left">{u.name}</td>
                  <td className="text-left">{u.email || "—"}</td>

                  {/* Ảnh tài khoản */}
                  <td className="text-center">
                    {u.userImage ? (
                      <img
                        src={
                          // nếu BE của bạn trả full URL thì có thể dùng luôn u.userImage
                          `${apiURL}/uploads/users/${u.userImage}`
                        }
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

                  {/* userRole: 0 = Khách, 1 = Admin (theo schema bạn đưa) */}
                  <td className="text-left">
                    {u.userRole === 1 ? "Admin" : "Khách hàng"}
                  </td>

                  <td className="text-left">{u.phoneNumber || "—"}</td>

                  <td className="text-center">
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                      }}
                    >
                      <button className="ad-btn">Sửa</button>
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
                <td colSpan="6" className="text-center">
                  Chưa có tài khoản
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="ad-muted" style={{ marginTop: 8 }}>
          Tổng: {accounts.length} tài khoản
        </div>
      </div>
    </div>
  );
}
