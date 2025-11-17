// src/Admin/pagesAD/BikeType/EditBikeTypeModal.js
import React, { useContext, useEffect, useState } from "react";
import { BikeTypeContext } from "./index";
import { editBikeType, getAllBikeType } from "./FetchApi";

export default function EditBikeTypeModal() {
  const { data, dispatch } = useContext(BikeTypeContext);
  const { editTypeModal } = data; // { modal, _id, name, description, status }

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTypeModal.modal) {
      setName(editTypeModal.name || "");
      setDescription(editTypeModal.description || "");
      setStatus(editTypeModal.status || "Active");
    }
  }, [editTypeModal]);

  if (!editTypeModal.modal) return null;

  const close = () => {
    dispatch({ type: "editTypeModalClose" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Vui lòng nhập tên loại xe");

    try {
      setLoading(true);
      const res = await editBikeType({
        tId: editTypeModal._id,
        name,
        description,
        status,
      });
      setLoading(false);

      if (res?.success) {
        alert("Cập nhật loại xe thành công!");
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
      console.log("Lỗi sửa loại xe:", err);
      alert("Lỗi server khi cập nhật loại xe");
    }
  };

  return (
    <div className="ad-modal">
      <div className="ad-modal-content">
        <h3>Chỉnh sửa loại xe</h3>

        <form className="ad-form" onSubmit={handleSave}>
          <label>Tên loại xe</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Mô tả</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
