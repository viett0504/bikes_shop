// src/Admin/pagesAD/Products/AddProductModal.js
import React, { useContext, useState } from "react";
import { ProductContext } from "./index";
import { createProduct } from "./FetchApi";

export default function AddProductModal() {
  const { data, dispatch } = useContext(ProductContext);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);

  const close = () => dispatch({ type: "addProductModal", payload: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: gọi API thật sau
    await createProduct({ name, desc, stock, status, image });
    
    console.log("submit add product:", { name, desc, stock, status, image });
    close();
  };

  // Nếu cờ tắt thì không hiển thị
  if (!data.addProductModal) return null;

  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
        <h2 className="ad-form-title">Thêm sản phẩm</h2>

        <form onSubmit={handleSubmit}>
          {/* Hàng 1: Tên + Mô tả */}
          <div className="ad-form-row">
            <div className="ad-form-group">
              <label>Tên sản phẩm</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Xe đạp thể thao"
              />
            </div>

            <div className="ad-form-group">
              <label>Mô tả</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Mô tả ngắn gọn về sản phẩm"
              />
            </div>
          </div>

          {/* Hàng 2: Tồn kho + Trạng thái + Ảnh */}
          <div className="ad-form-row">
            <div className="ad-form-group ad-form-group-sm">
              <label>Tồn kho</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="ad-form-group ad-form-group-sm">
              <label>Thương hiệu</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Thêm thương hiệu"
              />
            </div>

            <div className="ad-form-group ad-form-group-sm">
              <label>Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="ad-form-group">
              <label>Ảnh</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0] || null)}
              />
            </div>
          </div>

          {/* Nút */}
          <div className="ad-form-actions">
            <button
              type="button"
              className="ad-btn"
              style={{ marginRight: 8 }}
              onClick={close}
            >
              Hủy
            </button>
            <button type="submit" className="ad-btn success">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}