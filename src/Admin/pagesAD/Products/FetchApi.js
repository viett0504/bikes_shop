import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllProduct = async () => {
  try { const res = await axios.get(`${apiURL}/api/product/all-product`); return res.data; }
  catch (e) { console.log(e); }
};

export const createProduct = async (payload) => {
  const { pName, pDescription, pImage, pStatus, pCategory, pQuantity, pPrice, pOffer } = payload;
  const form = new FormData();
  (pImage || []).forEach(f => form.append("pImage", f));
  form.append("pName", pName); form.append("pDescription", pDescription);
  form.append("pStatus", pStatus); form.append("pCategory", pCategory);
  form.append("pQuantity", pQuantity); form.append("pPrice", pPrice); form.append("pOffer", pOffer);
  try { const res = await axios.post(`${apiURL}/api/product/add-product`, form); return res.data; }
  catch (e) { console.log(e); }
};

export const editProduct = async (product) => {
  const form = new FormData();
  (product.pEditImages || []).forEach(f => form.append("pEditImages", f));
  form.append("pId", product.pId); form.append("pName", product.pName);
  form.append("pDescription", product.pDescription); form.append("pStatus", product.pStatus);
  form.append("pCategory", product.pCategory?._id || product.pCategory);
  form.append("pQuantity", product.pQuantity); form.append("pPrice", product.pPrice);
  form.append("pOffer", product.pOffer); form.append("pImages", product.pImages);
  try { const res = await axios.post(`${apiURL}/api/product/edit-product`, form); return res.data; }
  catch (e) { console.log(e); }
};

export const deleteProduct = async (pId) => {
  try { const res = await axios.post(`${apiURL}/api/product/delete-product`, { pId }); return res.data; }
  catch (e) { console.log(e); }
};
