import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

export const getCategories = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/category/all-category`);
    return res.data?.Categories || [];
  } catch (err) {
    console.error("❌ getCategories error:", err?.response?.data || err);
    return [];
  }
};
export const getBikeTypes = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/bike-type/all-type`);
    return res.data?.BikeTypes || [];
  } catch (err) {
    console.error("❌ getBikeTypes error:", err?.response?.data || err);
    return [];
  }
};
