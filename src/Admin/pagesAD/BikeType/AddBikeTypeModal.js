// src/Admin/pagesAD/BikeType/AddBikeTypeModal.js
import React, { useContext, useState } from "react";
import { BikeTypeContext } from "./index";
import { addBikeType, getAllBikeType } from "./FetchApi";

export default function AddBikeTypeModal() {
  const { data, dispatch } = useContext(BikeTypeContext);
  const { addTypeModal } = data;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  if (!addTypeModal) return null;

  const close = () => {
    dispatch({ type: "addTypeModal", payload: false });
    setName("");
    setDescription("");
    setStatus("Active");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Vui lòng nhập tên loại xe");

    try {
      setLoading(true);
      const res = await addBikeType({ name, description, status });
      setLoading(false);

      if (res?.success) {
        alert("Thêm loại xe thành công!");
        // reload list
        const list = await getAllBikeType();
        dispatch({
          type: "fetchTypesAndChangeState",
          payload: list?.BikeTypes || [],
        });
        close();
      } else {
        alert(res?.error || res?.message || "Có lỗi xảy ra!");
      }
    } catch (err) {
      setLoading(false);
      console.log("Lỗi thêm loại xe:", err);
      alert("Lỗi server khi thêm loại xe");
    }
  };

  return (
    <div className="ad-modal">
      <div className="ad-modal-content">
        <h3>+ Thêm loại xe</h3>

        <form className="ad-form" onSubmit={handleSubmit}>
          <label>Tên loại xe</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Xe đạp địa hình"
          />

          <label>Mô tả</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn gọn"
          />

          <label>Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="ad-modal-actions">
            <button
              type="button"
              className="ad-btn"
              onClick={close}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="ad-btn success"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
