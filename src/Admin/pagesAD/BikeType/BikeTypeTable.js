// src/Admin/pagesAD/BikeType/BikeTypeTable.js
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { BikeTypeContext } from "./index";
import { getAllBikeType, deleteBikeType } from "./FetchApi";

export default function BikeTypeTable() {
  const { data, dispatch } = useContext(BikeTypeContext);
  const { types } = data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getAllBikeType();
    dispatch({
      type: "fetchTypesAndChangeState",
      payload: res?.BikeTypes || [],
    });
    setLoading(false);
  };

  const onEdit = (t) => {
    // nếu đang ở form Thêm thì tắt
    dispatch({ type: "addTypeModal", payload: false });

    dispatch({
      type: "editTypeModalOpen",
      typeData: t,
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa loại xe này?")) return;
    const r = await deleteBikeType(id);
    if (r?.success) fetchData();
    else if (r?.error) alert(r.error);
  };

  if (loading)
    return (
      <div className="ad-card">
        <div className="ad-body">Đang tải…</div>
      </div>
    );

  return (
    <div className="ad-card">
      <div className="ad-body">
        {/* ✅ wrapper giống các bảng khác: scroll dọc + ngang */}
        <div
          style={{
            maxHeight: 600,
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <table
            className="ad-table ad-table-sticky"
            style={{ minWidth: 800 }}
          >
            <thead>
              <tr>
                <th>Tên loại xe</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Cập nhật</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {types && types.length ? (
                types.map((t) => (
                  <tr key={t._id}>
                    <td className="text-left">{t.name}</td>

                    <td className="text-left">
                      {(t.description || "").length > 50
                        ? (t.description || "").slice(0, 50) + "..."
                        : t.description || "—"}
                    </td>

                    <td className="text-center">
                      <span
                        className={
                          "ad-badge " +
                          (t.status === "Active" ? "success" : "")
                        }
                      >
                        {t.status || "—"}
                      </span>
                    </td>

                    <td className="text-left">
                      {t.createdAt ? moment(t.createdAt).format("lll") : "—"}
                    </td>

                    <td className="text-left">
                      {t.updatedAt ? moment(t.updatedAt).format("lll") : "—"}
                    </td>

                    <td className="text-center" style={{ paddingRight: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          type="button"
                          className="ad-btn left"
                          onClick={() => onEdit(t)}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="ad-btn danger"
                          onClick={() => onDelete(t._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: 16 }}>
                    Chưa có loại xe
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ad-muted" style={{ marginTop: 8 }}>
          Tổng: {types?.length || 0} loại xe
        </div>
      </div>
    </div>
  );
}
