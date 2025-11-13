// src/Admin/pagesAD/Categories/AddCategoryModal.js
import React, { useContext, useState } from "react";
import { CategoryContext } from "./index";
import { createCategory } from "./FetchApi";

const AddCategoryModal = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const { addCategoryModal } = data;

  // 🔹 Hook luôn nằm ở TOP, không nằm trong if
  const [cName, setCName] = useState("");
  const [cDescription, setCDescription] = useState("");
  const [cStatus, setCStatus] = useState("Active");
  const [cImage, setCImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Sau khi khai báo hook mới được return condition
  if (!addCategoryModal) return null;

  const close = () => {
    dispatch({ type: "addCategoryModal", payload: false });
  };

  const handleAdd = async () => {
    if (!cName.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    setLoading(true);
    const res = await createCategory({
      cName,
      cDescription,
      cStatus,
      cImage,
    });
    setLoading(false);

    if (res?.success) {
      alert("Thêm danh mục thành công!");
      close();
      window.location.reload(); // tạm thời reload
    } else {
      alert(res?.message || "Có lỗi xảy ra!");
    }
  };

return (
  <div className="ad-card">
    <div className="ad-body">
      <h3 style={{ marginBottom: 16 }}>➕ Thêm danh mục</h3>

      {/* FORM 2 CỘT GỌN GÀNG */}
      <div className="ad-form-grid">
        <div className="ad-form-group">
          <label>Tên danh mục</label>
          <input
            value={cName}
            onChange={(e) => setCName(e.target.value)}
            placeholder="Ví dụ: Xe đạp địa hình"
          />
        </div>

        <div className="ad-form-group ad-form-group-full">
          <label>Mô tả</label>
          <textarea
            rows="3"
            value={cDescription}
            onChange={(e) => setCDescription(e.target.value)}
            placeholder="Mô tả ngắn về danh mục..."
          />
        </div>

        <div className="ad-form-group">
          <label>Trạng thái</label>
          <select
            value={cStatus}
            onChange={(e) => setCStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="ad-form-group">
          <label>Ảnh danh mục</label>
          <input
            type="file"
            onChange={(e) => setCImage(e.target.files[0])}
          />
        </div>
      </div>

      {/* NÚT */}
      <div className="ad-form-actions">
        <button className="ad-btn" onClick={close}>
          Hủy
        </button>
        <button
          className="ad-btn success"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm mới"}
        </button>
      </div>
    </div>
  </div>
);
};

export default AddCategoryModal;
