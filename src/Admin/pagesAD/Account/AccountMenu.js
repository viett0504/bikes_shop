import React, { useContext } from "react";
import { AccountContext } from "./index";

export default function AccountMenu() {
  const { data, dispatch } = useContext(AccountContext);
  const searching = data?.searching || "";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20rem",
        margin: "16px 0",
      }}
    >
      {/* Nút thêm tài khoản */}
      {/* <div className="ad-card ad-add" style={{ margin: 0 }}>
        <div className="ad-body">
          <button
            className="ad-btn"
            onClick={() => {
              dispatch({ type: "editProductModalClose" });
              dispatch({ type: "addProductModal", payload: true });
            }}
          >
            + Thêm tài khoản
          </button>
        </div>
      </div> */}

      {/* Ô tìm kiếm – gọn, không kéo full width */}
      <input
        type="text"
        value={searching}
        onChange={(e) =>
          dispatch({ type: "setSearchText", payload: e.target.value })
        }
        placeholder="Tìm kiếm tên tài khoản..."
        style={{
          flex: "0 1 25%",       // chiếm ~60% hàng, có thể co giãn
          maxWidth: "720px",     // không dài quá
          minWidth: "260px",     // không nhỏ quá khi thu hẹp
          padding: "10px 18px",
          borderRadius: "999px",
          border: "1px solid #3b3b3b",
          outline: "none",
          background: "#fff",
          fontSize: "14px",
        }}
      />
    </div>
  );
}
