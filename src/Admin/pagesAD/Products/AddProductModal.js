// src/Admin/pagesAD/Products/AddProductModal.js
import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "./index";
import { createProduct, editProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../Categories/FetchApi";
import { getAllBikeType } from "../BikeType/FetchApi";
import ProductExcelImport from "./ProductExcelImport";

export default function AddProductModal() {
  const { data, dispatch } = useContext(ProductContext);
  const addProductModal = data?.addProductModal;
  const editData = data?.editProductModal || {};
  const isEditMode = !!editData.modal;

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Active");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImages, setExistingImages] = useState(null);

  const [categories, setCategories] = useState([]);
  const [bikeTypes, setBikeTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // mở modal nếu đang thêm mới hoặc đang sửa
  const isOpen = addProductModal || isEditMode;

  // ====== LOAD CATEGORY + BIKE TYPE KHI MỞ MODAL ======
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          getAllCategory(),
          getAllBikeType(),
        ]);

        const cats =
          catRes?.Categories ||
          catRes?.categories ||
          catRes?.data ||
          [];

        const types =
          typeRes?.BikeTypes ||
          typeRes?.biketypes ||
          typeRes?.data ||
          [];

        setCategories(cats);
        setBikeTypes(types);
      } catch (err) {
        console.error("❌ Lỗi load categories / bikeTypes:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  // ====== FILL FORM KHI EDIT / RESET KHI THÊM MỚI ======
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editData) {
      setName(editData.pName || "");
      setDesc(editData.pDescription || "");
      setStock(editData.pQuantity ?? "");
      setPrice(editData.pPrice ?? "");
      setOffer(editData.pOffer ?? "");
      setStatus(editData.pStatus || "Active");

      const catId = editData.pCategory?._id || editData.pCategory || "";
      const typeId = editData.pBiketype?._id || editData.pBiketype || "";

      setBrand(catId);
      setType(typeId);

      setExistingImages(editData.pImages || null);
      setImage(null);
      setImagePreview(null);
    } else {
      // reset form khi ở chế độ thêm mới
      setName("");
      setDesc("");
      setStock("");
      setPrice("");
      setOffer("");
      setBrand("");
      setType("");
      setStatus("Active");
      setImage(null);
      setImagePreview(null);
      setExistingImages(null);
    }
  }, [isOpen, isEditMode, editData]);

  const handleClose = () => {
    dispatch({ type: "addProductModal", payload: false });
    dispatch({ type: "editProductModalClose" });
  };

  const refreshProducts = async () => {
    const res = await getAllProduct();
    dispatch({
      type: "fetchProductsAndChangeState",
      payload: res?.Products || res?.products || [],
    });
  };

  // ====== CHỌN ẢNH ======
  const onChangeImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ====== SUBMIT FORM (THÊM / SỬA) ======
  const onSubmit = async (e) => {
    e.preventDefault();

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
      alert("Vui lòng chọn Thương hiệu");
      return;
    }
    if (!type) {
      alert("Vui lòng chọn Loại xe");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        const payload = {
          pId: editData._id || editData.pId,

          pName: name,
          pDescription: desc,
          pStatus: status,
          pCategory: brand,
          pQuantity: stock,
          pPrice: price,
          pOffer: offer,
          pBiketype: type,
          pImages: Array.isArray(existingImages)
            ? existingImages.join(",")
            : existingImages || "",
          pEditImages: image ? [image] : [],
        };

        const res = await editProduct(payload);
        console.log("✅ editProduct res:", res);
      } else {
        await createProduct({
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

      await refreshProducts();
      handleClose();
    } catch (err) {
      console.error("❌ Lỗi lưu sản phẩm:", err);
      alert("Đã có lỗi xảy ra khi lưu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ad-modal-backdrop">
      <div className="ad-modal">
        <div className="ad-modal-header">
          <h3>{isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
          <button
            type="button"
            className="ad-btn ghost"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <div className="ad-modal-body">
          {/* ====== IMPORT EXCEL (CHỈ DÙNG CHO THÊM MỚI) ====== */}
          {!isEditMode && (
            <ProductExcelImport
              categories={categories}
              bikeTypes={bikeTypes}
              onAfterImport={async (newProducts) => {
                // newProducts là mảng products sau khi import
                dispatch({
                  type: "fetchProductsAndChangeState",
                  payload: newProducts,
                });
                handleClose();
              }}
            />
          )}

          {/* ====== FORM CHI TIẾT SẢN PHẨM ====== */}
          <form onSubmit={onSubmit} className="ad-form">
            <div className="ad-form-grid">
              <div className="ad-form-group">
                <label className="ad-label">Tên sản phẩm</label>
                <input
                  type="text"
                  className="ad-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="ad-form-group">
                <label className="ad-label">Mô tả</label>
                <textarea
                  className="ad-input"
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>

              <div className="ad-form-row">
                <div className="ad-form-group">
                  <label className="ad-label">Tồn kho</label>
                  <input
                    type="number"
                    className="ad-input"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min={0}
                  />
                </div>

                <div className="ad-form-group">
                  <label className="ad-label">Giá tiền (VND)</label>
                  <input
                    type="number"
                    className="ad-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min={0}
                  />
                </div>

                <div className="ad-form-group">
                  <label className="ad-label">Giảm giá (%)</label>
                  <input
                    type="number"
                    className="ad-input"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              <div className="ad-form-row">
                <div className="ad-form-group">
                  <label className="ad-label">Thương hiệu</label>
                  <select
                    className="ad-input"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {categories.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.cName || c.name || c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ad-form-group">
                  <label className="ad-label">Loại xe</label>
                  <select
                    className="ad-input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">-- Chọn loại xe --</option>
                    {bikeTypes.map((t) => (
                      <option key={t._id || t.id} value={t._id || t.id}>
                        {t.tName || t.name || t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ad-form-group">
                  <label className="ad-label">Trạng thái</label>
                  <select
                    className="ad-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="ad-form-group">
                <label className="ad-label">Ảnh sản phẩm</label>
                <div className="ad-image-input">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onChangeImage}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{
                        marginTop: 8,
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="ad-modal-footer">
              <button
                type="button"
                className="ad-btn secondary"
                onClick={handleClose}
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
    </div>
  );
}
