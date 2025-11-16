// src/Admin/pagesAD/Products/AddProductModal.js
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProductContext } from "./index";
import { createProduct, editProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../Categories/FetchApi";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";

export default function AddProductModal() {
  const { data, dispatch } = useContext(ProductContext);
  const { addProductModal, editProductModal } = data;

  const isEditMode = !!editProductModal?.modal && !addProductModal;    
  const isOpen = addProductModal || isEditMode;       

  const [loading, setLoading] = useState(false);

  // State form
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [brand, setBrand] = useState(""); // _id category
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null); // file ảnh mới (nếu chọn)

  const [categories, setCategories] = useState([]);

  // Lưu tên gốc khi bắt đầu sửa, để so sánh xem user có đổi tên hay không
  const originalNameRef = useRef("");

  const resetForm = () => {
    setName("");
    setDesc("");
    setBrand("");
    setStock(0);
    setStatus("Active");
    setImage(null);
  };

  const close = () => {
    if (isEditMode) {
      dispatch({ type: "editProductModalClose" });
    } else {
      dispatch({ type: "addProductModal", payload: false });
    }
    resetForm();
    originalNameRef.current = "";
  };

  // ======= LOAD DANH MỤC KHI MODAL MỞ =======
  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        const res = await getAllCategory();
        setCategories(res?.Categories || []);
      } catch (err) {
        console.log("Lỗi load categories:", err);
      }
    };

    fetchCategories();
  }, [isOpen]);

  // ======= FILL FORM KHI ẤN SỬA / HOẶC RESET KHI ẤN THÊM =======
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editProductModal) {
      // fill data cũ vào form
      setName(editProductModal.pName || "");
      setDesc(editProductModal.pDescription || "");
      setBrand(
        editProductModal.pCategory?._id ||
          editProductModal.pCategory ||
          ""
      );
      setStock(editProductModal.pQuantity ?? 0);
      setStatus(editProductModal.pStatus || "Active");
      setImage(null);

      originalNameRef.current = editProductModal.pName || "";
    } else {
      // chế độ thêm mới
      resetForm();
      originalNameRef.current = "";
    }
  }, [isOpen, isEditMode, editProductModal]);

  // Nếu modal đóng thì không render gì
  if (!isOpen) return null;

  // ======= SUBMIT FORM =======
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sameName =
      isEditMode &&
      originalNameRef.current &&
      name.trim().toLowerCase() ===
        originalNameRef.current.trim().toLowerCase();

    if (!name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!desc.trim()) {
      alert("Vui lòng nhập mô tả sản phẩm");
      return;
    }
    if (!stock || Number(stock) <= 0) {
      alert("Vui lòng nhập số lượng tồn kho hợp lệ");
      return;
    }
    if (!brand) {
      alert("Vui lòng chọn thương hiệu");
      return;
    }
    if (!status) {
      alert("Vui lòng chọn trạng thái");
      return;
    }
    // YÊU CẦU ẢNH nếu:
    // - đang THÊM mới, hoặc
    // - đang SỬA nhưng ĐỔI TÊN (tức là sẽ tạo SP mới)
    if (!image && !sameName) {
      alert("Vui lòng chọn ảnh sản phẩm");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // ====== ĐANG Ở CHẾ ĐỘ SỬA ======
        if (sameName) {
          // 👉 Giữ nguyên tên -> CẬP NHẬT SẢN PHẨM HIỆN TẠI
          const payload = {
            pId: editProductModal._id || editProductModal.pId,
            pName: name,
            pDescription: desc,
            pStatus: status,
            pCategory: brand,
            pQuantity: stock,
            pPrice: editProductModal.pPrice ?? 0,
            pOffer: editProductModal.pOffer ?? 0,
            pImages: editProductModal.pImages || [],
            pEditImages: image ? [image] : [],
          };

          const res = await editProduct(payload);
          if (res?.success) {
            alert("Cập nhật sản phẩm thành công");
          } else if (res?.error) {
            alert(res.error);
          }
        } else {
          // 👉 ĐỔI TÊN SẢN PHẨM -> TẠO SẢN PHẨM MỚI
          const res = await createProduct({
            name,
            desc,
            image,
            status,
            category: brand,
            stock,
            price: editProductModal.pPrice ?? 0,
            offer: editProductModal.pOffer ?? 0,
          });

          if (res?.success) {
            alert("Đã thêm sản phẩm mới (do đổi tên sản phẩm)");
          } else if (res?.error) {
            alert(res.error);
          }
        }
      } else {
        // ====== CHẾ ĐỘ THÊM MỚI BÌNH THƯỜNG ======
        const res = await createProduct({
          name,
          desc,
          image,
          status,
          category: brand,
          stock,
          price: 0,
          offer: 0,
        });

        if (res?.success) {
          alert("Tạo sản phẩm thành công");
        } else if (res?.error) {
          alert(res.error);
        }
      }

      // Load lại list sản phẩm sau khi lưu
      const list = await getAllProduct();
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: list?.Products || [],
      });

      close();
    } catch (err) {
      console.log("Lỗi tạo/cập nhật sản phẩm:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Lỗi server khi tạo/cập nhật sản phẩm";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // ======= IMPORT TỪ EXCEL =======
  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rows.length) {
        alert("File Excel không có dữ liệu.");
        return;
      }

      const first = rows[0]; // lấy dòng đầu tiên để fill form

      setName(first["Tên sản phẩm"] || first["Ten SP"] || "");
      setDesc(first["Mô tả"] || first["Mo ta"] || "");
      setStock(first["Tồn kho"] || first["Ton kho"] || 0);

      // map tên thương hiệu trong Excel -> _id trong categories
      const brandName =
        first["Thương hiệu"] ||
        first["Thuong hieu"] ||
        first["Brand"] ||
        "";

      if (brandName && categories.length) {
        const found = categories.find((c) => c.cName === brandName);
        if (found) setBrand(found._id);
      }

      const st =
        first["Trạng thái"] ||
        first["Trang thai"] ||
        first["Status"] ||
        "Active";
      setStatus(st === "Inactive" ? "Inactive" : "Active");

      console.log("Import từ Excel:", first);
    } catch (err) {
      console.log("Lỗi đọc file Excel:", err);
      alert("Không đọc được file Excel, vui lòng kiểm tra lại.");
    }
  };

  // ======= RENDER UI =======
  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
        {/* HEADER: tiêu đề + nút Excel */}
        <div className="ad-form-header">
          <h2 className="ad-form-title">
            {isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </h2>

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
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">-- Chọn thương hiệu --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.cName}
                  </option>
                ))}
              </select>
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
