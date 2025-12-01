// src/Admin/pagesAD/Categories/AddCategoryModal.js
import React, { useContext, useEffect, useState } from "react";
import { CategoryContext } from "./index";
import { createCategory, editCategory, getAllCategory } from "./FetchApi";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";
import { useNotification } from "../../../Customer/components/Noti/notification";

const AddCategoryModal = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const { addCategoryModal, editCategoryModal } = data;
  // editCategoryModal: { modal, cId, des, status, cName }

  const { showNotification } = useNotification();

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

  // log category action
  const logCategoryAction = async (action, extra = {}) => {
    try {
      await fetch("/logs/activity/admin/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
    } catch (err) {
      console.error("Log category error:", err);
    }
  };

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
      showNotification("Tên danh mục không được để trống", "warning", {
        title: "Thiếu thông tin",
      });
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
          showNotification("Cập nhật danh mục thành công!", "success", {
            title: "Thao tác thành công",
          });

          await logCategoryAction("ADMIN_EDIT_CATEGORY", {
            id: editCategoryModal.cId,
            name: cName,
            status: cStatus,
          });
        } else {
          const msg = res?.error || res?.message || "Có lỗi xảy ra!";
          showNotification(msg, "error", { title: "Cập nhật thất bại" });
        }
      } else {
        const res = await createCategory({
          cName,
          cDescription,
          cStatus,
          cImage,
        });

        if (res?.success) {
          showNotification("Thêm danh mục thành công!", "success", {
            title: "Thao tác thành công",
          });

          await logCategoryAction("ADMIN_ADD_CATEGORY", {
            name: cName,
            status: cStatus,
          });
        } else {
          const msg = res?.message || "Có lỗi xảy ra!";
          showNotification(msg, "error", { title: "Thêm danh mục thất bại" });
        }
      }

      const list = await getAllCategory();
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: list?.Categories || [],
      });

      close();
    } catch (err) {
      console.error(err);
      showNotification("Lỗi server khi xử lý danh mục", "error", {
        title: "Lỗi server",
      });
    } finally {
      setLoading(false);
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
        showNotification("File Excel không có dữ liệu!", "warning", {
          title: "Không có dữ liệu",
        });
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
        first["Mô tả"] || first["Description"] || first["Ghi chú"] || ""
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
      showNotification(
        "Không đọc được file Excel. Vui lòng kiểm tra lại.",
        "error",
        { title: "Lỗi import" }
      );
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
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

        <form onSubmit={handleSubmit}>
          <div className="ad-form-row">
            <div className="ad-form-group">
              <label>Tên danh mục</label>
              <input
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="Ví dụ: Xe đạp địa hình"
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

            <div className="ad-form-group ad-form-group-sm">
              <label>Ảnh danh mục</label>
              <input
                type="file"
                onChange={(e) => setCImage(e.target.files[0] || null)}
              />
            </div>
          </div>

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
