// src/Admin/pagesAD/BikeType/AddBikeTypeModal.js
import React, { useContext, useState } from "react";
import { BikeTypeContext } from "./index";
import { addBikeType, getAllBikeType } from "./FetchApi";
import { useNotification } from "../../../Customer/components/Noti/notification";

export default function AddBikeTypeModal() {
  const { data, dispatch } = useContext(BikeTypeContext);
  const { addTypeModal } = data;
  const { showNotification } = useNotification();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification("Vui lòng nhập tên loại xe", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await addBikeType({ name, description, status });
      setLoading(false);

      if (res?.success) {
        showNotification("Thêm loại xe thành công!", "success", {
          title: "Thao tác thành công",
        });

        // ghi log
        logBikeTypeAction("ADMIN_ADD_BIKE_TYPE", { name, status });

        // reload list
        const list = await getAllBikeType();
        dispatch({
          type: "fetchTypesAndChangeState",
          payload: list?.BikeTypes || [],
        });
        close();
      } else {
        const msg = res?.error || res?.message || "Có lỗi xảy ra!";
        showNotification(msg, "error", { title: "Thêm loại xe thất bại" });
      }
    } catch (err) {
      setLoading(false);
      console.log("Lỗi thêm loại xe:", err);
      showNotification("Lỗi server khi thêm loại xe", "error", {
        title: "Lỗi server",
      });
    }
  };

  return (
    <div className="ad-modal">
      <div className="ad-modal-content">
        <h3>Thêm loại xe</h3>

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
