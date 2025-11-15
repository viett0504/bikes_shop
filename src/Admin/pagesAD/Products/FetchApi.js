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

  // Ảnh: chỉ 1 file
  if (image) {
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
    const res = await axios.post(`${apiURL}/api/product/add-product`, form);
    return res.data;
  } catch (e) {
    console.log(e);
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
    const res = await axios.post(`${apiURL}/api/product/edit-product`, form); 
    return res.data; 
  }
  catch (e) { 
    console.log(e); 
  }
};

export const deleteProduct = async (pId) => {
  try { 
    const res = await axios.post(`${apiURL}/api/product/delete-product`, { pId }); 
    return res.data; 
  }
  catch (e) { 
    console.log(e); 
  }
};