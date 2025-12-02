// src/Admin/pagesAD/Products/AddProductModal.js
import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "./index";
import {
  createProduct,
  editProduct,
  getAllProduct,
  getImageSrc,
} from "./FetchApi";
import { getAllCategory } from "../Categories/FetchApi";
import { getAllBikeType } from "../BikeType/FetchApi";
import ProductExcelImport from "./ProductExcelImport";
import { useNotification } from "../../../Customer/components/Noti/notification";

export default function AddProductModal() {
  const { data, dispatch } = useContext(ProductContext);
  const addProductModal = data?.addProductModal;
  const editData = data?.editProductModal || {};
  const isEditMode = !!editData.modal;

  const { showNotification } = useNotification();

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

  const isOpen = addProductModal || isEditMode;

  // Load Category + BikeType khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          getAllCategory(),
          getAllBikeType(),
        ]);

        const cats =
          catRes?.Categories || catRes?.categories || catRes?.data || [];
        const types =
          typeRes?.BikeTypes || typeRes?.biketypes || typeRes?.data || [];

        setCategories(cats);
        setBikeTypes(types);
      } catch (err) {
        console.error("❌ Lỗi load categories / bikeTypes:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  // Đổ dữ liệu khi sửa / reset khi thêm mới
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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showNotification("Vui lòng nhập tên sản phẩm", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }
    if (!desc.trim()) {
      showNotification("Vui lòng nhập mô tả sản phẩm", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }
    if (!stock || Number(stock) <= 0) {
      showNotification("Vui lòng nhập số lượng tồn kho hợp lệ", "warning", {
        title: "Dữ liệu không hợp lệ",
      });
      return;
    }
    if (!brand) {
      showNotification("Vui lòng chọn Thương hiệu", "warning", {
        title: "Thiếu thông tin",
      });
      return;
    }
    if (!type) {
      showNotification("Vui lòng chọn Loại xe", "warning", {
        title: "Thiếu thông tin",
      });
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

        showNotification("Cập nhật sản phẩm thành công!", "success", {
          title: "Thao tác thành công",
        });
      } else {
        const res = await createProduct({
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

        console.log("✅ createProduct res:", res);

        showNotification("Thêm sản phẩm mới thành công!", "success", {
          title: "Thao tác thành công",
        });
      }

      await refreshProducts();
      handleClose();
    } catch (err) {
      console.error("❌ Lỗi lưu sản phẩm:", err);
      showNotification("Đã có lỗi xảy ra khi lưu sản phẩm.", "error", {
        title: "Lỗi server",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ad-modal-backdrop">
      <div
        className="ad-modal"
        style={{
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
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

        {/* 👉 Form chiếm hết phần còn lại, chia thành body cuộn được + footer nút cố định */}
        <form
          onSubmit={onSubmit}
          className="ad-form"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            maxHeight: "calc(90vh - 56px)", // trừ phần header
          }}
        >
          {/* PHẦN THÂN – CUỘN ĐƯỢC */}
          <div
            className="ad-modal-body"
            style={{
              padding: "16px 24px",
              overflowY: "auto",
            }}
          >
            {/* Khối Excel – chỉ hiện khi THÊM mới */}
            {!isEditMode && (
              <ProductExcelImport
                categories={categories}
                bikeTypes={bikeTypes}
                onAfterImport={async (newProducts) => {
                  dispatch({
                    type: "fetchProductsAndChangeState",
                    payload: newProducts,
                  });
                  handleClose();
                }}
              />
            )}

            {/* ===== FORM NHẬP TRƯỜNG ===== */}
            <div className="ad-form-row">
              <div className="ad-form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="ad-form-group">
                <label>Tồn kho</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Số lượng"
                />
              </div>
            </div>

            <div className="ad-form-group">
              <label>Mô tả</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Mô tả ngắn về sản phẩm"
              />
            </div>

            <div className="ad-form-row">
              <div className="ad-form-group">
                <label>Giá tiền (₫)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Giá bán"
                />
              </div>

              <div className="ad-form-group">
                <label>Ưu đãi (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder="Phần trăm giảm giá"
                />
              </div>
            </div>

            <div className="ad-form-row">
              <div className="ad-form-group">
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

              <div className="ad-form-group">
                <label>Loại xe</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">-- Chọn loại xe --</option>
                  {bikeTypes.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.tName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ad-form-row">
              <div className="ad-form-group">
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
                <label>Ảnh sản phẩm</label>
                <input type="file" accept="image/*" onChange={onChangeImage} />

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}

                  {!imagePreview &&
                    Array.isArray(existingImages) &&
                    existingImages[0] && (
                      <img
                        src={getImageSrc(existingImages[0])}
                        alt="Current"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER NÚT – LUÔN THẤY  */}
          <div
            className="ad-modal-actions"
            style={{
              padding: "10px 24px 16px",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              borderTop: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(15,23,42,0.97)",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              className="ad-btn ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="ad-btn primary"
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Đang lưu..."
                  : "Đang thêm..."
                : isEditMode
                ? "Lưu thay đổi"
                : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
