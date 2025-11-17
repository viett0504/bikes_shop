// src/Admin/pagesAD/BikeType/FetchApi.js
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

// Lấy tất cả loại xe
export const getAllBikeType = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/bike-type/all-type`);
    return res.data; // mong đợi { BikeTypes: [...] }
  } catch (e) {
    console.error("❌ getAllBikeType error:", e?.response?.data || e.message || e);
  }
};

// Thêm loại xe
export const addBikeType = async ({ name, description, status }) => {
  try {
    const res = await axios.post(`${apiURL}/api/bike-type/add-type`, {
      name,
      description,
      status,
    });
    return res.data;
  } catch (e) {
    console.error("❌ addBikeType error:", e?.response?.data || e.message || e);
  }
};

// Sửa loại xe
export const editBikeType = async ({ tId, name, description, status }) => {
  try {
    const res = await axios.post(`${apiURL}/api/bike-type/edit-type`, {
      tId,
      name,
      description,
      status,
    });
    return res.data;
  } catch (e) {
    console.error("❌ editBikeType error:", e?.response?.data || e.message || e);
  }
};

// Xóa loại xe
export const deleteBikeType = async (tId) => {
  try {
    const res = await axios.post(`${apiURL}/api/bike-type/delete-type`, { tId });
    return res.data;
  } catch (e) {
    console.error("❌ deleteBikeType error:", e?.response?.data || e.message || e);
  }
};
