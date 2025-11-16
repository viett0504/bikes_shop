import React, { useContext, useEffect, useState, Fragment } from "react";
import moment from "moment";
import { AccountContext } from "./index";
import { getAllAccount, deleteAccount } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

export default function AccountTable() {
  const { data, dispatch } = useContext(AccountContext);
  const { accounts } = data;
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, []);
  const fetchData = async () => {
    setLoading(true);
    const res = await getAllAccount();
    dispatch({
      type: "fetchAccountsAndChangeState",
      payload: res?.Users || []   
    });
    setLoading(false);
  };

  const onDelete = async (id) => {
    const r = await deleteAccount(id);
    if (r?.success) fetchData();
  };

  if (loading) return <div className="ad-card"><div className="ad-body">Đang tải…</div></div>;

  return (
    <div className="ad-card">
      <div className="ad-body" style={{overflowX:'auto'}}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Ảnh</th>
              <th>Mật khẩu</th>
              <th>Chức vụ</th>
              <th>Sđt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length ? accounts.map(p => (
              <tr key={p._id}>
                <td className="text-left">{p.name}</td>
                <td className="text-right">{p.email ?? 0}</td>
                <td className="text-right">{p.password ?? 0}</td>
                <td className="text-right">{p.position ?? 0}</td>
                <td className="text-right">{p.phoneNumber ?? 0}</td>

                <td className="text-center">
                  <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                    <button className="ad-btn">Sửa</button>
                    <button className="ad-btn danger" onClick={()=>onDelete(p._id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="10" className="text-center">Chưa có tài khoản</td></tr>
            )}
          </tbody>
        </table>
        <div className="ad-muted" style={{marginTop:8}}>Tổng: {accounts.length} tài khoản</div>
      </div>
    </div>
  );
}
