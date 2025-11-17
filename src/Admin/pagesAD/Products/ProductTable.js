// src/Admin/pagesAD/Products/ProductTable.js
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { ProductContext } from "./index";
import { getAllProduct, deleteProduct } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

export default function ProductTable() {
  const { data, dispatch } = useContext(ProductContext);
  const { products } = data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getAllProduct();
    dispatch({
      type: "fetchProductsAndChangeState",
      payload: res?.Products || [],
    });
    setLoading(false);
  };

  const onDelete = async (id) => {
    const r = await deleteProduct(id);
    if (r?.success) fetchData();
  };

  const onEdit = (p) => {
    // 🔹 Đang ở form Thêm thì tắt nó đi
    dispatch({ type: "addProductModal", payload: false });

    // 🔹 Mở mode Sửa với sản phẩm đã chọn
    dispatch({
      type: "editProductModalOpen",
      product: p,
    });
  };

  const getImageSrc = (img) => {
    if (!img) return "";

    if (img.startsWith("http") && img.includes("/ipfs/")) {
      const cid = img.split("/ipfs/")[1];
      if (cid) return `https://ipfs.filebase.io/ipfs/${cid}`;
    }

    if (!img.startsWith("http") && img.startsWith("Qm")) {
      return `https://ipfs.filebase.io/ipfs/${img}`;
    }

    if (!img.startsWith("http")) {
      return `${apiURL}/uploads/products/${img}`;
    }

    return img;
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
        {/* wrapper cho scroll dọc + ngang */}
        <div
          style={{
            maxHeight: 600,        // khoảng 5–6 dòng
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <table className="ad-table ad-table-sticky" style={{ minWidth: 1200 }}>
            <thead>
              <tr>
                <th>Tên SP</th>
                <th>Mô tả</th>
                <th>Ảnh</th>
                <th>Trạng thái</th>
                <th>Tồn</th>
                <th>Thương hiệu</th>
                <th>Loại xe</th>   {/* NEW */}
                <th>Giá tiền</th>  {/* NEW */}
                <th>Ưu đãi (%)</th>
                <th>Tạo lúc</th>
                <th>Cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((p) => (
                  <tr key={p._id}>
                    {/* Tên sản phẩm – không fix width nữa */}
                    <td className="text-left">{p.pName}</td>

                    {/* Mô tả – rút ngắn để bảng gọn */}
                    <td className="text-left">
                      {(p.pDescription || "").length > 40
                        ? (p.pDescription || "").slice(0, 40) + "..."
                        : p.pDescription || "—"}
                    </td>

                    {/* Ảnh */}
                    <td className="text-center">
                      {p.pImages?.[0] ? (
                        <img
                          alt=""
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                          src={getImageSrc(p.pImages[0])}
                        />
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="text-center">
                      <span
                        className={`ad-badge ${
                          p.pStatus === "Active" ? "success" : ""
                        }`}
                      >
                        {p.pStatus || "—"}
                      </span>
                    </td>

                    {/* Tồn */}
                    <td className="text-right">{p.pQuantity ?? 0}</td>

                    {/* Thương hiệu (tên category) */}
                    <td className="text-center">
                      {p.pCategory?.cName || "—"}
                    </td>

                    {/* Loại xe (nếu bạn có field type, không thì fallback cName) */}
                    <td className="text-center">
                      {p.pCategory?.type || p.pCategory?.cName || "—"}
                    </td>

                    {/* Giá tiền */}
                    <td className="text-right">
                      {p.pPrice
                        ? p.pPrice.toLocaleString("vi-VN") + " ₫"
                        : "—"}
                    </td>

                    {/* Ưu đãi */}
                    <td className="text-right">{p.pOffer ?? 0}</td>

                    {/* Thời gian */}
                    <td className="text-center">
                      {p.createdAt ? moment(p.createdAt).format("lll") : "—"}
                    </td>
                    <td className="text-center">
                      {p.updatedAt ? moment(p.updatedAt).format("lll") : "—"}
                    </td>

                    {/* Hành động */}
                    <td className="text-center" style={{ paddingRight: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="ad-btn left"
                          type="button"
                          onClick={() => onEdit(p)}
                        >
                          Sửa
                        </button>
                        <button
                          className="ad-btn danger"
                          type="button"
                          onClick={() => onDelete(p._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">
                    Chưa có sản phẩm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ad-muted" style={{ marginTop: 8 }}>
          Tổng: {products.length} sản phẩm
        </div>
      </div>
    </div>
  );
}
