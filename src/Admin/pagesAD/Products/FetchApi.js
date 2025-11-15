import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllProduct = async () => {
  try { 
    const res = await axios.get(`${apiURL}/api/product/all-product`); 
    return res.data; 
  }
  catch (e) { 
    console.log(e); 
  }
};

export const createProduct = async ({
  name,
  desc,
  image,
  status,
  category,
  stock,
  price,
  offer,
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

export const editProduct = async (product) => {
  const form = new FormData();
  (product.pEditImages || []).forEach(f => form.append("pEditImages", f));
  form.append("pId", product.pId); 
  form.append("pName", product.pName);
  form.append("pDescription", product.pDescription); 
  form.append("pStatus", product.pStatus);
  form.append("pCategory", product.pCategory?._id || product.pCategory);
  form.append("pQuantity", product.pQuantity); 
  form.append("pPrice", product.pPrice);
  form.append("pOffer", product.pOffer); 
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

export const deleteProduct = async (pId) => {
  try {
    const res = await axios.post(`${apiURL}/api/product/delete-product`, { pId });
    return res.data;
  } catch (e) {
    console.error("❌ deleteProduct error:", e?.response?.data || e.message || e);
  }
};