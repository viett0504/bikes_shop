// src/Admin/pagesAD/Categories/EditCategoryModal.js
import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "./index";
import { editCategory } from "./FetchApi";

const EditCategoryModal = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const { editCategoryModal } = data; // { modal, cId, des, status, cName }

  const [des, setDes] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editCategoryModal.modal) {
      setDes(editCategoryModal.des || "");
      setStatus(editCategoryModal.status || "Active");
    }
  }, [editCategoryModal]);

  if (!editCategoryModal.modal) return null;

  const close = () => {
    dispatch({ type: "editCategoryModalClose" });
  };

  const handleEdit = async () => {
    setLoading(true);
    const res = await editCategory({
      cId: editCategoryModal.cId,
      des,
      status,
    });
    setLoading(false);

    if (res?.success) {
      alert("Cập nhật danh mục thành công!");
      close();
      window.location.reload();
    } else {
      alert(res?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="ad-modal">
      <div className="ad-modal-content">
        <h3>✏️ Chỉnh sửa danh mục</h3>

        <div className="ad-form">
          <label>Tên danh mục</label>
          <input value={editCategoryModal.cName || ""} disabled />

          <label>Mô tả</label>
          <textarea
            rows="3"
            value={des}
            onChange={(e) => setDes(e.target.value)}
          />

          <label>Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="ad-modal-actions">
          <button className="ad-btn" onClick={close}>
            Hủy
          </button>
          <button
            className="ad-btn success"
            onClick={handleEdit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
