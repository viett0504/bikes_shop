// src/Admin/pagesAD/Products/FetchApi.js
import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// Lấy tất cả sản phẩm
export const getAllProduct = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/product/all-product`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

// Tạo sản phẩm mới
export const createProduct = async ({
  name,
  desc,
  image,
  status,
  category,
  stock,
  price = 0,
  offer = 0,
  type = "", 
}) => {
  const form = new FormData();

  if (image) {
    // multer.any() -> req.files
    form.append("pImage", image);
  }

  form.append("pName", name);
  form.append("pDescription", desc);
  form.append("pStatus", status);
  form.append("pCategory", category);
  form.append("pQuantity", stock);
  form.append("pPrice", price);
  form.append("pOffer", offer);

  // ID loại xe
  if (type) {
    form.append("pType", type);
  }

  try {
    const res = await axios.post(`${apiURL}/api/product/add-product`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("👉 createProduct res.data =", res.data);
    return res.data;
  } catch (e) {
    console.error(
      "❌ createProduct error:",
      e?.response?.data || e.message || e
    );
    // đẩy lỗi ra ngoài để FE xử lý
    throw e;
  }
};

// Sửa sản phẩm
export const editProduct = async (product) => {
  const form = new FormData();

  // ảnh mới (nếu có)
  (product.pEditImages || []).forEach((f) => form.append("pEditImages", f));

  form.append("pId", product.pId);
  form.append("pName", product.pName);
  form.append("pDescription", product.pDescription);
  form.append("pStatus", product.pStatus);
  form.append("pCategory", product.pCategory?._id || product.pCategory);
  form.append("pQuantity", product.pQuantity);
  form.append("pPrice", product.pPrice ?? 0);
  form.append("pOffer", product.pOffer ?? 0);
  form.append("pBiketype", product.pBiketype._id || product.pBiketype);
  
  // pImages có thể là array, tùy BE đang xử lý thế nào
  form.append("pImages", product.pImages);

  try {
    const res = await axios.post(`${apiURL}/api/product/edit-product`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (e) {
    console.error("❌ editProduct error:", e?.response?.data || e.message || e);
  }
};

// Xóa sản phẩm
export const deleteProduct = async (pId) => {
  try {
    const res = await axios.post(`${apiURL}/api/product/delete-product`, { pId });
    return res.data;
  } catch (e) {
    console.error("❌ deleteProduct error:", e?.response?.data || e.message || e);
  }
};