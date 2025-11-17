// src/Admin/pagesAD/BikeType/FetchApi.js
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

// Hàm chuẩn hoá data từ BE (tName → name, v.v..)
const normalizeBikeTypes = (res) => {
  const raw = res?.data?.BikeTypes || [];
  const mapped = raw.map((t) => ({
    ...t,
    name: t.tName,
    description: t.tDescription,
    status: t.tStatus,
  }));
  return { BikeTypes: mapped };
};

// Lấy tất cả loại xe
export const getAllBikeType = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/bike-type/all-type`);
    return normalizeBikeTypes(res); // { BikeTypes: [...] } đã map name/description/status
  } catch (e) {
    console.error("❌ getAllBikeType error:", e?.response?.data || e.message || e);
  }
};

// Thêm loại xe
export const addBikeType = async ({ name, description, status }) => {
  try {
    // BE đang nhận tName, tDescription, tStatus
    const res = await axios.post(`${apiURL}/api/bike-type/add-type`, {
      tName: name,
      tDescription: description,
      tStatus: status,
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
      tName: name,
      tDescription: description,
      tStatus: status,
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
