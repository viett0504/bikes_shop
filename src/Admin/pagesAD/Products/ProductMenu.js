import React, { useContext } from "react";
import { ProductContext } from "./index";

export default function ProductMenu() {
  const { dispatch } = useContext(ProductContext);
  return (
    <div className="ad-card ad-add">
      <div className="ad-body" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button className="ad-btn"
          onClick={() => {
            dispatch({ type: "editProductModalClose" });          
            dispatch({ type: "addProductModal", payload: true }); 
          }}
        >
          + Thêm sản phẩm
        </button>

        {/* Sau này nhúng AddProductModal / EditProductModal nếu muốn */}
      </div>
    </div>
  );
}
