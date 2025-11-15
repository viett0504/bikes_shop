// src/Admin/pagesAD/Products/AddProductModal.js
import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { createProduct } from "./FetchApi";
import * as XLSX from "xlsx";          // <-- thêm dòng này
import { FiUpload } from "react-icons/fi";  // icon cho nút Excel (npm i react-icons nếu chưa có)

export default function AddProductModal() {
  const { data, dispatch } = useContext(ProductContext);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);

  const close = () => dispatch({ type: "addProductModal", payload: false });

  const resetForm = () => {
    setName("");
    setDesc("");
    setBrand("");
    setStock(0);
    setStatus("Active");
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: gọi API thật
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("desc", desc);
    // formData.append("brand", brand);
    // formData.append("stock", stock);
    // formData.append("status", status);
    // if (image) formData.append("image", image);
    // await createProduct(formData);

    console.log("submit add product:", { name, desc, brand, stock, status, image });
    close();
    resetForm();
  };

  // ======= IMPORT TỪ EXCEL =======
  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Chuyển sheet sang JSON dạng mảng object.
      // Giả sử hàng đầu là header:
      // Tên sản phẩm | Mô tả | Tồn kho | Thương hiệu | Trạng thái
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rows.length) {
        alert("File Excel không có dữ liệu.");
        return;
      }

      const first = rows[0]; // lấy dòng đầu tiên để fill form

      // Tùy bạn đặt tên cột trong Excel, ví dụ:
      // "Tên sản phẩm", "Mô tả", "Tồn kho", "Thương hiệu", "Trạng thái"
      setName(first["Tên sản phẩm"] || first["Ten SP"] || "");
      setDesc(first["Mô tả"] || first["Mo ta"] || "");
      setStock(first["Tồn kho"] || first["Ton kho"] || 0);
      setBrand(first["Thương hiệu"] || first["Thuong hieu"] || "");
      const st =
        first["Trạng thái"] ||
        first["Trang thai"] ||
        "Active";
      setStatus(st === "Inactive" ? "Inactive" : "Active");

      console.log("Import từ Excel:", first);
    } catch (err) {
      console.error(err);
      alert("Không đọc được file Excel. Kiểm tra lại định dạng (.xlsx, .xls).");
    } finally {
      // để lần sau chọn lại cùng file vẫn trigger onChange
      e.target.value = "";
    }
  };

  if (!data.addProductModal) return null;

  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
        {/* ===== HEADER: tiêu đề + nút Excel ===== */}
        <div className="ad-form-header">
          <h2 className="ad-form-title">Thêm sản phẩm</h2>

          <div className="ad-form-tools">
            {/* input file Excel ẩn */}
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelImport}
              style={{ display: "none" }}
            />

            {/* nút bấm đẹp để upload Excel */}
            <label htmlFor="excel-upload" className="ad-btn secondary small">
              <FiUpload style={{ marginRight: 6 }} />
              Nhập từ Excel
            </label>
          </div>
        </div>

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

          {/* Hàng 2: Tồn kho + Thương hiệu + Trạng thái + Ảnh */}
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
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Thêm tên thương hiệu"
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
              onClick={() => {
                close();
                resetForm();
              }}
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
