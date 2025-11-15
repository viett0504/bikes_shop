// src/Admin/pagesAD/Categories/AddCategoryModal.js
import React, { useContext, useState } from "react";
import { CategoryContext } from "./index";
import { createCategory } from "./FetchApi";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";

const AddCategoryModal = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const { addCategoryModal } = data;

  // 🔹 Hook luôn đặt ở top
  const [cName, setCName] = useState("");
  const [cDescription, setCDescription] = useState("");
  const [cStatus, setCStatus] = useState("Active");
  const [cImage, setCImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!addCategoryModal) return null;

  const close = () => {
    dispatch({ type: "addCategoryModal", payload: false });
  };

  const resetForm = () => {
    setCName("");
    setCDescription("");
    setCStatus("Active");
    setCImage(null);
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
      resetForm();
      window.location.reload(); // tạm thời reload list
    } else {
      alert(res?.message || "Có lỗi xảy ra!");
    }
  };

  // ================== IMPORT EXCEL ==================
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
      e.target.value = ""; // reset input để chọn lại cùng file vẫn được
    }
  };

  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
        {/* ===== HEADER + NÚT EXCEL ===== */}
        <div className="ad-form-header">
          <h3 className="ad-form-title">Thêm danh mục</h3>

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
              onChange={(e) => setCImage(e.target.files[0] || null)}
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
