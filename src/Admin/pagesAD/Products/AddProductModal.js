// src/Admin/pagesAD/Products/AddProductModal.js
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProductContext } from "./index";
import { createProduct, editProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../Categories/FetchApi";
import { getAllBikeType } from "../BikeType/FetchApi"; // 🆕
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
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [bikeTypes, setBikeTypes] = useState([]); // 🆕 list loại xe

  const [price, setPrice] = useState(0); // Giá gốc
  const [offer, setOffer] = useState(0); // % giảm giá
  const [type, setType] = useState(""); // id loại xe
  const [imagePreview, setImagePreview] = useState(""); // 🔥 URL xem trước

  const originalNameRef = useRef("");

  const resetForm = () => {
    setName("");
    setDesc("");
    setBrand("");
    setStock(0);
    setStatus("Active");
    setImage(null);
    setImagePreview("");
    setPrice(0);
    setOffer(0);
    setType("");
  };

  const close = () => {
    if (isEditMode) {
      dispatch({ type: "editProductModalClose" });
    } else {
      dispatch({ type: "addProductModal", payload: false });
    }
    resetForm();
    setImagePreview("");
    originalNameRef.current = "";
  };

  // Load Category + BikeType khi modal mở
  useEffect(() => {
    if (!isOpen) return;

    const fetchMeta = async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          getAllCategory(),
          getAllBikeType(),
        ]);
        setCategories(catRes?.Categories || []);
        setBikeTypes(typeRes?.BikeTypes || []);
      } catch (err) {
        console.log("Lỗi load meta:", err);
      }
    };

    fetchMeta();
  }, [isOpen]);

  // Fill form khi ấn Sửa
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
      setImage(null);
      setImagePreview(
        Array.isArray(editProductModal.pImages) && editProductModal.pImages.length
          ? editProductModal.pImages[0]
          : ""
      );

      setPrice(editProductModal.pPrice ?? 0);
      setOffer(editProductModal.pOffer ?? 0);

      setType(
        editProductModal.pBiketype?._id ||
          editProductModal.pBiketype ||
          ""
      );

      originalNameRef.current = editProductModal.pName || "";
    } else {
      resetForm();
    }
  }, [isOpen, isEditMode, editProductModal]);

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
    if (!type) {
      alert("Vui lòng chọn loại xe");
      return;
    }
    if (!status) {
      alert("Vui lòng chọn trạng thái");
      return;
    }

    const priceNumber = Number(price) || 0;
    const offerNumber = Number(offer) || 0;
    if (priceNumber < 0) {
      alert("Giá tiền phải >= 0");
      return;
    }
    if (offerNumber < 0 || offerNumber > 100) {
      alert("Ưu đãi (%) phải từ 0 đến 100");
      return;
    }

    if (!image && !sameName) {
      alert("Vui lòng chọn ảnh sản phẩm");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        if (sameName) {
          // Cập nhật sản phẩm hiện tại
          const payload = {
            pId: editProductModal._id || editProductModal.pId,
            pName: name,
            pDescription: desc,
            pStatus: status,
            pCategory: brand,
            pQuantity: stock,
            pPrice: priceNumber,
            pOffer: offerNumber,
            pBiketype: type,
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
          // Đổi tên => tạo sản phẩm mới
          const res = await createProduct({
            name,
            desc,
            image,
            status,
            category: brand,
            stock,
            type,
            price: priceNumber,
            offer: offerNumber,
          });

          if (res?.success) {
            alert("Đã thêm sản phẩm mới (do đổi tên sản phẩm)");
          } else if (res?.error) {
            alert(res.error);
          }
        }
      } else {
        // Thêm mới
        const res = await createProduct({
          name,
          desc,
          image,
          status,
          category: brand,
          stock,
          type,
          price: priceNumber,
          offer: offerNumber,
        });

        if (res?.success) {
          alert("Tạo sản phẩm thành công");
        } else if (res?.error) {
          alert(res.error);
        }
      }

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

  // Import Excel giữ nguyên (chỉ fill name/desc/stock/brand/status)

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

      const first = rows[0];

      setName(first["Tên sản phẩm"] || first["Ten SP"] || "");
      setDesc(first["Mô tả"] || first["Mo ta"] || "");
      setStock(first["Tồn kho"] || first["Ton kho"] || 0);

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
    } catch (err) {
      console.log("Lỗi đọc file Excel:", err);
      alert("Không đọc được file Excel, vui lòng kiểm tra lại.");
    }
  };

  // ======= UI =======
  return (
    <div className="ad-card ad-form-card">
      <div className="ad-body">
        <div className="ad-form-header">
          <h2 className="ad-form-title">
            {isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </h2>

          <div className="ad-form-tools">
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelImport}
              style={{ display: "none" }}
            />

            <label
              htmlFor="excel-upload"
              className="ad-btn secondary small"
            >
              <FiUpload style={{ marginRight: 6 }} />
              Nhập từ Excel
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
  {/* Lưới form 2 cột, dùng class trong admin.css */}
  <div className="ad-form-grid">
    {/* Tên sản phẩm – full 2 cột */}
    <div className="ad-form-group ad-form-group-full">
      <label>Tên sản phẩm</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="VD: Xe đạp thể thao"
      />
    </div>

    {/* Mô tả – full 2 cột */}
    <div className="ad-form-group ad-form-group-full">
      <label>Mô tả</label>
      <textarea
        rows={3}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Mô tả ngắn gọn về sản phẩm"
      />
    </div>

    {/* Tồn kho */}
    <div className="ad-form-group">
      <label>Tồn kho</label>
      <input
        type="number"
        min={0}
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
    </div>

    {/* Thương hiệu */}
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

    {/* Loại xe */}
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

    {/* Trạng thái */}
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

    {/* Giá tiền */}
    <div className="ad-form-group">
      <label>Giá tiền (₫)</label>
      <input
        type="number"
        min={0}
        value={price}
        onChange={(e) =>
          setPrice(e.target.value ? Number(e.target.value) : 0)
        }
        placeholder="VD: 5.500.000"
      />
    </div>

    {/* Ưu đãi */}
    <div className="ad-form-group">
      <label>Ưu đãi (%)</label>
      <input
        type="number"
        min={0}
        max={100}
        value={offer}
        onChange={(e) =>
          setOffer(e.target.value ? Number(e.target.value) : 0)
        }
        placeholder="VD: 10"
      />
    </div>


    {/* Ảnh sản phẩm – 1 hàng riêng, chia 2 bên */}
    <div className="ad-form-group ad-form-group-full">
      <label>Ảnh sản phẩm</label>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "24px",
          flexWrap: "nowrap",
        }}
      >
        {/* Cột chọn file */}
        <div style={{ flex: 1 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                const url = URL.createObjectURL(file);
                setImagePreview(url);
              } else {
                setImage(null);
                setImagePreview("");
              }
            }}
            style={{
              padding: "10px",
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              width: "100%",
            }}
          />
        </div>

        {/* Cột preview ảnh */}
        <div
          style={{
            width: 160,
            height: 160,
            border: "1px solid var(--border)",
            borderRadius: 12,
            background: "var(--panel)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              Chưa chọn ảnh
            </span>
          )}
        </div>
      </div>
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
