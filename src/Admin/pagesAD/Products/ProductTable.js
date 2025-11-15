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
    dispatch({
      type: "editProductModalOpen",
      product: p,
    });
  };

  const getImageSrc = (img) => {
    if (!img) return "";

    // Nếu BE lưu full URL có /ipfs/
    if (img.startsWith("http") && img.includes("/ipfs/")) {
      const cid = img.split("/ipfs/")[1];
      if (cid) {
        return `https://ipfs.filebase.io/ipfs/${cid}`;
      }
    }

    // BE lưu CID 
    if (!img.startsWith("http") && img.startsWith("Qm")) {
      return `https://ipfs.filebase.io/ipfs/${img}`;
    }

    // Không phải IPFS → coi như ảnh nằm ở server backend
    if (!img.startsWith("http")) {
      return `${apiURL}/uploads/products/${img}`;
    }

    // Mặc định: trả về nguyên URL
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
      <div className="ad-body" style={{ overflowX: "auto" }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Tên SP</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Tồn</th>
              <th>Danh mục</th>
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
                  <td className="text-left">{p.pName}</td>
                  <td className="text-left">
                    {(p.pDescription || "").slice(0, 30)}…
                  </td>
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
                        // Ảnh là URL (Filebase) thì có thể dùng trực tiếp p.pImages[0]
                        src={getImageSrc(p.pImages[0])}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="text-center">
                    <span
                      className={`ad-badge ${
                        p.pStatus === "Active" ? "success" : ""
                      }`}
                    >
                      {p.pStatus || "—"}
                    </span>
                  </td>
                  <td className="text-right">{p.pQuantity ?? 0}</td>
                  <td className="text-center">
                    {p.pCategory?.cName || "—"}
                  </td>
                  <td className="text-right">{p.pOffer ?? 0}</td>
                  <td className="text-center">
                    {p.createdAt ? moment(p.createdAt).format("lll") : "—"}
                  </td>
                  <td className="text-center">
                    {p.updatedAt ? moment(p.updatedAt).format("lll") : "—"}
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
                        className="ad-btn"
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
                <td colSpan="10" className="text-center">
                  Chưa có sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="ad-muted" style={{ marginTop: 8 }}>
          Tổng: {products.length} sản phẩm
        </div>
      </div>
    </div>
  );
}
