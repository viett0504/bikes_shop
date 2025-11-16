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

  const isEditMode = !!editProductModal?.modal;   // đang sửa?
  const isOpen = addProductModal || isEditMode;   // mở modal nếu add hoặc edit

  const [loading, setLoading] = useState(false);

  // ===== STATE FORM SẢN PHẨM =====
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [brand, setBrand] = useState("");      // category _id
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const [price, setPrice] = useState(0);
  const [offer, setOffer] = useState(0);
  const [type, setType] = useState("");

  const originalNameRef = useRef("");

  // ===== RESET FORM =====
  const resetForm = () => {
    setName("");
    setDesc("");
    setBrand("");
    setStock(0);
    setStatus("Active");
    setImage(null);
    setPrice(0);
    setOffer(0);
    setType("");
  };

  // ===== ĐÓNG MODAL =====
  const close = () => {
    dispatch({ type: "addProductModal", payload: false });
    dispatch({ type: "editProductModalClose" });
    resetForm();
    originalNameRef.current = "";
  };

  // ===== LOAD CATEGORY =====
  useEffect(() => {
    if (!isOpen) return;

    const loadCat = async () => {
      try {
        const res = await getAllCategory();
        setCategories(res?.Categories || []);
      } catch (err) {
        console.log("Lỗi load categories:", err);
      }
    };

    loadCat();
  }, [isOpen]);

  // ===== FILL FORM KHI SỬA =====
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editProductModal) {
      setName(editProductModal.pName || "");
      setDesc(editProductModal.pDescription || "");
      setBrand(
        editProductModal.pCategory?._id ||
        editProductModal.pCategory ||
        ""
      );
      setStock(editProductModal.pQuantity ?? 0);
      setStatus(editProductModal.pStatus || "Active");

      setPrice(editProductModal.pPrice ?? 0);
      setOffer(editProductModal.pOffer ?? 0);
      setType(editProductModal.pType ?? "");

      originalNameRef.current = editProductModal.pName;
    } else {
      resetForm();
    }
  }, [isOpen, isEditMode, editProductModal]);

  if (!isOpen) return null;

  // ===== SUBMIT FORM =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!name.trim()) return alert("Vui lòng nhập tên sản phẩm");
    if (!desc.trim()) return alert("Vui lòng nhập mô tả");
    if (!brand) return alert("Vui lòng chọn thương hiệu");
    if (!stock || Number(stock) <= 0)
      return alert("Tồn kho phải lớn hơn 0");

    const sameName =
      isEditMode &&
      name.trim().toLowerCase() ===
        originalNameRef.current.trim().toLowerCase();

    if (!image && (!isEditMode || !sameName))
      return alert("Vui lòng chọn ảnh");

    try {
      setLoading(true);

      let res;

      if (isEditMode) {
        // ==== SỬA ====
        const payload = {
          pId: editProductModal._id,
          pName: name,
          pDescription: desc,
          pStatus: status,
          pCategory: brand,
          pQuantity: stock,
          pPrice: price,
          pOffer: offer,
          pType: type,
          pImages: editProductModal.pImages || [],
          pEditImages: image ? [image] : [],
        };

        res = await editProduct(payload);
      } else {
        // ==== THÊM MỚI ====
        res = await createProduct({
          name,
          desc,
          image,
          status,
          category: brand,
          stock,
          price,
          offer,
          type,
        });
      }

      if (res?.success) alert(res.success);
      else if (res?.error) alert(res.error);

      // Load lại danh sách
      const list = await getAllProduct();
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: list?.Products || [],
      });

      close();
    } catch (err) {
      console.log("Lỗi:", err);
      alert("Có lỗi xảy ra khi lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // ===== IMPORT EXCEL =====
  const handleExcelImport = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      if (!rows.length) return;

      const r = rows[0];
      setName(r["Tên sản phẩm"]);
      setDesc(r["Mô tả"]);
      setStock(r["Tồn kho"]);
      setPrice(r["Giá"] || 0);
      setOffer(r["Ưu đãi"] || 0);
      setType(r["Loại xe"] || "");

      const brandName = r["Thương hiệu"];
      const b = categories.find((c) => c.cName === brandName);
      if (b) setBrand(b._id);

    } catch (err) {
      console.log("Excel error:", err);
    }
  };

  // ===== UI FORM =====
  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">

        {/* Header */}
        <div className="ad-form-header">
          <h2 className="ad-form-title">
            {isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </h2>

          <div className="ad-form-tools">
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={handleExcelImport}
            />
            <label htmlFor="excel-upload" className="ad-btn secondary small">
              <FiUpload style={{ marginRight: 6 }} />
              Import Excel
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Hàng 1 */}
          <div className="ad-form-row">
            <div className="ad-form-group">
              <label>Tên sản phẩm</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} />
            </div>

            <div className="ad-form-group">
              <label>Mô tả</label>
              <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} rows={3}/>
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="ad-form-row">
            <div className="ad-form-group ad-form-group-sm">
              <label>Tồn kho</label>
              <input type="number" value={stock} onChange={(e)=>setStock(e.target.value)} />
            </div>

            <div className="ad-form-group ad-form-group-sm">
              <label>Thương hiệu</label>
              <select value={brand} onChange={(e)=>setBrand(e.target.value)}>
                <option value="">-- Chọn thương hiệu --</option>
                {categories.map((c)=>(
                  <option key={c._id} value={c._id}>{c.cName}</option>
                ))}
              </select>
            </div>

            <div className="ad-form-group ad-form-group-sm">
              <label>Trạng thái</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="ad-form-group">
              <label>Ảnh</label>
              <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
          </div>

          {/* Hàng 3: Loại xe + Giá tiền + Ưu đãi */}
          <div
            className="ad-form-row"
            style={{
              justifyContent: "center",
              gap: "80px",
            }}
          >

            <div
              className="ad-form-group ad-form-group-sm"
              style={{ maxWidth: "220px" }}
            >
              <label>Loại xe</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="VD: Xe địa hình, Xe gấp..."
              />
            </div>

            <div
              className="ad-form-group ad-form-group-sm"
              style={{ maxWidth: "220px" }}
            >
              <label>Giá tiền (₫)</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="VD: 5500000"
              />
            </div>

            <div
              className="ad-form-group ad-form-group-sm"
              style={{ maxWidth: "220px" }}
            >
              <label>Ưu đãi (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="VD: 10"
              />
            </div>

          </div>


          {/* Nút */}
          <div className="ad-form-actions">
            <button type="button" className="ad-btn" onClick={close}>Hủy</button>
            <button type="submit" className="ad-btn success">
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
