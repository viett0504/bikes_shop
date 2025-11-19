// src/Admin/pagesAD/Products/ProductTable.js
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { ProductContext } from "./index";
import { getAllProduct, deleteProduct } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

const calcDiscountPrice = (price, offer) => {
  const p = Number(price) || 0;
  const o = Number(offer) || 0;
  if (!p) return 0;
  const final = (p * (100 - o)) / 100;
  return Math.round(final);
};

export default function ProductTable() {
  const { data, dispatch } = useContext(ProductContext);

  // Chống crash nếu data chưa có
  const products = data?.products || [];
  const searchText = data?.searchText || "";

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

  const onDelete = async (id, name) => {
    const ok = window.confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`
    );
    if (!ok) return;

    const r = await deleteProduct(id);
    if (r?.success) fetchData();
  };


  const onEdit = (p) => {
    dispatch({ type: "addProductModal", payload: false });
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
      // 🔧 chỗ này lúc nãy dễ bị thiếu dấu ` hoặc dấu "
      return `${apiURL}/uploads/products/${img}`;
    }

    return img;
  };

  // ------ FILTER THEO TÊN/MÔ TẢ ------
  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((p) => {
        const name = (p.pName || "").toLowerCase();
        return (
          name.includes(normalizedSearch) 
        );
      })
    : products;

  // ------ UI ------
  if (loading)
    return (
      <div className="ad-card">
        <div className="ad-body">Đang tải…</div>
      </div>
    );

  return (
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
            style={{ minWidth: 1300 }}
          >
            <thead>
              <tr>
                <th>Tên SP</th>
                <th>Mô tả</th>
                <th>Ảnh</th>
                <th>Trạng thái</th>
                <th>Tồn</th>
                <th>Thương hiệu</th>
                <th>Loại xe</th>
                <th>Giá gốc</th>
                <th>Giảm giá (%)</th>
                <th>Giá sau giảm</th>
                <th>Tạo lúc</th>
                <th>Cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length ? (
                filteredProducts.map((p) => {
                  const discountPrice = calcDiscountPrice(
                    p.pPrice,
                    p.pOffer
                  );

                  return (
                    <tr key={p._id}>
                      <td className="text-left">{p.pName}</td>

                      <td className="text-left">
                        {(p.pDescription || "").length > 40
                          ? (p.pDescription || "").slice(0, 40) + "..."
                          : p.pDescription || "—"}
                      </td>

                      <td className="text-center">
                        {p.pImages?.[0] ? (
                          <img
                            alt=""
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
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

                      <td className="text-right">
                        {p.pQuantity ?? 0}
                      </td>

                      <td className="text-center">
                        {p.pCategory?.cName || "—"}
                      </td>

                      <td className="text-center">
                        {p.pBiketype?.tName || "—"}
                      </td>

                      <td className="text-right">
                        {p.pPrice
                          ? p.pPrice.toLocaleString("vi-VN") + " ₫"
                          : "—"}
                      </td>

                      <td className="text-right">
                        {p.pOffer ?? 0}
                      </td>

                      <td className="text-right">
                        {discountPrice
                          ? discountPrice.toLocaleString("vi-VN") + " ₫"
                          : "—"}
                      </td>

                      <td className="text-center">
                        {p.createdAt
                          ? moment(p.createdAt).format("lll")
                          : "—"}
                      </td>
                      <td className="text-center">
                        {p.updatedAt
                          ? moment(p.updatedAt).format("lll")
                          : "—"}
                      </td>

                      <td
                        className="text-center"
                        style={{ paddingRight: 12 }}
                      >
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
                            onClick={() => onDelete(p._id, p.pName)}
                          >
                            Xóa
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="13" className="text-center">
                    Chưa có sản phẩm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ad-muted" style={{ marginTop: 8 }}>
          Tổng: {filteredProducts.length} sản phẩm
        </div>
      </div>
    </div>
  );
}
