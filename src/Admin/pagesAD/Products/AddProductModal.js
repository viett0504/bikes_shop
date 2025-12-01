// src/Admin/pagesAD/Products/AddProductModal.js
import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "./index";
import { createProduct, editProduct, getAllProduct } from "./FetchApi";
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

  const logProductAction = async (action, extra = {}) => {
    try {
      await fetch("/logs/activity/admin/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
    } catch (err) {
      console.error("Log product error:", err);
    }
  };

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

        await logProductAction("ADMIN_EDIT_PRODUCT", {
          id: payload.pId,
          name,
          price,
          status,
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

        await logProductAction("ADMIN_ADD_PRODUCT", {
          name,
          price,
          status,
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

          <form onSubmit={onSubmit} className="ad-form">
            {/* ... phần form như cũ, mình giữ nguyên ... */}
            {/* (phần form bạn đã gửi không cần đổi thêm gì, chỉ thay onSubmit & useNotification) */}

            {/* FORM giữ nguyên – mình không paste lại để đỡ dài */}
          </form>
        </div>
      </div>
    </div>
  );
}
