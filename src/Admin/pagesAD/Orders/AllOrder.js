// src/Admin/pagesAD/Orders/AllOrder.js 
import React, { Fragment, useContext, useEffect, useState } from "react";
import moment from "moment";
import { orderContext } from "./index";
import { getAllOrders, updateOrderStatus, cancelOrder } from "./FetchApi";

export default function AllOrder() {
  const { data, dispatch } = useContext(orderContext);
  const { orders } = data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getAllOrders();
    dispatch({
      type: "fetchOrders",
      payload: (res && res.Orders) || [],
    });
    setLoading(false);
  };

  const onUpdateStatus = async (oId, status) => {
    const r = await updateOrderStatus({ oId, status });
    if (r?.success) fetchData();
  };

  const onCancel = async (oId) => {
    const r = await updateOrderStatus({ oId, status: "Đơn hàng đã bị hủy" });
    if (r?.success) fetchData();
  };

  const onDelete = async (oId) => {
    if (!window.confirm("Bạn chắc chắn muốn XÓA hẳn đơn hàng này?")) return;
    const r = await cancelOrder(oId);  
    if (r?.success) fetchData();
  };


  if (loading) {
    return (
      <div className="ad-card">
        <div className="ad-body">Đang tải đơn hàng…</div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="ad-card">
        <div className="ad-body">
          <div
            style={{
              maxHeight: 600,     
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <table
              className="ad-table ad-table-sticky"
              style={{ minWidth: 1000 }}
            >
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày</th>
                  <th>Trạng thái thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái đơn</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((o) => (
                    <tr key={o._id}>
                      <td className="text-left">#{o._id}</td>
                      <td className="text-left">
                        {o.user?.name || "—"}
                      </td>
                      <td className="text-left">
                        {o.createdAt
                          ? moment(o.createdAt).format("ll LT")
                          : "—"}
                      </td>
                      <td className="text-left">
                        {o.payStatus || "—"}
                      </td>
                      <td className="text-right">
                        {(o.amount || 0).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="text-left">
                        {o.payMethod || "—"}
                      </td>
                      <td className="text-left">
                        {o.status || "—"}
                      </td>
                      <td className="text-center">
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="ad-btn success"
                            onClick={() => onUpdateStatus(o._id, "Xác nhận")}
                          >
                            Xác nhận
                          </button>

                          <button
                            className="ad-btn left"
                            onClick={() => onUpdateStatus(o._id, "Giao hàng")}
                          >
                            Giao hàng
                          </button>

                          {/* (tuỳ chọn) HOÀN TẤT → "Đã giao" */}
                          {/* 
                          <button
                            className="ad-btn success"
                            onClick={() => onUpdateStatus(o._id, "Đã giao")}
                          >
                            Hoàn tất
                          </button> 
                          */}

                          <button
                            className="ad-btn danger"
                            onClick={() => onCancel(o._id)}
                          >
                            Hủy
                          </button>

                          <button
                            className="ad-btn danger"
                            style={{ backgroundColor: "#111", borderColor: "#111" }}
                            onClick={() => onDelete(o._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Chưa có đơn
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tổng đơn – nằm dưới vùng scroll */}
          <div className="ad-muted" style={{ marginTop: 8 }}>
            Tổng: {orders.length} đơn hàng
          </div>
        </div>
      </div>
    </Fragment>
  );
}
