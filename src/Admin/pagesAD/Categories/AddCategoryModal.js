// src/Admin/pagesAD/Categories/AddCategoryModal.js
import React, { useContext, useEffect, useState } from "react";
import { CategoryContext } from "./index";
import { createCategory, editCategory, getAllCategory } from "./FetchApi";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";

const AddCategoryModal = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const { addCategoryModal, editCategoryModal } = data;
  // editCategoryModal: { modal, cId, des, status, cName }

  // ✅ mode giống AddProductModal
  const isEditMode = !!editCategoryModal?.modal && !addCategoryModal;
  const isOpen = addCategoryModal || isEditMode;

  const [cName, setCName] = useState("");
  const [cDescription, setCDescription] = useState("");
  const [cStatus, setCStatus] = useState("Active");
  const [cImage, setCImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCName("");
    setCDescription("");
    setCStatus("Active");
    setCImage(null);
  };

  const close = () => {
    if (isEditMode) {
      dispatch({ type: "editCategoryModalClose" });
    } else {
      dispatch({ type: "addCategoryModal", payload: false });
    }
    resetForm();
  };

  // Fill form khi ấn Sửa / reset khi Thêm mới
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editCategoryModal) {
      setCName(editCategoryModal.cName || "");
      setCDescription(editCategoryModal.des || "");
      setCStatus(editCategoryModal.status || "Active");
      setCImage(null);
    } else {
      resetForm();
    }
  }, [isOpen, isEditMode, editCategoryModal]);

  if (!isOpen) return null;

  // ================== SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cName.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        const res = await editCategory({
          cId: editCategoryModal.cId,
          des: cDescription,
          status: cStatus,
        });

        if (res?.success) {
          alert("Cập nhật danh mục thành công!");
        } else {
          alert(res?.error || res?.message || "Có lỗi xảy ra!");
        }
      }
      else {
        // ➕ THÊM DANH MỤC
        const res = await createCategory({
          cName,
          cDescription,
          cStatus,
          cImage,
        });

        if (res?.success) {
          alert("Thêm danh mục thành công!");
        } else {
          alert(res?.message || "Có lỗi xảy ra!");
        }
      }

      // 🔁 Load lại list cho AllCategory, không dùng reload()
      const list = await getAllCategory();
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: list?.Categories || [],
      });

      close();
    } catch (err) {
      console.error(err);
      alert("Lỗi server khi xử lý danh mục");
    } finally {
      setLoading(false);
    }
  };

  // ================== IMPORT EXCEL (chung form, chủ yếu dùng khi Thêm) ==================
  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buf = await file.arrayBuffer();
      const workbook = XLSX.read(buf, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rows.length) {
        alert("File Excel không có dữ liệu!");
        return;
      }

      const first = rows[0];

      setCName(
        first["Tên danh mục"] ||
          first["Tên"] ||
          first["CategoryName"] ||
          first["Name"] ||
          ""
      );

      setCDescription(
        first["Mô tả"] ||
          first["Description"] ||
          first["Ghi chú"] ||
          ""
      );

      const rawStatus =
        first["Trạng thái"] || first["Status"] || first["state"] || "";
      if (rawStatus) {
        const norm = String(rawStatus).toLowerCase();
        if (["active", "hoạt động", "1"].includes(norm)) setCStatus("Active");
        else if (["inactive", "ngừng", "0"].includes(norm))
          setCStatus("Inactive");
      }

      console.log("Import category Excel:", first);
    } catch (err) {
      console.error(err);
      alert("Không đọc được file Excel. Vui lòng kiểm tra lại.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
        {/* ===== HEADER giống AddProduct ===== */}
        <div className="ad-form-header">
          <h3 className="ad-form-title">
            {isEditMode ? "Sửa danh mục" : "Thêm danh mục"}
          </h3>

          <div className="ad-form-tools">
            <input
              id="excel-upload-category"
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={handleExcelImport}
            />

            <label
              htmlFor="excel-upload-category"
              className="ad-btn secondary small"
            >
              <FiUpload size={16} style={{ marginRight: 6 }} />
              Nhập từ Excel
            </label>
          </div>
        </div>

        {/* ===== FORM giống style AddProductModal ===== */}
        <form onSubmit={handleSubmit}>
          {/* Hàng 1: Tên + Mô tả */}
          <div className="ad-form-row">
            <div className="ad-form-group">
              <label>Tên danh mục</label>
              <input
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="Ví dụ: Xe đạp địa hình"
                // Nếu bạn muốn cấm đổi tên khi sửa thì thêm disabled={isEditMode}
              />
            </div>

            <div className="ad-form-group">
              <label>Mô tả</label>
              <textarea
                rows={3}
                value={cDescription}
                onChange={(e) => setCDescription(e.target.value)}
                placeholder="Mô tả ngắn về danh mục..."
              />
            </div>
          </div>

          {/* Hàng 2: Trạng thái + Ảnh */}
          <div className="ad-form-row">
            <div className="ad-form-group ad-form-group-sm">
              <label>Trạng thái</label>
              <select
                value={cStatus}
                onChange={(e) => setCStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Ảnh – bạn có thể ẩn khi edit nếu BE chưa hỗ trợ sửa ảnh */}
            <div className="ad-form-group ad-form-group-sm">
              <label>Ảnh danh mục</label>
              <input
                type="file"
                onChange={(e) => setCImage(e.target.files[0] || null)}
              />
            </div>
          </div>

          {/* NÚT – 2 nút trong 1 form giống AddProduct */}
          <div className="ad-form-actions">
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
              {loading
                ? isEditMode
                  ? "Đang lưu..."
                  : "Đang thêm..."
                : isEditMode
                ? "Lưu thay đổi"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
