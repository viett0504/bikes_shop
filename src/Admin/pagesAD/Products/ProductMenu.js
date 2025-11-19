import React, { useContext } from "react";
import { ProductContext } from "./index";

export default function ProductMenu() {
  const { data, dispatch } = useContext(ProductContext);
  const searchText = data?.searchText || "";

  return (
    // 🔥 container ngoài dùng flex để xếp 1 hàng
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
        marginTop: "16px",
      }}
    >
      {/* Chỉ button nằm trong ad-card ad-add */}
      <div className="ad-card ad-add" style={{ margin: 0 }}>
        <div className="ad-body">
          <button
            className="ad-btn"
            onClick={() => {
              dispatch({ type: "editProductModalClose" });
              dispatch({ type: "addProductModal", payload: true });
            }}
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Ô tìm kiếm đứng cạnh, KHÔNG dính ad-add */}
      <input
        type="text"
        value={searchText}
        onChange={(e) =>
          dispatch({ type: "setSearchText", payload: e.target.value })
        }
        placeholder="Tìm kiếm sản phẩm..."
        style={{
          flex: 1,
          width: "3rem",
          padding: "10px 14px",
          borderRadius: "999px",
          border: "1px solid #ccc",
          outline: "none",
          background: "#fff",
        }}
      />
    </div>
  );
}
