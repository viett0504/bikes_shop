// src/Admin/pagesAD/BikeType/EditBikeTypeModal.js
import React, { useContext, useEffect, useState } from "react";
import { BikeTypeContext } from "./index";
import { editBikeType, getAllBikeType } from "./FetchApi";
import { useNotification } from "../../../Customer/components/Noti/notification";

export default function EditBikeTypeModal() {
  const { data, dispatch } = useContext(BikeTypeContext);
  const { editTypeModal } = data; // { modal, _id, name, description, status }
  const { showNotification } = useNotification();

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

  const logBikeTypeAction = async (action, extra = {}) => {
    try {
      await fetch("/logs/activity/admin/bike-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ...extra,
        }),
      });
    } catch (err) {
      console.error("Log bike type error:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification("Vui lòng nhập tên loại xe", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }

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
        showNotification("Cập nhật loại xe thành công!", "success", {
          title: "Thao tác thành công",
        });

        // ghi log
        logBikeTypeAction("ADMIN_EDIT_BIKE_TYPE", {
          id: editTypeModal._id,
          name,
          status,
        });

        const list = await getAllBikeType();
        dispatch({
          type: "fetchTypesAndChangeState",
          payload: list?.BikeTypes || [],
        });
        close();
      } else {
        const msg = res?.error || res?.message || "Có lỗi xảy ra!";
        showNotification(msg, "error", { title: "Cập nhật thất bại" });
      }
    } catch (err) {
      setLoading(false);
      console.log("Lỗi sửa loại xe:", err);
      showNotification("Lỗi server khi cập nhật loại xe", "error", {
        title: "Lỗi server",
      });
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
