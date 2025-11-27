// src/Customer/components/Product/fetchApi.js
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

// Lấy tất cả sản phẩm cho trang shop

export const getAllProduct = async (searchTerm = "") => {
  try {
    const params = {};

    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    const res = await axios.get(`${apiURL}/api/product/all-product`, {
      params,
    });

    return res.data?.Products || [];
  } catch (err) {
    console.error("❌ getAllProduct (Customer) error:", err?.response?.data || err);
    return [];
  }
};


// Lấy chi tiết 1 sản phẩm
export const getSingleProduct = async (id) => {
  try {
    const res = await axios.post(`${apiURL}/api/product/single-product`, {
      pId: id,
    });
    // BE: { Product: { ... } }
    return res.data?.Product || null;
  } catch (err) {
    console.error("❌ getSingleProduct error:", err?.response?.data || err);
    return null;
  }
};

export const getAllBikeTypes = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/bike-type/all-type`);
    return res.data?.BikeTypes || [];
  } catch (err) {
    console.error("❌ getAllBikeTypes error:", err?.response?.data || err);
    return [];
  }
};

export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/category/all-category`);
    return res.data?.Categories || [];
  } catch (err) {
    console.error("❌ getAllCategories error:", err?.response?.data || err);
    return [];
  }
};

export const getProductsByBikeType = async (typeId, limit = 3) => {
  if (!typeId) return [];
  try {
    const res = await axios.post(`${apiURL}/api/product/product-by-type`, {
      typeId,
    });
    const all = res.data?.Products || [];
    // trả về tối đa 3 sản phẩm
    return all.slice(0, limit);
  } catch (err) {
    console.error("❌ getProductsByBikeType error:", err?.response?.data || err);
    return [];
  }
};

export const getProductsByCategory = async (catId, limit = 3) => {
  if (!catId) return [];
  try {
    const res = await axios.post(`${apiURL}/api/product/product-by-category`, {
      catId,
    });
    const all = res.data?.Products || [];
    return all.slice(0, limit);
  } catch (err) {
    console.error(
      "❌ getProductsByCategory error:",
      err?.response?.data || err
    );
    return [];
  }
};
